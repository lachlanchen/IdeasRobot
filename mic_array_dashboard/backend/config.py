from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
ROOT_DIR = BASE_DIR.parent
DEFAULT_RECORDING_DIR = ROOT_DIR / "mic_array_dashboard" / "recordings"


def _env_flag(name: str, default: bool = False) -> bool:
    value = os.environ.get(name)
    if value is None:
        return default
    return value.lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class Settings:
    serial_port: str = os.environ.get("MIC_ARRAY_SERIAL", "/dev/wheeltec_mic")
    serial_baud: int = int(os.environ.get("MIC_ARRAY_SERIAL_BAUD", "115200"))
    sample_rate: int = int(os.environ.get("MIC_ARRAY_SAMPLE_RATE", "16000"))
    chunk_size: int = int(os.environ.get("MIC_ARRAY_CHUNK", "2048"))
    channels: int = int(os.environ.get("MIC_ARRAY_CHANNELS", "1"))
    device_name: str | None = os.environ.get("MIC_ARRAY_AUDIO_DEVICE")
    recording_dir: Path = Path(
        os.environ.get("MIC_ARRAY_RECORDING_DIR", DEFAULT_RECORDING_DIR)
    )
    websocket_path: str = os.environ.get("MIC_ARRAY_WS_PATH", "/ws/stream")
    host: str = os.environ.get("MIC_ARRAY_HOST", "0.0.0.0")
    port: int = int(os.environ.get("MIC_ARRAY_PORT", "8080"))
    simulate_audio: bool = _env_flag("MIC_ARRAY_SIMULATE_AUDIO", False)
    simulate_direction: bool = _env_flag("MIC_ARRAY_SIMULATE_DIRECTION", False)
    silence_threshold: float = float(os.environ.get("MIC_ARRAY_SILENCE_THRESHOLD", "0.12"))
    waveform_bars: int = int(os.environ.get("MIC_ARRAY_WAVEFORM_BARS", "72"))
    max_clients: int = int(os.environ.get("MIC_ARRAY_MAX_CLIENTS", "32"))


settings = Settings()
settings.recording_dir.mkdir(parents=True, exist_ok=True)
