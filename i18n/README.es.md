[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner](https://github.com/lachlanchen/lachlanchen/raw/main/figs/banner.png)](https://github.com/lachlanchen/lachlanchen/blob/main/figs/banner.png)

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

IdeasRobot es una consola de micrófono y cámara con tono relajado inspirada en *The Art of Lazying* y *OnlyIdeas*: un backend en Tornado que se comunica con el arreglo de micrófonos Wheeltec M2 (o su simulador) y proporciona una UI instalable en PWA/Android/iOS para la energía de onda, telemetría de ángulo de activación y grabaciones con un toque.

## Datos clave

| Área | Detalles |
| --- | --- |
| Rol del repositorio | Demo de runtime + referencias SDK del proveedor y legado |
| Stack de ejecución | Backend Tornado + WebSocket + REST + frontend instalable |
| Ruta de hardware | Arreglo Wheeltec M2 con `UART` + simulación de respaldo por `ALSA` |
| Activos de validación | `mic_array_dashboard/recordings`, `docs`, árbol de referencia SDK `M2` |

## Tabla de contenidos

- [Datos clave](#datos-clave)
- [Visión general](#visión-general)
- [Características](#características)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
  - [Web app](#web-app)
  - [REST API](#rest-api)
  - [Contrato WebSocket](#contrato-websocket)
- [Configuración](#configuración)
- [Ejemplos](#ejemplos)
- [Notas de desarrollo](#notas-de-desarrollo)
- [Sitio web](#sitio-web)
- [Notas del SDK de proveedor y legado](#notas-del-sdk-de-proveedor-y-legado)
- [Solución de problemas](#solución-de-problemas)
- [Hoja de ruta](#hoja-de-ruta)
- [Contribución](#contribución)
- [Support](#-support)
- [Licencia](#licencia)

## Visión general

IdeasRobot reúne tres capas en un mismo repositorio:

- Runtime de control en tiempo real en `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- UI cliente instalable en `mic_array_dashboard/frontend/public` (PWA para Android/iOS/Desktop).
- Referencias de hardware y proveedor en `M2系列麦克风语音阵列客户资料*`, activos heredados de Raspberry Pi y notas de protocolo para extensiones de bajo nivel.

Este repositorio es deliberadamente mixto: código runtime activo más activos del proveedor y heredados necesarios para la puesta en marcha de bajo nivel.

## Características

| Capacidad | Descripción |
| --- | --- |
| 🎛️ Centro de control en tiempo real | El backend `Tornado` envía barras de forma de onda, estado SILENCE/SPEAKING, telemetría de ángulo de activación y eventos de grabación, mientras expone endpoints REST para estado y recuperación de audio. |
| 🔌 Consciente del hardware | La entrada de audio ALSA y los paquetes seriales UART están envueltos con rutas de simulación de reserva para que el desarrollo pueda continuar sin hardware físico. |
| 📱 PWA en todas partes | El frontend se puede instalar en Android/iOS/Desktop e incluye forma de onda, visualización de dirección y comportamiento offline en caché desde los recursos del service worker. |
| 🤖 Listo para robot | Diseñado como frontend sensorial adecuado para futuros sistemas IdeasRobot con cámaras, módulos de movimiento y flujos de automatización. |
| 📚 Rico en referencias | Incluye documentación, material de SDK del proveedor y rutas heredadas de Raspberry Pi en un mismo repositorio para una experimentación y solución de problemas más rápida. |

## Estructura del proyecto

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

Documentación detallada:

- [Visión general de arquitectura](references/ARCHITECTURE.md)
- [Notas del SDK de Wheeltec](references/SDK_NOTES.md)

## Requisitos previos

### Runtime backend

- Python 3.x
- Linux con pila de audio ALSA
- Endpoint serial del arreglo de micrófonos (típicamente `/dev/wheeltec_mic`) para modo hardware

### Paquetes opcionales del sistema (recomendados)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### Helper de nombres de hardware (flujo del proveedor)

Después de cambios de kernel/puente USB, vuelve a ejecutar el helper desde los recursos del SDK para que `/dev/wheeltec_mic` siga estando expuesto:

```bash
# Ejemplo (la ruta del SDK puede variar):
cd .../offline_mic/scripts
sudo bash ch9102_udev.sh
```

### Supuestos del repositorio

- No existe un archivo de licencia en la raíz en esta instantánea, así que los términos legales se consideran pendientes hasta que se añada.
- Parte de los árboles de vendor/legado son referencias archivadas y no siguen el mismo ritmo de publicación que el código runtime.

## Instalación

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Dependencias listadas en `requirements.txt`:

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## Uso

### Web app

- UI principal: `http://localhost:8080`
- Instalar como PWA desde el flujo de añadir a pantalla de inicio de Chrome/Edge/Safari

### REST API

- `GET /api/status`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`
- `GET /api/recordings/latest`
- `GET /api/recordings/<session_id>/audio`

Ejemplo:

```bash
curl -s http://localhost:8080/api/status | jq
curl -X POST http://localhost:8080/api/recordings/start
curl -X POST http://localhost:8080/api/recordings/stop
curl -OJ http://localhost:8080/api/recordings/<session_id>/audio
```

### Contrato WebSocket

- Endpoint: `/ws/stream` (o `MIC_ARRAY_WS_PATH`)
- Tipos de mensaje del servidor: `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- Comandos del cliente: `ping`, `start_recording`, `stop_recording`

Ejemplo de payload de comando:

```json
{"command":"start_recording"}
```

### Inicio rápido (desde código fuente)

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Para prototipado sin hardware:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## Configuración

Las variables de entorno se definen en `mic_array_dashboard/backend/config.py`.

| Variable | Descripción | Predeterminado |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Dispositivo serial que emite frames de ángulo de activación | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Baud rate serial | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | ID/nombre del dispositivo ALSA pasado a `sounddevice` | valor predeterminado del sistema |
| `MIC_ARRAY_SAMPLE_RATE` | Tasa de muestreo de captura (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Muestras por bloque de audio | `2048` |
| `MIC_ARRAY_CHANNELS` | Número de canales (1 = mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | Directorio para capturas WAV | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Emitir audio sintético | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Emitir datos de ángulo sintéticos | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | Umbral de voz/silencio | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | Número de barras de forma de onda enviadas por frame | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | Máximo de clientes WebSocket concurrentes | `32` |
| `MIC_ARRAY_WS_PATH` | Ruta de WebSocket | `/ws/stream` |
| `MIC_ARRAY_HOST` | Host de enlace | `0.0.0.0` |
| `MIC_ARRAY_PORT` | Puerto HTTP | `8080` |

## Ejemplos

### Modo debug con autoreload

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### Guardar grabaciones fuera del repositorio

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### Exponer servicio en red local

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## Notas de desarrollo

- Ejecuta con `MIC_ARRAY_DEBUG=1` mientras iteras para obtener logs detallados y comportamiento de autoreload.
- La captura de audio depende de ALSA; ejecuta `python -m sounddevice` para listar índices de dispositivos.
- Los archivos frontend están en `frontend/public`; editar `styles.css` o `app.js` normalmente solo requiere refrescar el navegador tras reiniciar.
- Amplía el comportamiento del backend en `mic_array_dashboard/backend/server.py` (handlers y formato de mensajes).
- Amplía los adaptadores de sensores en `mic_array_dashboard/backend/device/`.
- El backend crea automáticamente `mic_array_dashboard/recordings/` si no existe.

## Sitio web

- El sitio marketing/estático vive en `docs/` (HTML/CSS/JS).
- Configura GitHub Pages para servir `/docs` en la rama `main`.
- Mantén `docs/CNAME` con `robot.lazying.art` cuando despliegues ese dominio.

## Notas del SDK de proveedor y legado

Este repositorio incluye software runtime y artefactos legacy del proveedor, incluyendo:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

Esto incluye flujos antiguos de ASR sin conexión y VAD; usa el backend actual en Python como runtime activo para el desarrollo del dashboard.

Flujo de compilación de ejemplo para comprobaciones de compatibilidad:

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

Para Raspberry Pi ARM64:

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

Al trabajar con reglas USB del proveedor, vuelve a ejecutar `ch9102_udev.sh` y desconecta/conecta el dispositivo si `/dev/wheeltec_mic` desaparece.

## Solución de problemas

| Síntoma | Causa probable / corrección |
| --- | --- |
| `libmsc.so: cannot open shared object file` | Ajusta `LD_LIBRARY_PATH` al directorio de librerías del SDK correspondiente (`libs/<arch>`). |
| Errores de entrada ALSA | Verifica el dispositivo con `arecord -l` y actualiza `MIC_ARRAY_AUDIO_DEVICE`. |
| Falta `/dev/wheeltec_mic` | Vuelve a ejecutar `ch9102_udev.sh`, reconecta el dispositivo y verifica la pertenencia al grupo `dialout`. |
| Sin telemetría en la UI | Asegúrate de que la ruta WebSocket coincida con `MIC_ARRAY_WS_PATH`; usa flags de simulación si no hay hardware conectado. |
| No aparece el aviso de instalación de PWA | Asegura origen HTTPS/público en producción y una configuración válida de `manifest.json` + service worker. |

## Hoja de ruta

- Añadir paneles de stream de cámara y fusión de eventos con la telemetría de ángulo de activación.
- Añadir puentes de automatización para flujos de estilo OnlyIdeas (integración MQTT/eventos).
- Añadir persistencia y analítica para historial de forma de onda + dirección.
- Mejorar plantillas de despliegue (unidades de servicio + ejemplos de reverse proxy).
- Expandir compatibilidad de protocolo para futuras revisiones de firmware del arreglo de micrófonos.

## Contribución

- Consulta `AGENTS.md` para convenciones de colaboradores y requisitos sensibles al hardware.
- Prefiere pull requests pequeñas y enfocadas con pasos de reproducción claros.
- Incluye contexto de hardware/OS y comandos ejecutados ante cualquier cambio que afecte runtime.
- Si se tocan referencias del SDK del proveedor, mantén actualizado `references/SDK_NOTES.md`.

Nota: en este repositorio todavía no existe un archivo `CONTRIBUTING.md` dedicado.

## Licencia

El estado de la licencia de este repositorio sigue sin estar claro: en esta instantánea de trabajo no existe un archivo `LICENSE` en la raíz.

Supuesto para colaboradores: trata el código y los activos como propiedad del propietario del repositorio hasta que se añada o aclare una licencia en una actualización futura.


## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |
