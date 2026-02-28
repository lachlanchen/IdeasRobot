[English](README.md) · [العربية](i18n/README.ar.md) · [Español](i18n/README.es.md) · [Français](i18n/README.fr.md) · [日本語](i18n/README.ja.md) · [한국어](i18n/README.ko.md) · [Tiếng Việt](i18n/README.vi.md) · [中文 (简体)](i18n/README.zh-Hans.md) · [中文（繁體）](i18n/README.zh-Hant.md) · [Deutsch](i18n/README.de.md) · [Русский](i18n/README.ru.md)

<p align="center">
  <img src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/logos/banner.png" alt="LazyingArt banner" />
</p>


# IdeasRobot

![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Tornado-222222)
![Frontend](https://img.shields.io/badge/Frontend-PWA-0a7ea4)
![Hardware](https://img.shields.io/badge/Hardware-Wheeltec%20M2-3c8c3c)
![OS](https://img.shields.io/badge/OS-Linux-FCC624?logo=linux&logoColor=111)
![Status](https://img.shields.io/badge/Project-Active%20Runtime%20%2B%20Vendor%20Assets-2f855a)

IdeasRobot is a laid-back mic-and-camera console inspired by *The Art of Lazying* and *OnlyIdeas*: a Tornado backend that talks to the Wheeltec M2 microphone array (or its simulator) plus an installable PWA/Android/iOS UI that streams waveform energy, wake-angle telemetry, and handles one-tap recordings from anywhere.

## Overview

IdeasRobot combines three layers in one repository:

- Realtime control runtime: `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- Installable client app: `mic_array_dashboard/frontend/public` (PWA for Android/iOS/Desktop).
- Hardware/vendor references: Wheeltec SDK bundles, Raspberry Pi legacy integration paths, and architecture notes for extending to broader robot systems.

This repository is intentionally mixed: active runtime code plus vendor/legacy assets needed for low-level bring-up.

## Highlights

| Capability | Description |
| --- | --- |
| 🎛️ Realtime control hub | `/ws/stream` pushes waveform bars, SILENCE/SPEAKING states, and wake angles while `/api/*` covers status and recordings. |
| 🔌 Hardware aware | ALSA input (via `sounddevice`) and vendor UART packets are wrapped with graceful fallbacks so development works even without the device. |
| 📱 PWA everywhere | Installable on Android/iOS/Desktop; ships a neon waveform, compass-based direction visualization, and offline cache. |
| 🤖 Robot-ready | Designed as a sensory front-end for future IdeasRobot builds pairing mic array + cameras + motors + OnlyIdeas automations. |

## Project Structure

```text
.
├── README.md
├── AGENTS.md
├── i18n/                          # Multilingual README variants
├── references/
│   ├── ARCHITECTURE.md            # Backend/frontend protocol and component detail
│   └── SDK_NOTES.md               # Deep Linux/Raspberry Pi SDK notes
├── docs/                          # GitHub Pages static landing
├── mic_array_dashboard/
│   ├── backend/
│   │   ├── server.py              # Main runtime entrypoint
│   │   ├── config.py              # Environment-driven settings
│   │   ├── requirements.txt
│   │   └── device/
│   │       ├── audio_capture.py
│   │       └── direction_reader.py
│   ├── frontend/public/           # PWA files
│   └── recordings/                # Runtime WAV output
├── raspberrypi_legacy/            # Legacy Raspberry Pi workflows and scripts
└── M2系列麦克风语音阵列客户资料/    # Vendor SDK archives and manuals
```

Detailed documentation:

- [Architecture overview](references/ARCHITECTURE.md)
- [Wheeltec SDK deep notes](references/SDK_NOTES.md)

## Prerequisites

### Runtime (dashboard)

- Python 3.x
- Linux with ALSA audio stack
- Microphone array serial endpoint (typically `/dev/wheeltec_mic`) for hardware mode

### Optional system packages (recommended)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### Hardware naming helper (vendor script)

After kernel/USB bridge updates, re-run the udev helper in vendor SDK paths so `/dev/wheeltec_mic` remains available:

```bash
# Example path inside bundled SDK assets:
# .../offline_mic/scripts/ch9102_udev.sh
sudo bash ch9102_udev.sh
```

## Installation

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

Dependencies (from `requirements.txt`):

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## Quick Start

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Open `http://localhost:8080` to view the console or install it as a PWA.

For hardware-free prototyping:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## Configuration

Environment variables are defined in `mic_array_dashboard/backend/config.py`.

| Variable | Description | Default |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Serial device that emits wake-angle frames | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Baud rate for the mic array UART | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | ALSA device id or name passed to `sounddevice` | system default |
| `MIC_ARRAY_SAMPLE_RATE` | Capture sample rate (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Samples per chunk | `2048` |
| `MIC_ARRAY_CHANNELS` | Channel count (1 = mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | Directory to store WAV recordings | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Emit synthetic sine-wave audio | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Emit fake wake angles | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | `level` threshold for speaking/silence state | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | Waveform bar count sent per chunk | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | Max concurrent WebSocket clients | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket endpoint | `/ws/stream` |
| `MIC_ARRAY_HOST` | Bind host | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP port | `8080` |

## Usage

### Web app

- Main UI: `http://localhost:8080`
- Install as PWA from Chrome/Edge/Safari add-to-home-screen flow

### REST API

- `GET /api/status`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`
- `GET /api/recordings/latest`
- `GET /api/recordings/<session_id>/audio`

Example:

```bash
curl -s http://localhost:8080/api/status | jq
curl -X POST http://localhost:8080/api/recordings/start
curl -X POST http://localhost:8080/api/recordings/stop
curl -OJ http://localhost:8080/api/recordings/<session_id>/audio
```

### WebSocket contract

- Endpoint: `/ws/stream` (or `MIC_ARRAY_WS_PATH`)
- Server message types: `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- Client commands: `ping`, `start_recording`, `stop_recording`

Example command payload:

```json
{"command":"start_recording"}
```

## Examples

### 1) Run in debug mode with autoreload

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 2) Store recordings outside repository

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 3) Expose to local network

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## Development Notes

- Run `MIC_ARRAY_DEBUG=1` while iterating to enable Tornado autoreload and verbose logging.
- Audio capture depends on ALSA; run `python -m sounddevice` to list device indices.
- Frontend files live in `frontend/public`; editing `styles.css` or `app.js` only requires a browser refresh.
- Extend backend behavior in `mic_array_dashboard/backend/server.py` (handlers + message shaping).
- Extend sensor integration through `mic_array_dashboard/backend/device/` adapters.
- The backend auto-creates `mic_array_dashboard/recordings/` if missing.

## Website

- Static landing lives under `docs/` (HTML/CSS/JS).
- Configure GitHub Pages to serve `/docs` on `main`.
- Keep `docs/CNAME` set to `robot.lazying.art`.

## Legacy/Vendor SDK Notes

The repository includes full Wheeltec SDK materials and Raspberry Pi legacy assets for low-level builds and protocol validation:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

Sample build flow from SDK demos (as documented in bundled notes):

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

For ARM64 Raspberry Pi:

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

## Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| `libmsc.so: cannot open shared object file` | Set `LD_LIBRARY_PATH` to the matching SDK `libs/<arch>` directory. |
| ALSA device errors | Verify index via `arecord -l` and check `MIC_ARRAY_AUDIO_DEVICE`. |
| Missing `/dev/wheeltec_mic` | Re-run `ch9102_udev.sh`, replug device, and verify `dialout` group membership. |
| No telemetry in UI | Confirm WebSocket path matches `MIC_ARRAY_WS_PATH` and enable simulation flags when no hardware is connected. |
| PWA install prompt not appearing | Ensure HTTPS/public origin in production and valid `manifest.json` + service worker routing. |

## Roadmap

- Add camera stream panels and event fusion with wake-angle telemetry.
- Add automation bridges for OnlyIdeas workflows (MQTT/event integrations).
- Add persistence/analytics for waveform + direction history.
- Improve deployment templates (reverse proxy + service units).
- Expand protocol compatibility coverage for future mic array firmware revisions.

## Contribution

- See `AGENTS.md` for contributor guidelines.
- Prefer small, focused pull requests with clear reproduction steps.
- Include hardware/OS context and executed commands for runtime-affecting changes.
- If changing vendor SDK references, keep `references/SDK_NOTES.md` synchronized.

Note: no dedicated `CONTRIBUTING.md` is currently present in this repository.

## Donate & Support

Your support keeps the IdeasRobot toolbox open, funds device prototyping, and helps subsidize community deployments. You can donate through any of the links below:

- GitHub Sponsors: https://github.com/sponsors/lachlanchen
- LazyingArt: https://lazying.art
- EchoMind (chat): https://chat.lazying.art
- OnlyIdeas: https://onlyideas.art

<div align="center">
<table style="margin:0 auto; text-align:center; border-collapse:collapse;">
  <tr>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;">
      <a href="https://chat.lazying.art/donate">https://chat.lazying.art/donate</a>
    </td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;">
      <a href="https://chat.lazying.art/donate"><img src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/figs/donate_button.svg" alt="Donate" height="44"></a>
    </td>
  </tr>
  <tr>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;">
      <a href="https://paypal.me/RongzhouChen">
        <img src="https://img.shields.io/badge/PayPal-Donate-003087?logo=paypal&logoColor=white" alt="Donate with PayPal">
      </a>
    </td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;">
      <a href="https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400">
        <img src="https://img.shields.io/badge/Stripe-Donate-635bff?logo=stripe&logoColor=white" alt="Donate with Stripe">
      </a>
    </td>
  </tr>
  <tr>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><strong>WeChat</strong></td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><strong>Alipay</strong></td>
  </tr>
  <tr>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><img alt="WeChat QR" src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/figs/donate_wechat.png" width="240"/></td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><img alt="Alipay QR" src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/figs/donate_alipay.png" width="240"/></td>
  </tr>
</table>
</div>

ありがとうございます · 谢谢你 · Thank you for helping the IdeasRobot learn, listen, and share more openly.

## License

License file status is currently unclear in this repository: no top-level `LICENSE` file is present at draft time.

Assumption for contributors: treat code/assets as proprietary to repository owners unless a license file is added or clarified in a future update.
