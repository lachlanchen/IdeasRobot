<p>
  <b>语言：</b>
  <a href="../README.md">English</a>
  · <a href="README.zh-Hans.md">中文 (简体)</a>
  · <a href="README.zh-Hant.md">中文（繁體）</a>
  · <a href="README.ja.md">日本語</a>
  · <a href="README.ko.md">한국어</a>
  · <a href="README.vi.md">Tiếng Việt</a>
  · <a href="README.es.md">Español</a>
</p>

# IdeasRobot

IdeasRobot 受到「Lazying 的艺术」与 OnlyIdeas 的启发——它把 Wheeltec M2 麦克风阵列（或模拟器）包装成一个 Tornado + PWA 控制台，让你在任何设备上查看波形能量、唤醒角度并一键录音。

## 亮点

- **实时控制中心**：`/ws/stream` 推送 72 段波形、SILENCE/SPEAKING 状态与唤醒角度；`/api/*` 负责状态查询与录音控制。
- **理解硬件**：通过 ALSA + `sounddevice` 抓取音频，串口解析完全兼容厂商 0xA5 帧；无硬件时可切换到模拟模式。
- **跨平台 PWA**：支持 Android/iOS/桌面安装，内建霓虹波形、罗盘式方向可视化与离线缓存。
- **为机器人而生**：未来可与摄像头、OnlyIdeas 自动化或驱动模块组合，成为 IdeasRobot 的听觉/视觉前端。

## 项目结构

```
mic_array_dashboard/
├── backend/          # Tornado 应用、硬件适配与依赖
├── frontend/public/  # PWA (HTML/JS/CSS、manifest、service worker、图标)
└── recordings/       # 运行时生成的 WAV
```

开发协作请查看 `AGENTS.md`。

## 文档

- [架构概览](../references/ARCHITECTURE.md)：后端适配器、消息格式与前端流程。
- [Wheetlec SDK 深度笔记](../references/SDK_NOTES.md)：在 Linux / Raspberry Pi 构建官方 SDK、以及 Python 集成技巧。

## 快速开始

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

打开 http://localhost:8080 即可查看控制台或安装 PWA。若尚无硬件，可设置 `MIC_ARRAY_SIMULATE_AUDIO=1` 与 `MIC_ARRAY_SIMULATE_DIRECTION=1`。

## 配置

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | 输出唤醒角度的串口设备 | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | 串口波特率 | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | 传给 `sounddevice` 的 ALSA 设备标识 | 系统默认 |
| `MIC_ARRAY_SAMPLE_RATE` | 采样率 (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | 每帧采样点数 | `2048` |
| `MIC_ARRAY_CHANNELS` | 声道数 | `1` |
| `MIC_ARRAY_SIMULATE_AUDIO` | 是否输出模拟音频 | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | 是否模拟唤醒角度 | `0` |
| `MIC_ARRAY_WS_PATH` | WebSocket 路径 | `/ws/stream` |
| `MIC_ARRAY_PORT` | HTTP 端口 | `8080` |

## 开发提示

- 开启 `MIC_ARRAY_DEBUG=1` 便于 Tornado 自动重载并输出调试日志。
- `python -m sounddevice` 可列出 ALSA 设备编号；确保与 `MIC_ARRAY_AUDIO_DEVICE` 一致。
- 前端位于 `frontend/public`，修改 `styles.css`/`app.js` 后刷新浏览器即可。

## 捐助 & 支持

你的支持能让 IdeasRobot 工具箱持续开源、资助硬件原型并支撑社区部署。欢迎通过以下任意方式捐助：

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
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><strong>支付宝</strong></td>
  </tr>
  <tr>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><img alt="WeChat QR" src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/figs/donate_wechat.png" width="240"/></td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><img alt="Alipay QR" src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/figs/donate_alipay.png" width="240"/></td>
  </tr>
</table>
</div>

谢谢你帮助 IdeasRobot 倾听、观察并更开放地分享。
