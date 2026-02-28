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

IdeasRobot ist eine entspannte Mikrofon-und-Kamera-Konsole, inspiriert von *The Art of Lazying* und *OnlyIdeas*: ein Tornado-Backend, das mit dem Wheeltec-M2-Mikrofonarray (oder dessen Simulator) kommuniziert, plus eine installierbare PWA/Android/iOS-Oberfläche, die Wellenform-Energie und Wake-Angle-Telemetrie streamt und Ein-Klick-Aufnahmen von überall ermöglicht.

## Überblick

IdeasRobot vereint drei Ebenen in einem Repository:

- Echtzeit-Steuerungsruntime: `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- Installierbare Client-App: `mic_array_dashboard/frontend/public` (PWA für Android/iOS/Desktop).
- Hardware-/Vendor-Referenzen: Wheeltec-SDK-Bundles, Legacy-Integrationspfade für Raspberry Pi und Architekturhinweise für die Erweiterung auf breitere Robotiksysteme.

Dieses Repository ist absichtlich gemischt: aktiver Runtime-Code plus Vendor-/Legacy-Assets, die für Low-Level-Bootstrap und Inbetriebnahme benötigt werden.

## Highlights

| Fähigkeit | Beschreibung |
| --- | --- |
| 🎛️ Echtzeit-Control-Hub | `/ws/stream` pusht Wellenform-Balken, SILENCE/SPEAKING-Status und Wake-Winkel, während `/api/*` Status und Aufnahmen abdeckt. |
| 🔌 Hardware-bewusst | ALSA-Eingang (über `sounddevice`) und Vendor-UART-Pakete sind mit robusten Fallbacks gekapselt, damit die Entwicklung auch ohne Gerät funktioniert. |
| 📱 PWA überall | Installierbar auf Android/iOS/Desktop; enthält eine Neon-Wellenform, kompassbasierte Richtungsvisualisierung und Offline-Cache. |
| 🤖 Robot-ready | Entwickelt als Sensor-Frontend für zukünftige IdeasRobot-Builds mit Mikrofonarray + Kameras + Motoren + OnlyIdeas-Automatisierungen. |

## Projektstruktur

```text
.
├── README.md
├── AGENTS.md
├── i18n/                          # Mehrsprachige README-Varianten
├── references/
│   ├── ARCHITECTURE.md            # Backend/Frontend-Protokoll und Komponentendetails
│   └── SDK_NOTES.md               # Tiefe Linux/Raspberry-Pi-SDK-Hinweise
├── docs/                          # GitHub-Pages-Static-Landing
├── mic_array_dashboard/
│   ├── backend/
│   │   ├── server.py              # Haupteinstiegspunkt der Runtime
│   │   ├── config.py              # Umgebungsvariablen-gesteuerte Einstellungen
│   │   ├── requirements.txt
│   │   └── device/
│   │       ├── audio_capture.py
│   │       └── direction_reader.py
│   ├── frontend/public/           # PWA-Dateien
│   └── recordings/                # Runtime-WAV-Ausgabe
├── raspberrypi_legacy/            # Legacy-Workflows und Skripte für Raspberry Pi
└── M2系列麦克风语音阵列客户资料/    # Vendor-SDK-Archive und Handbücher
```

Ausführliche Dokumentation:

- [Architekturüberblick](references/ARCHITECTURE.md)
- [Wheeltec SDK Deep Notes](references/SDK_NOTES.md)

## Voraussetzungen

### Runtime (Dashboard)

- Python 3.x
- Linux mit ALSA-Audiostack
- Serieller Endpoint des Mikrofonarrays (typischerweise `/dev/wheeltec_mic`) für den Hardware-Modus

### Optionale Systempakete (empfohlen)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### Hardware-Namenshelfer (Vendor-Skript)

Nach Kernel-/USB-Bridge-Updates den udev-Helfer in den Vendor-SDK-Pfaden erneut ausführen, damit `/dev/wheeltec_mic` verfügbar bleibt:

```bash
# Beispielpfad innerhalb der gebündelten SDK-Assets:
# .../offline_mic/scripts/ch9102_udev.sh
sudo bash ch9102_udev.sh
```

## Installation

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

Abhängigkeiten (aus `requirements.txt`):

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## Schnellstart

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Öffne `http://localhost:8080`, um die Konsole zu sehen oder sie als PWA zu installieren.

Für Prototyping ohne Hardware:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## Konfiguration

Umgebungsvariablen sind in `mic_array_dashboard/backend/config.py` definiert.

| Variable | Beschreibung | Standard |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Serielles Gerät, das Wake-Angle-Frames ausgibt | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Baudrate für den UART des Mikrofonarrays | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | ALSA-Geräte-ID oder -Name, der an `sounddevice` übergeben wird | Systemstandard |
| `MIC_ARRAY_SAMPLE_RATE` | Capture-Samplerate (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Samples pro Chunk | `2048` |
| `MIC_ARRAY_CHANNELS` | Kanalanzahl (1 = Mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | Verzeichnis zum Speichern von WAV-Aufnahmen | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Gibt synthetisches Sinus-Audio aus | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Gibt gefälschte Wake-Winkel aus | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | `level`-Schwellwert für den Status speaking/silence | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | Anzahl der pro Chunk gesendeten Wellenform-Balken | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | Maximale gleichzeitige WebSocket-Clients | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket-Endpoint | `/ws/stream` |
| `MIC_ARRAY_HOST` | Bind-Host | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP-Port | `8080` |

## Verwendung

### Web-App

- Haupt-UI: `http://localhost:8080`
- Als PWA über den Add-to-Home-Screen-Flow von Chrome/Edge/Safari installieren

### REST-API

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

## Beispiele

### 1) Im Debug-Modus mit Autoreload ausführen

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 2) Aufnahmen außerhalb des Repositorys speichern

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 3) Im lokalen Netzwerk bereitstellen

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## Entwicklungshinweise

- Beim Iterieren `MIC_ARRAY_DEBUG=1` ausführen, um Tornado-Autoreload und ausführliches Logging zu aktivieren.
- Audio-Capture hängt von ALSA ab; führe `python -m sounddevice` aus, um Geräteindizes aufzulisten.
- Frontend-Dateien liegen unter `frontend/public`; Änderungen an `styles.css` oder `app.js` erfordern nur ein Browser-Refresh.
- Backend-Verhalten in `mic_array_dashboard/backend/server.py` erweitern (Handler + Message-Shaping).
- Sensorintegration über Adapter in `mic_array_dashboard/backend/device/` erweitern.
- Das Backend erstellt `mic_array_dashboard/recordings/` automatisch, falls es fehlt.

## Website

- Das statische Landing liegt unter `docs/` (HTML/CSS/JS).
- GitHub Pages so konfigurieren, dass `/docs` auf `main` ausgeliefert wird.
- `docs/CNAME` auf `robot.lazying.art` belassen.

## Legacy-/Vendor-SDK-Hinweise

Das Repository enthält vollständige Wheeltec-SDK-Materialien und Raspberry-Pi-Legacy-Assets für Low-Level-Builds und Protokollvalidierung:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

Beispiel-Build-Flow aus den SDK-Demos (wie in den gebündelten Hinweisen dokumentiert):

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

## Fehlerbehebung

| Symptom | Wahrscheinliche Ursache / Lösung |
| --- | --- |
| `libmsc.so: cannot open shared object file` | `LD_LIBRARY_PATH` auf das passende SDK-Verzeichnis `libs/<arch>` setzen. |
| ALSA-Gerätefehler | Index via `arecord -l` prüfen und `MIC_ARRAY_AUDIO_DEVICE` kontrollieren. |
| Fehlendes `/dev/wheeltec_mic` | `ch9102_udev.sh` erneut ausführen, Gerät neu einstecken und Mitgliedschaft in Gruppe `dialout` prüfen. |
| Keine Telemetrie in der UI | Prüfen, ob der WebSocket-Pfad zu `MIC_ARRAY_WS_PATH` passt, und Simulations-Flags aktivieren, wenn keine Hardware verbunden ist. |
| PWA-Installationsprompt erscheint nicht | In Produktion HTTPS/öffentliche Origin sicherstellen und gültige `manifest.json` + Service-Worker-Routing prüfen. |

## Roadmap

- Kamera-Stream-Panels und Event-Fusion mit Wake-Angle-Telemetrie hinzufügen.
- Automatisierungs-Bridges für OnlyIdeas-Workflows (MQTT-/Event-Integrationen) hinzufügen.
- Persistenz/Analytics für Wellenform- und Richtungsverlauf hinzufügen.
- Deployment-Templates verbessern (Reverse Proxy + Service Units).
- Protokoll-Kompatibilitätsabdeckung für zukünftige Mikrofonarray-Firmware-Versionen erweitern.

## Beitrag

- Siehe `AGENTS.md` für Richtlinien für Mitwirkende.
- Bevorzuge kleine, fokussierte Pull Requests mit klaren Reproduktionsschritten.
- Für Runtime-relevante Änderungen Hardware-/OS-Kontext und ausgeführte Kommandos angeben.
- Bei Änderungen an Vendor-SDK-Referenzen `references/SDK_NOTES.md` synchron halten.

Hinweis: Es gibt derzeit keine eigene `CONTRIBUTING.md` in diesem Repository.

## Spenden & Support

Deine Unterstützung hält die IdeasRobot-Toolbox offen, finanziert Geräte-Prototyping und hilft bei der Subventionierung von Community-Deployments. Du kannst über einen der folgenden Links spenden:

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

ありがとうございます · 谢谢你 · Danke, dass du IdeasRobot dabei hilfst, mehr zu lernen, zuzuhören und offener zu teilen.

## Lizenz

Der Lizenzstatus ist in diesem Repository derzeit unklar: Zum Zeitpunkt des Entwurfs ist keine `LICENSE`-Datei im Top-Level vorhanden.

Annahme für Mitwirkende: Behandle Code/Assets als proprietär im Besitz der Repository-Eigentümer, bis eine Lizenzdatei hinzugefügt oder in einem zukünftigen Update klargestellt wird.
