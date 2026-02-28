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

IdeasRobot は、*The Art of Lazying* と *OnlyIdeas* に着想を得た、ゆるやかに使えるマイク＋カメラ向けコンソールです。Wheeltec M2 マイクアレイ（またはシミュレーター）と連携する Tornado バックエンドに、インストール可能な PWA/Android/iOS UI を組み合わせ、波形エネルギー、ウェイク角度テレメトリ、ワンタップ録音をどこからでも扱えます。

## 概要

IdeasRobot は 1 つのリポジトリに 3 つのレイヤーをまとめています。

- リアルタイム制御ランタイム: `mic_array_dashboard/backend`（Tornado + WebSocket + REST）。
- インストール可能なクライアントアプリ: `mic_array_dashboard/frontend/public`（Android/iOS/Desktop 向け PWA）。
- ハードウェア/ベンダー参照資料: Wheeltec SDK 一式、Raspberry Pi の旧統合パス、より広いロボットシステムへ拡張するためのアーキテクチャノート。

このリポジトリは意図的に混在構成です。現在稼働中のランタイムコードに加え、低レイヤー立ち上げに必要なベンダー資産やレガシー資産を同居させています。

## ハイライト

| 機能 | 説明 |
| --- | --- |
| 🎛️ リアルタイム制御ハブ | `/ws/stream` が波形バー、SILENCE/SPEAKING 状態、ウェイク角度を配信し、`/api/*` が状態取得と録音操作を提供します。 |
| 🔌 ハードウェア対応 | ALSA 入力（`sounddevice` 経由）とベンダー UART パケットをフォールバック付きでラップしているため、実機なしでも開発可能です。 |
| 📱 どこでも PWA | Android/iOS/Desktop にインストール可能。ネオン波形、コンパスによる方向表示、オフラインキャッシュを搭載。 |
| 🤖 ロボット拡張前提 | マイクアレイ + カメラ + モーター + OnlyIdeas 自動化を組み合わせる将来の IdeasRobot 構成に向けたセンサーフロントエンドとして設計。 |

## プロジェクト構成

```text
.
├── README.md
├── AGENTS.md
├── i18n/                          # 多言語 README
├── references/
│   ├── ARCHITECTURE.md            # バックエンド/フロントエンドのプロトコルと構成詳細
│   └── SDK_NOTES.md               # Linux/Raspberry Pi 向け SDK 詳細ノート
├── docs/                          # GitHub Pages 用静的ランディング
├── mic_array_dashboard/
│   ├── backend/
│   │   ├── server.py              # ランタイムのメインエントリーポイント
│   │   ├── config.py              # 環境変数駆動の設定
│   │   ├── requirements.txt
│   │   └── device/
│   │       ├── audio_capture.py
│   │       └── direction_reader.py
│   ├── frontend/public/           # PWA ファイル
│   └── recordings/                # 実行時 WAV 出力
├── raspberrypi_legacy/            # Raspberry Pi 向け旧ワークフローとスクリプト
└── M2系列麦克风语音阵列客户资料/    # ベンダー SDK アーカイブとマニュアル
```

詳細ドキュメント:

- [Architecture overview](../references/ARCHITECTURE.md)
- [Wheeltec SDK deep notes](../references/SDK_NOTES.md)

## 前提条件

### ランタイム（ダッシュボード）

- Python 3.x
- ALSA オーディオスタックを備えた Linux
- ハードウェアモード用のマイクアレイ用シリアルエンドポイント（通常は `/dev/wheeltec_mic`）

### 任意のシステムパッケージ（推奨）

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### ハードウェア命名ヘルパー（ベンダースクリプト）

カーネル更新や USB ブリッジ更新後は、ベンダー SDK 側の udev ヘルパーを再実行して `/dev/wheeltec_mic` を維持してください。

```bash
# Example path inside bundled SDK assets:
# .../offline_mic/scripts/ch9102_udev.sh
sudo bash ch9102_udev.sh
```

## インストール

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

依存関係（`requirements.txt` より）:

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## クイックスタート

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

`http://localhost:8080` を開いてコンソールを表示するか、PWA としてインストールしてください。

実機なしでのプロトタイピング:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## 設定

環境変数は `mic_array_dashboard/backend/config.py` で定義されています。

| 変数 | 説明 | デフォルト |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | ウェイク角度フレームを出力するシリアルデバイス | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | マイクアレイ UART のボーレート | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | `sounddevice` に渡す ALSA デバイス ID または名前 | system default |
| `MIC_ARRAY_SAMPLE_RATE` | キャプチャサンプルレート (Hz) | `16000` |
| `MIC_ARRAY_CHUNK` | 1 チャンクあたりのサンプル数 | `2048` |
| `MIC_ARRAY_CHANNELS` | チャンネル数（1 = モノラル） | `1` |
| `MIC_ARRAY_RECORDING_DIR` | WAV 録音の保存先ディレクトリ | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | 疑似サイン波音声を出力 | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | 擬似ウェイク角度を出力 | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | 発話/無音状態判定に使う `level` しきい値 | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | チャンクごとに送信する波形バー数 | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | 同時 WebSocket クライアント最大数 | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocket エンドポイント | `/ws/stream` |
| `MIC_ARRAY_HOST` | バインドホスト | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTP ポート | `8080` |

## 使い方

### Web アプリ

- メイン UI: `http://localhost:8080`
- Chrome/Edge/Safari のホーム画面追加フローから PWA としてインストール

### REST API

- `GET /api/status`
- `POST /api/recordings/start`
- `POST /api/recordings/stop`
- `GET /api/recordings/latest`
- `GET /api/recordings/<session_id>/audio`

例:

```bash
curl -s http://localhost:8080/api/status | jq
curl -X POST http://localhost:8080/api/recordings/start
curl -X POST http://localhost:8080/api/recordings/stop
curl -OJ http://localhost:8080/api/recordings/<session_id>/audio
```

### WebSocket 仕様

- エンドポイント: `/ws/stream`（または `MIC_ARRAY_WS_PATH`）
- サーバーメッセージ種別: `hello`, `waveform`, `direction`, `recording_started`, `recording_stopped`, `pong`
- クライアントコマンド: `ping`, `start_recording`, `stop_recording`

コマンドペイロード例:

```json
{"command":"start_recording"}
```

## 例

### 1) 自動リロード付きデバッグモードで実行

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### 2) リポジトリ外へ録音を保存

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### 3) ローカルネットワークへ公開

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## 開発メモ

- 反復開発中は `MIC_ARRAY_DEBUG=1` を使うと Tornado の自動リロードと詳細ログを有効化できます。
- 音声キャプチャは ALSA 依存です。`python -m sounddevice` でデバイスインデックスを確認してください。
- フロントエンドファイルは `frontend/public` にあり、`styles.css` または `app.js` の編集後はブラウザ再読み込みのみで反映されます。
- バックエンド挙動の拡張は `mic_array_dashboard/backend/server.py`（ハンドラー + メッセージ整形）で行います。
- センサー統合は `mic_array_dashboard/backend/device/` のアダプターを通して拡張します。
- `mic_array_dashboard/recordings/` は存在しない場合、バックエンドが自動作成します。

## Website

- 静的ランディングは `docs/` 配下にあります（HTML/CSS/JS）。
- GitHub Pages は `main` ブランチの `/docs` を配信対象に設定してください。
- `docs/CNAME` は `robot.lazying.art` に維持してください。

## Legacy/Vendor SDK Notes

このリポジトリには、低レイヤービルドやプロトコル検証のために Wheeltec SDK 一式と Raspberry Pi レガシー資産が含まれています。

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

SDK デモのビルド例（同梱ノートに記載）:

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

ARM64 Raspberry Pi の場合:

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

## トラブルシューティング

| 症状 | 主な原因 / 対処 |
| --- | --- |
| `libmsc.so: cannot open shared object file` | 対応する SDK の `libs/<arch>` ディレクトリを `LD_LIBRARY_PATH` に設定してください。 |
| ALSA デバイスエラー | `arecord -l` でデバイス番号を確認し、`MIC_ARRAY_AUDIO_DEVICE` を見直してください。 |
| `/dev/wheeltec_mic` がない | `ch9102_udev.sh` を再実行し、デバイス再接続後、`dialout` グループ所属を確認してください。 |
| UI にテレメトリが出ない | WebSocket パスが `MIC_ARRAY_WS_PATH` と一致しているか確認し、実機なしならシミュレーションフラグを有効化してください。 |
| PWA インストール案内が出ない | 本番では HTTPS/公開オリジン、`manifest.json` と service worker ルーティングの有効性を確認してください。 |

## ロードマップ

- カメラストリームパネルと、ウェイク角度テレメトリとのイベント融合を追加。
- OnlyIdeas ワークフロー向けの自動化ブリッジ（MQTT/イベント連携）を追加。
- 波形 + 方向履歴の永続化/分析機能を追加。
- デプロイテンプレート（リバースプロキシ + サービスユニット）を改善。
- 将来のマイクアレイファーム改訂に向けて、プロトコル互換性カバレッジを拡張。

## コントリビューション

- コントリビューター向けガイドラインは `AGENTS.md` を参照してください。
- 再現手順が明確な、小さく焦点の定まったプルリクエストを推奨します。
- ランタイムに影響する変更では、ハードウェア/OS 情報と実行コマンドを記載してください。
- ベンダー SDK 参照を更新する場合は、`references/SDK_NOTES.md` も同期してください。

注記: 現時点でこのリポジトリには専用の `CONTRIBUTING.md` はありません。

## Donate & Support

IdeasRobot ツールボックスのオープンな維持、デバイス試作の資金、コミュニティ展開の支援のため、以下リンクからサポートできます。

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

ありがとうございます · 谢谢你 · Thank you for helping the IdeasRobot learn, listen, and share more openly.

## License

このリポジトリのライセンスファイル状況は現在不明です。ドラフト時点ではトップレベルの `LICENSE` ファイルは存在しません。

コントリビューター向け前提: ライセンスファイルが追加されるか、将来の更新で明確化されるまでは、コード/資産はリポジトリ所有者の専有物として扱ってください。
