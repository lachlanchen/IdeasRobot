from __future__ import annotations

import math
import os
import queue
import threading
import time
import wave
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Optional

try:
    import sounddevice as sd
except ImportError:  # pragma: no cover - optional dependency
    sd = None


@dataclass
class RecordingSession:
    session_id: str
    path: Path
    started_at: float
    duration_ms: float = 0.0


class AudioCapture:
    """Captures PCM16 audio frames from the mic array or a simulator."""

    def __init__(
        self,
        *,
        sample_rate: int,
        chunk_size: int,
        channels: int,
        device_name: Optional[str] = None,
        simulate: bool = False,
    ) -> None:
        self.sample_rate = sample_rate
        self.chunk_size = chunk_size
        self.channels = channels
        self.device_name = device_name
        self.simulate = simulate or sd is None
        self._queue: queue.Queue[bytes] = queue.Queue(maxsize=64)
        self._stream = None
        self._stop = threading.Event()
        self._thread: Optional[threading.Thread] = None

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._stop.clear()
        if self.simulate:
            self._thread = threading.Thread(
                target=self._simulate_loop, name="AudioSim", daemon=True
            )
            self._thread.start()
        else:
            self._thread = threading.Thread(
                target=self._sounddevice_loop, name="AudioCapture", daemon=True
            )
            self._thread.start()

    def stop(self) -> None:
        self._stop.set()
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=1)
        self._thread = None

    def read_chunk(self, timeout: float = 1.0) -> Optional[bytes]:
        try:
            return self._queue.get(timeout=timeout)
        except queue.Empty:
            return None

    # Internal helpers -------------------------------------------------

    def _enqueue(self, data: bytes) -> None:
        try:
            self._queue.put_nowait(data)
        except queue.Full:
            try:
                self._queue.get_nowait()
            except queue.Empty:
                pass
            self._queue.put_nowait(data)

    def _sounddevice_loop(self) -> None:
        if sd is None:
            raise RuntimeError("sounddevice is not available; enable simulate mode")

        def callback(indata, frames, time_info, status):  # pragma: no cover - callback
            if status:
                print("sounddevice warning:", status)
            self._enqueue(indata.tobytes())

        with sd.InputStream(
            samplerate=self.sample_rate,
            blocksize=self.chunk_size,
            channels=self.channels,
            dtype="int16",
            device=self.device_name,
            callback=callback,
        ):
            while not self._stop.is_set():
                time.sleep(0.05)

    def _simulate_loop(self) -> None:
        t = 0.0
        dt = self.chunk_size / float(self.sample_rate)
        while not self._stop.is_set():
            chunk = bytearray()
            for i in range(self.chunk_size):
                t += 1 / self.sample_rate
                angle = 2 * math.pi * 440 * t
                amplitude = 0.15 + 0.75 * (0.5 * (1 + math.sin(t / 5)))
                sample = int(32767 * amplitude * math.sin(angle))
                chunk.extend(sample.to_bytes(2, byteorder="little", signed=True))
            self._enqueue(bytes(chunk))
            time.sleep(dt)


def write_wav_frame(
    wav_file: wave.Wave_write,
    frame: bytes,
) -> None:
    wav_file.writeframes(frame)
