# IdeasRobot Architecture

This document explains every moving piece inside IdeasRobot so you can extend, debug, or embed it inside a larger robot platform. It covers the Tornado backend, hardware adapters, WebSocket/REST contracts, the PWA front-end, and deployment patterns.

## 1. System Overview

```
┌──────────────────────────────┐
│ Wheeltec M2 mic array        │
│  • ALSA audio stream         │
│  • UART wake packets (0xA5)  │
└───────────────┬───────┬──────┘
                │       │
          audio frames   wake metadata
                │       │
         ┌──────▼───────▼───────────────┐
         │ mic_array_dashboard.backend  │
         │  AudioCapture + Direction    │
         │  AudioHub (frames → WS)      │
         │  REST (/api) + WebSocket     │
         └──────┬──────────────┬────────┘
                │              │
         WebSocket JSON     REST/HTTP
                │              │
         ┌──────▼──────────────▼───────┐
         │ mic_array_dashboard.frontend│
         │  Installable PWA            │
         │  Waveform + compass UI      │
         │  Recording controls         │
         └─────────────────────────────┘
```

## 2. Backend Components

Path: `mic_array_dashboard/backend/server.py`

| Component | Purpose |
| --- | --- |
| `AudioCapture` | Wraps `sounddevice.InputStream` (or a simulator) to emit PCM16 frames into an internal queue. |
| `MicDirectionReader` | Reads UART frames from `/dev/wheeltec_mic` (0xA5 header, JSON payload) and extracts `angle` + `awake` flags. Simulation mode emits synthetic angles. |
| `AudioHub` | Central coordinator that starts both adapters, records WAV files, computes waveform levels, and pushes WebSocket frames. |
| REST handlers | `/api/status`, `/api/recordings/start`, `/api/recordings/stop`, `/api/recordings/latest`, `/api/recordings/<id>/audio` are implemented directly in `server.py`. |
| WebSocket handler | `/ws/stream` (configurable) sends broadcast events to all subscribers, accepts `ping`/`start_recording`/`stop_recording`. |

### Audio capture flow

1. `AudioCapture` buffers PCM frames (default: 16 kHz, 2048 samples, mono).
2. `_pump_loop()` pulls frames, optionally writes into an open WAV via `wave.Wave_write`.
3. Each frame is converted into:
   - `level`: RMS/32768 for a 0..1 amplitude.
   - `state`: `"speaking"` if `level >= MIC_ARRAY_SILENCE_THRESHOLD` (default 0.12).
   - `waveform`: bucketed peaks (72 bars).
4. Combined payload (with latest direction data) is broadcast as `{"type": "waveform", ...}`.

### Direction packets

- Serial frame format: `[0xA5, 0x01, CMD, len_lo, len_hi, msg_id_lo, msg_id_hi, payload..., checksum]`.
- Command `0x04` carries JSON with nested `"ivw":{"angle":123,...}`.
- `MicDirectionReader` verifies checksum, parses JSON, and emits `DirectionEvent(angle, awake, timestamp)`.
- Each direction update is broadcast immediately (`{"type": "direction", ...}`) and also embedded alongside audio frames for convenience.

### WebSocket message types

| Type | Payload |
| --- | --- |
| `hello` | Acknowledges connection and reports `waveform_bars` + `ws_path`. |
| `waveform` | `{ level, state, waveform[], timestamp, direction }`. Sent for every audio chunk. |
| `direction` | Standalone notification when a new wake-angle arrives. |
| `recording_started` / `recording_stopped` | Confirmation events when the backend toggles WAV capture. |
| `pong` | Reply to `ping` for latency measurement. |

### REST API

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/status` | GET | Returns backend mode (simulator vs hardware), current recording session, and last direction event. |
| `/api/recordings/start` | POST | Opens a new WAV file under `mic_array_dashboard/recordings/` and begins buffering audio. |
| `/api/recordings/stop` | POST | Seals the file, reports duration, and exposes download path. |
| `/api/recordings/latest` | GET | Metadata about the newest WAV (404 if none). |
| `/api/recordings/<session_id>/audio` | GET | Streams WAV data for download. |

All endpoints are stateless; clients may also send `start_recording` / `stop_recording` via WebSocket for quicker toggles.

## 3. Frontend (PWA)

Path: `mic_array_dashboard/frontend/public`

| File | Role |
| --- | --- |
| `index.html` | Shell layout with header, waveform card, compass, recorder controls, and “install” button. |
| `styles.css` | Neon dashboard styling, responsive grid, waveform visual rules, compass animation. |
| `app.js` | WebSocket client, waveform rendering, direction compass logic, REST fetches for recordings, install prompt handler, SW registration. |
| `manifest.json` | PWA manifest (name, icons, theme). |
| `service-worker.js` | Cache-first strategy for offline installability. |
| `icons/icon.svg` | Maskable icon for Android/iOS/desktop installs. |

### UI data flow

1. `app.js` connects to `ws://host/ws/stream`, listens to message types described above, and updates:
   - `.waveform-bar` heights for energy.
   - `.state-pill` text (`SILENCE` vs `SPEAKING`).
   - Compass arrow rotation (angle degrees from direction events).
   - “Last Recording” metadata (REST `GET /api/recordings/latest`).
2. Recorder button calls the REST endpoints directly. The UI also reacts to `recording_started`/`recording_stopped` messages for out-of-band toggles.
3. A periodic `ping` ensures latency readout stays current.

### Installation

The manifest + service worker enable “Install App” prompts on Chrome/Edge and add-to-home-screen on Safari. Users can run the PWA fullscreen on Android/iOS or as a standalone desktop window.

## 4. Configuration & Environment

Environment variables (detailed in `README.md`) live in `mic_array_dashboard/backend/config.py`. Important ones:

- `MIC_ARRAY_SERIAL`, `MIC_ARRAY_SERIAL_BAUD`: UART device & speed.
- `MIC_ARRAY_AUDIO_DEVICE`, `MIC_ARRAY_SAMPLE_RATE`, `MIC_ARRAY_CHUNK`, `MIC_ARRAY_CHANNELS`: audio capture specifics.
- `MIC_ARRAY_SIMULATE_AUDIO`, `MIC_ARRAY_SIMULATE_DIRECTION`: toggles for development without hardware.
- `MIC_ARRAY_SILENCE_THRESHOLD`: amplitude threshold that flips SILENCE/SPEAKING.
- `MIC_ARRAY_WAVEFORM_BARS`: size of the waveform bar array (defaults to 72 to match the UI grid).
- `MIC_ARRAY_WS_PATH`, `MIC_ARRAY_PORT`, `MIC_ARRAY_HOST`: networking settings.

The backend automatically ensures `mic_array_dashboard/recordings/` exists. WAV filenames follow `<uuid>.wav`.

## 5. Deployment Notes

- **Local dev**: `python -m mic_array_dashboard.backend.server` from the `backend` folder after installing `requirements.txt`. Use `MIC_ARRAY_DEBUG=1` for autoreload.
- **Systemd/service**: wrap the module inside a systemd unit, exporting the desired env vars. Store recordings on persistent storage if you plan to keep historical audio.
- **Certificates**: put a reverse proxy (Caddy, Nginx, Traefik) in front for HTTPS so PWA install prompts work everywhere.
- **Hardware bring-up**:
  1. Run `scripts/ch9102_udev.sh` from the vendor SDK to assign `/dev/wheeltec_mic`.
  2. Confirm ALSA sees the mic array (`arecord -l`); pass that card/device to `MIC_ARRAY_AUDIO_DEVICE`.
  3. Start the backend without simulation flags to stream real data.

## 6. Extending IdeasRobot

- **Camera integration**: add another adapter (e.g., GStreamer, OpenCV) and broadcast metadata over the same WebSocket. Update the UI with a new panel.
- **OnlyIdeas automations**: push WebSocket events into an MQTT bridge or OnlyIdeas backend for higher-level workflows (e.g., voice prompts trigger camera capture).
- **Analytics**: persist direction + amplitude history to a database by augmenting `AudioHub._process_chunk`.
- **Security**: add authentication (JWT/cookie) by wrapping Tornado handlers or running behind a reverse proxy with auth.

Use this document as the canonical reference when onboarding contributors or planning the next sensor module for IdeasRobot.
