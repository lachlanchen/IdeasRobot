<p>
  <b>語言：</b>
  <a href="../README.md">English</a>
  · <a href="README.zh-Hans.md">中文 (简体)</a>
  · <a href="README.zh-Hant.md">中文（繁體）</a>
  · <a href="README.ja.md">日本語</a>
  · <a href="README.ko.md">한국어</a>
  · <a href="README.vi.md">Tiếng Việt</a>
  · <a href="README.es.md">Español</a>
</p>

# IdeasRobot

IdeasRobot 受「The Art of Lazying」和 OnlyIdeas 啟發，把 Wheeltec M2 麥克風陣列（或模擬訊號）封裝成 Tornado 後端 + PWA/Android/iOS 介面，讓你隨時查看波形能量、喚醒角度並進行錄音。

## 亮點

- **即時控制台**：`/ws/stream` 連續推送 72 段波形、SILENCE/SPEAKING 標籤與喚醒角度，`/api/*` 提供狀態與錄音控制。
- **硬體友善**：透過 ALSA + `sounddevice` 擷取音訊，串口解析完全對應原廠 0xA5 格式，沒有硬體時可切換到模擬模式。
- **PWA 隨處安裝**：支援 Android/iOS/桌面安裝，附霓虹波形、指南針視覺化以及離線快取。
- **為機器人打造**：未來可結合鏡頭、OnlyIdeas 自動化與驅動模組，作為 IdeasRobot 的聽覺/視覺前端。

## 專案結構

```
mic_array_dashboard/
├── backend/          # Tornado 服務、硬體介面、依賴清單
├── frontend/public/  # PWA (HTML/JS/CSS、manifest、service worker、icon)
└── recordings/       # 執行時產生的 WAV
```

協作指引請參考 `AGENTS.md`。

## 文件

- [架構概覽](../references/ARCHITECTURE.md)：後端適配器、訊息格式與前端流程。
- [Wheetlec SDK 深度筆記](../references/SDK_NOTES.md)：在 Linux / Raspberry Pi 編譯官方 SDK，並透過 Python 操作。

## 快速開始

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

開啟 http://localhost:8080 查看控制台或安裝 PWA。若還未連接硬體，可設定 `MIC_ARRAY_SIMULATE_AUDIO=1`、`MIC_ARRAY_SIMULATE_DIRECTION=1` 進行模擬。

## 設定

| 變數 | 說明 | 預設 |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | 提供喚醒角資料的序列埠 | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | 序列埠鮑率 | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | 傳給 `sounddevice` 的 ALSA 裝置名稱 | 系統預設 |
| `MIC_ARRAY_SAMPLE_RATE` | 取樣率 (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | 每個音訊區塊的取樣點數 | `2048` |
| `MIC_ARRAY_CHANNELS` | 聲道數 | `1` |
| `MIC_ARRAY_SIMULATE_AUDIO` | 是否輸出模擬音訊 | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | 是否模擬喚醒角 | `0` |
| `MIC_ARRAY_WS_PATH` | WebSocket 路徑 | `/ws/stream` |
| `MIC_ARRAY_PORT` | HTTP 連接埠 | `8080` |

## 開發提示

- 啟用 `MIC_ARRAY_DEBUG=1` 以獲得 Tornado 自動重新載入與除錯日誌。
- 使用 `python -m sounddevice` 查看 ALSA 裝置編號並設定 `MIC_ARRAY_AUDIO_DEVICE`。
- 前端檔案在 `frontend/public`，修改 `styles.css` 或 `app.js` 後重新整理瀏覽器即可。

## 捐助與支持

你的贊助能讓 IdeasRobot 保持開源、支援硬體原型並協助社群部署。歡迎透過以下方式贊助：

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
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><strong>微信</strong></td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><strong>支付寶</strong></td>
  </tr>
  <tr>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><img alt="WeChat QR" src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/figs/donate_wechat.png" width="240"/></td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><img alt="Alipay QR" src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/figs/donate_alipay.png" width="240"/></td>
  </tr>
</table>
</div>

感謝你讓 IdeasRobot 能夠持續傾聽、觀察與分享。
