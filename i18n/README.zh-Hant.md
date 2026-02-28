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

IdeasRobot 是一個輕鬆風格的麥克風與相機控制台，靈感來自 *The Art of Lazying* 與 *OnlyIdeas*：它使用 Tornado 後端與 Wheeltec M2 麥克風陣列（或模擬器）通訊，並提供可安裝於 PWA/Android/iOS 的 UI，可即時串流波形能量、喚醒角度遙測，並支援隨時一鍵錄音。

## 概覽

IdeasRobot 在同一個儲存庫中整合三個層次：

- 即時控制執行層：`mic_array_dashboard/backend`（Tornado + WebSocket + REST）。
- 可安裝的用戶端 App：`mic_array_dashboard/frontend/public`（Android/iOS/Desktop 的 PWA）。
- 硬體/廠商參考資料：Wheeltec SDK 套件、Raspberry Pi 舊版整合路徑，以及可延伸至更廣泛機器人系統的架構說明。

此儲存庫刻意採混合型內容：包含活躍運行中的程式碼，以及低層 bring-up 所需的廠商/舊版資產。

## 亮點

| 能力 | 說明 |
| --- | --- |
| 🎛️ 即時控制中樞 | `/ws/stream` 會推送波形條、SILENCE/SPEAKING 狀態與喚醒角度，而 `/api/*` 提供狀態與錄音控制。 |
| 🔌 硬體感知設計 | ALSA 輸入（透過 `sounddevice`）與廠商 UART 封包皆有封裝並具備優雅降級，沒有實機也能開發。 |
| 📱 全平台 PWA | 可安裝在 Android/iOS/Desktop；內建霓虹波形、指南針方向視覺化與離線快取。 |
| 🤖 機器人就緒 | 作為未來 IdeasRobot 建置（麥克風陣列 + 相機 + 馬達 + OnlyIdeas 自動化）的感測前端。 |

## 專案結構

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

詳細文件：

- [Architecture overview](references/ARCHITECTURE.md)
- [Wheeltec SDK deep notes](references/SDK_NOTES.md)

## 先決條件

### Runtime（dashboard）

- Python 3.x
- Linux 與 ALSA 音訊堆疊
- 麥克風陣列序列埠端點（硬體模式通常為 `/dev/wheeltec_mic`）

### 可選系統套件（建議）

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### 硬體命名輔助（廠商腳本）

在核心或 USB 橋接器更新後，請於廠商 SDK 路徑重新執行 udev 輔助腳本，以確保 `/dev/wheeltec_mic` 持續可用：

```bash
# Example path inside bundled SDK assets:
# .../offline_mic/scripts/ch9102_udev.sh
sudo bash ch9102_udev.sh
```

## 安裝

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

相依套件（來自 `requirements.txt`）：

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## 快速開始

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

開啟 `http://localhost:8080` 以查看控制台，或將其安裝為 PWA。

若要在無硬體情況下進行原型開發：

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## 設定

環境變數定義於 `mic_array_dashboard/backend/config.py`。

| 變數 | 說明 | 預設值 |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | 輸出喚醒角度幀的序列裝置 | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | 麥克風陣列 UART 鮑率 | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | 傳給 `sounddevice` 的 ALSA 裝置 id 或名稱 | system default |
| `MIC_ARRAY_SAMPLE_RATE` | 擷取取樣率（Hz） | `16000` |
| `MIC_ARRAY_CHUNK` | 每個 chunk 的取樣數 | `2048` |
| `MIC_ARRAY_CHANNELS` | 聲道數（1 = mono） | `1` |
| `MIC_ARRAY_RECORDING_DIR` | 儲存 WAV 錄音的目錄 | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | 輸出合成正弦波音訊 | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | 輸出假的喚醒角度 | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | speaking/silence 狀態的 `level` 閾值 | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | 每個 chunk 傳送的波形柱數 | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | WebSocket 同時連線上限 | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket 端點 | `/ws/stream` |
| `MIC_ARRAY_HOST` | 綁定位址 | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP 埠號 | `8080` |

## 使用方式

### Web app

- 主介面：`http://localhost:8080`
- 可透過 Chrome/Edge/Safari 加入主畫面流程安裝為 PWA

### REST API

- `GET /api/status`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`
- `GET /api/recordings/latest`
- `GET /api/recordings/<session_id>/audio`

範例：

```bash
curl -s http://localhost:8080/api/status | jq
curl -X POST http://localhost:8080/api/recordings/start
curl -X POST http://localhost:8080/api/recordings/stop
curl -OJ http://localhost:8080/api/recordings/<session_id>/audio
```

### WebSocket 協定

- 端點：`/ws/stream`（或 `MIC_ARRAY_WS_PATH`）
- 伺服器訊息類型：`hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- 用戶端指令：`ping`, `start_recording`, `stop_recording`

範例指令 payload：

```json
{"command":"start_recording"}
```

## 範例

### 1) 以 debug 模式啟動並開啟 autoreload

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 2) 將錄音儲存到儲存庫外部

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 3) 對區域網路提供服務

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## 開發備註

- 迭代開發時建議使用 `MIC_ARRAY_DEBUG=1`，可啟用 Tornado autoreload 與詳細日誌。
- 音訊擷取依賴 ALSA；可執行 `python -m sounddevice` 列出裝置索引。
- 前端檔案位於 `frontend/public`；修改 `styles.css` 或 `app.js` 後只需重新整理瀏覽器。
- 可在 `mic_array_dashboard/backend/server.py` 擴充後端行為（handlers 與訊息塑形）。
- 可透過 `mic_array_dashboard/backend/device/` adapters 擴充感測整合。
- 若 `mic_array_dashboard/recordings/` 不存在，後端會自動建立。

## 網站

- 靜態落地頁位於 `docs/`（HTML/CSS/JS）。
- 將 GitHub Pages 設定為在 `main` 分支提供 `/docs`。
- 保持 `docs/CNAME` 設為 `robot.lazying.art`。

## 舊版/廠商 SDK 備註

本儲存庫包含完整 Wheeltec SDK 資料與 Raspberry Pi 舊版資產，可用於低層建置與協定驗證：

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

SDK 範例建置流程（依照附帶說明文件）：

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

ARM64 Raspberry Pi：

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

## 疑難排解

| 症狀 | 可能原因 / 修復方式 |
| --- | --- |
| `libmsc.so: cannot open shared object file` | 將 `LD_LIBRARY_PATH` 設為對應 SDK `libs/<arch>` 目錄。 |
| ALSA 裝置錯誤 | 使用 `arecord -l` 確認索引，並檢查 `MIC_ARRAY_AUDIO_DEVICE`。 |
| 找不到 `/dev/wheeltec_mic` | 重新執行 `ch9102_udev.sh`、重新插拔裝置，並確認使用者在 `dialout` 群組。 |
| UI 無遙測資料 | 確認 WebSocket 路徑與 `MIC_ARRAY_WS_PATH` 一致，且無硬體時啟用模擬旗標。 |
| 沒出現 PWA 安裝提示 | 生產環境需 HTTPS/公開來源，並確認 `manifest.json` 與 service worker 路由有效。 |

## 路線圖

- 新增相機串流面板，並與喚醒角度遙測做事件融合。
- 新增 OnlyIdeas 工作流的自動化橋接（MQTT/事件整合）。
- 新增波形與方向歷史資料的持久化/分析能力。
- 改善部署範本（反向代理 + service units）。
- 擴充未來麥克風陣列韌體版本的協定相容覆蓋。

## 貢獻

- 貢獻規範請見 `AGENTS.md`。
- 建議使用小而聚焦、具清楚重現步驟的 pull request。
- 對影響執行行為的變更，請附上硬體/OS 環境與已執行命令。
- 若修改廠商 SDK 參考內容，請同步更新 `references/SDK_NOTES.md`。

註：此儲存庫目前尚未提供獨立的 `CONTRIBUTING.md`。

## 捐助與支持

你的支持能讓 IdeasRobot 工具箱持續開放、投入裝置原型製作，並協助社群部署成本。你可以透過以下連結捐助：

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

## 授權

目前此儲存庫的授權檔狀態不明：草稿撰寫時未發現頂層 `LICENSE` 檔案。

給貢獻者的暫時假設：在未來新增或釐清授權檔前，請將程式碼/資產視為儲存庫擁有者的專有內容。
