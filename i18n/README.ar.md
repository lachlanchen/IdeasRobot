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

IdeasRobot هي واجهة تحكم مريحة للمصغّر الصوتي والكاميرا مستوحاة من *The Art of Lazying* و *OnlyIdeas*: Backend مبني على Tornado يتواصل مع مصفوفة ميكروفونات Wheeltec M2 (أو محاكيها) ويقدّم واجهة PWA/Android/iOS قابلة للتثبيت لعرض طاقة الموجة، بيانات زاوية التنبيه، والتسجيلات بنقرة واحدة.

## فهرس المحتويات

- [حقائق سريعة](#fast-facts)
- [نظرة عامة](#overview)
- [الميزات](#features)
- [هيكل المشروع](#project-structure)
- [المتطلبات المسبقة](#prerequisites)
- [التثبيت](#installation)
- [الاستخدام](#usage)
  - [تطبيق الويب](#web-app)
  - [REST API](#rest-api)
  - [عقد WebSocket](#websocket-contract)
- [الإعداد](#configuration)
- [أمثلة](#examples)
- [ملاحظات التطوير](#development-notes)
- [الموقع](#website)
- [ملاحظات SDK للبائع والتراثية](#legacy-and-vendor-sdk-notes)
- [استكشاف الأخطاء](#troubleshooting)
- [خطة العمل](#roadmap)
- [المساهمة](#contribution)
- [الدعم](#-support)
- [الترخيص](#license)

## <a id="fast-facts"></a>حقائق سريعة

| المجال | التفاصيل |
| --- | --- |
| دور المستودع | عرض تجريبي Runtime + مراجع SDK للبائع/الإصدار القديم |
| مكدس التشغيل | Backend قائم على Tornado + WebSocket + REST + Frontend قابل للتثبيت |
| مسار العتاد | مصفوفة Wheeltec M2 مع مسار `UART` + محاكاة `ALSA` احتياطية |
| أصول التحقق | `mic_array_dashboard/recordings`, `docs`, وأشجار مراجع SDK لـ `M2` |

## <a id="overview"></a>نظرة عامة

IdeasRobot يجمع بين ثلاث طبقات في مستودع واحد:

- تشغيل تحكم فوري في `mic_array_dashboard/backend` (Tornado + WebSocket + REST).
- واجهة عميل قابلة للتثبيت في `mic_array_dashboard/frontend/public` (PWA لنظامي Android و iOS والـ desktop).
- مراجع عتاد وبائع في `M2系列麦克风语音阵列客户资料*`، أصول Raspberry Pi القديمة، وملاحظات البروتوكول للتوسعات على المستويات الأدنى.

هذا المستودع مختلط عن قصد: يحتوي على كود Runtime نشط بالإضافة إلى أصول البائع والتراثية اللازمة لبدء التشغيل على مستوى النظام.

## <a id="features"></a>الميزات

| القدرة | الوصف |
| --- | --- |
| 🎛️ مركز تحكم فوري | يقوم backend `Tornado` ببث أعمدة الموجة، حالة `SILENCE/SPEAKING`، قياسات زاوية الاستيقاظ، وأحداث التسجيل مع عرض نقاط نهاية REST للحالة واسترجاع الصوت. |
| 🔌 وعي بالعِتاد | يتم تغليف إدخال الصوت عبر ALSA وحزم UART التسلسلية مع مسارات محاكاة احتياطية بحيث يمكن الاستمرار في التطوير دون وجود العتاد فعليًا. |
| 📱 PWA في كل مكان | يمكن تثبيت الواجهة على Android/iOS/Desktop وتعرض الموجة، الاتجاه، وسلوك تخزين مؤقت غير متصل عبر Service Worker. |
| 🤖 جاهز للروبوتات | مصمم كواجهة حسّية أولية مناسبة لأنظمة IdeasRobot المستقبلية مع الكاميرات، وحدات الحركة، وسير عمل الأتمتة. |
| 📚 غني بالمرجعيات | يضم الوثائق ومواد SDK الخاص بالبائع ومسارات Raspberry Pi القديمة في مستودع واحد لتسريع التجارب واستكشاف الأخطاء. |

## <a id="project-structure"></a>هيكل المشروع

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

توثيق مفصّل:

- [نظرة عامة على البنية](references/ARCHITECTURE.md)
- [ملاحظات SDK لـ Wheeltec](references/SDK_NOTES.md)

## <a id="prerequisites"></a>المتطلبات المسبقة

### تشغيل backend

- Python 3.x
- Linux مع مكدس صوت ALSA
- نقطة نهاية UART لمصفوفة الميكروفونات (عادةً `/dev/wheeltec_mic`) لوضع العتاد

### حزم نظام اختيارية (مستحسنة)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### أداة تسمية العتاد (سير عمل البائع)

بعد تغييرات في نواة النظام/جسر USB، أعد تشغيل الأداة من أصول الـ SDK حتى يظل المسار `/dev/wheeltec_mic` مرئيًا:

```bash
# Example (SDK path may vary):
cd .../offline_mic/scripts
sudo bash ch9102_udev.sh
```

### افتراضات المستودع

- لا يوجد ملف ترخيص أعلى المستوى في هذه اللقطة، لذلك ينبغي اعتبار الشروط القانونية غير محسومة حتى تتم إضافتها.
- بعض أشجار البائع/التراث كبيرة الحجم وهي أرشيف مراجع وليست موجهة لوتيرة إصدار مماثلة لكود Runtime.

## <a id="installation"></a>التثبيت

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

الحزم المدرجة في `requirements.txt`:

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## <a id="usage"></a>الاستخدام

### <a id="web-app"></a>تطبيق الويب

- الواجهة الرئيسية: `http://localhost:8080`
- ثبّت كـ PWA عبر تدفق "Add to home screen" في Chrome/Edge/Safari

### <a id="rest-api"></a>REST API

- `GET /api/status`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`
- `GET /api/recordings/latest`
- `GET /api/recordings/<session_id>/audio`

Example:

```bash
curl -s http://localhost:8080/api/status | jq
curl -X POST http://localhost:8080/api/recordings/start
curl -X POST http://localhost:8080/api/recordings/stop
curl -OJ http://localhost:8080/api/recordings/<session_id>/audio
```

### <a id="websocket-contract"></a>عقد WebSocket

- نقطة النهاية: `/ws/stream` (أو `MIC_ARRAY_WS_PATH`)
- أنواع رسائل الخادم: `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- أوامر العميل: `ping`, `start_recording`, `stop_recording`

مثال payload للأمر:

```json
{"command":"start_recording"}
```

### البدء السريع (من المصدر)

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

للتجارب دون عتاد:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## <a id="configuration"></a>الإعداد

المتغيرات البيئية معرفة في `mic_array_dashboard/backend/config.py`.

| المتغير | الوصف | القيمة الافتراضية |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | جهاز التسلسل الذي يصدر إطارات زاوية التنبيه | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | معدل البود لبورت التسلسل | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | معرف/اسم جهاز ALSA الممرر إلى `sounddevice` | `system default` |
| `MIC_ARRAY_SAMPLE_RATE` | معدل أخذ العينات (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | عينات لكل مقطع صوتي | `2048` |
| `MIC_ARRAY_CHANNELS` | عدد القنوات (1 = أحادي) | `1` |
| `MIC_ARRAY_RECORDING_DIR` | دليل حفظ ملفات WAV | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | توليد صوت اصطناعي | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | توليد اتجاه اصطناعي | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | عتبة الكلام/الصمت | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | عدد أعمدة الموجة المرسلة لكل إطار | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | أقصى عدد عملاء WebSocket متزامنين | `32` |
| `MIC_ARRAY_WS_PATH` | مسار WebSocket | `/ws/stream` |
| `MIC_ARRAY_HOST` | المضيف للربط | `0.0.0.0` |
| `MIC_ARRAY_PORT` | منفذ HTTP | `8080` |

## <a id="examples"></a>أمثلة

### وضع التصحيح مع إعادة التحميل التلقائي

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### تخزين التسجيلات خارج المستودع

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### تعريض الخدمة على الشبكة المحلية

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## <a id="development-notes"></a>ملاحظات التطوير

- شغّل `MIC_ARRAY_DEBUG=1` أثناء التكرار للحصول على سجلات مفصلة وسلوك إعادة التحميل التلقائي.
- التقاط الصوت يعتمد على ALSA؛ شغّل `python -m sounddevice` لاستعراض مؤشرات الأجهزة.
- ملفات الواجهة الأمامية موجودة في `frontend/public`، وتعديل `styles.css` أو `app.js` غالبًا يحتاج فقط إلى تحديث الصفحة بعد إعادة التشغيل.
- وسّع منطق Backend في `mic_array_dashboard/backend/server.py` (المعالِجات وتشكيل الرسائل).
- وسّع موائمات الحساسات في `mic_array_dashboard/backend/device/`.
- يقوم Backend بإنشاء `mic_array_dashboard/recordings/` تلقائيًا إذا لم يكن موجودًا.

## <a id="website"></a>الموقع

- الموقع/الواجهة التسويقية توجد تحت `docs/` (HTML/CSS/JS).
- قم بتكوين GitHub Pages لخدمة `/docs` من فرع `main`.
- احتفظ بقيمة `docs/CNAME` على `robot.lazying.art` عند نشر هذا النطاق.

## <a id="legacy-and-vendor-sdk-notes"></a>ملاحظات SDK للبائع والتراثية

يجمع هذا المستودع كلًّا من البرنامج التشغيلي الحالي وقطع البائع/التراث، بما في ذلك:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

تتضمن ذلك تدفقات التسجيل القديم للـ ASR وVAD عبر SDK القديم؛ استخدم Backend Python الحالي كـ Runtime نشط لتطوير لوحة التحكم.

تدفق بناء SDK تجريبي للتحقق من التوافق:

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

لتوافق Raspberry Pi ARM64:

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

عند العمل مع قواعد USB للبائع، أعد تشغيل `ch9102_udev.sh` وأعد توصيل الجهاز إذا اختفى `/dev/wheeltec_mic`.

## <a id="troubleshooting"></a>استكشاف الأخطاء

| العرض | السبب المحتمل / الحل |
| --- | --- |
| `libmsc.so: cannot open shared object file` | اضبط `LD_LIBRARY_PATH` على دليل مكتبات SDK المطابق (`libs/<arch>`). |
| أخطاء إدخال ALSA | تحقق من الجهاز باستخدام `arecord -l` وحدث `MIC_ARRAY_AUDIO_DEVICE`. |
| نقص `/dev/wheeltec_mic` | أعد تشغيل `ch9102_udev.sh`، أعد توصيل الجهاز، وتأكد من انتمائك لمجموعة `dialout`. |
| لا توجد بيانات Telemetry في الواجهة | تأكد أن مسار WebSocket يطابق `MIC_ARRAY_WS_PATH`؛ استخدم وضع المحاكاة إذا لم يتم توصيل عتاد. |
| عدم ظهور مطالبة تثبيت PWA | تأكد من أصل HTTPS/عام في الإنتاج وتحقق من `manifest.json` وتكوين service-worker الصحيح. |

## <a id="roadmap"></a>خطة العمل

- إضافة لوحات تدفق الكاميرا ودمج الأحداث مع Telemetry زاوية الاستيقاظ.
- إضافة جسور أتمتة لسير عمل OnlyIdeas (اندماج MQTT/الأحداث).
- إضافة استمرارية وتحليلات لتاريخ الموجة + الاتجاه.
- تحسين قوالب النشر (وحدات الخدمة + أمثلة reverse proxy).
- توسيع توافق البروتوكول لنسخ البرامج الثابتة المستقبلية لمصفوفة الميكروفونات.

## <a id="contribution"></a>المساهمة

- انظر `AGENTS.md` لتعرف قواعد المساهمة ومتطلبات التغييرات التي تعيِّن Hardware.
- فضّل طلبات السحب الصغيرة والمركزة مع خطوات استنساخ واضحة.
- أدرج سياق العتاد/نظام التشغيل وأوامر التشغيل لكل تغيير يؤثر على وقت التشغيل.
- إذا تم تعديل مراجع SDK للبائع، حدّث `references/SDK_NOTES.md`.

ملاحظة: لا يوجد ملف `CONTRIBUTING.md` مخصّص في هذا المستودع حاليًا.

## <a id="license"></a>الترخيص

حالة ملف الترخيص غير واضحة حالياً في هذا المستودع: لا يوجد ملف `LICENSE` أعلى المستوى في لقطة العمل الحالية.

الافتراض للمساهمين: اعتبر الكود والأصول مملوكين لمؤيدي المستودع إلى أن يتم إضافة أو توضيح الترخيص في تحديث لاحق.


## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |
