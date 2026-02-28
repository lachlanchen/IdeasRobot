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

IdeasRobot هي منصة تحكم هادئة بالميكروفون والكاميرا، مستوحاة من *The Art of Lazying* و *OnlyIdeas*: خادم Tornado يتواصل مع مصفوفة ميكروفونات Wheeltec M2 (أو محاكيها)، مع واجهة PWA قابلة للتثبيت على Android/iOS تتيح بث طاقة الموجة، وبيانات زاوية الاستيقاظ، وإدارة التسجيل بضغطة واحدة من أي مكان.

## نظرة عامة

يجمع IdeasRobot ثلاث طبقات في مستودع واحد:

- بيئة التحكم الآني: `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- تطبيق عميل قابل للتثبيت: `mic_array_dashboard/frontend/public` (PWA لـ Android/iOS/Desktop).
- مراجع العتاد والمورّد: حزم Wheeltec SDK، ومسارات دمج Raspberry Pi القديمة، وملاحظات معمارية للتوسعة إلى أنظمة روبوتية أوسع.

هذا المستودع مصمم عمدًا ليكون مزيجًا من كود التشغيل الفعّال وأصول المورّد/الأنظمة القديمة اللازمة للتشغيل منخفض المستوى.

## أبرز الميزات

| الإمكانية | الوصف |
| --- | --- |
| 🎛️ محور تحكم آني | يقوم `/ws/stream` بدفع أشرطة الموجة، وحالات SILENCE/SPEAKING، وزوايا الاستيقاظ، بينما تغطي `/api/*` الحالة والتسجيلات. |
| 🔌 واعٍ بالعتاد | يتم تغليف دخل ALSA (عبر `sounddevice`) وحزم UART الخاصة بالمورّد مع بدائل سلسة، بحيث يعمل التطوير حتى بدون الجهاز. |
| 📱 PWA في كل مكان | قابل للتثبيت على Android/iOS/Desktop؛ يتضمن موجة نيون، وتمثيل اتجاه قائم على البوصلة، وذاكرة تخزين بلا اتصال. |
| 🤖 جاهز للروبوت | مصمم كواجهة حسّية أمامية لإصدارات IdeasRobot المستقبلية التي تجمع مصفوفة الميكروفون + الكاميرات + المحركات + أتمتة OnlyIdeas. |

## بنية المشروع

```text
.
├── README.md
├── AGENTS.md
├── i18n/                          # Multilingual README variants
├── references/
│   ├── ARCHITECTURE.md            # Backend/frontend protocol and component detail
│   └── SDK_NOTES.md               # Deep Linux/Raspberry Pi SDK notes
├── docs/                          # GitHub Pages static landing
├── mic_array_dashboard/
│   ├── backend/
│   │   ├── server.py              # Main runtime entrypoint
│   │   ├── config.py              # Environment-driven settings
│   │   ├── requirements.txt
│   │   └── device/
│   │       ├── audio_capture.py
│   │       └── direction_reader.py
│   ├── frontend/public/           # PWA files
│   └── recordings/                # Runtime WAV output
├── raspberrypi_legacy/            # Legacy Raspberry Pi workflows and scripts
└── M2系列麦克风语音阵列客户资料/    # Vendor SDK archives and manuals
```

توثيق تفصيلي:

- [نظرة عامة على المعمارية](../references/ARCHITECTURE.md)
- [ملاحظات متعمقة حول Wheeltec SDK](../references/SDK_NOTES.md)

## المتطلبات المسبقة

### بيئة التشغيل (لوحة التحكم)

- Python 3.x
- Linux مع مكدس صوت ALSA
- منفذ تسلسلي لمصفوفة الميكروفون (عادة `/dev/wheeltec_mic`) لوضع العتاد

### حزم نظام اختيارية (موصى بها)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### أداة تثبيت اسم الجهاز (سكربت المورّد)

بعد تحديثات النواة/جسر USB، أعد تشغيل أداة udev في مسارات SDK الخاصة بالمورّد حتى يبقى `/dev/wheeltec_mic` متاحًا:

```bash
# Example path inside bundled SDK assets:
# .../offline_mic/scripts/ch9102_udev.sh
sudo bash ch9102_udev.sh
```

## التثبيت

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

الاعتماديات (من `requirements.txt`):

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## البدء السريع

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

افتح `http://localhost:8080` لعرض لوحة التحكم أو تثبيتها كتطبيق PWA.

للنمذجة السريعة بدون عتاد:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## الإعداد

يتم تعريف متغيرات البيئة في `mic_array_dashboard/backend/config.py`.

| المتغير | الوصف | الافتراضي |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | جهاز serial الذي يرسل إطارات زاوية الاستيقاظ | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | معدل البود لاتصال UART الخاص بالمصفوفة | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | معرف/اسم جهاز ALSA الممرر إلى `sounddevice` | افتراضي النظام |
| `MIC_ARRAY_SAMPLE_RATE` | معدل أخذ العينات (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | عدد العينات في كل chunk | `2048` |
| `MIC_ARRAY_CHANNELS` | عدد القنوات (1 = mono) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | المجلد الذي تُحفظ فيه تسجيلات WAV | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | إخراج صوت جيبي اصطناعي | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | إخراج زوايا استيقاظ وهمية | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | عتبة `level` لحالة التحدث/الصمت | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | عدد أشرطة الموجة المُرسلة لكل chunk | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | الحد الأقصى لعملاء WebSocket المتزامنين | `32` |
| `MIC_ARRAY_WS_PATH` | مسار WebSocket | `/ws/stream` |
| `MIC_ARRAY_HOST` | عنوان الربط | `0.0.0.0` |
| `MIC_ARRAY_PORT` | منفذ HTTP | `8080` |

## الاستخدام

### تطبيق الويب

- الواجهة الرئيسية: `http://localhost:8080`
- ثبّت كتطبيق PWA عبر مسار الإضافة إلى الشاشة الرئيسية في Chrome/Edge/Safari

### REST API

- `GET /api/status`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`
- `GET /api/recordings/latest`
- `GET /api/recordings/<session_id>/audio`

مثال:

```bash
curl -s http://localhost:8080/api/status | jq
curl -X POST http://localhost:8080/api/recordings/start
curl -X POST http://localhost:8080/api/recordings/stop
curl -OJ http://localhost:8080/api/recordings/<session_id>/audio
```

### عقد WebSocket

- المسار: `/ws/stream` (أو `MIC_ARRAY_WS_PATH`)
- أنواع رسائل الخادم: `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- أوامر العميل: `ping`, `start_recording`, `stop_recording`

مثال لحمولة الأمر:

```json
{"command":"start_recording"}
```

## أمثلة

### 1) التشغيل في وضع التصحيح مع autoreload

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 2) تخزين التسجيلات خارج المستودع

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 3) الإتاحة على الشبكة المحلية

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## ملاحظات التطوير

- شغّل `MIC_ARRAY_DEBUG=1` أثناء التطوير لتفعيل Tornado autoreload والسجلات التفصيلية.
- يعتمد التقاط الصوت على ALSA؛ شغّل `python -m sounddevice` لعرض فهارس الأجهزة.
- ملفات الواجهة الأمامية موجودة في `frontend/public`; تعديل `styles.css` أو `app.js` يحتاج فقط لتحديث المتصفح.
- وسّع سلوك الخادم في `mic_array_dashboard/backend/server.py` (handlers + message shaping).
- وسّع تكامل الحساسات عبر محولات `mic_array_dashboard/backend/device/`.
- ينشئ الخادم تلقائيًا `mic_array_dashboard/recordings/` إذا كان غير موجود.

## الموقع

- الصفحة الثابتة موجودة ضمن `docs/` (HTML/CSS/JS).
- اضبط GitHub Pages لخدمة `/docs` من فرع `main`.
- أبقِ `docs/CNAME` مضبوطًا على `robot.lazying.art`.

## ملاحظات Legacy/Vendor SDK

يتضمن المستودع مواد Wheeltec SDK كاملة وأصول Raspberry Pi القديمة من أجل البناء منخفض المستوى والتحقق من البروتوكول:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

تدفق بناء نموذجي من عروض SDK (كما هو موثق في الملاحظات المرفقة):

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

لأجهزة ARM64 Raspberry Pi:

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

## استكشاف الأخطاء وإصلاحها

| العرَض | السبب المحتمل / الحل |
| --- | --- |
| `libmsc.so: cannot open shared object file` | اضبط `LD_LIBRARY_PATH` إلى مجلد SDK المطابق في `libs/<arch>`. |
| أخطاء جهاز ALSA | تحقّق من الفهرس عبر `arecord -l` وافحص `MIC_ARRAY_AUDIO_DEVICE`. |
| عدم وجود `/dev/wheeltec_mic` | أعد تشغيل `ch9102_udev.sh`، أعد توصيل الجهاز، وتحقق من عضوية مجموعة `dialout`. |
| لا تظهر بيانات telemetry في الواجهة | تأكد أن مسار WebSocket يطابق `MIC_ARRAY_WS_PATH` وفعّل خيارات المحاكاة عند عدم توصيل العتاد. |
| لا يظهر طلب تثبيت PWA | تأكد من HTTPS/أصل عام في الإنتاج وصحة `manifest.json` وتوجيه service worker. |

## خارطة الطريق

- إضافة لوحات بث الكاميرا ودمج الأحداث مع بيانات زاوية الاستيقاظ.
- إضافة جسور أتمتة لتدفقات OnlyIdeas (تكاملات MQTT/events).
- إضافة الاستمرارية/التحليلات لتاريخ الموجة + الاتجاه.
- تحسين قوالب النشر (reverse proxy + service units).
- توسيع تغطية توافق البروتوكول لإصدارات firmware المستقبلية لمصفوفة الميكروفون.

## المساهمة

- راجع `../AGENTS.md` لإرشادات المساهمين.
- يُفضَّل تقديم طلبات سحب صغيرة ومركزة مع خطوات إعادة إنتاج واضحة.
- أضف سياق العتاد/نظام التشغيل والأوامر المنفّذة للتغييرات المؤثرة على التشغيل.
- عند تعديل مراجع Vendor SDK، حافظ على تزامن `../references/SDK_NOTES.md`.

ملاحظة: لا يوجد ملف `CONTRIBUTING.md` مخصص حاليًا في هذا المستودع.

## التبرع والدعم

دعمك يحافظ على انفتاح أدوات IdeasRobot، ويموّل نماذج الأجهزة، ويساعد على دعم النشر المجتمعي. يمكنك التبرع عبر أي من الروابط التالية:

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

ありがとうございます · 谢谢你 · شكرًا لك لمساعدتك IdeasRobot على التعلم، والاستماع، والمشاركة بانفتاح أكبر.

## الترخيص

حالة ملف الترخيص غير واضحة حاليًا في هذا المستودع: لا يوجد ملف `LICENSE` على المستوى الأعلى وقت إعداد هذه النسخة.

افتراض للمساهمين: تعامل مع الكود/الأصول على أنها ملكية خاصة لمالكي المستودع ما لم تتم إضافة ملف ترخيص أو توضيحه في تحديث لاحق.
