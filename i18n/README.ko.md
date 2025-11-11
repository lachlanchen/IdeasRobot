<p>
  <b>언어:</b>
  <a href="../README.md">English</a>
  · <a href="README.zh-Hans.md">中文 (简体)</a>
  · <a href="README.zh-Hant.md">中文（繁體）</a>
  · <a href="README.ja.md">日本語</a>
  · <a href="README.ko.md">한국어</a>
  · <a href="README.vi.md">Tiếng Việt</a>
  · <a href="README.es.md">Español</a>
</p>

# IdeasRobot

IdeasRobot는 “The Art of Lazying”과 OnlyIdeas 철학을 담은 콘솔입니다. Wheeltec M2 마이크 어레이(또는 시뮬레이터)를 Tornado 백엔드와 PWA/모바일 UI에 연결해 어디서나 파형, 깨움 각도, 녹음을 제어할 수 있습니다.

## 특징

- **실시간 허브**: `/ws/stream`이 72개 막대, SILENCE/SPEAKING 상태, 방향 데이터를 스트리밍하고 `/api/*`는 상태 및 녹음을 담당합니다.
- **하드웨어 친화적**: ALSA + `sounddevice`로 오디오를 가져오고, 시리얼 파서는 제조사 0xA5 프레임과 호환됩니다. 장비가 없어도 시뮬레이터로 개발 가능합니다.
- **PWA 지원**: Android/iOS/데스크톱에 설치할 수 있으며 네온 파형, 컴퍼스, 오프라인 캐시를 제공합니다.
- **로봇 확장**: 앞으로 카메라나 OnlyIdeas 자동화와 결합해 IdeasRobot의 감각 전면 역할을 수행하도록 설계되었습니다.

## 프로젝트 구조

```
mic_array_dashboard/
├── backend/          # Tornado 앱, 디바이스 어댑터, requirements
├── frontend/public/  # PWA (HTML/JS/CSS, manifest, SW, icon)
└── recordings/       # 실행 중 생성되는 WAV
```

기여 방법은 `AGENTS.md`를 확인하세요.

## 문서

- [아키텍처 개요](../docs/ARCHITECTURE.md) – 백엔드 어댑터, 메시지 포맷, 프론트엔드 흐름.
- [Wheetlec SDK 노트](../docs/SDK_NOTES.md) – Linux / Raspberry Pi에서 SDK를 빌드하고 Python으로 제어하는 방법.

## 빠른 시작

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

http://localhost:8080 에 접속해 콘솔을 확인하거나 PWA를 설치하세요. 장비가 없다면 `MIC_ARRAY_SIMULATE_AUDIO=1`, `MIC_ARRAY_SIMULATE_DIRECTION=1`을 설정해 시뮬레이션할 수 있습니다.

## 설정

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | 방향 데이터를 내보내는 시리얼 디바이스 | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | 시리얼 속도 | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | `sounddevice`에 전달할 ALSA 디바이스 명 | 시스템 기본 |
| `MIC_ARRAY_SAMPLE_RATE` | 샘플링 속도 (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | 프레임당 샘플 수 | `2048` |
| `MIC_ARRAY_CHANNELS` | 채널 수 | `1` |
| `MIC_ARRAY_SIMULATE_AUDIO` | 오디오 시뮬레이터 사용 | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | 방향 시뮬레이터 사용 | `0` |
| `MIC_ARRAY_WS_PATH` | WebSocket 경로 | `/ws/stream` |
| `MIC_ARRAY_PORT` | HTTP 포트 | `8080` |

## 개발 팁

- `MIC_ARRAY_DEBUG=1`로 Tornado 자동 리로드와 상세 로그를 활성화하세요.
- `python -m sounddevice`로 ALSA 디바이스 목록을 확인해 `MIC_ARRAY_AUDIO_DEVICE` 값을 정합니다.
- 프론트엔드는 `frontend/public`에 있으며 `styles.css`, `app.js`를 수정 후 브라우저 새로고침만 하면 됩니다.

## 후원

IdeasRobot를 통해 더 많은 오픈 도구와 하드웨어 실험을 계속할 수 있도록 후원을 부탁드립니다.

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
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><strong>Wechat</strong></td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><strong>Alipay</strong></td>
  </tr>
  <tr>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><img alt="WeChat QR" src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/figs/donate_wechat.png" width="240"/></td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;"><img alt="Alipay QR" src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/figs/donate_alipay.png" width="240"/></td>
  </tr>
</table>
</div>

감사합니다. 여러분의 응원이 IdeasRobot이 더 많이 듣고 보고 공유하도록 힘이 됩니다.
