[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


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

IdeasRobot là một bảng điều khiển mic và camera theo phong cách thư thái, lấy cảm hứng từ *The Art of Lazying* và *OnlyIdeas*: backend Tornado giao tiếp với mảng micro Wheeltec M2 (hoặc trình mô phỏng), kết hợp với giao diện PWA/Android/iOS có thể cài đặt để phát trực tuyến năng lượng dạng sóng, telemetry góc đánh thức và xử lý ghi âm một chạm từ bất kỳ đâu.

## Tổng quan

IdeasRobot kết hợp ba lớp trong cùng một repository:

- Runtime điều khiển thời gian thực: `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- Ứng dụng client có thể cài đặt: `mic_array_dashboard/frontend/public` (PWA cho Android/iOS/Desktop).
- Tài liệu tham chiếu phần cứng/nhà cung cấp: bộ SDK Wheeltec, luồng tích hợp Raspberry Pi legacy, và ghi chú kiến trúc để mở rộng sang hệ robot rộng hơn.

Repository này được thiết kế có chủ đích theo kiểu hỗn hợp: mã runtime đang hoạt động cùng các tài sản vendor/legacy cần thiết cho quá trình bring-up mức thấp.

## Điểm nổi bật

| Khả năng | Mô tả |
| --- | --- |
| 🎛️ Trung tâm điều khiển thời gian thực | `/ws/stream` đẩy các cột waveform, trạng thái SILENCE/SPEAKING và góc wake, trong khi `/api/*` xử lý trạng thái và ghi âm. |
| 🔌 Nhận biết phần cứng | Đầu vào ALSA (qua `sounddevice`) và gói UART từ vendor được bọc với cơ chế fallback mềm, nên vẫn phát triển được ngay cả khi không có thiết bị. |
| 📱 PWA mọi nơi | Cài được trên Android/iOS/Desktop; có waveform neon, trực quan hóa hướng dựa trên la bàn và bộ nhớ đệm offline. |
| 🤖 Sẵn sàng cho robot | Được thiết kế như lớp cảm biến frontend cho các bản IdeasRobot tương lai kết hợp mảng micro + camera + động cơ + tự động hóa OnlyIdeas. |

## Cấu trúc dự án

```text
.
├── README.md
├── AGENTS.md
├── i18n/                          # Các biến thể README đa ngôn ngữ
├── references/
│   ├── ARCHITECTURE.md            # Chi tiết giao thức backend/frontend và thành phần
│   └── SDK_NOTES.md               # Ghi chú chuyên sâu Linux/Raspberry Pi SDK
├── docs/                          # Landing tĩnh cho GitHub Pages
├── mic_array_dashboard/
│   ├── backend/
│   │   ├── server.py              # Entrypoint runtime chính
│   │   ├── config.py              # Cấu hình theo biến môi trường
│   │   ├── requirements.txt
│   │   └── device/
│   │       ├── audio_capture.py
│   │       └── direction_reader.py
│   ├── frontend/public/           # Tệp PWA
│   └── recordings/                # WAV output khi runtime chạy
├── raspberrypi_legacy/            # Workflow và script Raspberry Pi legacy
└── M2系列麦克风语音阵列客户资料/    # Kho SDK vendor và tài liệu hướng dẫn
```

Tài liệu chi tiết:

- [Tổng quan kiến trúc](references/ARCHITECTURE.md)
- [Ghi chú chuyên sâu Wheeltec SDK](references/SDK_NOTES.md)

## Điều kiện tiên quyết

### Runtime (dashboard)

- Python 3.x
- Linux với ALSA audio stack
- Cổng serial mảng micro (thường là `/dev/wheeltec_mic`) cho chế độ phần cứng

### Gói hệ thống tùy chọn (khuyến nghị)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### Trợ giúp đặt tên phần cứng (script vendor)

Sau khi cập nhật kernel/USB bridge, hãy chạy lại tiện ích udev trong đường dẫn SDK vendor để đảm bảo `/dev/wheeltec_mic` vẫn khả dụng:

```bash
# Example path inside bundled SDK assets:
# .../offline_mic/scripts/ch9102_udev.sh
sudo bash ch9102_udev.sh
```

## Cài đặt

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

Phụ thuộc (từ `requirements.txt`):

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## Khởi động nhanh

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Mở `http://localhost:8080` để xem bảng điều khiển hoặc cài dưới dạng PWA.

Để prototype không cần phần cứng:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## Cấu hình

Các biến môi trường được định nghĩa trong `mic_array_dashboard/backend/config.py`.

| Biến | Mô tả | Mặc định |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Thiết bị serial phát frame góc wake | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Baud rate cho UART của mảng micro | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | ID hoặc tên thiết bị ALSA truyền cho `sounddevice` | mặc định hệ thống |
| `MIC_ARRAY_SAMPLE_RATE` | Tần số lấy mẫu capture (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Số mẫu trên mỗi chunk | `2048` |
| `MIC_ARRAY_CHANNELS` | Số kênh (1 = mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | Thư mục lưu bản ghi WAV | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Phát audio sóng sine tổng hợp | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Phát góc wake giả lập | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | Ngưỡng `level` cho trạng thái speaking/silence | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | Số cột waveform gửi mỗi chunk | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | Số client WebSocket đồng thời tối đa | `32` |
| `MIC_ARRAY_WS_PATH` | Endpoint WebSocket | `/ws/stream` |
| `MIC_ARRAY_HOST` | Host bind | `0.0.0.0` |
| `MIC_ARRAY_PORT` | Cổng HTTP | `8080` |

## Cách dùng

### Ứng dụng web

- UI chính: `http://localhost:8080`
- Cài dưới dạng PWA từ luồng add-to-home-screen của Chrome/Edge/Safari

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

### Hợp đồng WebSocket

- Endpoint: `/ws/stream` (hoặc `MIC_ARRAY_WS_PATH`)
- Kiểu message từ server: `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- Lệnh từ client: `ping`, `start_recording`, `stop_recording`

Ví dụ payload lệnh:

```json
{"command":"start_recording"}
```

## Ví dụ

### 1) Chạy ở chế độ debug với autoreload

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 2) Lưu bản ghi ngoài repository

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 3) Mở truy cập trong mạng nội bộ

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## Ghi chú phát triển

- Chạy `MIC_ARRAY_DEBUG=1` khi lặp phát triển để bật autoreload Tornado và log chi tiết.
- Audio capture phụ thuộc ALSA; chạy `python -m sounddevice` để liệt kê chỉ số thiết bị.
- Tệp frontend nằm trong `frontend/public`; sửa `styles.css` hoặc `app.js` chỉ cần refresh trình duyệt.
- Mở rộng hành vi backend tại `mic_array_dashboard/backend/server.py` (handlers + tạo hình message).
- Mở rộng tích hợp cảm biến thông qua adapter trong `mic_array_dashboard/backend/device/`.
- Backend sẽ tự tạo `mic_array_dashboard/recordings/` nếu chưa tồn tại.

## Website

- Landing tĩnh nằm dưới `docs/` (HTML/CSS/JS).
- Cấu hình GitHub Pages phục vụ `/docs` trên `main`.
- Giữ `docs/CNAME` là `robot.lazying.art`.

## Ghi chú SDK Legacy/Vendor

Repository bao gồm đầy đủ tài liệu SDK Wheeltec và tài sản Raspberry Pi legacy để build mức thấp và xác thực giao thức:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

Luồng build mẫu từ demo SDK (như ghi trong tài liệu đi kèm):

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

Cho ARM64 Raspberry Pi:

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

## Khắc phục sự cố

| Triệu chứng | Nguyên nhân/cách xử lý khả dĩ |
| --- | --- |
| `libmsc.so: cannot open shared object file` | Đặt `LD_LIBRARY_PATH` trỏ đến đúng thư mục SDK `libs/<arch>`. |
| Lỗi thiết bị ALSA | Kiểm tra chỉ số qua `arecord -l` và rà `MIC_ARRAY_AUDIO_DEVICE`. |
| Thiếu `/dev/wheeltec_mic` | Chạy lại `ch9102_udev.sh`, cắm lại thiết bị, và xác minh thành viên nhóm `dialout`. |
| Không có telemetry trên UI | Xác nhận đường dẫn WebSocket khớp `MIC_ARRAY_WS_PATH` và bật cờ mô phỏng khi không có phần cứng. |
| Không xuất hiện prompt cài PWA | Đảm bảo HTTPS/public origin ở production và `manifest.json` + định tuyến service worker hợp lệ. |

## Lộ trình

- Thêm panel luồng camera và hợp nhất sự kiện với telemetry góc wake.
- Thêm cầu nối tự động hóa cho luồng OnlyIdeas (tích hợp MQTT/event).
- Thêm lưu trữ/phân tích cho lịch sử waveform + hướng.
- Cải thiện mẫu triển khai (reverse proxy + service units).
- Mở rộng phạm vi tương thích giao thức cho các bản firmware mảng micro tương lai.

## Đóng góp

- Xem `AGENTS.md` để biết hướng dẫn cộng tác viên.
- Ưu tiên pull request nhỏ, tập trung và có bước tái hiện rõ ràng.
- Bao gồm ngữ cảnh phần cứng/HĐH và các lệnh đã chạy cho thay đổi ảnh hưởng runtime.
- Nếu thay đổi tham chiếu SDK vendor, hãy đồng bộ `references/SDK_NOTES.md`.

Lưu ý: repository hiện chưa có `CONTRIBUTING.md` chuyên biệt.

## Donate & Support

Sự hỗ trợ của bạn giúp hộp công cụ IdeasRobot luôn mở, tài trợ nguyên mẫu thiết bị, và hỗ trợ triển khai cho cộng đồng. Bạn có thể ủng hộ qua bất kỳ liên kết nào dưới đây:

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

## Giấy phép

Trạng thái tệp giấy phép hiện chưa rõ trong repository này: tại thời điểm soạn thảo chưa có tệp `LICENSE` ở cấp cao nhất.

Giả định cho cộng tác viên: coi mã/tài sản là tài sản độc quyền của chủ repository trừ khi tệp giấy phép được thêm hoặc làm rõ trong một bản cập nhật tương lai.
