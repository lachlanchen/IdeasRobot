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

IdeasRobot — это непринуждённая консоль для микрофона и камеры, вдохновлённая *The Art of Lazying* и *OnlyIdeas*: backend на Tornado, который взаимодействует с микрофонной решёткой Wheeltec M2 (или её симулятором), плюс устанавливаемый интерфейс PWA/Android/iOS, передающий энергию волны, телеметрию угла пробуждения и поддерживающий запись в одно нажатие из любого места.

## Обзор

IdeasRobot объединяет три уровня в одном репозитории:

- Рантайм управления в реальном времени: `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- Устанавливаемое клиентское приложение: `mic_array_dashboard/frontend/public` (PWA для Android/iOS/Desktop).
- Материалы по железу и вендору: пакеты Wheeltec SDK, legacy-пути интеграции Raspberry Pi и архитектурные заметки для расширения на более широкие робототехнические системы.

Этот репозиторий намеренно смешанный: активный runtime-код и вендорские/legacy-ассеты, нужные для низкоуровневого bring-up.

## Ключевые возможности

| Возможность | Описание |
| --- | --- |
| 🎛️ Центр управления в реальном времени | `/ws/stream` отправляет столбики волны, состояния SILENCE/SPEAKING и углы пробуждения, а `/api/*` покрывает статус и записи. |
| 🔌 Учет аппаратной среды | ALSA-вход (через `sounddevice`) и вендорские UART-пакеты обёрнуты с корректными fallback-режимами, поэтому разработка работает даже без устройства. |
| 📱 PWA везде | Устанавливается на Android/iOS/Desktop; включает неоновую волну, визуализацию направления на базе компаса и офлайн-кэш. |
| 🤖 Готовность к роботам | Спроектирован как сенсорный фронтенд для будущих сборок IdeasRobot с микрофонной решёткой + камерами + моторами + автоматизациями OnlyIdeas. |

## Структура проекта

```text
.
├── README.md
├── AGENTS.md
├── i18n/                          # Многоязычные варианты README
├── references/
│   ├── ARCHITECTURE.md            # Детали протокола backend/frontend и компонентов
│   └── SDK_NOTES.md               # Подробные заметки по Linux/Raspberry Pi SDK
├── docs/                          # Статический лендинг GitHub Pages
├── mic_array_dashboard/
│   ├── backend/
│   │   ├── server.py              # Главная точка входа runtime
│   │   ├── config.py              # Настройки через переменные окружения
│   │   ├── requirements.txt
│   │   └── device/
│   │       ├── audio_capture.py
│   │       └── direction_reader.py
│   ├── frontend/public/           # Файлы PWA
│   └── recordings/                # Runtime-выгрузка WAV
├── raspberrypi_legacy/            # Legacy-процессы и скрипты для Raspberry Pi
└── M2系列麦克风语音阵列客户资料/    # Архивы и руководства вендорского SDK
```

Подробная документация:

- [Обзор архитектуры](references/ARCHITECTURE.md)
- [Глубокие заметки по Wheeltec SDK](references/SDK_NOTES.md)

## Предварительные требования

### Runtime (dashboard)

- Python 3.x
- Linux с аудиостеком ALSA
- Последовательный endpoint микрофонной решётки (обычно `/dev/wheeltec_mic`) для аппаратного режима

### Опциональные системные пакеты (рекомендуется)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### Хелпер именования оборудования (вендорский скрипт)

После обновлений ядра/USB-моста повторно запустите udev-хелпер в путях вендорского SDK, чтобы `/dev/wheeltec_mic` оставался доступен:

```bash
# Example path inside bundled SDK assets:
# .../offline_mic/scripts/ch9102_udev.sh
sudo bash ch9102_udev.sh
```

## Установка

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

Зависимости (из `requirements.txt`):

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## Быстрый старт

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

Откройте `http://localhost:8080`, чтобы увидеть консоль или установить её как PWA.

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
| `MIC_ARRAY_SERIAL` | Последовательное устройство, выдающее кадры угла пробуждения | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | Скорость UART для микрофонной решётки | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | Идентификатор или имя ALSA-устройства, передаваемое в `sounddevice` | системное значение |
| `MIC_ARRAY_SAMPLE_RATE` | Частота захвата (Гц) | `16000` |
| `MIC_ARRAY_CHUNK` | Сэмплов на чанк | `2048` |
| `MIC_ARRAY_CHANNELS` | Количество каналов (1 = моно) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | Каталог для хранения WAV-записей | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | Генерировать синтетический синусоидальный звук | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | Генерировать фиктивные углы пробуждения | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | Порог `level` для состояния speaking/silence | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | Количество столбиков волны, отправляемых на чанк | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | Максимум одновременных WebSocket-клиентов | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket-эндпоинт | `/ws/stream` |
| `MIC_ARRAY_HOST` | Хост привязки | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP-порт | `8080` |

## Использование

### Веб-приложение

- Основной UI: `http://localhost:8080`
- Установка как PWA через поток add-to-home-screen в Chrome/Edge/Safari

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

### Контракт WebSocket

- Эндпоинт: `/ws/stream` (или `MIC_ARRAY_WS_PATH`)
- Типы сообщений сервера: `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- Команды клиента: `ping`, `start_recording`, `stop_recording`

Пример payload команды:

```json
{"command":"start_recording"}
```

## Примеры

### 1) Запуск в debug-режиме с autoreload

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 2) Хранение записей вне репозитория

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 3) Публикация в локальную сеть

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## Примечания по разработке

- Запускайте `MIC_ARRAY_DEBUG=1` во время итераций, чтобы включить autoreload Tornado и подробные логи.
- Захват аудио зависит от ALSA; запустите `python -m sounddevice`, чтобы увидеть индексы устройств.
- Файлы frontend находятся в `frontend/public`; при редактировании `styles.css` или `app.js` достаточно обновить страницу браузера.
- Расширяйте поведение backend в `mic_array_dashboard/backend/server.py` (handlers + формирование сообщений).
- Расширяйте интеграцию сенсоров через адаптеры `mic_array_dashboard/backend/device/`.
- Backend автоматически создаёт `mic_array_dashboard/recordings/`, если каталог отсутствует.

## Сайт

- Статический лендинг расположен в `docs/` (HTML/CSS/JS).
- Настройте GitHub Pages на обслуживание `/docs` из ветки `main`.
- Оставляйте `docs/CNAME` со значением `robot.lazying.art`.

## Примечания по legacy/вендорскому SDK

Репозиторий включает полный набор материалов Wheeltec SDK и legacy-ассеты Raspberry Pi для низкоуровневой сборки и проверки протокола:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

Пример процесса сборки из демо SDK (как описано в приложенных заметках):

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

## Устранение неполадок

| Симптом | Вероятная причина / исправление |
| --- | --- |
| `libmsc.so: cannot open shared object file` | Установите `LD_LIBRARY_PATH` на соответствующий каталог SDK `libs/<arch>`. |
| Ошибки ALSA-устройства | Проверьте индекс через `arecord -l` и параметр `MIC_ARRAY_AUDIO_DEVICE`. |
| Отсутствует `/dev/wheeltec_mic` | Повторно запустите `ch9102_udev.sh`, переподключите устройство и проверьте членство в группе `dialout`. |
| Нет телеметрии в UI | Убедитесь, что путь WebSocket совпадает с `MIC_ARRAY_WS_PATH`, и включите флаги симуляции при отсутствии подключённого оборудования. |
| Не появляется предложение установить PWA | В production нужны HTTPS/публичный origin и корректные `manifest.json` + маршрутизация service worker. |

## Дорожная карта

- Добавить панели видеопотока с камер и объединение событий с телеметрией угла пробуждения.
- Добавить мосты автоматизации для workflows OnlyIdeas (интеграции MQTT/событий).
- Добавить сохранение/аналитику истории waveform + direction.
- Улучшить шаблоны развертывания (reverse proxy + service units).
- Расширить покрытие совместимости протокола для будущих ревизий прошивки микрофонной решётки.

## Вклад

- См. `AGENTS.md` для рекомендаций по внесению изменений.
- Предпочтительны небольшие, сфокусированные pull request с чёткими шагами воспроизведения.
- Для изменений, влияющих на runtime, указывайте контекст hardware/OS и выполненные команды.
- При изменении ссылок на вендорский SDK синхронизируйте `references/SDK_NOTES.md`.

Примечание: в этом репозитории пока нет отдельного `CONTRIBUTING.md`.

## Донат и поддержка

Ваша поддержка помогает сохранять открытость инструментов IdeasRobot, финансировать прототипирование устройств и частично покрывать внедрения в сообществе. Поддержать проект можно по любым ссылкам ниже:

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

ありがとうございます · 谢谢你 · Спасибо за помощь IdeasRobot учиться, слушать и делиться ещё более открыто.

## Лицензия

Статус файла лицензии в этом репозитории сейчас неясен: на момент подготовки нет `LICENSE` в корне.

Предположение для контрибьюторов: считайте код/ассеты собственностью владельцев репозитория, пока файл лицензии не будет добавлен или уточнён в будущих обновлениях.
