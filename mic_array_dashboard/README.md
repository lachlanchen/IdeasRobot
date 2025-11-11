# Mic Array Control Console

This module adds a self-contained Tornado backend plus a Progressive Web App (PWA) front-end for Wheeltec's M2 microphone array. The stack exposes real-time audio levels, wake-angle telemetry, and recording controls that work across desktop, Android, and iOS (via the installed PWA).

## Features

- Tornado server streams waveform levels and direction data over WebSockets at `/ws/stream`, hosts REST endpoints under `/api`, and stores WAV recordings in `mic_array_dashboard/recordings/`.
- Audio capture runs directly against ALSA devices through `sounddevice`; set `MIC_ARRAY_AUDIO_DEVICE` to the correct ALSA index/name. Fallback simulators can be enabled with `MIC_ARRAY_SIMULATE_AUDIO=1` and `MIC_ARRAY_SIMULATE_DIRECTION=1` for development without hardware.
- Serial parser mirrors the vendor SDK frame format (`0xA5` header + JSON payload) to surface wake angles in degrees and awake/sleep state.
- PWA UI ships with installable manifest + service worker, neon waveform (72 bars), silence/speaking badge, and compass visualization that rotates toward the active source.
- Recording controls kick REST APIs, toggle hardware capture, and offer in-app download links once a WAV segment closes.

## Quick start

```bash
cd mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Then open http://localhost:8080 (or the configured host/port) from Chrome/Safari/Edge and "Install App" to pin it on Android/iOS home screens.

## Configuration flags

| Variable | Description | Default |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Serial device providing wake packets | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | UART baud rate | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | ALSA device name/id for audio capture | system default |
| `MIC_ARRAY_SAMPLE_RATE` | Sample rate in Hz | `16000` |
| `MIC_ARRAY_CHUNK` | Samples per frame | `2048` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Use synthetic sine-wave audio | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Emit fake angle events | `0` |
| `MIC_ARRAY_WS_PATH` | WebSocket endpoint | `/ws/stream` |
| `MIC_ARRAY_PORT` | HTTP port | `8080` |

## Folder layout

- `backend/` – Tornado app, device adapters, requirements file.
- `frontend/public/` – Installable PWA (HTML/CSS/JS, manifest, service worker, icons).
- `recordings/` – Automatically created directory where sessions are stored as WAV.

Extend by adding new REST handlers under `backend/server.py` and extra UI panels within `frontend/public/app.js`.
