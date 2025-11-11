<p dir="rtl" align="right">
  <b>اللغات:</b>
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

<div dir="rtl" align="right">

# IdeasRobot

IdeasRobot امتداد لفلسفة “فن الـ Lazying” و OnlyIdeas: خادم Tornado مع واجهة PWA يمكن تثبيتها، يتصل بمصفوفة ميكروفونات Wheeltec M2 (أو بمحاكيها) لعرض طاقة الموجة واتجاه اليقظة والتحكم في التسجيل من أي جهاز.

## المزايا

- **مركز تحكم فوري** — ‎`/ws/stream` يبث 72 شريطاً للموجة مع حالة SILENCE/SPEAKING وزاوية اليقظة، بينما توفر ‎`/api/*` واجهات الحالة والتسجيل.
- **صديق للأجهزة** — يعتمد على ALSA و`sounddevice` لالتقاط الصوت، ويفك ترميز إطارات UART (القيمة 0xA5) الخاصة بالمصنع؛ يمكن تشغيل وضع المحاكاة أثناء التطوير.
- **PWA على كل منصة** — قابل للتثبيت على Android/iOS/سطح المكتب مع واجهة نيّون وبوصلة اتجاهية وتخزين بلا اتصال.
- **جاهز للروبوتات** — يُعد جبهة حسّية يمكن دمجها مع الكاميرات أو أتمتة OnlyIdeas في إصدارات IdeasRobot القادمة.

## هيكل المشروع

```
mic_array_dashboard/
├── backend/          # خادم Tornado ومحولات الأجهزة وrequirements
├── frontend/public/  # تطبيق PWA (HTML/JS/CSS، manifest، service worker، أيقونة)
└── recordings/       # ملفات WAV الناتجة أثناء التشغيل
```

راجع `AGENTS.md` لإرشادات المساهمة.

## التوثيق

- [نظرة معمارية](../docs/ARCHITECTURE.md) — المحولات الخلفية، صيغ الرسائل، تدفق الواجهة.
- [ملاحظات SDK الخاصة بـ Wheeltec](../docs/SDK_NOTES.md) — بناء حزم المصنع على لينكس/راسبيري باي وربطها مع بايثون.

## البدء السريع

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

افتح http://localhost:8080 للاطلاع على لوحة التحكم أو تثبيت الـ PWA. فعّل `MIC_ARRAY_SIMULATE_AUDIO=1` و `MIC_ARRAY_SIMULATE_DIRECTION=1` إن لم يكن الجهاز متوفراً.

## الإعدادات

| المتغير | الوصف | القيمة الافتراضية |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | منفذ السيريال الذي يبث زاوية اليقظة | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | معدل البود | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | جهاز ALSA المستخدم بواسطة `sounddevice` | الإعداد الافتراضي للنظام |
| `MIC_ARRAY_SAMPLE_RATE` | تردد العينة (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | عدد العينات في كل كتلة | `2048` |
| `MIC_ARRAY_CHANNELS` | عدد القنوات | `1` |
| `MIC_ARRAY_SIMULATE_AUDIO` | تشغيل محاكي الصوت | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | تشغيل محاكي الاتجاه | `0` |
| `MIC_ARRAY_WS_PATH` | مسار WebSocket | `/ws/stream` |
| `MIC_ARRAY_PORT` | منفذ HTTP | `8080` |

## نصائح التطوير

- استخدم `MIC_ARRAY_DEBUG=1` لتفعيل إعادة التحميل التلقائية في Tornado وسجلات مفصلة.
- الأمر `python -m sounddevice` يعرض أجهزة ALSA المتاحة لضبط `MIC_ARRAY_AUDIO_DEVICE`.
- واجهة الويب موجودة ضمن `frontend/public`؛ عدّل `styles.css` أو `app.js` ثم حدّث المتصفح.

## التبرع

بدعمك نستمر في إبقاء أدوات IdeasRobot مفتوحة وتمويل النماذج التجريبية ونشرها للمجتمع:

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

شكراً لدعمك، فهو يمنح IdeasRobot قدرة أكبر على الاستماع والرؤية والمشاركة.

</div>
