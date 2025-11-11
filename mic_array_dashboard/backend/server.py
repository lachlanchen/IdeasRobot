from __future__ import annotations

import audioop
import json
import os
import threading
import time
import uuid
import wave
from array import array
from pathlib import Path
from typing import Any, Dict, List, Optional

import tornado.ioloop
import tornado.web
import tornado.websocket

from .config import settings
from .device.audio_capture import AudioCapture, RecordingSession, write_wav_frame
from .device.direction_reader import DirectionEvent, MicDirectionReader

FRONTEND_DIR = settings.recording_dir.parent / "frontend" / "public"


class AudioHub:
    """Fans out audio levels and direction data to websocket clients."""

    def __init__(self) -> None:
        self.capture = AudioCapture(
            sample_rate=settings.sample_rate,
            chunk_size=settings.chunk_size,
            channels=settings.channels,
            device_name=settings.device_name,
            simulate=settings.simulate_audio,
        )
        self.direction_reader = MicDirectionReader(
            port=settings.serial_port,
            baudrate=settings.serial_baud,
            simulate=settings.simulate_direction,
        )
        self.clients: set["AudioWebSocketHandler"] = set()
        self._lock = threading.Lock()
        self._recorder: Optional[wave.Wave_write] = None
        self._recording_session: Optional[RecordingSession] = None
        self._latest_session: Optional[RecordingSession] = None
        self._speaking_state = "silence"
        self.capture.start()
        self.direction_reader.start()
        self.direction_reader.add_listener(self._direction_event)
        self._pump_thread = threading.Thread(target=self._pump_loop, daemon=True)
        self._pump_thread.start()

    # Broadcast --------------------------------------------------------

    def register_client(self, client: "AudioWebSocketHandler") -> bool:
        with self._lock:
            if len(self.clients) >= settings.max_clients:
                return False
            self.clients.add(client)
            return True

    def unregister_client(self, client: "AudioWebSocketHandler") -> None:
        with self._lock:
            self.clients.discard(client)

    def broadcast(self, message: Dict[str, Any]) -> None:
        payload = json.dumps(message)
        for client in list(self.clients):
            try:
                client.write_message(payload)
            except tornado.websocket.WebSocketClosedError:
                self.unregister_client(client)

    # Recording --------------------------------------------------------

    def start_recording(self) -> RecordingSession:
        if self._recorder:
            return self._recording_session  # type: ignore[return-value]
        session_id = uuid.uuid4().hex
        path = settings.recording_dir / f"{session_id}.wav"
        rec = wave.open(str(path), "wb")
        rec.setnchannels(settings.channels)
        rec.setsampwidth(2)
        rec.setframerate(settings.sample_rate)
        session = RecordingSession(
            session_id=session_id,
            path=path,
            started_at=time.time(),
        )
        self._recorder = rec
        self._recording_session = session
        return session

    def stop_recording(self) -> Optional[RecordingSession]:
        if not self._recorder or not self._recording_session:
            return None
        self._recorder.close()
        self._recording_session.duration_ms = (time.time() - self._recording_session.started_at) * 1000
        session = self._recording_session
        self._latest_session = session
        self._recorder = None
        self._recording_session = None
        return session

    @property
    def latest_session(self) -> Optional[RecordingSession]:
        return self._latest_session

    # Status -----------------------------------------------------------

    def build_status(self) -> Dict[str, Any]:
        direction = self.direction_reader.latest
        return {
            "audio_backend": "simulator" if self.capture.simulate else "sounddevice",
            "recording": bool(self._recording_session),
            "recording_session": (
                {
                    "session_id": self._recording_session.session_id,
                    "started_at": self._recording_session.started_at,
                }
                if self._recording_session
                else None
            ),
            "latest_direction": self._serialize_direction(direction),
            "latest_session": (
                {
                    "session_id": self._latest_session.session_id,
                    "path": str(self._latest_session.path),
                    "duration_ms": self._latest_session.duration_ms,
                }
                if self._latest_session
                else None
            ),
        }

    # Internal loops ---------------------------------------------------

    def _pump_loop(self) -> None:
        while True:
            chunk = self.capture.read_chunk(timeout=1.0)
            if not chunk:
                continue
            self._process_chunk(chunk)

    def _process_chunk(self, chunk: bytes) -> None:
        if self._recorder:
            write_wav_frame(self._recorder, chunk)
            if self._recording_session:
                elapsed = len(chunk) / (2 * settings.channels) / settings.sample_rate
                self._recording_session.duration_ms += elapsed * 1000
        level = min(audioop.rms(chunk, 2) / 32768.0, 1.0)
        speaking = "speaking" if level >= settings.silence_threshold else "silence"
        if speaking != self._speaking_state:
            self._speaking_state = speaking
        waveform = self._build_waveform(chunk, settings.waveform_bars)
        message = {
            "type": "waveform",
            "level": level,
            "state": speaking,
            "waveform": waveform,
            "timestamp": time.time(),
            "direction": self._serialize_direction(self.direction_reader.latest),
        }
        self.broadcast(message)

    def _build_waveform(self, chunk: bytes, bars: int) -> List[float]:
        samples = array("h", chunk)
        if not samples:
            return [0.0] * bars
        bucket = max(1, len(samples) // bars)
        result: List[float] = []
        for idx in range(bars):
            start = idx * bucket
            block = samples[start : start + bucket]
            if not block:
                result.append(0.0)
                continue
            peak = max(abs(v) for v in block)
            result.append(round(min(1.0, peak / 32768.0), 3))
        return result

    def _direction_event(self, event: DirectionEvent) -> None:
        self.broadcast(
            {
                "type": "direction",
                "direction": self._serialize_direction(event),
            }
        )

    def _serialize_direction(
        self, event: Optional[DirectionEvent]
    ) -> Optional[Dict[str, Any]]:
        if not event:
            return None
        return {
            "angle": event.angle,
            "awake": event.awake,
            "timestamp": event.timestamp,
        }


# HTTP + WebSocket handlers -----------------------------------------------


class BaseHandler(tornado.web.RequestHandler):
    def initialize(self, hub: AudioHub) -> None:  # type: ignore[override]
        self.hub = hub


class StatusHandler(BaseHandler):
    def get(self) -> None:
        self.write(self.hub.build_status())


class StartRecordingHandler(BaseHandler):
    def post(self) -> None:
        session = self.hub.start_recording()
        self.write({"session_id": session.session_id, "started_at": session.started_at})


class StopRecordingHandler(BaseHandler):
    def post(self) -> None:
        session = self.hub.stop_recording()
        if not session:
            self.set_status(400)
            self.write({"error": "no_active_session"})
            return
        self.write(
            {
                "session_id": session.session_id,
                "duration_ms": session.duration_ms,
                "path": str(session.path),
            }
        )


class LatestRecordingHandler(BaseHandler):
    def get(self) -> None:
        session = self.hub.latest_session
        if not session:
            self.set_status(404)
            self.write({"error": "no_recording"})
            return
        self.write(
            {
                "session_id": session.session_id,
                "duration_ms": session.duration_ms,
                "path": str(session.path),
            }
        )


class RecordingDownloadHandler(BaseHandler):
    def get(self, session_id: str) -> None:
        session = self.hub.latest_session
        if not session or session.session_id != session_id:
            self.set_status(404)
            self.write({"error": "unknown_session"})
            return
        self.set_header("Content-Type", "audio/wav")
        self.set_header(
            "Content-Disposition", f'attachment; filename="{session.session_id}.wav"'
        )
        with open(session.path, "rb") as fp:
            while chunk := fp.read(4096):
                self.write(chunk)
        self.finish()


class AudioWebSocketHandler(tornado.websocket.WebSocketHandler):
    def initialize(self, hub: AudioHub) -> None:  # type: ignore[override]
        self.hub = hub

    def check_origin(self, origin: str) -> bool:
        return True

    def open(self) -> None:
        if not self.hub.register_client(self):
            self.close(1013, "busy")
            return
        self.write_message(
            json.dumps(
                {
                    "type": "hello",
                    "ws_path": settings.websocket_path,
                    "waveform_bars": settings.waveform_bars,
                }
            )
        )

    def on_message(self, message: str) -> None:
        try:
            payload = json.loads(message)
        except ValueError:
            return
        command = payload.get("command")
        if command == "ping":
            self.write_message(json.dumps({"type": "pong", "ts": time.time()}))
        elif command == "start_recording":
            session = self.hub.start_recording()
            self.write_message(
                json.dumps(
                    {"type": "recording_started", "session_id": session.session_id}
                )
            )
        elif command == "stop_recording":
            session = self.hub.stop_recording()
            self.write_message(
                json.dumps(
                    {
                        "type": "recording_stopped",
                        "session_id": session.session_id if session else None,
                    }
                )
            )

    def on_close(self) -> None:
        self.hub.unregister_client(self)


class FrontendHandler(tornado.web.StaticFileHandler):
    def parse_url_path(self, url_path: str) -> str:
        if not url_path or url_path == "/":
            return "index.html"
        return url_path


def make_app() -> tornado.web.Application:
    hub = AudioHub()
    return tornado.web.Application(
        [
            (settings.websocket_path, AudioWebSocketHandler, {"hub": hub}),
            (r"/api/status", StatusHandler, {"hub": hub}),
            (r"/api/recordings/start", StartRecordingHandler, {"hub": hub}),
            (r"/api/recordings/stop", StopRecordingHandler, {"hub": hub}),
            (r"/api/recordings/latest", LatestRecordingHandler, {"hub": hub}),
            (r"/api/recordings/(?P<session_id>[0-9a-f]+)/audio", RecordingDownloadHandler, {"hub": hub}),
            (
                r"/service-worker.js",
                tornado.web.StaticFileHandler,
                {"path": FRONTEND_DIR, "default_filename": "service-worker.js"},
            ),
            (
                r"/manifest.json",
                tornado.web.StaticFileHandler,
                {"path": FRONTEND_DIR, "default_filename": "manifest.json"},
            ),
            (
                r"/icons/(.*)",
                tornado.web.StaticFileHandler,
                {"path": FRONTEND_DIR / "icons"},
            ),
            (
                r"/(.*)",
                FrontendHandler,
                {"path": FRONTEND_DIR, "default_filename": "index.html"},
            ),
        ],
        debug=_debug_mode(),
    )


def _debug_mode() -> bool:
    return os.environ.get("MIC_ARRAY_DEBUG", "1") not in {"0", "false"}


def main() -> None:
    app = make_app()
    app.listen(settings.port, address=settings.host)
    print(f"Mic array console running on http://{settings.host}:{settings.port}")
    tornado.ioloop.IOLoop.current().start()


if __name__ == "__main__":
    main()
