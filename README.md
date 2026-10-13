[English](README.md) · [العربية](i18n/README.ar.md) · [Español](i18n/README.es.md) · [Français](i18n/README.fr.md) · [日本語](i18n/README.ja.md) · [한국어](i18n/README.ko.md) · [Tiếng Việt](i18n/README.vi.md) · [中文 (简体)](i18n/README.zh-Hans.md) · [中文（繁體）](i18n/README.zh-Hant.md) · [Deutsch](i18n/README.de.md) · [Русский](i18n/README.ru.md)


[![LazyingArt banner — apps and four buddies](https://github.com/lachlanchen/LazyingArtWebsite/raw/main/media/brand/lazyingart-intro.gif)](https://lazying.art)

# IdeasRobot

![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Tornado-222222)
![Frontend](https://img.shields.io/badge/Frontend-PWA-0a7ea4)
![Hardware](https://img.shields.io/badge/Hardware-Wheeltec%20M2-3c8c3c)
![OS](https://img.shields.io/badge/OS-Linux-FCC624?logo=linux&logoColor=111)
![Status](https://img.shields.io/badge/Project-Active%20Runtime%20%2B%20Vendor%20Assets-2f855a)
![Stars](https://img.shields.io/github/stars/lachlanchen/IdeasRobot?label=Stars&logo=github&style=flat-square)
![Forks](https://img.shields.io/github/forks/lachlanchen/IdeasRobot?label=Forks&logo=github&style=flat-square)
![Last%20Commit](https://img.shields.io/github/last-commit/lachlanchen/IdeasRobot?label=Last%20Commit&logo=git&style=flat-square)

IdeasRobot is a laid-back mic-and-camera console inspired by *The Art of Lazying* and *OnlyIdeas*: a Tornado backend that talks to the Wheeltec M2 microphone array (or its simulator) and provides an installable PWA/Android/iOS UI for waveform energy, wake-angle telemetry, and one-tap recordings.

## Fast Facts

| Area | Details |
| --- | --- |
| Repository role | Runtime demo + vendor/legacy SDK references |
| Runtime stack | Tornado backend + WebSocket + REST + installable frontend |
| Hardware path | Wheeltec M2 array with `UART` + `ALSA` fallback simulation |
| Validation assets | `mic_array_dashboard/recordings`, `docs`, `M2` SDK reference trees |

## Table of Contents

- [Fast Facts](#fast-facts)
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Web app](#web-app)
  - [REST API](#rest-api)
  - [WebSocket contract](#websocket-contract)
- [Configuration](#configuration)
- [Examples](#examples)
- [Development Notes](#development-notes)
- [Website](#website)
- [Legacy and Vendor SDK Notes](#legacy-and-vendor-sdk-notes)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contribution](#contribution)
- [Support](#-support)
- [License](#license)

## Overview

IdeasRobot combines three layers in one repository:

- Realtime control runtime in `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- Installable client UI in `mic_array_dashboard/frontend/public` (PWA for Android/iOS/Desktop).
- Hardware and vendor references in `M2系列麦克风语音阵列客户资料*`, Raspberry Pi legacy assets, and protocol notes for lower-level extensions.

This repository is intentionally mixed: active runtime code plus vendor and legacy assets needed for low-level bring-up.

## Features

| Capability | Description |
| --- | --- |
| 🎛️ Realtime control hub | `Tornado` backend streams waveform bars, SILENCE/SPEAKING state, wake-angle telemetry, and recording events while exposing REST endpoints for state and audio retrieval. |
| 🔌 Hardware aware | ALSA audio input and serial UART packets are wrapped with simulation fallback paths so development can continue without physical hardware. |
| 📱 PWA everywhere | Frontend can be installed on Android/iOS/Desktop and includes waveform, direction display, and cached offline behavior from service worker assets. |
| 🤖 Robot-ready | Designed as a sensory front-end suitable for future IdeasRobot systems with cameras, movement modules, and automation workflows. |
| 📚 Reference-rich | Includes docs, vendor SDK material, and legacy Raspberry Pi paths in one repository for faster experimentation and troubleshooting. |

## Project Structure

```text
.
├── README.md
├── AGENTS.md
├── i18n/
│   ├── README.ar.md
│   ├── README.de.md
│   ├── README.es.md
│   ├── README.fr.md
│   ├── README.ja.md
│   ├── README.ko.md
│   ├── README.ru.md
│   ├── README.vi.md
│   ├── README.zh-Hans.md
│   └── README.zh-Hant.md
├── references/
│   ├── ARCHITECTURE.md
│   └── SDK_NOTES.md
├── docs/
├── mic_array_dashboard/
│   ├── backend/
│   │   ├── server.py
│   │   ├── config.py
│   │   ├── requirements.txt
│   │   └── device/
│   │       ├── audio_capture.py
│   │       └── direction_reader.py
│   ├── frontend/
│   │   └── public/
│   │       ├── index.html
│   │       ├── app.js
│   │       ├── styles.css
│   │       ├── manifest.json
│   │       ├── service-worker.js
│   │       └── icons/
│   ├── recordings/
│   └── README.md
├── M2系列麦克风语音阵列客户资料/
│   └── M2系列麦克风语音阵列客户资料V5.1_20231128/
├── raspberrypi_legacy/
├── figs/
└── .auto-readme-work/
    └── 20260301_071231/
        ├── pipeline-context.md
        ├── repo-structure-analysis.md
        └── translation-plan.txt
```

Detailed documentation:

- [Architecture overview](references/ARCHITECTURE.md)
- [Wheeltec SDK notes](references/SDK_NOTES.md)

## Prerequisites

### Runtime backend

- Python 3.x
- Linux with ALSA audio stack
- Microphone array serial endpoint (typically `/dev/wheeltec_mic`) for hardware mode

### Optional system packages (recommended)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### Hardware naming helper (vendor workflow)

After kernel/USB bridge changes, rerun the helper from SDK assets so `/dev/wheeltec_mic` remains exposed:

```bash
# Example (SDK path may vary):
cd .../offline_mic/scripts
sudo bash ch9102_udev.sh
```

### Repository assumptions

- No top-level license file exists in this snapshot, so legal terms should be treated as unresolved until added.
- Some large vendor/legacy trees are archived references and are not intended for the same release cadence as runtime code.

## Installation

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Dependencies listed in `requirements.txt`:

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

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

### Quick Start (from source)

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

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
| `MIC_ARRAY_SERIAL_BAUD` | Serial baud rate | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | ALSA device ID/name passed to `sounddevice` | system default |
| `MIC_ARRAY_SAMPLE_RATE` | Capture sample rate (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Samples per audio chunk | `2048` |
| `MIC_ARRAY_CHANNELS` | Channel count (1 = mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | Directory for WAV captures | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Emit synthetic audio | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Emit synthetic angle data | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | Speech/silence threshold | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | Number of waveform bars sent per frame | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | Max concurrent WebSocket clients | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket path | `/ws/stream` |
| `MIC_ARRAY_HOST` | Bind host | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP port | `8080` |

## Examples

### Debug mode with autoreload

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### Store recordings outside repository

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### Expose service on local network

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## Development Notes

- Run with `MIC_ARRAY_DEBUG=1` while iterating for verbose logs/autoreload behavior.
- Audio capture depends on ALSA; run `python -m sounddevice` to list device indices.
- Frontend files are in `frontend/public`; editing `styles.css` or `app.js` usually only requires a browser refresh after restart.
- Extend backend behavior in `mic_array_dashboard/backend/server.py` (handlers and message shaping).
- Extend sensor adapters in `mic_array_dashboard/backend/device/`.
- The backend auto-creates `mic_array_dashboard/recordings/` if missing.

## Website

- Marketing/static site lives under `docs/` (HTML/CSS/JS).
- Configure GitHub Pages to serve `/docs` on `main` branch.
- Keep `docs/CNAME` set to `robot.lazying.art` when deploying that domain.

## Legacy and Vendor SDK Notes

This repository bundles both runtime software and vendor/legacy artifacts, including:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

These include older offline ASR recorder and VAD flows; use current Python backend as the active runtime for dashboard development.

Sample SDK build flow for compatibility checks:

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

When working with vendor USB rules, rerun `ch9102_udev.sh` and replug the device if `/dev/wheeltec_mic` disappears.

## Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| `libmsc.so: cannot open shared object file` | Set `LD_LIBRARY_PATH` to the matching SDK library directory (`libs/<arch>`). |
| ALSA input errors | Verify device with `arecord -l` and update `MIC_ARRAY_AUDIO_DEVICE`. |
| Missing `/dev/wheeltec_mic` | Rerun `ch9102_udev.sh`, replug device, and verify `dialout` membership. |
| No telemetry in UI | Ensure WebSocket path matches `MIC_ARRAY_WS_PATH`; use simulation flags if no hardware is attached. |
| PWA install prompt missing | Ensure HTTPS/public origin in production and valid `manifest.json` + service-worker configuration. |

## Roadmap

- Add camera stream panels and event fusion with wake-angle telemetry.
- Add automation bridges for OnlyIdeas-style workflows (MQTT/event integration).
- Add persistence and analytics for waveform + direction history.
- Improve deployment templates (service units + reverse proxy examples).
- Expand protocol compatibility for future firmware revisions of the mic array.

## Contribution

- See `AGENTS.md` for contributor conventions and hardware-aware change requirements.
- Prefer small, focused pull requests with clear reproduction steps.
- Include hardware/OS context and executed commands for any runtime-affecting change.
- If vendor SDK references are touched, keep `references/SDK_NOTES.md` updated.

Note: no dedicated `CONTRIBUTING.md` file exists in this repository at present.

## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |

## License

License file status is currently unclear in this repository: no top-level `LICENSE` file is present in this working snapshot.

Assumption for contributors: treat code and assets as proprietary to repository owners unless a license is added or clarified in a future update.
