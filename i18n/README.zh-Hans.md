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

IdeasRobot 是一个轻量、随性的话筒与摄像头控制台，灵感来自 *The Art of Lazying* 与 *OnlyIdeas*：它以 Tornado 后端连接 Wheeltec M2 麦克风阵列（或模拟器），并配套可安装的 PWA/Android/iOS 界面，可在任意位置实时查看波形能量、唤醒角度遥测，并一键录音。

## 概览

IdeasRobot 在同一个仓库中融合了三层能力：

- 实时控制运行时：`mic_array_dashboard/backend`（Tornado + WebSocket + REST）。
- 可安装客户端应用：`mic_array_dashboard/frontend/public`（面向 Android/iOS/Desktop 的 PWA）。
- 硬件/厂商参考资料：Wheeltec SDK 资料包、Raspberry Pi 旧版集成路径，以及面向更广泛机器人系统扩展的架构说明。

本仓库有意采用混合形态：既包含活跃运行时代码，也保留底层调试与 bring-up 所需的厂商/遗留资产。

## 亮点

| 能力 | 说明 |
| --- | --- |
| 🎛️ 实时控制中枢 | `/ws/stream` 推送波形柱、SILENCE/SPEAKING 状态和唤醒角度，`/api/*` 提供状态与录音接口。 |
| 🔌 面向硬件 | ALSA 输入（通过 `sounddevice`）与厂商 UART 数据包具备优雅降级机制，即使没有设备也能开发。 |
| 📱 全平台 PWA | 可安装到 Android/iOS/Desktop；内置霓虹波形、罗盘方向可视化与离线缓存。 |
| 🤖 机器人就绪 | 作为未来 IdeasRobot 构建的感知前端，面向麦克风阵列 + 摄像头 + 电机 + OnlyIdeas 自动化联动。 |

## 项目结构

```text
.
├── README.md
├── AGENTS.md
├── i18n/                          # 多语言 README 版本
├── references/
│   ├── ARCHITECTURE.md            # 后端/前端协议与组件细节
│   └── SDK_NOTES.md               # 深入 Linux/Raspberry Pi SDK 笔记
├── docs/                          # GitHub Pages 静态落地页
├── mic_array_dashboard/
│   ├── backend/
│   │   ├── server.py              # 运行时主入口
│   │   ├── config.py              # 基于环境变量的设置
│   │   ├── requirements.txt
│   │   └── device/
│   │       ├── audio_capture.py
│   │       └── direction_reader.py
│   ├── frontend/public/           # PWA 文件
│   └── recordings/                # 运行时 WAV 输出
├── raspberrypi_legacy/            # Raspberry Pi 旧版流程与脚本
└── M2系列麦克风语音阵列客户资料/    # 厂商 SDK 压缩包与手册
```

详细文档：

- [架构概览](../references/ARCHITECTURE.md)
- [Wheeltec SDK 深度笔记](../references/SDK_NOTES.md)

## 前置条件

### 运行时（dashboard）

- Python 3.x
- 带 ALSA 音频栈的 Linux
- 麦克风阵列串口端点（硬件模式通常为 `/dev/wheeltec_mic`）

### 可选系统包（推荐）

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### 硬件命名辅助（厂商脚本）

在内核或 USB 桥接更新后，请在厂商 SDK 路径中重新执行 udev 辅助脚本，确保 `/dev/wheeltec_mic` 始终可用：

```bash
# Example path inside bundled SDK assets:
# .../offline_mic/scripts/ch9102_udev.sh
sudo bash ch9102_udev.sh
```

## 安装

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

依赖（来自 `requirements.txt`）：

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## 快速开始

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

打开 `http://localhost:8080` 查看控制台，或将其安装为 PWA。

若需在无硬件环境下进行原型开发：

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## 配置

环境变量定义见 `mic_array_dashboard/backend/config.py`。

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | 输出唤醒角度帧的串口设备 | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | 麦克风阵列 UART 波特率 | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | 传给 `sounddevice` 的 ALSA 设备 id 或名称 | system default |
| `MIC_ARRAY_SAMPLE_RATE` | 采集采样率（Hz） | `16000` |
| `MIC_ARRAY_CHUNK` | 每块样本数 | `2048` |
| `MIC_ARRAY_CHANNELS` | 通道数（1 = 单声道） | `1` |
| `MIC_ARRAY_RECORDING_DIR` | 存放 WAV 录音的目录 | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | 输出模拟正弦波音频 | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | 输出模拟唤醒角度 | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | 用于 speaking/silence 状态的 `level` 阈值 | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | 每个 chunk 发送的波形柱数量 | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | WebSocket 最大并发客户端数 | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket 端点 | `/ws/stream` |
| `MIC_ARRAY_HOST` | 绑定主机 | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP 端口 | `8080` |

## 使用方式

### Web 应用

- 主界面：`http://localhost:8080`
- 在 Chrome/Edge/Safari 的添加到主屏流程中安装为 PWA

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

## 示例

### 1) 在调试模式下启用自动重载

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 2) 将录音存储到仓库外部

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 3) 暴露到局域网

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## 开发说明

- 迭代开发时运行 `MIC_ARRAY_DEBUG=1`，可启用 Tornado 自动重载与详细日志。
- 音频采集依赖 ALSA；运行 `python -m sounddevice` 查看设备索引。
- 前端文件位于 `frontend/public`；编辑 `styles.css` 或 `app.js` 后只需刷新浏览器。
- 在 `mic_array_dashboard/backend/server.py` 扩展后端行为（处理器 + 消息整形）。
- 通过 `mic_array_dashboard/backend/device/` 适配器扩展传感器集成。
- 若目录缺失，后端会自动创建 `mic_array_dashboard/recordings/`。

## 网站

- 静态落地页位于 `docs/`（HTML/CSS/JS）。
- 配置 GitHub Pages 以 `main` 分支的 `/docs` 作为站点目录。
- 保持 `docs/CNAME` 为 `robot.lazying.art`。

## 旧版/厂商 SDK 说明

仓库包含完整 Wheeltec SDK 资料与 Raspberry Pi 旧版资产，用于底层构建与协议验证：

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

SDK demo 的示例构建流程（见打包说明文档）：

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

针对 ARM64 Raspberry Pi：

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

## 故障排查

| 症状 | 常见原因 / 处理方式 |
| --- | --- |
| `libmsc.so: cannot open shared object file` | 将 `LD_LIBRARY_PATH` 指向匹配架构的 SDK `libs/<arch>` 目录。 |
| ALSA 设备报错 | 使用 `arecord -l` 确认设备索引，并检查 `MIC_ARRAY_AUDIO_DEVICE`。 |
| 缺少 `/dev/wheeltec_mic` | 重新运行 `ch9102_udev.sh`，重新插拔设备，并确认用户属于 `dialout` 组。 |
| UI 无遥测数据 | 确认 WebSocket 路径与 `MIC_ARRAY_WS_PATH` 一致；无硬件时开启模拟开关。 |
| 未出现 PWA 安装提示 | 生产环境确保 HTTPS/公网域名，并保证 `manifest.json` 与 service worker 路由有效。 |

## 路线图

- 添加摄像头流面板，并与唤醒角度遥测进行事件融合。
- 添加面向 OnlyIdeas 工作流的自动化桥接（MQTT/事件集成）。
- 添加波形 + 方向历史数据的持久化/分析能力。
- 改进部署模板（反向代理 + service 单元）。
- 扩展协议兼容覆盖，以适配后续麦克风阵列固件版本。

## 贡献

- 贡献者指南见 `AGENTS.md`。
- 建议提交小而聚焦的 pull request，并提供清晰复现步骤。
- 对影响运行时的改动，请附上硬件/操作系统上下文与执行命令。
- 若修改了厂商 SDK 参考内容，请同步更新 `references/SDK_NOTES.md`。

说明：当前仓库暂无专门的 `CONTRIBUTING.md`。

## 捐助与支持

你的支持将帮助 IdeasRobot 工具箱保持开放、资助设备原型开发，并补贴社区部署。你可以通过以下任意链接捐助：

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

## 许可

当前仓库的许可证文件状态尚不明确：在草稿时未发现顶层 `LICENSE` 文件。

对贡献者的暂定假设：在后续新增或澄清许可证文件之前，请将代码/资产视为归仓库所有者专有。
