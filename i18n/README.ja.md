<p>
  <b>Language:</b>
  <a href="../README.md">English</a>
  · <a href="README.zh-Hans.md">中文 (简体)</a>
  · <a href="README.zh-Hant.md">中文（繁體）</a>
  · <a href="README.ja.md">日本語</a>
  · <a href="README.ko.md">한국어</a>
  · <a href="README.vi.md">Tiếng Việt</a>
  · <a href="README.es.md">Español</a>
</p>

# IdeasRobot

IdeasRobot は「The Art of Lazying」と OnlyIdeas から生まれた軽量コンソールです。Wheeltc M2 マイクアレイ（またはシミュレーター）を Tornado バックエンド + PWA/UI に接続し、どこからでも波形・起動角度・録音を監視できます。

## 特徴

- **リアルタイム制御**：`/ws/stream` が 72 本のバー、SILENCE/SPEAKING バッジ、起動角を配信。`/api/*` で状態確認と録音制御。
- **ハードウェアに優しい**：ALSA + `sounddevice` で音声を取得し、シリアル解析はベンダーの 0xA5 フレームと互換。ハードが無くてもシミュレーターで開発可能。
- **PWA 対応**：Android/iOS/デスクトップにインストールでき、ネオン波形・コンパス・オフラインキャッシュを備えます。
- **ロボット拡張**：今後カメラや OnlyIdeas オートメーションと組み合わせ、IdeasRobot の感覚フロントエンドとして機能。

## プロジェクト構成

```
mic_array_dashboard/
├── backend/          # Tornado アプリ、デバイスアダプタ、依存関係
├── frontend/public/  # PWA (HTML/JS/CSS、manifest、SW、icon)
└── recordings/       # ランタイムで生成される WAV
```

コントリビューションガイドは `AGENTS.md` を参照してください。

## ドキュメント

- [アーキテクチャ概要](../docs/ARCHITECTURE.md)：バックエンドアダプタ、メッセージ形式、フロントエンドフロー。
- [Wheetlec SDK ノート](../docs/SDK_NOTES.md)：Linux / Raspberry Pi での SDK ビルドと Python 連携。

## クイックスタート

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

http://localhost:8080 を開いてコンソールを確認するか、PWA をインストールしてください。ハードがない場合は `MIC_ARRAY_SIMULATE_AUDIO=1` と `MIC_ARRAY_SIMULATE_DIRECTION=1` を有効にします。

## 設定

| 変数 | 説明 | デフォルト |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | 起動角データを出力するシリアルデバイス | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | シリアルボーレート | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | `sounddevice` に渡す ALSA デバイス | システム既定 |
| `MIC_ARRAY_SAMPLE_RATE` | サンプリングレート (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | チャンク当たりのサンプル数 | `2048` |
| `MIC_ARRAY_CHANNELS` | チャンネル数 | `1` |
| `MIC_ARRAY_SIMULATE_AUDIO` | 擬似音声を出力 | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | 擬似角度を出力 | `0` |
| `MIC_ARRAY_WS_PATH` | WebSocket パス | `/ws/stream` |
| `MIC_ARRAY_PORT` | HTTP ポート | `8080` |

## 開発メモ

- `MIC_ARRAY_DEBUG=1` を設定して Tornado の自動リロードと詳細ログを有効化。
- `python -m sounddevice` で ALSA デバイス番号を確認し、`MIC_ARRAY_AUDIO_DEVICE` に指定。
- フロントエンドは `frontend/public` にあり、`styles.css` や `app.js` を編集後ブラウザを再読み込みします。

## 寄付・サポート

オープンツールの維持、ハード試作、コミュニティ展開のためにご支援をお願いします：

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

ご支援ありがとうございます。IdeasRobot がもっと自由に「聴き・見て・共有」できるようになります。
