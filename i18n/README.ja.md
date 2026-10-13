[English](../README.md) · [العربية](README.ar.md) · [Español](README.es.md) · [Français](README.fr.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Tiếng Việt](README.vi.md) · [中文 (简体)](README.zh-Hans.md) · [中文（繁體）](README.zh-Hant.md) · [Deutsch](README.de.md) · [Русский](README.ru.md)


[![LazyingArt banner](https://github.com/lachlanchen/lachlanchen/raw/main/figs/banner.png)](https://lazying.art)

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

IdeasRobotは*The Art of Lazying*と*OnlyIdeas*にインスパイアされた、マイクとカメラ向けのラウンジスタイルコンソールです。Wheeltec M2 マイクアレイ（またはシミュレーター）と連携するTornadoバックエンドを提供し、波形エネルギー、ウェイク角度テレメトリ、ワンタップ録音を扱うインストール可能なPWA/Android/iOS向けUIを備えています。

## 重要事項

| 領域 | 詳細 |
| --- | --- |
| リポジトリの役割 | 実行時デモ + ベンダー/レガシーSDK参照 |
| 実行スタック | Tornadoバックエンド + WebSocket + REST + インストール可能フロントエンド |
| ハードウェア経路 | `UART` + ALSAフォールバックシミュレーション付きWheeltec M2アレイ |
| 検証アセット | `mic_array_dashboard/recordings`、`docs`、`M2` SDK参照ツリー |

## 目次

- [重要事項](#重要事項)
- [概要](#概要)
- [機能](#機能)
- [プロジェクト構成](#プロジェクト構成)
- [前提条件](#前提条件)
  - [ランタイムバックエンド](#ランタイムバックエンド)
  - [任意のシステムパッケージ（推奨）](#任意のシステムパッケージ推奨)
  - [ハードウェア命名ヘルパー（ベンダーワークフロー）](#ハードウェア命名ヘルパーベンダーワークフロー)
- [インストール](#インストール)
- [使用方法](#使用方法)
  - [Webアプリ](#webアプリ)
  - [REST API](#rest-api)
  - [WebSocket仕様](#websocket仕様)
- [設定](#設定)
- [例](#例)
- [開発ノート](#開発ノート)
- [ウェブサイト](#ウェブサイト)
- [レガシーとベンダーSDKノート](#レガシーとベンダーSDKノート)
- [トラブルシューティング](#トラブルシューティング)
- [ロードマップ](#ロードマップ)
- [貢献](#貢献)
- [Support](#-support)
- [ライセンス](#ライセンス)

## 概要

IdeasRobotは、1つのリポジトリ内で3層を統合します。

- リアルタイム制御実行時: `mic_array_dashboard/backend`（Tornado + WebSocket + REST）。
- インストール可能なクライアントUI: `mic_array_dashboard/frontend/public`（Android/iOS/Desktop向けPWA）。
- ハードウェアとベンダー参照: `M2系列麦克风语音阵列客户资料*`、Raspberry Piレガシー資産、下位レベル拡張向けのプロトコルノート。

このリポジトリは意図的に混在構成で、実行時のアクティブコードと、低レイヤーの立ち上げに必要なベンダー資産・レガシー資産を同居させています。

## 機能

| 機能 | 説明 |
| --- | --- |
| 🎛️ リアルタイム制御ハブ | `Tornado`バックエンドは、波形バー、SILENCE/SPEAKING状態、ウェイク角度テレメトリ、録音イベントを配信し、状態取得と音声取得用のRESTエンドポイントを公開します。 |
| 🔌 ハードウェア連携 | ALSA音声入力とUARTシリアルパケットは、物理デバイスが無くても開発を続行できるようシミュレーションのフォールバック経路でラップされています。 |
| 📱 PWA全方位対応 | フロントエンドはAndroid/iOS/Desktopへインストール可能で、波形、方向表示、サービスワーカーを使ったキャッシュオフライン動作を備えます。 |
| 🤖 ロボット統合志向 | 今後のIdeasRobotシステム（カメラ、移動モジュール、自動化ワークフロー）向けのセンサーフロントエンドとして設計。 |
| 📚 参照情報の充実 | ドキュメント、ベンダーSDK資料、Raspberry Pi系のレガシーパスを1つのリポジトリにまとめ、実験とトラブルシュートを高速化。 |

## プロジェクト構成

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

詳細ドキュメント:

- [アーキテクチャ概要](references/ARCHITECTURE.md)
- [Wheeltec SDKノート](references/SDK_NOTES.md)

## 前提条件

### ランタイムバックエンド

- Python 3.x
- ALSAオーディオスタックを備えたLinux
- ハードウェアモード用のマイクロフォンアレイのシリアルエンドポイント（通常`/dev/wheeltec_mic`）

### 任意のシステムパッケージ（推奨）

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

### ハードウェア命名ヘルパー（ベンダーワークフロー）

カーネル/USBブリッジ変更後は、SDK資産内のヘルパーを再実行して`/dev/wheeltec_mic`の公開を維持します。

```bash
# 例（SDKパスは環境により異なります）:
cd .../offline_mic/scripts
sudo bash ch9102_udev.sh
```

### リポジトリの前提条件

- このスナップショットにはトップレベルのライセンスファイルがないため、法的条件は追加されるまで未確定として扱う必要があります。
- 一部の大規模なベンダー/レガシーツリーはアーカイブ参照用で、実行時コードと同じリリースサイクルでは更新されません。

## インストール

```bash
git clone https://github.com/lachlanchen/IdeasRobot.git
cd IdeasRobot/mic_array_dashboard/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

`requirements.txt`で定義されている依存関係:

- `tornado>=6.3`
- `pyserial>=3.5`
- `sounddevice>=0.4`

## 使用方法

### Webアプリ

- メインUI: `http://localhost:8080`
- Chrome/Edge/Safariのホーム画面追加フローでPWAとしてインストール

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

### WebSocket仕様

- エンドポイント: `/ws/stream`（または`MIC_ARRAY_WS_PATH`）
- サーバーメッセージ種別: `hello`、`waveform`、`direction`、`recording_started`、`recording_stopped`、`pong`
- クライアントコマンド: `ping`、`start_recording`、`stop_recording`

コマンドペイロード例:

```json
{"command":"start_recording"}
```

### クイックスタート（ソースから）

```bash
MIC_ARRAY_SERIAL=/dev/wheeltec_mic \
MIC_ARRAY_AUDIO_DEVICE="hw:1,0" \
python -m mic_array_dashboard.backend.server
```

ハードウェアが無い場合の試作:

```bash
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

## 設定

環境変数は`mic_array_dashboard/backend/config.py`で定義されています。

| 変数 | 説明 | デフォルト |
| --- | --- | --- |
| `MIC_ARRAY_SERIAL` | 起床角度フレームを送るシリアルデバイス | `/dev/wheeltec_mic` |
| `MIC_ARRAY_SERIAL_BAUD` | シリアル通信ボーレート | `115200` |
| `MIC_ARRAY_AUDIO_DEVICE` | `sounddevice`に渡すALSAデバイスID/名称 | システム既定値 |
| `MIC_ARRAY_SAMPLE_RATE` | キャプチャのサンプリングレート（Hz） | `16000` |
| `MIC_ARRAY_CHUNK` | 音声チャンクあたりのサンプル数 | `2048` |
| `MIC_ARRAY_CHANNELS` | チャンネル数（1 = モノラル） | `1` |
| `MIC_ARRAY_RECORDING_DIR` | WAV保存先ディレクトリ | `mic_array_dashboard/recordings` |
| `MIC_ARRAY_SIMULATE_AUDIO` | 合成音声を出力 | `0` |
| `MIC_ARRAY_SIMULATE_DIRECTION` | 合成角度データを出力 | `0` |
| `MIC_ARRAY_SILENCE_THRESHOLD` | 発話/無音判定しきい値 | `0.12` |
| `MIC_ARRAY_WAVEFORM_BARS` | フレームあたりの波形バー数 | `72` |
| `MIC_ARRAY_MAX_CLIENTS` | 最大同時WebSocketクライアント数 | `32` |
| `MIC_ARRAY_WS_PATH` | WebSocketパス | `/ws/stream` |
| `MIC_ARRAY_HOST` | バインド先ホスト | `0.0.0.0` |
| `MIC_ARRAY_PORT` | HTTPポート | `8080` |

## 例

### 自動リロード付きデバッグモード

```bash
MIC_ARRAY_DEBUG=1 \
MIC_ARRAY_SIMULATE_AUDIO=1 \
MIC_ARRAY_SIMULATE_DIRECTION=1 \
python -m mic_array_dashboard.backend.server
```

### リポジトリ外へ録音を保存

```bash
MIC_ARRAY_RECORDING_DIR=/data/ideasrobot/recordings \
python -m mic_array_dashboard.backend.server
```

### サービスをローカルネットワークへ公開

```bash
MIC_ARRAY_HOST=0.0.0.0 MIC_ARRAY_PORT=8080 \
python -m mic_array_dashboard.backend.server
```

## 開発ノート

- イテレーション時は`MIC_ARRAY_DEBUG=1`を有効化し、冗長ログとautoreload挙動を確認。
- 音声キャプチャはALSA依存です。`python -m sounddevice`でデバイスインデックスを確認してください。
- フロントエンドファイルは`frontend/public`にあり、`styles.css`や`app.js`を編集した場合は再起動後にブラウザ更新だけで反映されることが多いです。
- バックエンドの振る舞いは`mic_array_dashboard/backend/server.py`で拡張します（ハンドラーとメッセージ整形）。
- センサアダプターは`mic_array_dashboard/backend/device/`で拡張します。
- バックエンドは`mic_array_dashboard/recordings/`が存在しない場合に自動作成します。

## ウェブサイト

- マーケティング/静的サイトは`docs/`にあります（HTML/CSS/JS）。
- GitHub Pagesは`main`ブランチの`/docs`を配信するよう設定します。
- `docs/CNAME`はデプロイ時に`robot.lazying.art`を維持してください。

## レガシーとベンダーSDKノート

このリポジトリには実行時ソフトウェアとベンダー/レガシー資産の両方が含まれます。対象は以下です:

- `M2系列麦克风语音阵列客户资料/.../3.Linux_SDK与使用教程/...`
- `raspberrypi_legacy/`

これには旧来のオフラインASR録音とVADフローが含まれます。ダッシュボード開発では、Pythonバックエンドをアクティブ実行時として使用してください。

互換性確認向けのSDKビルド例:

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

ARM64 Raspberry Piの場合:

```bash
make LINUX_ARM64=1
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
```

ベンダーのUSBルール作業時は、`ch9102_udev.sh`を再実行し、`/dev/wheeltec_mic`が消えた場合は再接続してください。

## トラブルシューティング

| 症状 | 想定原因 / 対処 |
| --- | --- |
| `libmsc.so: cannot open shared object file` | `LD_LIBRARY_PATH`にSDKの対応ライブラリディレクトリ（`libs/<arch>`）を設定してください。 |
| ALSA入力エラー | `arecord -l`でデバイスを確認し、`MIC_ARRAY_AUDIO_DEVICE`を更新してください。 |
| `/dev/wheeltec_mic`がない | `ch9102_udev.sh`を再実行し、デバイスを再接続し、`dialout`の所属を確認してください。 |
| UIにテレメトリが出ない | `MIC_ARRAY_WS_PATH`がWebSocketパスと一致しているか確認し、ハードウェア未接続時はシミュレーションフラグを使ってください。 |
| PWAインストールプロンプトが表示されない | 本番環境はHTTPS/公開オリジンにし、`manifest.json`とservice-workerの設定を有効化してください。 |

## ロードマップ

- カメラストリームパネルを追加し、ウェイク角度テレメトリとのイベント統合を行う。
- OnlyIdeas系ワークフロー向けにMQTT/イベント統合の自動化ブリッジを追加する。
- 波形と方向履歴の永続化および分析機能を追加する。
- デプロイメントテンプレート（サービスユニット + リバースプロキシ例）を改善する。
- 将来のマイクアレイファームウェア改訂に合わせてプロトコル互換性を拡張する。

## 貢献

- `AGENTS.md`でコントリビューション規約とハードウェア前提の要件を確認してください。
- 小さく焦点が明確なPull Requestを、再現手順付きで提出するのが望ましいです。
- 実行時に影響する変更は、ハードウェア/OS情報と実行コマンドを必ず含めます。
- ベンダーSDK参照を更新する場合、`references/SDK_NOTES.md`を更新し続けてください。

注記: 現在このリポジトリには専用`CONTRIBUTING.md`は存在しません。

## ライセンス

このリポジトリのライセンス状況は現時点では不明です。作業スナップショットにはトップレベルの`LICENSE`ファイルがありません。

コントリビューター向けの前提: 今後ライセンスが追加または明確化されるまでは、コードと資産はリポジトリ所有者の専有資産として扱ってください。


## ❤️ Support

| Donate | PayPal | Stripe |
| --- | --- | --- |
| [![Donate](https://camo.githubusercontent.com/24a4914f0b42c6f435f9e101621f1e52535b02c225764b2f6cc99416926004b7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f6e6174652d4c617a79696e674172742d3045413545393f7374796c653d666f722d7468652d6261646765266c6f676f3d6b6f2d6669266c6f676f436f6c6f723d7768697465)](https://chat.lazying.art/donate) | [![PayPal](https://camo.githubusercontent.com/d0f57e8b016517a4b06961b24d0ca87d62fdba16e18bbdb6aba28e978dc0ea21/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50617950616c2d526f6e677a686f754368656e2d3030343537433f7374796c653d666f722d7468652d6261646765266c6f676f3d70617970616c266c6f676f436f6c6f723d7768697465)](https://paypal.me/RongzhouChen) | [![Stripe](https://camo.githubusercontent.com/1152dfe04b6943afe3a8d2953676749603fb9f95e24088c92c97a01a897b4942/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5374726970652d446f6e6174652d3633354246463f7374796c653d666f722d7468652d6261646765266c6f676f3d737472697065266c6f676f436f6c6f723d7768697465)](https://buy.stripe.com/aFadR8gIaflgfQV6T4fw400) |
