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

IdeasRobot ist eine lockere Mikrophon- und Kamerakonsole, inspiriert von *The Art of Lazying* und *OnlyIdeas*: ein Tornado-Backend, das mit dem Wheeltec M2 Mikrofonarray (oder dessen Simulator) kommuniziert und eine installierbare PWA/Android/iOS-Oberfläche für Wellenformenergie, Wake-Winkel-Telemetrie und Aufnahmen per Tastendruck bereitstellt.

## Fast Facts

| Bereich | Details |
| --- | --- |
| Rolle im Repository | Runtime-Demo + Vendor-/Legacy-SDK-Referenzen |
| Runtime-Stack | Tornado-Backend + WebSocket + REST + installierbares Frontend |
| Hardware-Pfad | Wheeltec M2 Array mit `UART` + `ALSA`-Fallback-Simulation |
| Validierungs-Assets | `mic_array_dashboard/recordings`, `docs`, `M2` SDK-Referenzbäume |

## Inhaltsverzeichnis

- [Fast Facts](#fast-facts)
- [Überblick](#%C3%BCberblick)
- [Funktionen](#funktionen)
- [Projektstruktur](#projektstruktur)
- [Voraussetzungen](#voraussetzungen)
- [Installation](#installation)
- [Nutzung](#nutzung)
  - [Web-App](#web-app)
  - [REST API](#rest-api)
  - [WebSocket-Vertrag](#websocket-vertrag)
- [Konfiguration](#konfiguration)
- [Beispiele](#beispiele)
- [Entwicklungshinweise](#entwicklungshinweise)
- [Website](#website)
- [Hinweise zu Legacy- und Vendor-SDK](#hinweise-zu-legacy--und-vendor-sdk)
- [Fehlerbehebung](#fehlerbehebung)
- [Roadmap](#roadmap)
- [Beitrag](#beitrag)
- [Support](#-support)
- [Lizenz](#lizenz)

## Überblick

IdeasRobot vereint drei Ebenen in einem Repository:

- Echtzeit-Steuerungsruntime in `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- Installierbare Client-UI in `mic_array_dashboard/frontend/public` (PWA für Android/iOS/Desktop).
- Hardware- und Vendor-Referenzen in `M2系列麦克风语音阵列客户资料*`, Raspberry-Pi-Legacy-Assets und Protokollnotizen für tieferliegende Erweiterungen.

Dieses Repository ist absichtlich gemischt: aktive Runtime-Software plus Vendor- und Legacy-Assets, die für Low-Level-Bring-up und Inbetriebnahme nötig sind.

## Funktionen

| Fähigkeit | Beschreibung |
| --- | --- |
| 🎛️ Echtzeit-Steuerzentrale | `Tornado`-Backend streamt Wellenform-Balken, SILENCE/SPEAKING-Status, Wake-Winkel-Telemetrie und Aufzeichnungsereignisse, während REST-Endpunkte für Status und Audioabruf bereitgestellt werden. |
| 🔌 Hardware-bewusst | ALSA-Audioeingang und serielle UART-Pakete haben Fallback-Pfade für die Simulation, sodass die Entwicklung auch ohne reale Hardware laufen kann. |
| 📱 PWA überall | Das Frontend ist auf Android/iOS/Desktop installierbar und enthält Wellenform-, Richtungsanzeige- und Offline-Cache-Verhalten über Service-Worker-Assets. |
| 🤖 Robot-ready | Als sensorisches Frontend für zukünftige IdeasRobot-Systeme mit Kamera, Bewegungsmodulen und Automations-Workflows ausgelegt. |
| 📚 Referenzreich | Enthält Dokumentation, Vendor-SDK-Material und ältere Raspberry-Pi-Pfade in einem Repository für schnellere Experimente und Fehleranalyse. |

## Projektstruktur

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

Detaillierte Dokumentation:

- [Architecture overview](references/ARCHITECTURE.md)
- [Wheeltec SDK notes](references/SDK_NOTES.md)

## Voraussetzungen

### Runtime-Backend

- Python 3.x
- Linux mit ALSA-Audiostack
- Serielle Endstelle des Mikrofonarrays (typischerweise `/dev/wheeltec_mic`) für den Hardware-Modus

### Optionale Systempakete (empfohlen)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### Hardware-Namens-Helfer (Vendor-Workflow)

Nach Änderungen an Kernel/USB-Bridge den Helfer aus den SDK-Assets erneut ausführen, damit `/dev/wheeltec_mic` weiterhin bereitgestellt wird:

```bash
# Beispiel (SDK-Pfad kann abweichen):
cd .../offline_mic/scripts
sudo bash ch9102_udev.sh
```

### Annahmen auf Repository-Ebene

- In diesem Snapshot gibt es keine Top-Level-Lizenzdatei, daher sollten rechtliche Bedingungen als offen betrachtet werden, bis eine Lizenz ergänzt ist.
- Einige große Vendor-/Legacy-Bäume sind als Referenzarchive abgelegt und nicht mit derselben Release-Taktung wie der Runtime-Code gedacht.

## Installation

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

In `requirements.txt` aufgeführte Abhängigkeiten:

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## Nutzung

### Web-App

- Haupt-UI: `http://localhost:8080`
- Als PWA über den Add-to-Home-Screen-Flow von Chrome/Edge/Safari installieren

### REST API

- `GET /api/status`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`
- `GET /api/recordings/latest`
- `GET /api/recordings/<session_id>/audio`

Beispiel:

```bash
curl -s http://localhost:8080/api/status | jq
curl -X POST http://localhost:8080/api/recordings/start
curl -X POST http://localhost:8080/api/recordings/stop
curl -OJ http://localhost:8080/api/recordings/<session_id>/audio
```

### WebSocket-Vertrag

- Endpoint: `/ws/stream` (oder `MIC_ARRAY_WS_PATH`)
- Server-Nachrichtentypen: `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- Client-Kommandos: `ping`, `start_recording`, `stop_recording`

Beispiel-Command-Payload:

```json
{"command":"start_recording"}
```

### Kurzanleitung (aus dem Quellcode)

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Für Hardware-freies Prototyping:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## Konfiguration

Umgebungsvariablen sind in `mic_array_dashboard/backend/config.py` definiert.

| Variable | Beschreibung | Standard |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Serielle Schnittstelle, die Wake-Angle-Frames ausgibt | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Serielle Baudrate | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | ALSA-Geräte-ID/-Name, übergeben an `sounddevice` | Systemstandard |
| `MIC_ARRAY_SAMPLE_RATE` | Abtastrate der Aufnahme (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Samples pro Audio-Chunk | `2048` |
| `MIC_ARRAY_CHANNELS` | Kanalanzahl (1 = Mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | Verzeichnis für WAV-Aufnahmen | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Synthetisches Audio emittieren | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Synthetische Winkel-Daten emittieren | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | Schwelle für Sprach-/Stille-Erkennung | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | Anzahl der pro Frame übertragenen Wellenform-Balken | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | Maximale gleichzeitige WebSocket-Clients | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket-Pfad | `/ws/stream` |
| `MIC_ARRAY_HOST` | Bind-Host | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP-Port | `8080` |

## Beispiele

### Debug-Modus mit Autoreload

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### Aufnahmen außerhalb des Repositorys speichern

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### Dienst im lokalen Netzwerk bereitstellen

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## Entwicklungshinweise

- Starte mit `MIC_ARRAY_DEBUG=1` beim Iterieren, um ausführliche Logs und Autoreload-Verhalten zu erhalten.
- Audio-Capture hängt von ALSA ab; führe `python -m sounddevice` aus, um Geräte-Indizes aufzulisten.
- Frontend-Dateien befinden sich in `frontend/public`; Änderungen in `styles.css` oder `app.js` erfordern normalerweise nur einen Browser-Refresh nach Neustart.
- Erweitere das Backend-Verhalten in `mic_array_dashboard/backend/server.py` (Handler und Nachrichtenaufbereitung).
- Erweitere Sensor-Adapter in `mic_array_dashboard/backend/device/`.
- Das Backend legt `mic_array_dashboard/recordings/` automatisch an, falls es fehlt.

## Website

- Die Marketing-/Statische Seite liegt unter `docs/` (HTML/CSS/JS).
- Konfiguriere GitHub Pages so, dass `/docs` auf dem `main`-Branch ausgeliefert wird.
- Halte `docs/CNAME` bei diesem Deployment auf `robot.lazying.art`.

## Hinweise zu Legacy- und Vendor-SDK

Das Repository bündelt sowohl Laufzeitsoftware als auch Vendor-/Legacy-Artefakte, darunter:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

Dazu gehören ältere Offline-ASR-Recorder- und VAD-Flows; nutze das aktuelle Python-Backend als aktive Runtime für die Dashboard-Entwicklung.

Beispiel-Build-Flow für SDK-Kompatibilitätschecks:

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

Für ARM64 Raspberry Pi:

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

Bei Problemen mit USB-Regeln für den Vendor führe `ch9102_udev.sh` erneut aus und ziehe das Gerät neu ein, falls `/dev/wheeltec_mic` verschwindet.

## Fehlerbehebung

| Symptom | Wahrscheinliche Ursache / Lösung |
| --- | --- |
| `libmsc.so: cannot open shared object file` | Setze `LD_LIBRARY_PATH` auf das passende SDK-Library-Verzeichnis (`libs/<arch>`). |
| ALSA-Eingabefehler | Prüfe das Gerät mit `arecord -l` und aktualisiere `MIC_ARRAY_AUDIO_DEVICE`. |
| Fehlendes `/dev/wheeltec_mic` | `ch9102_udev.sh` erneut ausführen, Gerät neu einstecken und Mitgliedschaft in `dialout` prüfen. |
| Keine Telemetrie in der UI | Stelle sicher, dass der WebSocket-Pfad zu `MIC_ARRAY_WS_PATH` passt; nutze Simulations-Flags, wenn keine Hardware angeschlossen ist. |
| PWA-Installationsdialog fehlt | Stelle HTTPS/Public Origin in Produktion und gültige `manifest.json` + Service-Worker-Konfiguration sicher. |

## Roadmap

- Kamera-Stream-Panels und Event-Fusion mit Wake-Winkel-Telemetrie ergänzen.
- Automatisierungsbrücken für OnlyIdeas-orientierte Workflows hinzufügen (MQTT/Event-Integration).
- Persistenz und Analysen für Wellenform- und Richtungsverlauf verbessern.
- Deployment-Templates verbessern (Service Units + Reverse-Proxy-Beispiele).
- Protokoll-Kompatibilität für künftige Firmware-Revisionen des Mikrofonarrays ausbauen.

## Beitrag

- Sieh `AGENTS.md` für Konventionen und hardware-sensible Änderungsanforderungen nach.
- Bevorzuge kleine, fokussierte Pull Requests mit klaren Reproduktionsschritten.
- Gib bei jedem Runtime-relevanten Update den Hardware-/OS-Kontext und die ausgeführten Kommandos an.
- Wenn Vendor-SDK-Referenzen berührt werden, halte `references/SDK_NOTES.md` aktuell.

Hinweis: Aktuell existiert keine `CONTRIBUTING.md`-Datei in diesem Repository.

## Lizenz

Der Lizenzstatus dieses Repositories ist derzeit unklar: In dieser Arbeitskopie liegt keine Top-Level-`LICENSE`-Datei vor.

Annahme für Beitragende: Behandle Code und Assets als Eigentum der Repository-Besitzer, solange keine Lizenzdatei hinzugefügt oder in einem künftigen Update rechtlich geklärt wird.


## ❤️ Support

<!-- support:start -->
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsors-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/lachlanchen)
[![LazyingArt Support](https://img.shields.io/badge/LazyingArt-Support-0EA5E9?style=for-the-badge)](https://chat.lazying.art/donate)
[![PayPal Support](https://img.shields.io/badge/PayPal-Support-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/RongzhouChen)
[![Stripe Support](https://img.shields.io/badge/Stripe-Support-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400)
<!-- support:end -->
