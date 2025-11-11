from __future__ import annotations

import json
import random
import threading
import time
from dataclasses import dataclass
from typing import Callable, Optional

try:
    import serial  # type: ignore
except ImportError:  # pragma: no cover - optional dependency
    serial = None


FRAME_HEADER = 0xA5
USER_ID = 0x01


@dataclass
class DirectionEvent:
    angle: int
    awake: bool
    timestamp: float
    raw_payload: dict


class MicDirectionReader:
    """Reads wake-word direction metadata from the Wheeltec mic array."""

    def __init__(
        self,
        *,
        port: str,
        baudrate: int,
        simulate: bool = False,
    ) -> None:
        self.port = port
        self.baudrate = baudrate
        self.simulate = simulate or serial is None
        self._listeners: set[Callable[[DirectionEvent], None]] = set()
        self._latest: Optional[DirectionEvent] = None
        self._stop = threading.Event()
        self._thread: Optional[threading.Thread] = None

    @property
    def latest(self) -> Optional[DirectionEvent]:
        return self._latest

    def add_listener(self, callback: Callable[[DirectionEvent], None]) -> None:
        self._listeners.add(callback)

    def remove_listener(self, callback: Callable[[DirectionEvent], None]) -> None:
        self._listeners.discard(callback)

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._stop.clear()
        target = self._simulate_loop if self.simulate else self._reader_loop
        self._thread = threading.Thread(target=target, name="DirectionReader", daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop.set()
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=1)
        self._thread = None

    # Internal loops ---------------------------------------------------

    def _reader_loop(self) -> None:
        if serial is None:
            raise RuntimeError("pyserial is not available; enable simulate mode")

        ser = serial.Serial(self.port, self.baudrate, timeout=0.1)
        buffer = bytearray()
        frame_len: Optional[int] = None
        try:
            while not self._stop.is_set():
                data = ser.read(1)
                if not data:
                    continue
                buffer += data
                buffer, frame_len = self._truncate_until_header(buffer, frame_len)
                if frame_len is None and len(buffer) >= 7:
                    payload_len = (buffer[4] << 8) | buffer[3]
                    frame_len = payload_len + 8
                if frame_len and len(buffer) >= frame_len:
                    frame = bytes(buffer[:frame_len])
                    buffer = buffer[frame_len:]
                    frame_len = None
                    event = self._parse_frame(frame)
                    if event:
                        self._emit(event)
        finally:
            ser.close()

    def _truncate_until_header(
        self, buffer: bytearray, frame_len: Optional[int]
    ) -> tuple[bytearray, Optional[int]]:
        while buffer and buffer[0] != FRAME_HEADER:
            buffer.pop(0)
            frame_len = None
        if len(buffer) >= 2 and buffer[1] != USER_ID:
            buffer.pop(0)
            frame_len = None
        return buffer, frame_len

    def _parse_frame(self, frame: bytes) -> Optional[DirectionEvent]:
        if len(frame) < 9:
            return None
        if not self._verify_checksum(frame):
            return None
        command = frame[2]
        if command != 0x04:
            return None
        payload = frame[7:-1]
        try:
            outer = json.loads(payload.decode("utf-8"))
            info = json.loads(outer["content"]["info"])
            ivw = info.get("ivw", {})
            angle = int(ivw.get("angle", -1))
            awake = bool(ivw.get("ws", 1))  # ws=0 => sleeping
            event = DirectionEvent(
                angle=angle if angle >= 0 else 0,
                awake=awake,
                timestamp=time.time(),
                raw_payload=ivw,
            )
            self._latest = event
            return event
        except Exception:
            return None

    def _verify_checksum(self, frame: bytes) -> bool:
        checksum = frame[-1]
        calc = (~(sum(frame[:-1]) & 0xFF) + 1) & 0xFF
        return calc == checksum

    def _simulate_loop(self) -> None:
        while not self._stop.is_set():
            event = DirectionEvent(
                angle=random.randint(0, 359),
                awake=random.choice([True, False]),
                timestamp=time.time(),
                raw_payload={"angle": "simulated"},
            )
            self._latest = event
            self._emit(event)
            time.sleep(1.5)

    def _emit(self, event: DirectionEvent) -> None:
        for listener in list(self._listeners):
            try:
                listener(event)
            except Exception as exc:  # pragma: no cover - log only
                print("Direction listener error:", exc)
