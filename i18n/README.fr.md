[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


<p align="center">
  <img src="https://raw.githubusercontent.com/lachlanchen/lachlanchen/main/logos/banner.png" alt="Bannière LazyingArt" />
</p>

# IdeasRobot

![Python](https://img.shields.io/badge/Python-3.x-3776AB?logo=python&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Tornado-222222)
![Frontend](https://img.shields.io/badge/Frontend-PWA-0a7ea4)
![Hardware](https://img.shields.io/badge/Hardware-Wheeltec%20M2-3c8c3c)
![OS](https://img.shields.io/badge/OS-Linux-FCC624?logo=linux&logoColor=111)
![Status](https://img.shields.io/badge/Project-Active%20Runtime%20%2B%20Vendor%20Assets-2f855a)

IdeasRobot est une console micro-caméra décontractée inspirée de *The Art of Lazying* et *OnlyIdeas* : un backend Tornado qui communique avec le réseau de microphones Wheeltec M2 (ou son simulateur), plus une UI PWA/Android/iOS installable qui diffuse l'énergie de forme d'onde, la télémétrie d'angle de réveil, et gère les enregistrements en un geste depuis n'importe où.

## Vue d'ensemble

IdeasRobot réunit trois couches dans un seul dépôt :

- Runtime de contrôle en temps réel : `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- Application cliente installable : `mic_array_dashboard/frontend/public` (PWA pour Android/iOS/Desktop).
- Références matériel/fournisseur : bundles SDK Wheeltec, chemins d'intégration Raspberry Pi hérités, et notes d'architecture pour étendre vers des systèmes robotiques plus larges.

Ce dépôt est volontairement mixte : code runtime actif et ressources fournisseur/héritées nécessaires au bring-up bas niveau.

## Points forts

| Capacité | Description |
| --- | --- |
| 🎛️ Hub de contrôle temps réel | `/ws/stream` envoie les barres de forme d'onde, les états SILENCE/SPEAKING, et les angles de réveil, tandis que `/api/*` couvre l'état et les enregistrements. |
| 🔌 Conscience matérielle | L'entrée ALSA (via `sounddevice`) et les paquets UART fournisseur sont encapsulés avec des replis robustes pour permettre le développement même sans appareil. |
| 📱 PWA partout | Installable sur Android/iOS/Desktop ; propose une forme d'onde néon, une visualisation de direction basée sur boussole, et un cache hors ligne. |
| 🤖 Prêt pour la robotique | Conçu comme frontal sensoriel pour de futures versions d'IdeasRobot associant réseau de microphones + caméras + moteurs + automatisations OnlyIdeas. |

## Structure du projet

```text
.
├── README.md
├── AGENTS.md
├── i18n/                          # Variantes multilingues du README
├── references/
│   ├── ARCHITECTURE.md            # Détail du protocole backend/frontend et des composants
│   └── SDK_NOTES.md               # Notes approfondies Linux/Raspberry Pi SDK
├── docs/                          # Landing statique GitHub Pages
├── mic_array_dashboard/
│   ├── backend/
│   │   ├── server.py              # Point d'entrée principal du runtime
│   │   ├── config.py              # Paramètres pilotés par l'environnement
│   │   ├── requirements.txt
│   │   └── device/
│   │       ├── audio_capture.py
│   │       └── direction_reader.py
│   ├── frontend/public/           # Fichiers PWA
│   └── recordings/                # Sortie WAV du runtime
├── raspberrypi_legacy/            # Workflows et scripts Raspberry Pi hérités
└── M2系列麦克风语音阵列客户资料/    # Archives SDK fournisseur et manuels
```

Documentation détaillée :

- [Aperçu de l'architecture](references/ARCHITECTURE.md)
- [Notes approfondies sur le SDK Wheeltec](references/SDK_NOTES.md)

## Prérequis

### Runtime (dashboard)

- Python 3.x
- Linux avec pile audio ALSA
- Point de terminaison série du réseau de microphones (généralement `/dev/wheeltec_mic`) pour le mode matériel

### Paquets système optionnels (recommandés)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### Aide de nommage matériel (script fournisseur)

Après des mises à jour du noyau ou du pont USB, relancez l'outil udev dans les chemins SDK fournisseur afin que `/dev/wheeltec_mic` reste disponible :

```bash
# Example path inside bundled SDK assets:
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

Dépendances (depuis `requirements.txt`) :

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## Démarrage rapide

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Ouvrez `http://localhost:8080` pour afficher la console ou l'installer en tant que PWA.

Pour prototyper sans matériel :

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## Configuration

Les variables d'environnement sont définies dans `mic_array_dashboard/backend/config.py`.

| Variable | Description | Valeur par défaut |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Périphérique série qui émet les trames d'angle de réveil | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Débit en bauds pour l'UART du réseau de micros | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | ID ou nom du périphérique ALSA transmis à `sounddevice` | valeur système par défaut |
| `MIC_ARRAY_SAMPLE_RATE` | Taux d'échantillonnage de capture (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Échantillons par bloc | `2048` |
| `MIC_ARRAY_CHANNELS` | Nombre de canaux (1 = mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | Répertoire de stockage des enregistrements WAV | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Émet un signal audio sinusoïdal synthétique | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Émet de faux angles de réveil | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | Seuil `level` pour l'état parole/silence | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | Nombre de barres de forme d'onde envoyées par bloc | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | Nombre max de clients WebSocket simultanés | `32` |
| `MIC_ARRAY_WS_PATH` | Point de terminaison WebSocket | `/ws/stream` |
| `MIC_ARRAY_HOST` | Hôte d'écoute | `0.0.0.0` |
| `MIC_ARRAY_PORT` | Port HTTP | `8080` |

## Utilisation

### Application web

- UI principale : `http://localhost:8080`
- Installation en PWA via le flux d'ajout à l'écran d'accueil Chrome/Edge/Safari

### API REST

- `GET /api/status`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`
- `GET /api/recordings/latest`
- `GET /api/recordings/<session_id>/audio`

Exemple :

```bash
curl -s http://localhost:8080/api/status | jq
curl -X POST http://localhost:8080/api/recordings/start
curl -X POST http://localhost:8080/api/recordings/stop
curl -OJ http://localhost:8080/api/recordings/<session_id>/audio
```

### Contrat WebSocket

- Point de terminaison : `/ws/stream` (ou `MIC_ARRAY_WS_PATH`)
- Types de messages serveur : `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- Commandes client : `ping`, `start_recording`, `stop_recording`

Exemple de payload de commande :

```json
{"command":"start_recording"}
```

## Exemples

### 1) Exécuter en mode debug avec autoreload

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 2) Stocker les enregistrements en dehors du dépôt

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 3) Exposer sur le réseau local

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## Notes de développement

- Exécutez `MIC_ARRAY_DEBUG=1` pendant les itérations pour activer l'autoreload Tornado et la journalisation verbeuse.
- La capture audio dépend d'ALSA ; exécutez `python -m sounddevice` pour lister les indices des périphériques.
- Les fichiers frontend se trouvent dans `frontend/public` ; modifier `styles.css` ou `app.js` ne nécessite qu'un rafraîchissement navigateur.
- Étendez le comportement backend dans `mic_array_dashboard/backend/server.py` (handlers + structuration des messages).
- Étendez l'intégration capteurs via les adaptateurs `mic_array_dashboard/backend/device/`.
- Le backend crée automatiquement `mic_array_dashboard/recordings/` s'il n'existe pas.

## Site web

- La landing statique se trouve sous `docs/` (HTML/CSS/JS).
- Configurez GitHub Pages pour servir `/docs` sur `main`.
- Conservez `docs/CNAME` défini sur `robot.lazying.art`.

## Notes sur les SDK hérités/fournisseur

Le dépôt inclut les matériaux SDK Wheeltec complets et des ressources Raspberry Pi héritées pour les builds bas niveau et la validation de protocole :

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

Flux de build exemple depuis les démos SDK (comme documenté dans les notes incluses) :

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

Pour Raspberry Pi ARM64 :

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

## Dépannage

| Symptôme | Cause probable / correction |
| --- | --- |
| `libmsc.so: cannot open shared object file` | Définissez `LD_LIBRARY_PATH` vers le répertoire SDK `libs/<arch>` correspondant. |
| Erreurs de périphérique ALSA | Vérifiez l'index via `arecord -l` et contrôlez `MIC_ARRAY_AUDIO_DEVICE`. |
| Absence de `/dev/wheeltec_mic` | Relancez `ch9102_udev.sh`, rebranchez l'appareil et vérifiez l'appartenance au groupe `dialout`. |
| Pas de télémétrie dans l'UI | Confirmez que le chemin WebSocket correspond à `MIC_ARRAY_WS_PATH` et activez les flags de simulation si aucun matériel n'est connecté. |
| L'invite d'installation PWA n'apparaît pas | Assurez-vous d'un origin HTTPS/public en production et d'un `manifest.json` valide + routage service worker. |

## Feuille de route

- Ajouter des panneaux de flux caméra et la fusion d'événements avec la télémétrie d'angle de réveil.
- Ajouter des ponts d'automatisation pour les workflows OnlyIdeas (intégrations MQTT/événements).
- Ajouter la persistance/analytique pour l'historique forme d'onde + direction.
- Améliorer les modèles de déploiement (reverse proxy + unités de service).
- Étendre la couverture de compatibilité protocolaire pour les futures révisions firmware de réseaux de micros.

## Contribution

- Voir `AGENTS.md` pour les consignes de contribution.
- Préférez des pull requests petites et ciblées avec des étapes de reproduction claires.
- Incluez le contexte matériel/OS et les commandes exécutées pour les changements impactant le runtime.
- Si vous modifiez des références SDK fournisseur, gardez `references/SDK_NOTES.md` synchronisé.

Note : aucun `CONTRIBUTING.md` dédié n'est actuellement présent dans ce dépôt.

## Don & Support

Votre soutien permet de garder la boîte à outils IdeasRobot ouverte, finance le prototypage matériel et aide à subventionner les déploiements de la communauté. Vous pouvez faire un don via l'un des liens ci-dessous :

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

ありがとうございます · 谢谢你 · Merci de contribuer à ce qu'IdeasRobot apprenne, écoute et partage de façon plus ouverte.

## Licence

Le statut du fichier de licence est actuellement incertain dans ce dépôt : aucun fichier `LICENSE` n'est présent à la racine au moment de la rédaction.

Hypothèse pour les contributeurs : traitez le code/les ressources comme propriétaires des détenteurs du dépôt tant qu'un fichier de licence n'est pas ajouté ou clarifié dans une future mise à jour.
