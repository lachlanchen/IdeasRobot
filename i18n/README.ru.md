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

IdeasRobot — расслабленная консоль с микрофоном и камерой, вдохновлённая *The Art of Lazying* и *OnlyIdeas*: это backend на Tornado, который работает с массивом микрофонов Wheeltec M2 (или его эмулятором) и предоставляет устанавливаемый PWA/Android/iOS UI для визуализации энергии волны, телеметрии направления пробуждения и записи одним нажатием.

## Краткие факты

| Область | Детали |
| --- | --- |
| Роль репозитория | Runtime-демо + ссылки на вендорные/устаревшие SDK |
| Технологический стек | Backend Tornado + WebSocket + REST + устанавливаемый frontend |
| Аппаратный путь | Массив Wheeltec M2 с `UART` + эмуляция через `ALSA` при недоступности устройства |
| Проверочные артефакты | `mic_array_dashboard/recordings`, `docs`, деревья SDK `M2` |

## Содержание

- [Краткие факты](#краткие-факты)
- [Обзор](#обзор)
- [Возможности](#возможности)
- [Структура проекта](#структура-проекта)
- [Требования](#требования)
- [Установка](#установка)
- [Использование](#использование)
  - [Веб-приложение](#веб-приложение)
  - [REST API](#rest-api)
  - [WebSocket контракт](#websocket-контракт)
- [Конфигурация](#конфигурация)
- [Примеры](#примеры)
- [Примечания по разработке](#примечания-по-разработке)
- [Сайт](#сайт)
- [Заметки по устаревшим и вендорным SDK](#заметки-по-устаревшим-и-вендорным-sdk)
- [Устранение неполадок](#устранение-неполадок)
- [Дорожная карта](#дорожная-карта)
- [Вклад](#вклад)
- [Поддержка](#-support)
- [Лицензия](#лицензия)

## Обзор

IdeasRobot объединяет в одном репозитории три слоя:

- runtime-среду управления в `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- устанавливаемый клиентский UI в `mic_array_dashboard/frontend/public` (PWA для Android/iOS/Desktop).
- аппаратные и вендорные материалы в `M2系列麦克风语音阵列客户资料*`, assets для Raspberry Pi и протокольные заметки для низкоуровневого расширения.

Этот репозиторий намеренно гибридный: активный runtime-код находится рядом с вендорными и legacy-артефактами, которые нужны для низкоуровневого пуска.

## Возможности

| Возможность | Описание |
| --- | --- |
| 🎛️ Центр управления в реальном времени | `Tornado`-backend отправляет уровни волн, состояние SILENCE/SPEAKING, телеметрию угла пробуждения и события записи, а также предоставляет REST-эндпойнты для состояния и получения аудио. |
| 🔌 Аппаратная осведомлённость | Захват звука через ALSA и UART-пакеты сериализации поддерживаются с путями эмуляции, поэтому разработка возможна без физического устройства. |
| 📱 PWA повсюду | Frontend можно установить на Android/iOS/Desktop; включает волну, отображение направления и оффлайн-кеш через service worker. |
| 🤖 Готовность к роботу | Разработан как сенсорный фронтэнд для будущих систем IdeasRobot с камерами, модулями движения и автоматизационными сценариями. |
| 📚 Богатая документация | В репозитории собраны docs, материалы вендорских SDK и legacy-пути Raspberry Pi для ускорения экспериментов и устранения проблем. |

## Структура проекта

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

Подробная документация:

- [Обзор архитектуры](references/ARCHITECTURE.md)
- [Примечания по Wheeltec SDK](references/SDK_NOTES.md)

## Требования

### Runtime backend

- Python 3.x
- Linux с ALSA audio stack
- Серийный endpoint массива микрофонов (обычно `/dev/wheeltec_mic`) для режима с железом

### Рекомендуемые опциональные пакеты

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### Помощник по именованию аппаратных устройств (вендорный workflow)

После изменений ядра или USB-моста повторно запустите скрипт из SDK-ресурсов, чтобы `/dev/wheeltec_mic` оставался доступным:

```bash
# Пример (путь к SDK может отличаться):
cd .../offline_mic/scripts
sudo bash ch9102_udev.sh
```

### Допущения репозитория

- В этом снапшоте отсутствует отдельный файл лицензии на верхнем уровне, поэтому юридические условия пока считать неуточнёнными до его добавления.
- Часть крупных вендорных/legacy деревьев хранится как архивные ссылки и не следует обновлять с той же частотой, что runtime-код.

## Установка

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Зависимости из `requirements.txt`:

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## Использование

### Веб-приложение

- Основной UI: `http://localhost:8080`
- Установка как PWA через Chrome/Edge/Safari (Add-to-home-screen flow)

### REST API

- `GET /api/status`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`
- `GET /api/recordings/latest`
- `GET /api/recordings/<session_id>/audio`

Пример:

```bash
curl -s http://localhost:8080/api/status | jq
curl -X POST http://localhost:8080/api/recordings/start
curl -X POST http://localhost:8080/api/recordings/stop
curl -OJ http://localhost:8080/api/recordings/<session_id>/audio
```

### WebSocket контракт

- Endpoint: `/ws/stream` (или `MIC_ARRAY_WS_PATH`)
- Типы сообщений сервера: `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- Команды клиента: `ping`, `start_recording`, `stop_recording`

Пример полезной нагрузки:

```json
{"command":"start_recording"}
```

### Быстрый старт (из исходников)

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Для прототипирования без железа:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## Конфигурация

Переменные окружения определены в `mic_array_dashboard/backend/config.py`.

| Переменная | Описание | По умолчанию |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | Сериал-устройство, передающее кадры угла пробуждения | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Скорость порта | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | Идентификатор/имя ALSA устройства, передаваемый в `sounddevice` | system default |
| `MIC_ARRAY_SAMPLE_RATE` | Частота дискретизации захвата (Гц) | `16000` |
| `MIC_ARRAY_CHUNK` | Количество сэмплов на аудио-чанк | `2048` |
| `MIC_ARRAY_CHANNELS` | Количество каналов (1 = mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | Каталог для WAV-записей | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Генерировать синтетический звук | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Генерировать синтетические данные угла | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | Порог разделения речь/тишина | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | Количество столбцов волновой формы на кадр | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | Максимум одновременных WebSocket-клиентов | `32` |
| `MIC_ARRAY_WS_PATH` | Путь WebSocket | `/ws/stream` |
| `MIC_ARRAY_HOST` | Хост привязки | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP порт | `8080` |

## Примеры

### Режим отладки с автообновлением

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### Хранение записей вне репозитория

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### Публикация сервиса в локальной сети

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## Примечания по разработке

- Запускайте с `MIC_ARRAY_DEBUG=1` во время итераций для подробных логов и автоперезагрузки.
- Захват аудио зависит от ALSA; команда `python -m sounddevice` покажет список индексов устройств.
- Файлы frontend лежат в `frontend/public`; обычно изменения `styles.css` или `app.js` требуют перезапуска и обновления страницы.
- Backend-логику расширения вносите в `mic_array_dashboard/backend/server.py` (обработчики и формирование сообщений).
- Сенсорные адаптеры расширяются в `mic_array_dashboard/backend/device/`.
- Backend автоматически создаёт `mic_array_dashboard/recordings/`, если папки нет.

## Сайт

- Маркетинговый/статический сайт находится в `docs/` (HTML/CSS/JS).
- Настройте GitHub Pages для обслуживания `/docs` на ветке `main`.
- При развертывании этого домена поддерживайте `docs/CNAME` со значением `robot.lazying.art`.

## Заметки по устаревшим и вендорным SDK

В репозитории собраны и runtime ПО, и артефакты вендора/legacy, включая:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

Сюда входят старые offline ASR recorder и VAD-потоки; для разработки dashboard используйте текущий Python backend как активный runtime.

Пример build-сценария SDK для проверки совместимости:

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

Для ARM64 Raspberry Pi:

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

При работе с вендорными USB-правилами повторно запускайте `ch9102_udev.sh` и переподключайте устройство, если `/dev/wheeltec_mic` пропал.

## Устранение неполадок

| Симптом | Вероятная причина / исправление |
| --- | --- |
| `libmsc.so: cannot open shared object file` | Установите `LD_LIBRARY_PATH` на корректную библиотечную папку SDK (`libs/<arch>`). |
| Ошибки ALSA ввода | Проверьте устройство командой `arecord -l` и обновите `MIC_ARRAY_AUDIO_DEVICE`. |
| Отсутствует `/dev/wheeltec_mic` | Повторно запустите `ch9102_udev.sh`, переподключите устройство и проверьте членство в группе `dialout`. |
| Нет телеметрии в UI | Убедитесь, что WebSocket путь совпадает с `MIC_ARRAY_WS_PATH`; при отсутствии железа используйте флаги эмуляции. |
| Не появляется запрос установки PWA | Убедитесь в HTTPS/public origin в production и корректных конфигурациях `manifest.json` + service-worker. |

## Дорожная карта

- Добавить панели видеопотока камеры и слияние событий с телеметрией угла пробуждения.
- Добавить мосты автоматизации для рабочих процессов в стиле OnlyIdeas (интеграция MQTT/событий).
- Добавить устойчивость и аналитику истории волновой формы + направления.
- Улучшить шаблоны развёртывания (systemd units + примеры reverse proxy).
- Расширить совместимость протокола для будущих прошивок массива микрофонов.

## Вклад

- См. `AGENTS.md` для правил контрибьютора и требований к изменениям с учетом аппаратной части.
- Предпочитайте небольшие и сфокусированные pull request с понятными шагами для воспроизведения.
- Для изменений, влияющих на runtime, указывайте контекст по железу/ОС и выполненные команды.
- Если затрагиваются вендорные SDK-ссылки, держите `references/SDK_NOTES.md` в актуальном состоянии.

Примечание: на текущий момент в репозитории нет отдельного файла `CONTRIBUTING.md`.

## Лицензия

Статус лицензии в текущем репозитории пока неясен: в рабочем снапшоте отсутствует топ-левел файл `LICENSE`.

Для контрибьюторов по умолчанию: считаем код и артефакты собственностью владельцев репозитория до появления или уточнения лицензии в будущих обновлениях.


## ❤️ Support

<!-- support:start -->
[![GitHub Sponsors](https://img.shields.io/badge/GitHub-Sponsors-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/lachlanchen)
[![LazyingArt Support](https://img.shields.io/badge/LazyingArt-Support-0EA5E9?style=for-the-badge)](https://chat.lazying.art/donate)
[![PayPal Support](https://img.shields.io/badge/PayPal-Support-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/RongzhouChen)
[![Stripe Support](https://img.shields.io/badge/Stripe-Support-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400)
<!-- support:end -->
