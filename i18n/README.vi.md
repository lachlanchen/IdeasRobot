[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner — apps and four buddies](https://lazying.art/media/brand/lazyingart-intro.gif)](https://lazying.art)

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

IdeasRobot là một bảng điều khiển mic-and-camera mang phong cách thư giãn, lấy cảm hứng từ *The Art of Lazying* và *OnlyIdeas*: một backend Tornado giao tiếp với mảng microphone Wheeltec M2 (hoặc trình mô phỏng), đồng thời cung cấp giao diện PWA/Android/iOS cài đặt được để xem năng lượng waveform, telemetry góc đánh thức và bản ghi một chạm.

## Fast Facts

| Khu vực | Chi tiết |
| --- | --- |
| Vai trò của repository | Demo runtime + tham chiếu SDK nhà cung cấp/legacy |
| Stack runtime | Tornado backend + WebSocket + REST + frontend cài đặt được |
| Đường đi phần cứng | Mảng Wheeltec M2 với `UART` + mô phỏng dự phòng `ALSA` |
| Tài nguyên kiểm thử | `mic_array_dashboard/recordings`, `docs`, cây tham chiếu SDK `M2` |

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

IdeasRobot kết hợp ba lớp trong một repository:

- Runtime điều khiển thời gian thực trong `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- UI client cài đặt được trong `mic_array_dashboard/frontend/public` (PWA cho Android/iOS/Desktop).
- Tài liệu tham chiếu phần cứng và nhà cung cấp trong `M2系列麦克风语音阵列客户资料*`, tài sản Raspberry Pi legacy và ghi chú giao thức cho các mở rộng tầng thấp hơn.

Repository này được thiết kế theo hướng hỗn hợp: mã runtime đang hoạt động đi cùng các tài nguyên vendor/legacy cần cho bring-up mức thấp.

## Features

| Khả năng | Mô tả |
| --- | --- |
| 🎛️ Realtime control hub | Backend `Tornado` stream waveform bars, trạng thái SILENCE/SPEAKING, telemetry góc wake và sự kiện ghi âm, đồng thời expose các endpoint REST cho trạng thái và truy xuất âm thanh. |
| 🔌 Hardware aware | Đầu vào audio ALSA và gói UART được bọc cùng đường dự phòng mô phỏng, nhờ đó có thể phát triển ngay cả khi chưa có thiết bị vật lý. |
| 📱 PWA everywhere | Frontend cài đặt được trên Android/iOS/Desktop, gồm waveform, hiển thị hướng, và hành vi cache offline từ service worker. |
| 🤖 Robot-ready | Thiết kế như lớp cảm biến frontend cho các hệ thống IdeasRobot tương lai, tích hợp camera, module di chuyển và luồng tự động hóa. |
| 📚 Reference-rich | Bao gồm tài liệu, vật liệu SDK nhà cung cấp và đường dẫn Raspberry Pi legacy trong cùng repository để thử nghiệm và khắc phục nhanh hơn. |

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

Tài liệu chi tiết:

- [Tổng quan kiến trúc](references/ARCHITECTURE.md)
- [Ghi chú Wheeltec SDK](references/SDK_NOTES.md)

## Prerequisites

### Runtime backend

- Python 3.x
- Linux với ALSA audio stack
- Cổng serial của mảng microphone (thường là `/dev/wheeltec_mic`) cho chế độ phần cứng

### Optional system packages (recommended)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### Hardware naming helper (vendor workflow)

Sau khi thay đổi kernel/USB bridge, chạy lại công cụ từ tài sản SDK để giữ `/dev/wheeltec_mic` luôn hiển thị:

```bash
# Example (SDK path may vary):
cd .../offline_mic/scripts
sudo bash ch9102_udev.sh
```

### Repository assumptions

- Trong snapshot này chưa có tệp license cấp repo, vì vậy điều khoản pháp lý tạm thời được xem là chưa chốt cho đến khi có file rõ ràng.
- Một số cây vendor/legacy lớn là tài liệu tham chiếu lưu trữ, không cùng nhịp release với runtime.

## Installation

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Các dependency được liệt kê trong `requirements.txt`:

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## Usage

### Web app

- UI chính: `http://localhost:8080`
- Cài PWA từ luồng add-to-home-screen của Chrome/Edge/Safari

### REST API

- `GET /api/status`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`
- `GET /api/recordings/latest`
- `GET /api/recordings/<session_id>/audio`

Ví dụ:

```bash
curl -s http://localhost:8080/api/status | jq
curl -X POST http://localhost:8080/api/recordings/start
curl -X POST http://localhost:8080/api/recordings/stop
curl -OJ http://localhost:8080/api/recordings/<session_id>/audio
```

### WebSocket contract

- Endpoint: `/ws/stream` (hoặc `MIC_ARRAY_WS_PATH`)
- Kiểu message server gửi: `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- Lệnh client: `ping`, `start_recording`, `stop_recording`

Ví dụ payload lệnh:

```json
{"command":"start_recording"}
```

### Quick Start (from source)

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Cho prototyping không cần phần cứng:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## Configuration

Các biến môi trường được định nghĩa trong `mic_array_dashboard/backend/config.py`.

| Biến | Mô tả | Mặc định |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Thiết bị serial phát frame góc wake | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Baud rate serial | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | ID/tên thiết bị ALSA truyền cho `sounddevice` | system default |
| `MIC_ARRAY_SAMPLE_RATE` | Tốc độ lấy mẫu (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Số mẫu mỗi audio chunk | `2048` |
| `MIC_ARRAY_CHANNELS` | Số kênh (1 = mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | Thư mục lưu bản ghi WAV | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Tạo dữ liệu audio giả | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Tạo dữ liệu góc giả | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | Ngưỡng speech/silence | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | Số waveform bar gửi mỗi frame | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | Số client WebSocket tối đa đồng thời | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket path | `/ws/stream` |
| `MIC_ARRAY_HOST` | Host bind | `0.0.0.0` |
| `MIC_ARRAY_PORT` | Cổng HTTP | `8080` |

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

### Cho phép truy cập dịch vụ trong mạng nội bộ

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## Development Notes

- Chạy với `MIC_ARRAY_DEBUG=1` khi lặp phát triển để có log chi tiết và autoreload.
- Audio capture phụ thuộc ALSA; chạy `python -m sounddevice` để liệt kê chỉ số thiết bị.
- Frontend nằm trong `frontend/public`; chỉnh `styles.css` hoặc `app.js` thường chỉ cần refresh trình duyệt sau khi khởi động lại.
- Mở rộng hành vi backend ở `mic_array_dashboard/backend/server.py` (handlers và message shaping).
- Mở rộng các adapter cảm biến trong `mic_array_dashboard/backend/device/`.
- Backend tự tạo `mic_array_dashboard/recordings/` nếu chưa tồn tại.

## Website

- Website/landing tĩnh nằm trong `docs/` (HTML/CSS/JS).
- Cấu hình GitHub Pages serve thư mục `/docs` trên nhánh `main`.
- Giữ `docs/CNAME` là `robot.lazying.art` khi deploy domain này.

## Legacy and Vendor SDK Notes

Repository này gói cả runtime và tài sản vendor/legacy, gồm:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

Trong đó có luồng recorder ASR offline và VAD cũ; dùng backend Python hiện tại làm runtime chính cho dashboard.

Luồng build mẫu kiểm tra tương thích:

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

Dành cho ARM64 Raspberry Pi:

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

Khi làm việc với USB rule nhà cung cấp, chạy lại `ch9102_udev.sh` và gắn lại thiết bị nếu `/dev/wheeltec_mic` biến mất.

## Troubleshooting

| Triệu chứng | Nguyên nhân / cách xử lý |
| --- | --- |
| `libmsc.so: cannot open shared object file` | Set `LD_LIBRARY_PATH` về đúng thư mục SDK (`libs/<arch>`). |
| Lỗi đầu vào ALSA | Kiểm tra thiết bị bằng `arecord -l` và cập nhật `MIC_ARRAY_AUDIO_DEVICE`. |
| Thiếu `/dev/wheeltec_mic` | Chạy lại `ch9102_udev.sh`, rút/gắn lại thiết bị, và xác nhận quyền nhóm `dialout`. |
| Không có telemetry trong UI | Đảm bảo WebSocket path khớp `MIC_ARRAY_WS_PATH`; dùng cờ mô phỏng khi không có phần cứng. |
| Prompt cài PWA không hiển thị | Đảm bảo môi trường production dùng HTTPS/public origin và cấu hình hợp lệ cho `manifest.json` + service-worker. |

## Roadmap

- Thêm panel stream camera và ghép sự kiện với telemetry góc wake.
- Thêm cầu nối tự động hóa cho workflow kiểu OnlyIdeas (tích hợp MQTT/event).
- Thêm persistence và analytics cho lịch sử waveform + hướng.
- Cải tiến mẫu triển khai (service unit + ví dụ reverse proxy).
- Mở rộng tương thích giao thức cho các bản firmware mic array trong tương lai.

## Contribution

- Xem `AGENTS.md` để biết quy chuẩn đóng góp và yêu cầu nhận biết phần cứng.
- Ưu tiên pull request nhỏ, tập trung, kèm bước tái hiện rõ ràng.
- Bao gồm bối cảnh phần cứng/HĐH và các lệnh đã chạy cho bất kỳ thay đổi ảnh hưởng runtime nào.
- Nếu chạm vào tham chiếu SDK vendor, hãy cập nhật `references/SDK_NOTES.md`.

Lưu ý: repo hiện chưa có tệp `CONTRIBUTING.md` chuyên biệt.

## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |

## License

Tình trạng tệp giấy phép hiện chưa rõ trong repository này: snapshot hiện tại chưa có `LICENSE` ở cấp cao nhất.

Giả định cho người đóng góp: coi mã và tài sản là sở hữu của chủ repository cho đến khi có giấy phép rõ ràng được thêm vào hoặc xác nhận trong lần cập nhật tới.
