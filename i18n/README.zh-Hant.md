[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


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

IdeasRobot 是一個靈感來自 *The Art of Lazying* 與 *OnlyIdeas* 的輕鬆語氣麥克風＋攝影機主控台：以 Tornado 後端連接 Wheeltec M2 麥克風陣列（或其模擬器），並提供可安裝的 PWA/Android/iOS 介面，供觀看波形能量、喚醒角度遙測與一鍵錄音使用。

## 快速重點

| 項目 | 說明 |
| --- | --- |
| 倉庫角色 | 執行時示範 + 廠商/歷史 SDK 參考 |
| 運行堆疊 | Tornado 後端 + WebSocket + REST + 可安裝前端 |
| 硬體路徑 | 使用 `UART` + `ALSA` 的 Wheeltec M2 陣列與備援模擬 |
| 驗證資產 | `mic_array_dashboard/recordings`、`docs`、`M2` SDK 參考樹 |

## 目錄

- [快速重點](#快速重點)
- [專案概覽](#專案概覽)
- [功能](#功能)
- [專案架構](#專案架構)
- [先決條件](#先決條件)
- [安裝](#安裝)
- [使用方式](#使用方式)
  - [Web 應用程式](#web-應用程式)
  - [REST API](#rest-api)
  - [WebSocket 合約](#websocket-合約)
- [設定](#設定)
- [範例](#範例)
- [開發備註](#開發備註)
- [網站](#網站)
- [廠商與舊版 SDK 說明](#廠商與舊版-sdk-說明)
- [故障排除](#故障排除)
- [路線圖](#路線圖)
- [貢獻](#貢獻)
- [❤️ Support](#-support)
- [授權](#授權)

## 專案概覽

IdeasRobot 在同一個倉庫整合三層能力：

- `mic_array_dashboard/backend` 的即時控制運行時（Tornado + WebSocket + REST）。
- `mic_array_dashboard/frontend/public` 的可安裝客戶端介面（Android/iOS/Desktop 的 PWA）。
- `M2系列麦克风语音阵列客户资料*`、Raspberry Pi 舊版資源，及低階擴充所需的通訊協定說明。

此倉庫有意採用混合結構：同時保留可執行的運行時程式碼，與底層啟動所需的廠商與歷史資產。

## 功能

| 能力 | 說明 |
| --- | --- |
| 🎛️ 即時控制中樞 | `Tornado` 後端持續串流波形柱、SILENCE/SPEAKING 狀態、喚醒角度遙測與錄音事件，並透過 REST 端點提供狀態與音訊擷取能力。 |
| 🔌 硬體感知 | ALSA 音訊輸入與序列埠 UART 封包皆以模擬備援路徑包裝，讓未接實體硬體的情況下也能持續開發。 |
| 📱 全域 PWA | 前端可安裝於 Android/iOS/Desktop，包含波形、方向顯示，並具備 service worker 所提供的離線快取行為。 |
| 🤖 機器人導向 | 以感測前端定位，適合作為未來 IdeasRobot 系統（攝影機、移動模組、自動化流程）的一部份。 |
| 📚 資料參考齊備 | 將文件、廠商 SDK 材料與歷史 Raspberry Pi 路徑集中於同一倉庫，便於更快實驗與疑難排解。 |

## 專案架構

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

詳細文件：

- [架構總覽](../references/ARCHITECTURE.md)
- [Wheeltec SDK 說明](../references/SDK_NOTES.md)

## 先決條件

### 運行時後端

- Python 3.x
- Linux（含 ALSA 音訊堆疊）
- 麥克風陣列序列埠端點（硬體模式通常為 `/dev/wheeltec_mic`）

### 可選系統套件（建議）

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### 硬體命名協助（廠商流程）

在 kernel/USB bridge 變更後，請重新執行 SDK 資料中提供的腳本，讓 `/dev/wheeltec_mic` 持續暴露：

```bash
# 範例（SDK 路徑可能不同）：
cd .../offline_mic/scripts
sudo bash ch9102_udev.sh
```

### 倉庫前提假設

- 在此快照中沒有頂層授權檔，請將法律條件視為尚未定案，待補上後再據以判斷。
- 部分較大的廠商與歷史資產目錄僅作為歸檔參考，不採與運行代碼同速率發佈。

## 安裝

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

`requirements.txt` 中定義的相依套件：

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## 使用方式

### Web 應用程式

- 主介面：`http://localhost:8080`
- 從 Chrome/Edge/Safari 的「加到主畫面」流程安裝為 PWA

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

### WebSocket 合約

- 端點：`/ws/stream`（或 `MIC_ARRAY_WS_PATH`）
- 伺服器訊息類型：`hello`、`waveform`、`direction`、`recording_started`、`recording_stopped`、`pong`
- 客戶端指令：`ping`、`start_recording`、`stop_recording`

範例指令負載：

```json
{"command":"start_recording"}
```

### 從原始碼快速上手

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

無硬體原型開發：

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## 設定

環境變數定義於 `mic_array_dashboard/backend/config.py`。

| 變數 | 說明 | 預設 |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | 發送喚醒角度畫面的序列埠裝置 | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | 序列埠鮑率 | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | 傳給 `sounddevice` 的 ALSA 裝置 ID/名稱 | 系統預設 |
| `MIC_ARRAY_SAMPLE_RATE` | 擷取採樣率（Hz） | `16000` |
| `MIC_ARRAY_CHUNK` | 每筆音訊區塊樣本數 | `2048` |
| `MIC_ARRAY_CHANNELS` | 頻道數（1 = 單聲道） | `1` |
| `MIC_ARRAY_RECORDING_DIR` | WAV 錄音儲存目錄 | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | 輸出合成音訊 | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | 輸出合成角度資料 | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | 語音/靜音門檻值 | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | 每幀傳送的波形柱數 | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | WebSocket 最大同時連線數 | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket 路徑 | `/ws/stream` |
| `MIC_ARRAY_HOST` | 綁定主機 | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP 通訊埠 | `8080` |

## 範例

### 開啟除錯且自動重載

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 將錄音存放於倉庫外

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 在區域網路公開服務

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## 開發備註

- 在反覆調整時，請使用 `MIC_ARRAY_DEBUG=1` 以取得詳細日誌與自動重載行為。
- 音訊擷取依賴 ALSA，請執行 `python -m sounddevice` 以列出裝置索引。
- 前端檔案位於 `frontend/public`；通常只需重啟後刷新瀏覽器，即可套用 `styles.css` 或 `app.js` 的變更。
- 在 `mic_array_dashboard/backend/server.py` 中擴充後端行為（處理器與訊息成形）。
- 在 `mic_array_dashboard/backend/device/` 中擴充感測器介接。
- 若缺少時，後端會自動建立 `mic_array_dashboard/recordings/`。

## 網站

- 行銷/靜態站點位於 `docs/`（HTML/CSS/JS）。
- 設定 GitHub Pages 後，請在 `main` 分支上提供 `/docs`。
- 部署該網域時，將 `docs/CNAME` 維持為 `robot.lazying.art`。

## 廠商與舊版 SDK 說明

此倉庫同時併列運行時軟體與廠商/歷史遺留素材，包括：

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

其中包含較舊的離線 ASR 錄音與 VAD 流程；進行看板開發時，請以目前 Python 後端作為主要運行時。

相容性檢查範例建置流程：

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

ARM64 Raspberry Pi 作法：

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

處理廠商 USB 規則時，若 `/dev/wheeltec_mic` 消失，請重跑 `ch9102_udev.sh` 並重新插拔裝置。

## 故障排除

| 症狀 | 可能原因 / 修正 |
| --- | --- |
| `libmsc.so: cannot open shared object file` | 將 `LD_LIBRARY_PATH` 指向對應架構的 SDK 函式庫目錄（`libs/<arch>`）。 |
| ALSA 輸入錯誤 | 透過 `arecord -l` 確認裝置並更新 `MIC_ARRAY_AUDIO_DEVICE`。 |
| 看不到 `/dev/wheeltec_mic` | 重跑 `ch9102_udev.sh`、重新插拔裝置，並確認 `dialout` 群組成員身份。 |
| UI 無遙測資料 | 確認 WebSocket 路徑與 `MIC_ARRAY_WS_PATH` 一致；若未連接硬體可啟用模擬旗標。 |
| 沒有 PWA 安裝提示 | 生產環境請確保 HTTPS、公開來源，並確認 `manifest.json` 與 service-worker 設定有效。 |

## 路線圖

- 新增攝影機串流面板，並與喚醒角度遙測做事件融合。
- 為 OnlyIdeas 型工作流程加入自動化橋接（MQTT/事件整合）。
- 改善波形與方向歷史的持久化與分析能力。
- 優化部署範本（service unit + 反向代理範例）。
- 擴展未來韌體版本的韌體相容性。

## 貢獻

- 請參考 `AGENTS.md` 了解貢獻者約定與硬體感知變更需求。
- 傾向提交小而聚焦的 PR，並附上清楚的重現步驟。
- 對任何影響運行時的修改，請補上硬體/作業系統背景與執行過的命令。
- 若涉及廠商 SDK 參考，請同步更新 `references/SDK_NOTES.md`。

備註：目前此倉庫沒有獨立的 `CONTRIBUTING.md` 檔案。

## 授權

目前倉庫授權檔案狀態仍未明確：在此工作快照中，頂層未包含 `LICENSE`。

對貢獻者的約定前提：在未新增或釐清授權前，請將程式碼與資產視為倉庫擁有者的專有內容。


## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |
