[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner — apps and four buddies](https://lazying.art/media/brand/lazyingart-intro.gif)](https://lazying.art)

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

IdeasRobot는 *The Art of Lazying*와 *OnlyIdeas*에서 영감받은 편안한 음성/카메라 콘솔입니다. Wheeltec M2 마이크 배열(또는 시뮬레이터)과 통신하는 Tornado 백엔드와, 파형 에너지, 웨이크 각도 텔레메트리, 원탭 녹음을 위한 설치형 PWA/Android/iOS UI를 제공합니다.

## 빠른 사실

| 영역 | 세부 내용 |
| --- | --- |
| 저장소 역할 | 런타임 데모 + 벤더/레거시 SDK 참조 |
| 런타임 스택 | Tornado 백엔드 + WebSocket + REST + 설치형 프론트엔드 |
| 하드웨어 경로 | `UART` + `ALSA` 폴백 시뮬레이션을 지원하는 Wheeltec M2 배열 |
| 검증 자산 | `mic_array_dashboard/recordings`, `docs`, `M2` SDK 참조 트리 |

## 목차

- [빠른 사실](#빠른-사실)
- [개요](#개요)
- [기능](#기능)
- [프로젝트 구조](#프로젝트-구조)
- [전제 조건](#전제-조건)
- [설치](#설치)
- [사용법](#사용법)
  - [웹 앱](#웹-앱)
  - [REST API](#rest-api)
  - [WebSocket 계약](#websocket-계약)
- [설정](#설정)
- [예시](#예시)
- [개발 노트](#개발-노트)
- [웹사이트](#웹사이트)
- [레거시 및 벤더 SDK 노트](#레거시-및-벤더-sdk-노트)
- [문제 해결](#문제-해결)
- [로드맵](#로드맵)
- [기여](#기여)
- [Support](#-support)
- [라이선스](#라이선스)

## 개요

IdeasRobot는 한 저장소에서 세 가지 계층을 결합합니다.

- `mic_array_dashboard/backend`의 실시간 제어 런타임 (Tornado + WebSocket + REST).
- `mic_array_dashboard/frontend/public`의 설치형 클라이언트 UI (Android/iOS/Desktop용 PWA).
- `M2系列麦克风语音阵列客户资料*`, Raspberry Pi 레거시 자산, 그리고 저수준 확장용 프로토콜 메모를 담은 하드웨어/벤더 참고 자료.

이 저장소는 의도적으로 혼합 구조로 구성되어 있습니다. 즉, 활성 런타임 코드와 함께 하드웨어 초기화에 필요한 벤더/레거시 자산을 함께 유지합니다.

## 기능

| 기능 | 설명 |
| --- | --- |
| 🎛️ 실시간 제어 허브 | `Tornado` 백엔드는 파형 바, SILENCE/SPEAKING 상태, 웨이크 각도 텔레메트리, 녹음 이벤트를 스트리밍하고, 상태 조회 및 오디오 조회를 위한 REST 엔드포인트를 제공합니다. |
| 🔌 하드웨어 인식 | ALSA 오디오 입력과 직렬 UART 패킷은 시뮬레이션 폴백 경로와 함께 래핑되어, 물리 하드웨어가 없어도 개발을 계속할 수 있습니다. |
| 📱 어디서나 PWA | 프런트엔드는 Android/iOS/Desktop에 설치 가능하며, 파형·방향 표시·서비스 워커 자산을 통한 오프라인 캐시 동작을 포함합니다. |
| 🤖 로봇 연동 준비 | 카메라, 모션 모듈, 자동화 워크플로우를 갖춘 향후 IdeasRobot 시스템에 적합한 센서형 프런트엔드로 설계되었습니다. |
| 📚 레퍼런스 풍부 | 문서, 벤더 SDK 자료, 레거시 Raspberry Pi 경로를 한 저장소에 포함해 실험과 트러블슈팅 속도를 높입니다. |

## 프로젝트 구조

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

상세 문서:

- [아키텍처 개요](references/ARCHITECTURE.md)
- [Wheeltec SDK 노트](references/SDK_NOTES.md)

## 전제 조건

### 런타임 백엔드

- Python 3.x
- ALSA 오디오 스택이 포함된 Linux
- 하드웨어 모드용 마이크 배열 직렬 엔드포인트(일반적으로 `/dev/wheeltec_mic`)

### 선택적 시스템 패키지 (권장)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### 하드웨어 명명 보조 도구 (벤더 워크플로우)

커널/USB 브릿지 변경 후에도 `/dev/wheeltec_mic`이 계속 노출되도록 SDK 자산에 있는 유틸리티를 다시 실행하세요.

```bash
# 예시 (SDK 경로는 환경에 따라 달라질 수 있음):
cd .../offline_mic/scripts
sudo bash ch9102_udev.sh
```

### 저장소 가정 사항

- 이 스냅샷에는 최상위 라이선스 파일이 없어, 라이선스 항목은 추가 전까지 미정으로 간주합니다.
- 일부 대형 벤더/레거시 트리는 아카이브 참조용이며 런타임 코드와 동일한 릴리스 주기 대상이 아닙니다.

## 설치

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

`requirements.txt`에 정의된 의존성:

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## 사용법

### 웹 앱

- 메인 UI: `http://localhost:8080`
- Chrome/Edge/Safari의 홈 화면에 추가 흐름에서 PWA로 설치

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

### 소스에서 빠르게 시작

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

하드웨어 없이 프로토타이핑:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## 설정

환경 변수는 `mic_array_dashboard/backend/config.py`에 정의되어 있습니다.

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | 웨이크 각도 프레임을 송신하는 직렬 장치 | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | 직렬 통신 보드레이트 | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | `sounddevice`에 전달되는 ALSA 장치 ID/이름 | 시스템 기본값 |
| `MIC_ARRAY_SAMPLE_RATE` | 캡처 샘플링 속도 (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | 오디오 청크당 샘플 수 | `2048` |
| `MIC_ARRAY_CHANNELS` | 채널 수 (1 = 모노) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | WAV 캡처 저장 디렉터리 | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | 합성 오디오 출력 | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | 합성 각도 데이터 출력 | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | 말하기/무음 임계값 | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | 프레임당 전송되는 파형 바 개수 | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | 동시 WebSocket 최대 클라이언트 수 | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket 경로 | `/ws/stream` |
| `MIC_ARRAY_HOST` | 바인딩 호스트 | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP 포트 | `8080` |

## 예시

### 자동 재로드가 포함된 디버그 모드

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 저장소 외부에 녹음 저장

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 로컬 네트워크에 서비스 노출

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## 개발 노트

- 반복 작업 시 `MIC_ARRAY_DEBUG=1`을 사용하면 상세 로그와 자동 재로드 동작을 볼 수 있습니다.
- 오디오 캡처는 ALSA에 의존합니다. 장치 인덱스를 보려면 `python -m sounddevice`를 실행하세요.
- 프런트엔드 파일은 `frontend/public`에 있으며, `styles.css` 또는 `app.js` 수정 시 보통 재시작 후 브라우저 새로고침만 필요합니다.
- 백엔드 동작은 `mic_array_dashboard/backend/server.py`(핸들러와 메시지 형성)에서 확장하세요.
- 센서 어댑터는 `mic_array_dashboard/backend/device/`에서 확장하세요.
- 백엔드는 누락된 경우 `mic_array_dashboard/recordings/`를 자동 생성합니다.

## 웹사이트

- 마케팅/정적 사이트는 `docs/` 하위에 있습니다 (HTML/CSS/JS).
- GitHub Pages를 `main` 브랜치의 `/docs`를 서빙하도록 설정하세요.
- 도메인을 배포할 때는 `docs/CNAME`을 `robot.lazying.art`로 유지하세요.

## 레거시 및 벤더 SDK 노트

이 저장소에는 실행 런타임 소프트웨어와 벤더/레거시 아티팩트가 함께 포함되어 있습니다.

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

여기에는 이전 오프라인 ASR 레코더와 VAD 플로우가 포함됩니다. 대시보드 개발의 활성 런타임은 최신 Python 백엔드를 사용하세요.

호환성 확인을 위한 샘플 SDK 빌드 흐름:

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

벤더 USB 규칙 작업 시 `ch9102_udev.sh`를 다시 실행하고 장치가 사라지면 재연결하세요.

## 문제 해결

| 증상 | 가능성 있는 원인 / 해결 |
| --- | --- |
| `libmsc.so: cannot open shared object file` | `LD_LIBRARY_PATH`를 해당 아키텍처 라이브러리 경로(`libs/<arch>`)로 설정하세요. |
| ALSA 입력 오류 | `arecord -l`로 장치를 확인하고 `MIC_ARRAY_AUDIO_DEVICE`를 갱신하세요. |
| `/dev/wheeltec_mic`이 누락됨 | `ch9102_udev.sh`를 다시 실행하고 장치를 뽑았다 꽂은 뒤 `dialout` 권한을 확인하세요. |
| UI에 텔레메트리 없음 | `MIC_ARRAY_WS_PATH`와 WebSocket 경로가 일치하는지 확인하고, 하드웨어 미연결 시 시뮬레이션 플래그를 사용하세요. |
| PWA 설치 프롬프트가 없음 | 운영 환경의 HTTPS/공개 오리진과 유효한 `manifest.json` 및 서비스 워커 구성이 설정되어 있는지 확인하세요. |

## 로드맵

- 웨이크 각도 텔레메트리와 이벤트 퓨전하는 카메라 스트림 패널을 추가합니다.
- OnlyIdeas 스타일 워크플로우를 위한 자동화 브릿지(MQTT/이벤트 통합)를 추가합니다.
- 파형 + 방향 이력에 대한 영속성 및 분석 기능을 추가합니다.
- 배포 템플릿을 개선합니다(서비스 유닛 + 리버스 프록시 예시).
- 마이크 배열의 향후 펌웨어 개정과 호환성을 확장합니다.

## 기여

- 기여 규칙과 하드웨어 인지 변경 요구사항은 `AGENTS.md`를 참고하세요.
- 재현 단계가 명확한 작은 범위의 PR을 선호합니다.
- 런타임에 영향을 주는 변경은 하드웨어/OS 맥락과 실행한 명령을 함께 포함하세요.
- 벤더 SDK 참조를 수정할 경우 `references/SDK_NOTES.md`를 최신 상태로 유지하세요.

참고: 현재 이 저장소에는 전용 `CONTRIBUTING.md` 파일이 없습니다.

## 라이선스

이 저장소의 라이선스 상태는 현재 불분명합니다. 작업 스냅샷에는 최상위 `LICENSE` 파일이 없습니다.

기여자 전제: 향후 라이선스가 추가되거나 명확히 규정되기 전까지는 코드와 에셋을 저장소 소유자의 독점 자산으로 간주하세요.


## ❤️ Support

<!-- support:start -->
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsors-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/lachlanchen)
[![LazyingArt Support](https://img.shields.io/badge/LazyingArt-Support-0EA5E9?style=for-the-badge)](https://chat.lazying.art/donate)
[![PayPal Support](https://img.shields.io/badge/PayPal-Support-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/RongzhouChen)
[![Stripe Support](https://img.shields.io/badge/Stripe-Support-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400)
<!-- support:end -->
