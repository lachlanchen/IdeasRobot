# IdeasRobot

IdeasRobot is a laid-back mic‑and‑camera console inspired by *The Art of Lazying* and *OnlyIdeas*: a Tornado backend that talks to the Wheeltec M2 microphone array (or its simulator) plus an installable PWA/Android/iOS UI that streams waveform energy, wake-angle telemetry, and handles one-tap recordings from anywhere.

## Highlights

- **Realtime control hub** – `/ws/stream` pushes waveform bars, SILENCE/SPEAKING states, and wake angles while `/api/*` covers status and recordings.
- **Hardware aware** – ALSA input (via `sounddevice`) and the vendor’s UART packets are wrapped with graceful fallbacks so development works even without the device.
- **PWA everywhere** – Installable on Android/iOS/Desktop; ships a neon waveform, compass-based direction visualization, and offline cache.
- **Robot-ready** – Designed to be the sensory front-end for future IdeasRobot builds that pair the mic array with cameras, motors, and OnlyIdeas automations.

## Project layout

```
mic_array_dashboard/
├── backend/          # Tornado app, device adapters, requirements.txt
├── frontend/public/  # PWA (HTML/JS/CSS, manifest, service worker, icon)
└── recordings/       # WAV artifacts written at runtime
```

See `AGENTS.md` for contributor guidelines.

## Documentation

- [Architecture overview](docs/ARCHITECTURE.md) – backend adapters, message formats, and frontend flow.
- [Wheetlec SDK deep notes](docs/SDK_NOTES.md) – building the vendor demos on Linux/Raspberry Pi and driving them from Python.

## Quick start

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Visit http://localhost:8080 to view the console or install it as a PWA. Use `MIC_ARRAY_SIMULATE_AUDIO=1` and `MIC_ARRAY_SIMULATE_DIRECTION=1` if you are prototyping without hardware.

## Configuration

| Variable | Description | Default |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Serial device that emits wake-angle frames | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Baud rate for the mic array UART | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | ALSA device id or name passed to `sounddevice` | system default |
| `MIC_ARRAY_SAMPLE_RATE` | Capture sample rate (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Samples per chunk | `2048` |
| `MIC_ARRAY_CHANNELS` | Channel count (1 = mono) | `1` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Emit synthetic sine-wave audio | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Emit fake wake angles | `0` |
| `MIC_ARRAY_WS_PATH` | WebSocket endpoint | `/ws/stream` |
| `MIC_ARRAY_PORT` | HTTP port | `8080` |

## Development tips

- Run `MIC_ARRAY_DEBUG=1` while iterating to enable Tornado autoreload and verbose logging.
- Audio capture depends on ALSA; run `python -m sounddevice` to list device indices.
- Frontend files live in `frontend/public`; editing `styles.css` or `app.js` only requires a browser refresh.

## Donate & support

Your support keeps the IdeasRobot toolbox open, funds device prototyping, and helps subsidize community deployments. You can donate through any of the links below:

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
