[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner](https://github.com/lachlanchen/lachlanchen/raw/main/figs/banner.png)](https://lazying.art)

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

IdeasRobot 是一个轻松随意的麦克风与摄像头控制台，灵感来自 *The Art of Lazying* 与 *OnlyIdeas*：它基于 Tornado 后端连接 Wheeltec M2 麦克风阵列（或其模拟器），并提供可安装的 PWA/Android/iOS 界面，用于查看波形能量、唤醒角度遥测和一键录音。

## 快速要点

| 区域 | 详情 |
| --- | --- |
| 仓库角色 | 运行时演示 + 厂商/历史 SDK 参考 |
| 运行栈 | Tornado 后端 + WebSocket + REST + 可安装前端 |
| 硬件路径 | Wheeltec M2 阵列，使用 `UART` + `ALSA` 回退模拟 |
| 校验资产 | `mic_array_dashboard/recordings`、`docs`、`M2` SDK 参考目录 |

## 目录

- [快速要点](#快速要点)
- [概览](#概览)
- [功能](#功能)
- [项目结构](#项目结构)
- [先决条件](#先决条件)
- [安装](#安装)
- [使用方式](#使用方式)
  - [Web 应用](#web-应用)
  - [REST API](#rest-api)
  - [WebSocket 协议](#websocket-协议)
- [配置](#配置)
- [示例](#示例)
- [开发说明](#开发说明)
- [网站](#网站)
- [厂商与旧版 SDK 说明](#厂商与旧版-sdk-说明)
- [故障排查](#故障排查)
- [路线图](#路线图)
- [贡献](#贡献)
- [❤️ Support](#-support)
- [许可](#许可)

## 概览

IdeasRobot 在一个仓库中整合了三层能力：

- `mic_array_dashboard/backend` 的实时控制运行时（Tornado + WebSocket + REST）。
- `mic_array_dashboard/frontend/public` 的可安装客户端 UI（Android/iOS/Desktop 的 PWA）。
- `M2系列麦克风语音阵列客户资料*`、Raspberry Pi 旧版资产以及面向底层扩展的协议说明中的硬件与厂商参考。

该仓库故意采用混合结构：既有可运行的运行时代码，也保留了底层启动所需的厂商与历史资产。

## 功能

| 能力 | 说明 |
| --- | --- |
| 🎛️ 实时控制中心 | `Tornado` 后端持续推送波形柱、SILENCE/SPEAKING 状态、唤醒角度遥测和录音事件，同时通过 REST 接口暴露状态与音频读取能力。 |
| 🔌 硬件感知 | ALSA 音频输入和串口 UART 包装了模拟回退路径，未接入实体硬件时也可继续开发。 |
| 📱 全场景 PWA | 前端可安装到 Android/iOS/Desktop，包含波形、方向显示，以及 service worker 提供的离线缓存行为。 |
| 🤖 适配机器人 | 作为传感前端，面向未来的 IdeasRobot 系统（摄像头、运动组件与自动化流程）做了可扩展设计。 |
| 📚 资料丰富 | 在单一仓库内聚合文档、厂商 SDK 材料与 Raspberry Pi 历史路径，便于快速试验与排障。 |

## 项目结构

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

详细文档：

- [架构概览](../references/ARCHITECTURE.md)
- [Wheeltec SDK 说明](../references/SDK_NOTES.md)

## 先决条件

### 运行时后端

- Python 3.x
- Linux（含 ALSA 音频栈）
- 麦克风阵列串口端点（硬件模式通常为 `/dev/wheeltec_mic`）

### 可选系统依赖（推荐）

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### 硬件命名辅助（厂商流程）

内核/USB 桥接变更后，重新运行 SDK 资产中的脚本以保持 `/dev/wheeltec_mic` 持续暴露：

```bash
# 示例（SDK 路径可能不同）：
cd .../offline_mic/scripts
sudo bash ch9102_udev.sh
```

### 仓库假设

- 该快照中没有顶层许可证文件，故请将法律条款视为未明确，待补充后再确认。
- 一些较大的厂商和历史树仅用于归档参考，不与运行时代码采用同一发布节奏。

## 安装

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

`requirements.txt` 中的依赖项：

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## 使用方式

### Web 应用

- 主界面：`http://localhost:8080`
- 从 Chrome/Edge/Safari 的「添加到主屏幕」流程安装为 PWA

### REST API

- `GET /api/status`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`
- `GET /api/recordings/latest`
- `GET /api/recordings/<session_id>/audio`

示例：

```bash
curl -s http://localhost:8080/api/status | jq
curl -X POST http://localhost:8080/api/recordings/start
curl -X POST http://localhost:8080/api/recordings/stop
curl -OJ http://localhost:8080/api/recordings/<session_id>/audio
```

### WebSocket 协议

- 端点：`/ws/stream`（或 `MIC_ARRAY_WS_PATH`）
- 服务端消息类型：`hello`、`waveform`、`direction`、`recording_started`、`recording_stopped`、`pong`
- 客户端命令：`ping`、`start_recording`、`stop_recording`

示例命令载荷：

```json
{"command":"start_recording"}
```

### 快速开始（源代码运行）

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

无硬件原型开发：

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## 配置

环境变量定义在 `mic_array_dashboard/backend/config.py`。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | 发出唤醒角度帧的串口设备 | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | 串口波特率 | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | 传给 `sounddevice` 的 ALSA 设备 ID/名称 | 系统默认 |
| `MIC_ARRAY_SAMPLE_RATE` | 采样率（Hz） | `16000` |
| `MIC_ARRAY_CHUNK` | 每帧采样数量 | `2048` |
| `MIC_ARRAY_CHANNELS` | 声道数（1 = 单声道） | `1` |
| `MIC_ARRAY_RECORDING_DIR` | WAV 采集文件目录 | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | 产出合成音频 | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | 产出合成角度数据 | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | 语音/静音阈值 | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | 每帧发送的波形柱数量 | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | WebSocket 最大并发客户端 | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket 路径 | `/ws/stream` |
| `MIC_ARRAY_HOST` | 绑定主机 | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP 端口 | `8080` |

## 示例

### 启用自动重载的调试模式

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 将录音存放到仓库外

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 在局域网内公开服务

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## 开发说明

- 迭代开发时请使用 `MIC_ARRAY_DEBUG=1`，便于启用 Tornado 的自动重载和详细日志。
- 音频采集依赖 ALSA；运行 `python -m sounddevice` 查看设备索引。
- 前端文件位于 `frontend/public`；修改 `styles.css` 或 `app.js` 后通常只需刷新浏览器。
- 在 `mic_array_dashboard/backend/server.py` 扩展后端行为（处理器与消息整理）。
- 通过 `mic_array_dashboard/backend/device/` 扩展传感器适配器。
- 后端会在目录缺失时自动创建 `mic_array_dashboard/recordings/`。

## 网站

- 落地页在 `docs/` 下（HTML/CSS/JS）。
- 将 GitHub Pages 配置为 `main` 分支的 `/docs`。
- 部署该域名时保持 `docs/CNAME` 为 `robot.lazying.art`。

## 厂商与旧版 SDK 说明

本仓库同时包含运行时代码与厂商/历史遗留资产：

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

这些目录中包含旧版离线 ASR 录音及 VAD 流程；在做传感看板开发时，请以当前 Python 后端作为主运行时。

兼容性检查示例构建流程：

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

用于 ARM64 Raspberry Pi：

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

处理厂商 USB 规则时，如 `/dev/wheeltec_mic` 消失，请重跑 `ch9102_udev.sh` 并重新插拔设备。

## 故障排查

| 症状 | 可能原因 / 处理 |
| --- | --- |
| `libmsc.so: cannot open shared object file` | 将 `LD_LIBRARY_PATH` 指向匹配架构的 SDK 库目录（`libs/<arch>`）。 |
| ALSA 输入报错 | 用 `arecord -l` 核对设备并更新 `MIC_ARRAY_AUDIO_DEVICE`。 |
| 缺少 `/dev/wheeltec_mic` | 重新运行 `ch9102_udev.sh`，重新插拔设备，并确认已加入 `dialout` 用户组。 |
| UI 无遥测数据 | 确认 WebSocket 路径与 `MIC_ARRAY_WS_PATH` 一致；无硬件时可开启模拟参数。 |
| PWA 安装提示缺失 | 生产环境保持 HTTPS 和公开来源，并确保 `manifest.json` 与 service worker 配置有效。 |

## 路线图

- 增加摄像头流面板，并与唤醒角度遥测做事件融合。
- 为 OnlyIdeas 风格工作流增加自动化桥接（MQTT/事件集成）。
- 增强波形与方向历史记录的持久化与分析。
- 改进部署模板（service unit + 反向代理示例）。
- 扩展未来麦克风阵列固件版本的协议兼容性。

## 贡献

- 查看 `AGENTS.md` 了解贡献者约定与硬件相关修改要求。
- 倾向提交小而聚焦的 PR，并提供明确复现步骤。
- 对任何运行时影响较大的改动，注明硬件/操作系统上下文与执行命令。
- 若触及厂商 SDK 参考内容，请同步更新 `references/SDK_NOTES.md`。

说明：本仓库当前没有独立的 `CONTRIBUTING.md` 文件。

## 许可

当前仓库的许可文件状态仍不明确：在当前工作快照中未发现顶层 `LICENSE` 文件。

对贡献者的假设说明：在后续补充或澄清许可证前，请将代码与资产按仓库所有者专有资产处理。


## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |
