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

IdeasRobot는 *The Art of Lazying* 및 *OnlyIdeas*에서 영감을 받은, 여유로운 마이크+카메라 콘솔입니다. Wheeltec M2 마이크 어레이(또는 시뮬레이터)와 통신하는 Tornado 백엔드와, 어디서든 파형 에너지 스트리밍, 웨이크 각도 텔레메트리 확인, 원탭 녹음을 지원하는 설치형 PWA/Android/iOS UI를 결합했습니다.

## 개요

IdeasRobot는 하나의 저장소에서 다음 세 계층을 함께 제공합니다.

- 실시간 제어 런타임: `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- 설치형 클라이언트 앱: `mic_array_dashboard/frontend/public` (Android/iOS/Desktop용 PWA).
- 하드웨어/벤더 레퍼런스: Wheeltec SDK 번들, Raspberry Pi 레거시 통합 경로, 더 넓은 로봇 시스템으로 확장하기 위한 아키텍처 노트.

이 저장소는 의도적으로 혼합형으로 구성되어 있습니다. 즉, 실제 동작 코드와 저수준 bring-up에 필요한 벤더/레거시 자산을 함께 포함합니다.

## 주요 기능

| Capability | Description |
| --- | --- |
| 🎛️ 실시간 제어 허브 | `/ws/stream`이 파형 바, SILENCE/SPEAKING 상태, 웨이크 각도를 푸시하며 `/api/*`는 상태 및 녹음을 담당합니다. |
| 🔌 하드웨어 인지형 설계 | ALSA 입력(`sounddevice` 사용)과 벤더 UART 패킷을 유연한 폴백과 함께 감싸 하드웨어 없이도 개발할 수 있습니다. |
| 📱 어디서나 PWA | Android/iOS/Desktop에 설치 가능하며, 네온 스타일 파형, 나침반 기반 방향 시각화, 오프라인 캐시를 제공합니다. |
| 🤖 로봇 확장 준비 | 마이크 어레이 + 카메라 + 모터 + OnlyIdeas 자동화를 결합하는 향후 IdeasRobot 빌드의 센서 프런트엔드로 설계되었습니다. |

## 프로젝트 구조

```text
.
├── README.md
├── AGENTS.md
├── i18n/                          # 다국어 README 변형
├── references/
│   ├── ARCHITECTURE.md            # 백엔드/프런트엔드 프로토콜 및 컴포넌트 상세
│   └── SDK_NOTES.md               # Linux/Raspberry Pi SDK 심화 노트
├── docs/                          # GitHub Pages 정적 랜딩
├── mic_array_dashboard/
│   ├── backend/
│   │   ├── server.py              # 메인 런타임 엔트리포인트
│   │   ├── config.py              # 환경 변수 기반 설정
│   │   ├── requirements.txt
│   │   └── device/
│   │       ├── audio_capture.py
│   │       └── direction_reader.py
│   ├── frontend/public/           # PWA 파일
│   └── recordings/                # 런타임 WAV 출력
├── raspberrypi_legacy/            # 레거시 Raspberry Pi 워크플로와 스크립트
└── M2系列麦克风语音阵列客户资料/    # 벤더 SDK 아카이브 및 매뉴얼
```

상세 문서:

- [Architecture overview](references/ARCHITECTURE.md)
- [Wheeltec SDK deep notes](references/SDK_NOTES.md)

## 사전 요구사항

### 런타임(대시보드)

- Python 3.x
- ALSA 오디오 스택이 있는 Linux
- 하드웨어 모드용 마이크 어레이 시리얼 엔드포인트(일반적으로 `/dev/wheeltec_mic`)

### 선택적 시스템 패키지(권장)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### 하드웨어 이름 고정 도우미(벤더 스크립트)

커널/USB 브리지 업데이트 후에는 벤더 SDK 경로의 udev 도우미를 다시 실행해 `/dev/wheeltec_mic`가 계속 유지되도록 하세요.

```bash
# bundled SDK 자산 내부 경로 예시:
# .../offline_mic/scripts/ch9102_udev.sh
sudo bash ch9102_udev.sh
```

## 설치

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

의존성(`requirements.txt` 기준):

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## 빠른 시작

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

콘솔을 보거나 PWA로 설치하려면 `http://localhost:8080`을 여세요.

하드웨어 없이 프로토타이핑하려면:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## 설정

환경 변수는 `mic_array_dashboard/backend/config.py`에 정의되어 있습니다.

| Variable | Description | Default |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | 웨이크 각도 프레임을 내보내는 시리얼 장치 | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | 마이크 어레이 UART 보드레이트 | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | `sounddevice`에 전달되는 ALSA 장치 id 또는 이름 | system default |
| `MIC_ARRAY_SAMPLE_RATE` | 캡처 샘플 레이트(Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | 청크당 샘플 수 | `2048` |
| `MIC_ARRAY_CHANNELS` | 채널 수(1 = mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | WAV 녹음 저장 디렉터리 | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | 합성 사인파 오디오 출력 | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | 가짜 웨이크 각도 출력 | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | 발화/무음 상태용 `level` 임계값 | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | 청크당 전송할 파형 바 개수 | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | 동시 WebSocket 클라이언트 최대 수 | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket 엔드포인트 | `/ws/stream` |
| `MIC_ARRAY_HOST` | 바인딩 호스트 | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP 포트 | `8080` |

## 사용법

### 웹 앱

- 메인 UI: `http://localhost:8080`
- Chrome/Edge/Safari의 홈 화면 추가 흐름으로 PWA 설치

### REST API

- `GET /api/status`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`
- `GET /api/recordings/latest`
- `GET /api/recordings/<session_id>/audio`

예시:

```bash
curl -s http://localhost:8080/api/status | jq
curl -X POST http://localhost:8080/api/recordings/start
curl -X POST http://localhost:8080/api/recordings/stop
curl -OJ http://localhost:8080/api/recordings/<session_id>/audio
```

### WebSocket 계약

- 엔드포인트: `/ws/stream` (또는 `MIC_ARRAY_WS_PATH`)
- 서버 메시지 타입: `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- 클라이언트 명령: `ping`, `start_recording`, `stop_recording`

명령 페이로드 예시:

```json
{"command":"start_recording"}
```

## 예제

### 1) 자동 리로드로 디버그 모드 실행

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 2) 저장소 외부에 녹음 파일 저장

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 3) 로컬 네트워크로 노출

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## 개발 노트

- 개발 중에는 `MIC_ARRAY_DEBUG=1`을 사용해 Tornado 자동 리로드와 상세 로깅을 활성화하세요.
- 오디오 캡처는 ALSA에 의존합니다. 장치 인덱스는 `python -m sounddevice`로 확인하세요.
- 프런트엔드 파일은 `frontend/public`에 있으며, `styles.css` 또는 `app.js` 수정 시 브라우저 새로고침만으로 반영됩니다.
- 백엔드 동작 확장은 `mic_array_dashboard/backend/server.py`(핸들러 + 메시지 구성)에서 진행하세요.
- 센서 통합 확장은 `mic_array_dashboard/backend/device/` 어댑터를 통해 수행하세요.
- 백엔드는 `mic_array_dashboard/recordings/`가 없으면 자동으로 생성합니다.

## 웹사이트

- 정적 랜딩 페이지는 `docs/` 아래에 있습니다(HTML/CSS/JS).
- GitHub Pages가 `main` 브랜치의 `/docs`를 서비스하도록 설정하세요.
- `docs/CNAME`은 `robot.lazying.art`로 유지하세요.

## 레거시/벤더 SDK 노트

이 저장소에는 저수준 빌드 및 프로토콜 검증을 위한 Wheeltec SDK 전체 자료와 Raspberry Pi 레거시 자산이 포함되어 있습니다.

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

SDK 데모의 샘플 빌드 흐름(번들 노트 문서 기준):

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

ARM64 Raspberry Pi의 경우:

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

## 문제 해결

| Symptom | Likely cause / fix |
| --- | --- |
| `libmsc.so: cannot open shared object file` | `LD_LIBRARY_PATH`를 해당 SDK `libs/<arch>` 디렉터리로 설정하세요. |
| ALSA 장치 오류 | `arecord -l`로 인덱스를 확인하고 `MIC_ARRAY_AUDIO_DEVICE`를 점검하세요. |
| `/dev/wheeltec_mic` 누락 | `ch9102_udev.sh`를 다시 실행하고 장치를 재연결한 뒤 `dialout` 그룹 권한을 확인하세요. |
| UI에 텔레메트리가 없음 | WebSocket 경로가 `MIC_ARRAY_WS_PATH`와 일치하는지 확인하고, 하드웨어가 없으면 시뮬레이션 플래그를 켜세요. |
| PWA 설치 프롬프트가 뜨지 않음 | 운영 환경에서 HTTPS/공개 오리진을 사용하고 `manifest.json`과 서비스 워커 라우팅이 유효한지 확인하세요. |

## 로드맵

- 웨이크 각도 텔레메트리와 결합한 카메라 스트림 패널 및 이벤트 융합 추가.
- OnlyIdeas 워크플로용 자동화 브리지(MQTT/이벤트 통합) 추가.
- 파형 + 방향 이력에 대한 영속 저장/분석 기능 추가.
- 배포 템플릿(리버스 프록시 + 서비스 유닛) 개선.
- 향후 마이크 어레이 펌웨어 개정에 대한 프로토콜 호환성 범위 확대.

## 기여

- 기여 가이드는 `AGENTS.md`를 참고하세요.
- 재현 단계가 명확한 작고 집중된 PR을 권장합니다.
- 런타임에 영향을 주는 변경의 경우 하드웨어/OS 맥락과 실행한 명령을 포함하세요.
- 벤더 SDK 레퍼런스를 변경했다면 `references/SDK_NOTES.md`와 동기화 상태를 유지하세요.

참고: 현재 저장소에는 별도 `CONTRIBUTING.md`가 없습니다.

## 후원 및 지원

여러분의 지원은 IdeasRobot 툴박스를 개방적으로 유지하고, 디바이스 프로토타이핑 비용을 지원하며, 커뮤니티 배포를 돕는 데 사용됩니다. 아래 링크를 통해 후원할 수 있습니다.

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

## 라이선스

현재 저장소의 라이선스 파일 상태는 명확하지 않습니다. 작성 시점 기준 최상위 `LICENSE` 파일이 없습니다.

기여자를 위한 가정: 향후 라이선스 파일이 추가되거나 명확히 고지되기 전까지, 코드/자산은 저장소 소유자의 독점 자산으로 취급하세요.
