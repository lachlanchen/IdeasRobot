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

IdeasRobot est une console microphone et caméra décontractée inspirée de *The Art of Lazying* et *OnlyIdeas* : un backend Tornado qui communique avec le tableau de microphones Wheeltec M2 (ou son simulateur) et fournit une interface installable PWA/Android/iOS pour la visualisation de l’énergie d’onde, de la télémétrie d’angle d’éveil et des enregistrements en un clic.

## Faits rapides

| Domaine | Détails |
| --- | --- |
| Rôle du dépôt | Démo runtime + références SDK fournisseur/légacy |
| Stack runtime | Backend Tornado + WebSocket + REST + frontend installable |
| Parcours matériel | Tableau Wheeltec M2 avec `UART` + simulation de secours ALSA |
| Ressources de validation | `mic_array_dashboard/recordings`, `docs`, arborescences de référence SDK `M2` |

## Table des matières

- [Faits rapides](#faits-rapides)
- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
  - [Application web](#application-web)
  - [API REST](#api-rest)
  - [Contrat WebSocket](#contrat-websocket)
- [Configuration](#configuration)
- [Exemples](#exemples)
- [Notes de développement](#notes-de-développement)
- [Site web](#site-web)
- [Notes sur le SDK legacy/fournisseur](#notes-sur-le-sdk-legacy-et-fournisseur)
- [Dépannage](#dépannage)
- [Feuille de route](#feuille-de-route)
- [Contribution](#contribution)
- [Support](#-support)
- [Licence](#licence)

## Vue d'ensemble

IdeasRobot regroupe trois couches dans un seul dépôt :

- Runtime de contrôle temps réel dans `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- Interface cliente installable dans `mic_array_dashboard/frontend/public` (PWA pour Android/iOS/Desktop).
- Références matériel/fournisseur dans `M2系列麦克风语音阵列客户资料*`, les ressources héritées Raspberry Pi et les notes de protocole pour des extensions bas niveau.

Ce dépôt est volontairement hybride : il combine le code runtime actif avec des ressources fournisseur et héritées utiles au démarrage de bas niveau.

## Fonctionnalités

| Fonctionnalité | Description |
| --- | --- |
| 🎛️ Hub de contrôle temps réel | Le backend `Tornado` diffuse des barres de forme d’onde, l’état SILENCE/SPEAKING, la télémétrie d’angle d’éveil et les événements d’enregistrement, tout en exposant des endpoints REST pour l’état et la récupération audio. |
| 🔌 Conscience matérielle | Les entrées audio ALSA et les paquets série UART sont encapsulés avec des chemins de simulation de secours pour permettre le développement sans matériel physique. |
| 📱 PWA partout | Le frontend peut être installé sur Android/iOS/Desktop et inclut la forme d’onde, l’affichage de direction, ainsi qu’un comportement hors ligne en cache via le service worker. |
| 🤖 Prêt pour la robotique | Conçu comme une couche sensorielle prête pour de futurs systèmes IdeasRobot avec caméra, modules de mouvement et flux d’automatisation. |
| 📚 Référencé | Documentation, matériel SDK fournisseur et chemins Raspberry Pi hérités sont réunis dans un seul dépôt pour accélérer les essais et le dépannage. |

## Structure du projet

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

Documentation détaillée :

- [Vue d’ensemble de l’architecture](references/ARCHITECTURE.md)
- [Notes du SDK Wheeltec](references/SDK_NOTES.md)

## Prérequis

### Backend runtime

- Python 3.x
- Linux avec pile audio ALSA
- Endpoint série du tableau de microphones (généralement `/dev/wheeltec_mic`) pour le mode matériel

### Paquets système optionnels (recommandés)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### Assistant de nommage matériel (workflow fournisseur)

Après les changements noyau/bridge USB, relancez l’assistant depuis les assets SDK pour garder `/dev/wheeltec_mic` exposé :

```bash
# Exemple (le chemin SDK peut varier) :
cd .../offline_mic/scripts
sudo bash ch9102_udev.sh
```

### Hypothèses du dépôt

- Aucun fichier de licence principal n’existe dans cet instantané, donc les termes légaux doivent être considérés comme en attente jusqu’à ajout.
- Certains grands jeux de données fournisseur/legacy sont des références archivées et ne suivent pas la même cadence de release que le code runtime.

## Installation

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Les dépendances listées dans `requirements.txt` :

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## Utilisation

### Application web

- UI principale : `http://localhost:8080`
- Installer en PWA via le flux « ajouter à l’écran d’accueil » de Chrome/Edge/Safari

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

- Endpoint : `/ws/stream` (ou `MIC_ARRAY_WS_PATH`)
- Types de messages serveur : `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- Commandes client : `ping`, `start_recording`, `stop_recording`

Exemple de payload de commande :

```json
{"command":"start_recording"}
```

### Démarrage rapide (depuis les sources)

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Pour prototypage sans matériel :

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## Configuration

Les variables d’environnement sont définies dans `mic_array_dashboard/backend/config.py`.

| Variable | Description | Par défaut |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Périphérique série qui émet les trames d’angle de réveil | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Débit du port série | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | Identifiant nom du périphérique ALSA transmis à `sounddevice` | défaut système |
| `MIC_ARRAY_SAMPLE_RATE` | Fréquence d’échantillonnage (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | Échantillons par bloc audio | `2048` |
| `MIC_ARRAY_CHANNELS` | Nombre de canaux (1 = mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | Répertoire des captures WAV | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Émettre de l’audio synthétique | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Émettre des données d’angle synthétiques | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | Seuil parole/silence | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | Nombre de barres d’onde envoyées par frame | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | Nombre max de clients WebSocket simultanés | `32` |
| `MIC_ARRAY_WS_PATH` | Chemin WebSocket | `/ws/stream` |
| `MIC_ARRAY_HOST` | Hôte lié | `0.0.0.0` |
| `MIC_ARRAY_PORT` | Port HTTP | `8080` |

## Exemples

### Mode debug avec autoreload

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### Stocker les enregistrements hors du dépôt

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### Exposer le service sur le réseau local

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## Notes de développement

- Lancez avec `MIC_ARRAY_DEBUG=1` pendant l’itération pour des logs détaillés/comportement autoreload.
- La capture audio dépend d’ALSA ; lancez `python -m sounddevice` pour lister les indices de périphériques.
- Les fichiers frontend sont dans `frontend/public` ; modifier `styles.css` ou `app.js` requiert généralement un simple rafraîchissement navigateur après redémarrage.
- Étendez le comportement backend dans `mic_array_dashboard/backend/server.py` (handlers et mise en forme des messages).
- Étendez les adaptateurs capteurs dans `mic_array_dashboard/backend/device/`.
- Le backend crée automatiquement `mic_array_dashboard/recordings/` s’il n’existe pas.

## Site web

- Le site marketing/statique vit sous `docs/` (HTML/CSS/JS).
- Configurez GitHub Pages pour servir `/docs` sur la branche `main`.
- Gardez `docs/CNAME` défini à `robot.lazying.art` lors du déploiement de ce domaine.

## Notes sur le SDK legacy et fournisseur

Ce dépôt regroupe à la fois logiciel runtime et artefacts fournisseur/legacy, notamment :

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

Ils incluent des flux ASR offline VAD/ancien ; utilisez le backend Python actuel comme runtime actif pour le développement du dashboard.

Flux de build SDK d’exemple pour les contrôles de compatibilité :

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

Avec les règles USB du fournisseur, relancez `ch9102_udev.sh` et rebranchez l’appareil si `/dev/wheeltec_mic` disparaît.

## Dépannage

| Symptôme | Cause probable / correctif |
| --- | --- |
| `libmsc.so: cannot open shared object file` | Définissez `LD_LIBRARY_PATH` vers le répertoire SDK correspondant (`libs/<arch>`). |
| Erreurs d’entrée ALSA | Vérifiez le périphérique avec `arecord -l` et mettez à jour `MIC_ARRAY_AUDIO_DEVICE`. |
| `/dev/wheeltec_mic` manquant | Relancez `ch9102_udev.sh`, rebranchez le dispositif, et vérifiez l’appartenance au groupe `dialout`. |
| Aucune télémétrie dans l’UI | Vérifiez que le chemin WebSocket correspond à `MIC_ARRAY_WS_PATH`; utilisez les flags de simulation si aucun matériel n’est connecté. |
| Invite d’installation PWA manquante | Assurez HTTPS/origin public en production et une configuration valide de `manifest.json` + service-worker. |

## Feuille de route

- Ajouter des panneaux de flux caméra et la fusion d’événements avec la télémétrie d’angle de réveil.
- Ajouter des ponts d’automatisation pour les workflows type OnlyIdeas (intégration MQTT/événements).
- Ajouter persistance et analytics de l’historique des formes d’onde + directions.
- Améliorer les templates de déploiement (unités de service + exemples reverse-proxy).
- Étendre la compatibilité protocolaire pour les futures révisions firmware du tableau de microphones.

## Contribution

- Voir `AGENTS.md` pour les conventions contributives et les exigences liées au matériel.
- Privilégiez des pull requests petites et ciblées avec des étapes de reproduction claires.
- Incluez le contexte matériel/OS et les commandes exécutées pour tout changement impactant le runtime.
- Si des références du SDK fournisseur sont touchées, maintenez `references/SDK_NOTES.md` à jour.

Note : il n’existe actuellement aucun fichier `CONTRIBUTING.md` dédié dans ce dépôt.

## Licence

Le statut de la licence de ce dépôt reste flou pour l’instant : aucun fichier `LICENSE` n’est présent dans l’instantané de travail actuel.

Hypothèse pour les contributeurs : considérez le code et les ressources comme propriétaires des mainteneurs tant qu’une licence n’est pas ajoutée ou clarifiée lors d’une mise à jour future.


## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |
