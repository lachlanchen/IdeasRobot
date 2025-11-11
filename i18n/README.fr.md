<p>
  <b>Langues :</b>
  <a href="../README.md">English</a>
  · <a href="README.zh-Hans.md">中文 (简体)</a>
  · <a href="README.zh-Hant.md">中文（繁體）</a>
  · <a href="README.ja.md">日本語</a>
  · <a href="README.ko.md">한국어</a>
  · <a href="README.vi.md">Tiếng Việt</a>
  · <a href="README.es.md">Español</a>
  · <a href="README.fr.md">Français</a>
  · <a href="README.ar.md">العربية</a>
</p>

# IdeasRobot

IdeasRobot, inspiré de *The Art of Lazying* et d’OnlyIdeas, connecte l’array de micros Wheeltec M2 (ou son simulateur) à un backend Tornado et à une PWA installable pour visualiser l’énergie sonore, l’angle de réveil et lancer des enregistrements depuis n’importe quel appareil.

## Points clés

- **Hub temps réel** – `/ws/stream` diffuse 72 barres de waveform, l’état SILENCE/SPEAKING et l’angle détecté, tandis que `/api/*` gère statut et enregistrements.
- **Compatibilité matériel** – capture ALSA via `sounddevice`, parseur série compatible avec la trame 0xA5 du fournisseur; un mode simulateur permet de développer sans matériel.
- **PWA partout** – installable sur Android/iOS/desktop avec interface néon, boussole directionnelle et cache hors-ligne.
- **Prêt pour les robots** – conçu comme front sensoriel pour les futures configurations IdeasRobot mêlant caméras et automatisations OnlyIdeas.

## Structure du projet

```
mic_array_dashboard/
├── backend/          # backend Tornado, adaptateurs matériels, requirements
├── frontend/public/  # PWA (HTML/JS/CSS, manifest, service worker, icône)
└── recordings/       # Fichiers WAV écrits à l’exécution
```

Consultez `AGENTS.md` pour les consignes de contribution.

## Documentation

- [Vue d’architecture](../docs/ARCHITECTURE.md) – adaptateurs backend, formats de message, flux front-end.
- [Notes SDK Wheeltec](../docs/SDK_NOTES.md) – compilation des SDK officiels sur Linux/Raspberry Pi et intégration Python.

## Démarrage rapide

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Ouvrez http://localhost:8080 pour accéder à la console ou installer la PWA. Utilisez `MIC_ARRAY_SIMULATE_AUDIO=1` et `MIC_ARRAY_SIMULATE_DIRECTION=1` si le matériel n’est pas branché.

## Configuration

| Variable | Description | Valeur par défaut |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Périphérique série des paquets d’angle | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Débit série | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | Périphérique ALSA transmis à `sounddevice` | valeur système |
| `MIC_ARRAY_SAMPLE_RATE` | Fréquence d’échantillonnage (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Échantillons par bloc | `2048` |
| `MIC_ARRAY_CHANNELS` | Nombre de canaux | `1` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Active l’audio simulé | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Active l’angle simulé | `0` |
| `MIC_ARRAY_WS_PATH` | Route WebSocket | `/ws/stream` |
| `MIC_ARRAY_PORT` | Port HTTP | `8080` |

## Conseils développeur

- Passez `MIC_ARRAY_DEBUG=1` pour activer l’autoreload Tornado et des logs détaillés.
- `python -m sounddevice` liste les périphériques ALSA, pratique pour configurer `MIC_ARRAY_AUDIO_DEVICE`.
- Le frontend réside dans `frontend/public`; modifiez `styles.css` ou `app.js` puis rafraîchissez le navigateur.

## Soutenir le projet

Votre soutien maintient l’écosystème IdeasRobot ouvert, finance les prototypes matériels et des déploiements communautaires :

<div align="center">
<table style="margin:0 auto; text-align:center; border-collapse:collapse;">
  <tr>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;">
      <a href="https://chat.lazying.art/donate">https://chat.lazying.art/donate</a>
    </td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;">
      <a href="https://chat.lazying.art/donate"><img src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/figs/donate_button.svg" alt="Donner" height="44"></a>
    </td>
  </tr>
  <tr>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;">
      <a href="https://paypal.me/RongzhouChen">
        <img src="https://img.shields.io/badge/PayPal-Donate-003087?logo=paypal&logoColor=white" alt="Faire un don via PayPal">
      </a>
    </td>
    <td style="text-align:center; vertical-align:middle; padding:6px 12px;">
      <a href="https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400">
        <img src="https://img.shields.io/badge/Stripe-Donate-635bff?logo=stripe&logoColor=white" alt="Faire un don via Stripe">
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

Merci d’aider IdeasRobot à écouter, observer et partager plus librement.
