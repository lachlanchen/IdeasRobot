<p>
  <b>Idiomas:</b>
  <a href="../README.md">English</a>
  · <a href="README.zh-Hans.md">中文 (简体)</a>
  · <a href="README.zh-Hant.md">中文（繁體）</a>
  · <a href="README.ja.md">日本語</a>
  · <a href="README.ko.md">한국어</a>
  · <a href="README.vi.md">Tiếng Việt</a>
  · <a href="README.es.md">Español</a>
</p>

# IdeasRobot

IdeasRobot nace de “The Art of Lazying” y OnlyIdeas: un backend Tornado con una PWA que se conecta al arreglo de micrófonos Wheeltec M2 (o a su simulador) para visualizar energía, ángulos de activación y grabaciones desde cualquier dispositivo.

## Destacados

- **Centro en tiempo real** – `/ws/stream` envía 72 barras de waveform, el estado SILENCE/SPEAKING y el ángulo detectado; `/api/*` expone estado y control de grabaciones.
- **Amigable con el hardware** – usa ALSA + `sounddevice` para audio y replica el protocolo UART 0xA5 del fabricante; se puede trabajar en modo simulado.
- **PWA multiplataforma** – instalable en Android/iOS/desktop con interfaz de neón, brújula direccional y caché offline.
- **Listo para robots** – pensado como frente sensorial para futuros proyectos IdeasRobot con cámaras y automatizaciones OnlyIdeas.

## Estructura

```
mic_array_dashboard/
├── backend/          # App Tornado, adaptadores, requirements
├── frontend/public/  # PWA (HTML/JS/CSS, manifest, SW, icono)
└── recordings/       # WAV generados en runtime
```

Las guías de contribución están en `AGENTS.md`.

## Documentación

- [Resumen de arquitectura](../references/ARCHITECTURE.md): adaptadores, mensajes y flujo del frontend.
- [Notas del SDK Wheeltec](../references/SDK_NOTES.md): compilación en Linux/Raspberry Pi e integración Python.

## Inicio rápido

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Abre http://localhost:8080 para usar la consola o instalar la PWA. Si no tienes hardware, activa `MIC_ARRAY_SIMULATE_AUDIO=1` y `MIC_ARRAY_SIMULATE_DIRECTION=1`.

## Configuración

| Variable | Descripción | Predeterminado |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Puerto serie con los paquetes de ángulo | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Baudios | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | Dispositivo ALSA para `sounddevice` | valor del sistema |
| `MIC_ARRAY_SAMPLE_RATE` | Frecuencia de muestreo (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Muestras por bloque | `2048` |
| `MIC_ARRAY_CHANNELS` | Canales | `1` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Habilita audio simulado | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Habilita ángulos simulados | `0` |
| `MIC_ARRAY_WS_PATH` | Ruta WebSocket | `/ws/stream` |
| `MIC_ARRAY_PORT` | Puerto HTTP | `8080` |

## Consejos de desarrollo

- `MIC_ARRAY_DEBUG=1` activa autoreload y logs detallados en Tornado.
- Ejecuta `python -m sounddevice` para ver los índices ALSA y definir `MIC_ARRAY_AUDIO_DEVICE`.
- El frontend vive en `frontend/public`; cambia `styles.css` o `app.js` y recarga el navegador.

## Donaciones

Tu apoyo mantiene abierto el ecosistema IdeasRobot, financia prototipos y despliegues comunitarios:

<div align="center">
<table style="margin:0 auto; text-align:center; border-collapse:collapse;">
  <tr>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;">
      <a href="https://chat.lazying.art/donate">https://chat.lazying.art/donate</a>
    </td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;">
      <a href="https://chat.lazying.art/donate"><img src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/figs/donate_button.svg" alt="Donar" height="44"></a>
    </td>
  </tr>
  <tr>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;">
      <a href="https://paypal.me/RongzhouChen">
        <img src="https://img.shields.io/badge/PayPal-Donate-003087?logo=paypal&logoColor=white" alt="Donar vía PayPal">
      </a>
    </td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;">
      <a href="https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400">
        <img src="https://img.shields.io/badge/Stripe-Donate-635bff?logo=stripe&logoColor=white" alt="Donar vía Stripe">
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

Gracias por ayudar a IdeasRobot a escuchar, observar y compartir de forma abierta.
