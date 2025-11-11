<p>
  <b>Ngôn ngữ:</b>
  <a href="../README.md">English</a>
  · <a href="README.zh-Hans.md">中文 (简体)</a>
  · <a href="README.zh-Hant.md">中文（繁體）</a>
  · <a href="README.ja.md">日本語</a>
  · <a href="README.ko.md">한국어</a>
  · <a href="README.vi.md">Tiếng Việt</a>
  · <a href="README.es.md">Español</a>
</p>

# IdeasRobot

IdeasRobot lấy cảm hứng từ “The Art of Lazying” và OnlyIdeas: một backend Tornado + PWA có thể nói chuyện với mảng micro Wheeltec M2 (hoặc bộ giả lập), giúp bạn xem mức sóng, góc đánh thức và điều khiển ghi âm ở mọi nơi.

## Điểm nổi bật

- **Hub thời gian thực** – `/ws/stream` phát 72 cột sóng, trạng thái SILENCE/SPEAKING và góc thức tỉnh, `/api/*` cung cấp API trạng thái và ghi âm.
- **Thân thiện phần cứng** – thu âm qua ALSA + `sounddevice`, giải mã UART tương thích khung 0xA5 của nhà sản xuất; có thể bật chế độ mô phỏng khi chưa có thiết bị.
- **PWA đa nền tảng** – cài được lên Android/iOS/Desktop với giao diện waveform neon, la bàn hướng và cache offline.
- **Sẵn sàng cho robot** – đóng vai trò lớp cảm biến cho các dự án IdeasRobot kết hợp camera, tự động hóa OnlyIdeas hoặc mô-đun điều khiển.

## Cấu trúc

```
mic_array_dashboard/
├── backend/          # Ứng dụng Tornado, adapter thiết bị, requirements
├── frontend/public/  # PWA (HTML/JS/CSS, manifest, service worker, icon)
└── recordings/       # File WAV tạo trong lúc chạy
```

Hướng dẫn đóng góp nằm tại `AGENTS.md`.

## Tài liệu

- [Tổng quan kiến trúc](../docs/ARCHITECTURE.md) – adapter backend, định dạng thông điệp, luồng frontend.
- [Ghi chú SDK Wheeltec](../docs/SDK_NOTES.md) – build SDK nhà sản xuất trên Linux/Raspberry Pi và cách giao tiếp bằng Python.

## Bắt đầu nhanh

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Truy cập http://localhost:8080 để mở console hoặc cài PWA. Nếu chưa có thiết bị, đặt `MIC_ARRAY_SIMULATE_AUDIO=1` và `MIC_ARRAY_SIMULATE_DIRECTION=1`.

## Cấu hình

| Biến | Mô tả | Mặc định |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Thiết bị serial phát góc đánh thức | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Baud rate | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | Thiết bị ALSA truyền cho `sounddevice` | hệ thống mặc định |
| `MIC_ARRAY_SAMPLE_RATE` | Tần số lấy mẫu (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Số mẫu mỗi khối | `2048` |
| `MIC_ARRAY_CHANNELS` | Số kênh | `1` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Bật mô phỏng âm thanh | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Bật mô phỏng góc | `0` |
| `MIC_ARRAY_WS_PATH` | Đường dẫn WebSocket | `/ws/stream` |
| `MIC_ARRAY_PORT` | Cổng HTTP | `8080` |

## Ghi chú phát triển

- Dùng `MIC_ARRAY_DEBUG=1` để bật auto-reload và log chi tiết của Tornado.
- `python -m sounddevice` sẽ liệt kê các thiết bị ALSA; dùng kết quả đó cho `MIC_ARRAY_AUDIO_DEVICE`.
- Frontend nằm trong `frontend/public`; chỉnh sửa `styles.css` hoặc `app.js` rồi refresh trình duyệt.

## Ủng hộ

Sự đóng góp của bạn giúp IdeasRobot tiếp tục mở nguồn, thử nghiệm phần cứng và phục vụ cộng đồng:

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

Cảm ơn bạn đã giúp IdeasRobot lắng nghe, quan sát và chia sẻ nhiều hơn.
