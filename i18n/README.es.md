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

IdeasRobot es una consola relajada de micrófono y cámara inspirada en *The Art of Lazying* y *OnlyIdeas*: un backend en Tornado que se comunica con el arreglo de micrófonos Wheeltec M2 (o su simulador), junto con una interfaz instalable para PWA/Android/iOS que transmite energía de forma de onda, telemetría de ángulo de activación y permite grabar con un toque desde cualquier lugar.

## Resumen

IdeasRobot combina tres capas en un solo repositorio:

- Runtime de control en tiempo real: `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- Aplicación cliente instalable: `mic_array_dashboard/frontend/public` (PWA para Android/iOS/Escritorio).
- Referencias de hardware/fabricante: paquetes SDK de Wheeltec, rutas de integración heredadas para Raspberry Pi y notas de arquitectura para ampliar hacia sistemas robóticos más generales.

Este repositorio es intencionalmente mixto: código runtime activo junto con recursos de fabricante/heredados necesarios para el arranque de bajo nivel.

## Puntos destacados

| Capacidad | Descripción |
| --- | --- |
| 🎛️ Hub de control en tiempo real | `/ws/stream` envía barras de forma de onda, estados SILENCE/SPEAKING y ángulos de activación, mientras que `/api/*` cubre estado y grabaciones. |
| 🔌 Consciente del hardware | La entrada ALSA (mediante `sounddevice`) y los paquetes UART del fabricante se encapsulan con fallback elegante para que el desarrollo funcione incluso sin el dispositivo. |
| 📱 PWA en todas partes | Instalable en Android/iOS/Escritorio; incluye forma de onda neón, visualización de dirección basada en brújula y caché offline. |
| 🤖 Lista para robots | Diseñado como front-end sensorial para futuras versiones de IdeasRobot que combinen arreglo de micrófonos + cámaras + motores + automatizaciones de OnlyIdeas. |

## Estructura del proyecto

```text
.
├── README.md
├── AGENTS.md
├── i18n/                          # Variantes multilingües del README
├── references/
│   ├── ARCHITECTURE.md            # Protocolo backend/frontend y detalle de componentes
│   └── SDK_NOTES.md               # Notas profundas del SDK en Linux/Raspberry Pi
├── docs/                          # Landing estática de GitHub Pages
├── mic_array_dashboard/
│   ├── backend/
│   │   ├── server.py              # Punto de entrada principal del runtime
│   │   ├── config.py              # Configuración impulsada por variables de entorno
│   │   ├── requirements.txt
│   │   └── device/
│   │       ├── audio_capture.py
│   │       └── direction_reader.py
│   ├── frontend/public/           # Archivos PWA
│   └── recordings/                # Salida WAV en runtime
├── raspberrypi_legacy/            # Flujos y scripts heredados de Raspberry Pi
└── M2系列麦克风语音阵列客户资料/    # Archivos SDK del fabricante y manuales
```

Documentación detallada:

- [Resumen de arquitectura](references/ARCHITECTURE.md)
- [Notas detalladas del SDK de Wheeltec](references/SDK_NOTES.md)

## Requisitos previos

### Runtime (dashboard)

- Python 3.x
- Linux con stack de audio ALSA
- Endpoint serie del arreglo de micrófonos (normalmente `/dev/wheeltec_mic`) para modo hardware

### Paquetes de sistema opcionales (recomendados)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### Helper de nombrado de hardware (script del fabricante)

Después de actualizaciones de kernel/puente USB, vuelve a ejecutar el helper udev en las rutas del SDK del fabricante para mantener disponible `/dev/wheeltec_mic`:

```bash
# Example path inside bundled SDK assets:
# .../offline_mic/scripts/ch9102_udev.sh
sudo bash ch9102_udev.sh
```

## Instalación

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

Dependencias (desde `requirements.txt`):

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## Inicio rápido

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Abre `http://localhost:8080` para ver la consola o instalarla como PWA.

Para prototipado sin hardware:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## Configuración

Las variables de entorno están definidas en `mic_array_dashboard/backend/config.py`.

| Variable | Descripción | Predeterminado |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Dispositivo serie que emite tramas de ángulo de activación | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Baudios para el UART del arreglo de micrófonos | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | ID o nombre de dispositivo ALSA pasado a `sounddevice` | predeterminado del sistema |
| `MIC_ARRAY_SAMPLE_RATE` | Tasa de muestreo de captura (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Muestras por chunk | `2048` |
| `MIC_ARRAY_CHANNELS` | Número de canales (1 = mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | Directorio para guardar grabaciones WAV | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Emite audio sintético de onda sinusoidal | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Emite ángulos de activación simulados | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | Umbral de `level` para estado speaking/silence | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | Número de barras de forma de onda enviadas por chunk | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | Máximo de clientes WebSocket concurrentes | `32` |
| `MIC_ARRAY_WS_PATH` | Endpoint WebSocket | `/ws/stream` |
| `MIC_ARRAY_HOST` | Host de enlace | `0.0.0.0` |
| `MIC_ARRAY_PORT` | Puerto HTTP | `8080` |

## Uso

### App web

- UI principal: `http://localhost:8080`
- Instálala como PWA desde el flujo de añadir a pantalla de inicio en Chrome/Edge/Safari

### API REST

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

Payload de comando de ejemplo:

```json
{"command":"start_recording"}
```

## Ejemplos

### 1) Ejecutar en modo debug con autoreload

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 2) Guardar grabaciones fuera del repositorio

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 3) Exponer a la red local

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## Notas de desarrollo

- Ejecuta `MIC_ARRAY_DEBUG=1` durante iteración para habilitar autoreload de Tornado y logging detallado.
- La captura de audio depende de ALSA; ejecuta `python -m sounddevice` para listar índices de dispositivos.
- Los archivos frontend viven en `frontend/public`; editar `styles.css` o `app.js` solo requiere refrescar el navegador.
- Amplía el comportamiento backend en `mic_array_dashboard/backend/server.py` (handlers + forma de mensajes).
- Amplía la integración de sensores mediante adaptadores en `mic_array_dashboard/backend/device/`.
- El backend crea automáticamente `mic_array_dashboard/recordings/` si no existe.

## Sitio web

- La landing estática vive en `docs/` (HTML/CSS/JS).
- Configura GitHub Pages para servir `/docs` en `main`.
- Mantén `docs/CNAME` con el valor `robot.lazying.art`.

## Notas del SDK heredado/del fabricante

El repositorio incluye materiales completos del SDK de Wheeltec y recursos heredados de Raspberry Pi para compilaciones de bajo nivel y validación de protocolo:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

Flujo de compilación de ejemplo desde demos del SDK (tal como se documenta en las notas incluidas):

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

## Solución de problemas

| Síntoma | Causa probable / solución |
| --- | --- |
| `libmsc.so: cannot open shared object file` | Configura `LD_LIBRARY_PATH` al directorio SDK `libs/<arch>` correspondiente. |
| Errores de dispositivo ALSA | Verifica el índice con `arecord -l` y revisa `MIC_ARRAY_AUDIO_DEVICE`. |
| Falta `/dev/wheeltec_mic` | Vuelve a ejecutar `ch9102_udev.sh`, reconecta el dispositivo y verifica membresía del grupo `dialout`. |
| Sin telemetría en la UI | Confirma que la ruta WebSocket coincide con `MIC_ARRAY_WS_PATH` y habilita flags de simulación cuando no haya hardware conectado. |
| No aparece el aviso de instalación PWA | Asegura HTTPS/origen público en producción y un `manifest.json` válido + enrutado del service worker. |

## Hoja de ruta

- Añadir paneles de stream de cámara y fusión de eventos con telemetría de ángulo de activación.
- Añadir puentes de automatización para flujos de OnlyIdeas (integraciones MQTT/eventos).
- Añadir persistencia/analítica para historial de forma de onda + dirección.
- Mejorar plantillas de despliegue (proxy inverso + unidades de servicio).
- Ampliar cobertura de compatibilidad de protocolo para futuras revisiones de firmware del arreglo de micrófonos.

## Contribución

- Consulta `AGENTS.md` para las directrices de contribución.
- Prefiere pull requests pequeños y enfocados, con pasos de reproducción claros.
- Incluye contexto de hardware/SO y comandos ejecutados para cambios que afecten al runtime.
- Si modificas referencias del SDK del fabricante, mantén `references/SDK_NOTES.md` sincronizado.

Nota: actualmente no existe un `CONTRIBUTING.md` dedicado en este repositorio.

## Donaciones y soporte

Tu apoyo mantiene abierta la caja de herramientas de IdeasRobot, financia el prototipado de dispositivos y ayuda a subvencionar despliegues comunitarios. Puedes donar a través de cualquiera de los siguientes enlaces:

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

ありがとうございます · 谢谢你 · Gracias por ayudar a IdeasRobot a aprender, escuchar y compartir con mayor apertura.

## Licencia

El estado del archivo de licencia no está claro actualmente en este repositorio: en el momento de redacción no hay un archivo `LICENSE` en la raíz.

Suposición para contribuidores: tratar el código/recursos como propiedad de los dueños del repositorio, salvo que se añada o aclare un archivo de licencia en una actualización futura.
