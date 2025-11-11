const angleEl = document.getElementById("angleValue");
const needle = document.querySelector(".needle");
const wavePreview = document.getElementById("wavePreview");
const yearEl = document.getElementById("year");
const langButton = document.getElementById("langButton");
const langMenu = document.getElementById("langMenu");
const langSwitcher = document.querySelector(".lang-switcher");
const LANGUAGE_KEY = "ideasrobot_lang";

const translations = {
  en: {
    label: "English",
    langCode: "en",
    dir: "ltr",
    strings: {
      logo_tagline: "The Art of Lazying · OnlyIdeas",
      nav_features: "Features",
      nav_stack: "Stack",
      nav_launch: "Launch",
      nav_github: "GitHub",
      hero_eyebrow: "robot.lazying.art",
      hero_title: "Listen, see, and steer your mic array from anywhere.",
      hero_body:
        "IdeasRobot pairs a Tornado control plane with an installable PWA that streams neon waveforms, wake angles, and recordings from the Wheeltec M2 array. Built for lazy automation fans who want insight without ceremony.",
      hero_btn_primary: "Launch Console",
      hero_btn_secondary: "View Source",
      hero_meta1_title: "72-bar",
      hero_meta1_desc: "Waveform grid inspired by IdeasGlass",
      hero_meta2_title: "Installable",
      hero_meta2_desc: "PWA for Android/iOS/Desktop",
      hero_meta3_title: "Edge-ready",
      hero_meta3_desc: "ALSA + serial parsers for Raspberry Pi",
      hero_device_label: "Wake angle",
      hero_device_state: "SPEAKING",
      features_eyebrow: "Why IdeasRobot",
      features_title: "Built for sensory calm, not grind.",
      features_desc:
        "A robot console that respects your time: minimal setup, generous visuals, and automation hooks for OnlyIdeas workflows.",
      feature1_title: "WebSocket control loop",
      feature1_body:
        "`/ws/stream` pushes waveform energy, silence/speaking state, and wake metadata with < 80 ms latency. Toggle recordings via REST or WebSocket commands.",
      feature2_title: "Hardware-native adapters",
      feature2_body:
        "ALSA capture via `sounddevice`, serial parsing for CH9102-based UART frames, and simulator flags for development without M2 hardware.",
      feature3_title: "Robot-friendly API surface",
      feature3_body:
        "Ready for ROS bridges, OnlyIdeas workflows, or camera triggers—stream direction events to MQTT, databases, or edge ML pipelines.",
      feature4_title: "Install once, monitor forever",
      feature4_body:
        "The PWA ships service worker caching, offline splash, and home-screen icons so your phone or tablet becomes a dedicated IdeasRobot display.",
      stack_title: "Stack overview",
      stack_item1:
        "<strong>Tornado backend</strong> — REST + WebSocket fan-out, WAV archiving, status endpoints.",
      stack_item2:
        "<strong>Audio adapters</strong> — PCM16 chunks via ALSA or simulator, saved into <code>recordings/</code>.",
      stack_item3:
        "<strong>Direction reader</strong> — Mirrors vendor 0xA5 protocol to broadcast wake angles.",
      stack_item4:
        "<strong>PWA front-end</strong> — Neon waveform grid, compass, install prompts, service worker.",
      stack_item5:
        "<strong>Docs bundle</strong> — Architecture + SDK notes for Linux/Raspberry Pi bring-up.",
      stack_highlight_title: "Ready for robot.lazying.art",
      stack_highlight_body:
        "Host `docs/` on GitHub Pages or your own CDN, point `robot.lazying.art` at the Pages distribution, and forward `/` to the live Tornado instance.",
      timeline_step1: "<span>1</span> Configure Pages to serve <code>/docs</code> branch/folder.",
      timeline_step2: "<span>2</span> Set <code>CNAME</code> file to <code>robot.lazying.art</code>.",
      timeline_step3:
        "<span>3</span> Proxy console origin (<code>https://robot.lazying.art/app</code>) to your Tornado host.",
      gallery_title: "A gentle robot operations cockpit.",
      gallery_card1_title: "Waveform",
      gallery_card1_body: "Neon bars with silence/speaking pill and latency badge.",
      gallery_card2_title: "Direction compass",
      gallery_card2_body: "Animated arrow locks onto the wake angle, ideal for beam-steering demos.",
      gallery_card3_title: "Recording shelf",
      gallery_card3_body: "One-tap start/stop with downloadable WAV artifacts synced to your robot logs.",
      cta_eyebrow: "Only Ideas · Less grind",
      cta_title: "Deploy IdeasRobot, relax the Ops.",
      cta_body:
        "Whether you’re running a Raspberry Pi in a workshop or a fleet of home robots, IdeasRobot keeps the sensory stack elegant. Build on it, remix it, or sponsor its future.",
      cta_btn_primary: "Clone on GitHub",
      cta_btn_secondary: "Donate",
      footer_text: "© <span id=\"year\"></span> IdeasRobot · The Art of Lazying",
      footer_link_github: "GitHub",
      footer_link_site: "Lazying.art",
      footer_link_donate: "Donate",
    },
  },
  "zh-Hans": {
    label: "中文 (简体)",
    langCode: "zh-Hans",
    dir: "ltr",
    strings: {
      logo_tagline: "Lazying 的艺术 · OnlyIdeas",
      nav_features: "功能",
      nav_stack: "技术栈",
      nav_launch: "启动",
      nav_github: "GitHub",
      hero_eyebrow: "robot.lazying.art",
      hero_title: "随时随地监听、可视化并掌控你的麦克风阵列。",
      hero_body:
        "IdeasRobot 将 Tornado 控制平面与可安装 PWA 结合，实时推送霓虹波形、唤醒角与录音，专为想要“少操心”的自动化玩家而生。",
      hero_btn_primary: "打开控制台",
      hero_btn_secondary: "查看源码",
      hero_meta1_title: "72 段",
      hero_meta1_desc: "来自 IdeasGlass 的霓虹波形网格",
      hero_meta2_title: "可安装",
      hero_meta2_desc: "Android / iOS / 桌面均可添加到桌面",
      hero_meta3_title: "边缘友好",
      hero_meta3_desc: "支持 ALSA 采集与串口解析，适配 Raspberry Pi",
      hero_device_label: "唤醒角度",
      hero_device_state: "讲话中",
      features_eyebrow: "为什么选择 IdeasRobot",
      features_title: "更安静的感知，而非更忙的运维。",
      features_desc: "最小化配置、直观大屏、接上 OnlyIdeas 工作流，让机器人状态一目了然。",
      feature1_title: "WebSocket 控制环",
      feature1_body:
        "`/ws/stream` 以 < 80 ms 延迟推送波形能量、Silence/Speaking 状态与唤醒角度，可通过 REST 或 WebSocket 指令触发录音。",
      feature2_title: "原生硬件适配",
      feature2_body:
        "基于 `sounddevice` 的 ALSA 采集、兼容 CH9102 的串口解析、以及支持无硬件调试的模拟模式。",
      feature3_title: "机器人级 API",
      feature3_body: "轻松接入 ROS、OnlyIdeas 自动化或相机触发，将角度事件推送到 MQTT、数据库或边缘 ML。",
      feature4_title: "一次安装，随处监控",
      feature4_body: "PWA 内置缓存、离线提示与桌面图标，让手机/平板成为专属监视器。",
      stack_title: "技术栈一览",
      stack_item1:
        "<strong>Tornado 后端</strong> —— REST + WebSocket 广播、WAV 归档与状态接口。",
      stack_item2:
        "<strong>音频适配器</strong> —— 通过 ALSA 或模拟器生成 PCM16 块并写入 <code>recordings/</code>。",
      stack_item3:
        "<strong>方向解析器</strong> —— 还原厂家 0xA5 帧，实时播报唤醒角。",
      stack_item4:
        "<strong>PWA 前端</strong> —— 霓虹波形、罗盘、安装提示与 Service Worker。",
      stack_item5:
        "<strong>文档包</strong> —— Linux/Raspberry Pi 搭建手册与 SDK 深度笔记。",
      stack_highlight_title: "对接 robot.lazying.art",
      stack_highlight_body:
        "将 `docs/` 发布到 GitHub Pages 或自建 CDN，域名指向 `robot.lazying.art`，再把 `/` 转发到正在运行的 Tornado 服务。",
      timeline_step1:
        "<span>1</span> 在 Pages 中选择 <code>/docs</code> 目录作为发布源。",
      timeline_step2: "<span>2</span> 在仓库中维护 <code>CNAME</code> = <code>robot.lazying.art</code>。",
      timeline_step3:
        "<span>3</span> 将 <code>https://robot.lazying.art/app</code> 代理到你的 Tornado 主机。",
      gallery_title: "温和的机器人运维驾驶舱。",
      gallery_card1_title: "波形",
      gallery_card1_body: "72 段霓虹条 + Silence/Speaking 徽章 + 延迟状态。",
      gallery_card2_title: "方向罗盘",
      gallery_card2_body: "动态箭头锁定唤醒角，适合波束指向展示。",
      gallery_card3_title: "录音架",
      gallery_card3_body: "一键开始/结束，WAV 自动对齐机器人日志。",
      cta_eyebrow: "Only Ideas · 少一些忙碌",
      cta_title: "部署 IdeasRobot，让 Ops 更轻松。",
      cta_body:
        "不论是工作坊里的 Raspberry Pi，还是家中的一排机器人，IdeasRobot 都让感知链路保持优雅。欢迎拓展、改造或赞助。",
      cta_btn_primary: "克隆仓库",
      cta_btn_secondary: "支持项目",
      footer_text: "© <span id=\"year\"></span> IdeasRobot · Lazying 的艺术",
      footer_link_github: "GitHub",
      footer_link_site: "Lazying.art",
      footer_link_donate: "捐助",
    },
  },
  "zh-Hant": {
    label: "中文（繁體）",
    langCode: "zh-Hant",
    dir: "ltr",
    strings: {
      logo_tagline: "Lazying 的藝術 · OnlyIdeas",
      nav_features: "特色",
      nav_stack: "技術棧",
      nav_launch: "啟動",
      nav_github: "GitHub",
      hero_eyebrow: "robot.lazying.art",
      hero_title: "隨時監控、視覺化並操控你的麥克風陣列。",
      hero_body:
        "IdeasRobot 結合 Tornado 控制面與可安裝 PWA，串流霓虹波形、喚醒角與錄音，給想「少忙一點」的自動化玩家。",
      hero_btn_primary: "開啟控制台",
      hero_btn_secondary: "檢視原始碼",
      hero_meta1_title: "72 段",
      hero_meta1_desc: "取材 IdeasGlass 的霓虹波形網格",
      hero_meta2_title: "可安裝",
      hero_meta2_desc: "Android / iOS / 桌面皆可加入主畫面",
      hero_meta3_title: "邊緣友善",
      hero_meta3_desc: "支援 ALSA 與串口解析，適用 Raspberry Pi",
      hero_device_label: "喚醒角度",
      hero_device_state: "說話中",
      features_eyebrow: "為何選擇 IdeasRobot",
      features_title: "讓感知維運保持沈著，而非更繁忙。",
      features_desc:
        "減少設定、提供明亮視覺，並可無縫接入 OnlyIdeas 自動化流程。",
      feature1_title: "WebSocket 控制迴圈",
      feature1_body:
        "`/ws/stream` 以 < 80 ms 延遲推播波形能量與喚醒角，也可用 REST / WebSocket 指令切換錄音。",
      feature2_title: "原生硬體介面",
      feature2_body:
        "透過 `sounddevice` 擷取 ALSA 音訊，解析 CH9102 UART 幀，並提供無硬體時的模擬模式。",
      feature3_title: "機器人友善 API",
      feature3_body: "可串 ROS、OnlyIdeas 或相機觸發，把方向事件送往 MQTT、資料庫或邊緣 ML。",
      feature4_title: "一次安裝，持續觀看",
      feature4_body: "PWA 內建快取、離線提示與桌面捷徑，讓手機變成專用儀表板。",
      stack_title: "技術棧概覽",
      stack_item1:
        "<strong>Tornado 後端</strong> —— REST + WebSocket 廣播、WAV 封存與狀態端點。",
      stack_item2:
        "<strong>音訊介面</strong> —— ALSA / 模擬產生 PCM16，寫入 <code>recordings/</code>。",
      stack_item3:
        "<strong>方向解析</strong> —— 還原原廠 0xA5 幀，隨時輸出喚醒角。",
      stack_item4:
        "<strong>PWA 前端</strong> —— 霓虹波形、指南針、安裝提示與 Service Worker。",
      stack_item5:
        "<strong>文件組</strong> —— Linux/Raspberry Pi 佈署步驟與 SDK 筆記。",
      stack_highlight_title: "對接 robot.lazying.art",
      stack_highlight_body:
        "把 `docs/` 發佈到 GitHub Pages 或任一 CDN，將網域指向 `robot.lazying.art`，再把 `/` 代理到 Tornado 服務。",
      timeline_step1:
        "<span>1</span> 在 Pages 選擇 <code>/docs</code> 目錄作為來源。",
      timeline_step2:
        "<span>2</span> 設定 <code>CNAME</code> = <code>robot.lazying.art</code>。",
      timeline_step3:
        "<span>3</span> 代理 <code>https://robot.lazying.art/app</code> 至後端主機。",
      gallery_title: "優雅穩定的機器人駕駛艙。",
      gallery_card1_title: "波形",
      gallery_card1_body: "霓虹條 + 靜音/說話徽章 + 連線延遲顯示。",
      gallery_card2_title: "方向羅盤",
      gallery_card2_body: "動畫箭頭鎖定聲源，示範波束指向最直觀。",
      gallery_card3_title: "錄音架",
      gallery_card3_body: "一鍵錄製並產出 WAV，方便與機器人日誌對上。",
      cta_eyebrow: "Only Ideas · 減少忙碌",
      cta_title: "部署 IdeasRobot，Ops 自然鬆一口氣。",
      cta_body:
        "無論是工作室裡的 Pi 還是家用機器人，IdeasRobot 讓感知鏈路保持優雅。歡迎擴充、改造或贊助。",
      cta_btn_primary: "Clone GitHub",
      cta_btn_secondary: "贊助",
      footer_text: "© <span id=\"year\"></span> IdeasRobot · Lazying 的藝術",
      footer_link_github: "GitHub",
      footer_link_site: "Lazying.art",
      footer_link_donate: "捐助",
    },
  },
  ja: {
    label: "日本語",
    langCode: "ja",
    dir: "ltr",
    strings: {
      logo_tagline: "The Art of Lazying · OnlyIdeas",
      nav_features: "特徴",
      nav_stack: "スタック",
      nav_launch: "起動",
      nav_github: "GitHub",
      hero_eyebrow: "robot.lazying.art",
      hero_title: "いつでもどこでもマイクアレイを観測し、操作する。",
      hero_body:
        "IdeasRobot は Tornado 制御プレーンとインストール可能な PWA を組み合わせ、Wheeltec M2 から波形・方位・録音をストリーミングします。余計な儀式なしに状況を把握したい人のためのコンソールです。",
      hero_btn_primary: "コンソールを開く",
      hero_btn_secondary: "ソースを見る",
      hero_meta1_title: "72 本",
      hero_meta1_desc: "IdeasGlass 由来のネオン波形",
      hero_meta2_title: "インストール可",
      hero_meta2_desc: "Android / iOS / デスクトップ対応 PWA",
      hero_meta3_title: "エッジ対応",
      hero_meta3_desc: "ALSA とシリアル解析で Raspberry Pi に最適",
      hero_device_label: "ウェイク角度",
      hero_device_state: "発話中",
      features_eyebrow: "IdeasRobot の理由",
      features_title: "オペレーションを忙しくしない感覚ハブ。",
      features_desc:
        "セットアップ最小・可視化充実・OnlyIdeas 連携で、ロボットの耳を落ち着いて観察できます。",
      feature1_title: "WebSocket 制御ループ",
      feature1_body:
        "`/ws/stream` が波形エネルギーと SILENCE/SPEAKING を 80ms 未満で配信。REST でも WebSocket でも録音トグルが可能。",
      feature2_title: "ハードウェアネイティブ",
      feature2_body:
        "`sounddevice` による ALSA 取り込み、CH9102 フレームのシリアル解析、ハード無しで試せるシミュレーター。",
      feature3_title: "ロボット向け API",
      feature3_body:
        "ROS や OnlyIdeas、自作カメラトリガーと組み合わせやすく、角度イベントを MQTT・DB・エッジ ML に発行できます。",
      feature4_title: "一度インストールすれば常設",
      feature4_body:
        "PWA はキャッシュとオフライン画面、ホームアイコン付き。手元の端末がそのまま IdeasRobot の計器盤になります。",
      stack_title: "スタック概要",
      stack_item1:
        "<strong>Tornado バックエンド</strong> — REST + WebSocket 配信、WAV 保管、ステータス API。",
      stack_item2:
        "<strong>オーディオアダプタ</strong> — ALSA/シミュレーター経由で PCM16 を生成し <code>recordings/</code> へ保存。",
      stack_item3:
        "<strong>方向リーダー</strong> — ベンダー 0xA5 フレームを解析して角度を配信。",
      stack_item4:
        "<strong>PWA フロント</strong> — ネオン波形、コンパス、インストール導線、Service Worker。",
      stack_item5:
        "<strong>ドキュメント</strong> — Linux / Raspberry Pi 向けの構築メモと SDK ノート。",
      stack_highlight_title: "robot.lazying.art で公開",
      stack_highlight_body:
        "`docs/` を GitHub Pages へ公開し、`robot.lazying.art` を Pages 配信先に向け、`/` を Tornado 本番にフォワードします。",
      timeline_step1:
        "<span>1</span> Pages で <code>/docs</code> ディレクトリを発行ソースに設定。",
      timeline_step2:
        "<span>2</span> リポジトリに <code>CNAME</code>（robot.lazying.art）を置く。",
      timeline_step3:
        "<span>3</span> <code>https://robot.lazying.art/app</code> を Tornado へプロキシ。",
      gallery_title: "しなやかなロボット運用コックピット。",
      gallery_card1_title: "波形",
      gallery_card1_body: "ネオンバーと SILENCE/SPEAKING ピル、レイテンシ表示。",
      gallery_card2_title: "コンパス",
      gallery_card2_body: "ウェイク角に追従する矢印でビーム制御を可視化。",
      gallery_card3_title: "録音ラック",
      gallery_card3_body: "ワンタップ記録・停止、ログと同期した WAV を取得。",
      cta_eyebrow: "Only Ideas · 少ない手間で",
      cta_title: "IdeasRobot を配備して、Ops を軽く。",
      cta_body:
        "工房の Raspberry Pi でも家庭用ロボット群でも、IdeasRobot が聴覚スタックを端正に保ちます。フォーク、改造、支援すべて歓迎です。",
      cta_btn_primary: "GitHub でクローン",
      cta_btn_secondary: "寄付する",
      footer_text: "© <span id=\"year\"></span> IdeasRobot · The Art of Lazying",
      footer_link_github: "GitHub",
      footer_link_site: "Lazying.art",
      footer_link_donate: "寄付",
    },
  },
  ko: {
    label: "한국어",
    langCode: "ko",
    dir: "ltr",
    strings: {
      logo_tagline: "Lazying의 예술 · OnlyIdeas",
      nav_features: "특징",
      nav_stack: "스택",
      nav_launch: "실행",
      nav_github: "GitHub",
      hero_eyebrow: "robot.lazying.art",
      hero_title: "어디서나 마이크 어레이를 듣고 보고 제어하세요.",
      hero_body:
        "IdeasRobot은 Tornado 백엔드와 설치형 PWA를 묶어 Wheeltec M2의 네온 파형, 각도, 녹음을 스트리밍합니다. 복잡한 절차 없이 상태를 보고 싶은 사람을 위한 도구입니다.",
      hero_btn_primary: "콘솔 열기",
      hero_btn_secondary: "소스 보기",
      hero_meta1_title: "72바",
      hero_meta1_desc: "IdeasGlass에서 영감을 얻은 네온 파형 격자",
      hero_meta2_title: "설치형",
      hero_meta2_desc: "Android / iOS / 데스크톱 PWA",
      hero_meta3_title: "엣지 최적화",
      hero_meta3_desc: "ALSA + 시리얼 파서로 Raspberry Pi 지원",
      hero_device_label: "웨이크 각도",
      hero_device_state: "발화 중",
      features_eyebrow: "IdeasRobot 이유",
      features_title: "바쁜 운용 대신 차분한 감각 허브.",
      features_desc:
        "세팅은 가볍게, 시각화는 선명하게, OnlyIdeas 자동화와 자연스럽게 연결됩니다.",
      feature1_title: "WebSocket 제어 루프",
      feature1_body:
        "`/ws/stream` 이 80ms 미만 지연으로 파형 에너지와 각도를 전송하고, REST/WS 명령으로 녹음을 토글합니다.",
      feature2_title: "하드웨어 친화",
      feature2_body:
        "`sounddevice` 기반 ALSA 캡처, CH9102 UART 해석, 장비 없이도 가능한 시뮬레이터.",
      feature3_title: "로봇 API",
      feature3_body: "ROS, OnlyIdeas, 카메라 트리거 등과 연결하여 각도 이벤트를 MQTT·DB·엣지 ML로 보낼 수 있습니다.",
      feature4_title: "한 번 설치, 계속 모니터링",
      feature4_body:
        "PWA 캐시와 홈 아이콘으로 휴대폰/태블릿이 상시 모니터가 됩니다.",
      stack_title: "스택 개요",
      stack_item1:
        "<strong>Tornado 백엔드</strong> — REST + WebSocket 팬아웃, WAV 저장, 상태 API.",
      stack_item2:
        "<strong>오디오 어댑터</strong> — ALSA/시뮬레이터에서 PCM16을 생성하고 <code>recordings/</code>에 보관.",
      stack_item3:
        "<strong>방향 리더</strong> — 제조사 0xA5 프레임을 그대로 파싱하여 각도를 방송.",
      stack_item4:
        "<strong>PWA 프런트엔드</strong> — 네온 파형, 컴퍼스, 설치 안내, Service Worker.",
      stack_item5:
        "<strong>문서</strong> — Linux/Raspberry Pi 빌드 가이드와 SDK 노트.",
      stack_highlight_title: "robot.lazying.art 구성",
      stack_highlight_body:
        "`docs/` 를 GitHub Pages 에 배포하고, `robot.lazying.art` 도메인을 연결한 뒤 `/` 을 실제 Tornado 인스턴스로 프록시합니다.",
      timeline_step1:
        "<span>1</span> Pages 에서 <code>/docs</code> 폴더를 소스로 선택.",
      timeline_step2:
        "<span>2</span> 저장소에 <code>CNAME</code>(robot.lazying.art)을 추가.",
      timeline_step3:
        "<span>3</span> <code>https://robot.lazying.art/app</code> 을 Tornado 호스트로 프록시.",
      gallery_title: "부드러운 로봇 운영 조종석.",
      gallery_card1_title: "파형",
      gallery_card1_body: "네온 막대 + SILENCE/SPEAKING 배지 + 지연 표시.",
      gallery_card2_title: "방향 컴퍼스",
      gallery_card2_body: "웨이크 각도에 맞춰 회전하는 화살표로 빔 조향을 보여줍니다.",
      gallery_card3_title: "녹음 선반",
      gallery_card3_body: "원클릭 녹음/중지, 로봇 로그와 동기화된 WAV 다운로드.",
      cta_eyebrow: "Only Ideas · 덜 바쁘게",
      cta_title: "IdeasRobot으로 Ops를 가볍게.",
      cta_body:
        "작업실의 Pi부터 집안 로봇까지, IdeasRobot이 감각 스택을 단정하게 유지합니다. 포크·확장·후원을 환영합니다.",
      cta_btn_primary: "GitHub 복제",
      cta_btn_secondary: "후원하기",
      footer_text: "© <span id=\"year\"></span> IdeasRobot · The Art of Lazying",
      footer_link_github: "GitHub",
      footer_link_site: "Lazying.art",
      footer_link_donate: "후원",
    },
  },
  vi: {
    label: "Tiếng Việt",
    langCode: "vi",
    dir: "ltr",
    strings: {
      logo_tagline: "Nghệ thuật Lười Biếng · OnlyIdeas",
      nav_features: "Tính năng",
      nav_stack: "Stack",
      nav_launch: "Khởi chạy",
      nav_github: "GitHub",
      hero_eyebrow: "robot.lazying.art",
      hero_title: "Lắng nghe, quan sát và điều khiển mảng micro mọi lúc.",
      hero_body:
        "IdeasRobot kết hợp Tornado backend với PWA cài đặt được để phát sóng waveform, góc đánh thức và bản ghi từ Wheeltec M2 — dành cho người muốn nắm tình hình mà không tốn công.",
      hero_btn_primary: "Mở bảng điều khiển",
      hero_btn_secondary: "Xem nguồn",
      hero_meta1_title: "72 cột",
      hero_meta1_desc: "Lưới waveform neon lấy cảm hứng từ IdeasGlass",
      hero_meta2_title: "PWA",
      hero_meta2_desc: "Cài trên Android / iOS / Desktop",
      hero_meta3_title: "Sẵn sàng edge",
      hero_meta3_desc: "ALSA + parser UART cho Raspberry Pi",
      hero_device_label: "Góc đánh thức",
      hero_device_state: "Đang nói",
      features_eyebrow: "Vì sao chọn IdeasRobot",
      features_title: "Một bảng điều khiển nhẹ nhàng, không làm bạn bận rộn.",
      features_desc:
        "Thiết lập tối giản, trực quan, sẵn sàng nối với workflow OnlyIdeas.",
      feature1_title: "Vòng điều khiển WebSocket",
      feature1_body:
        "`/ws/stream` phát năng lượng waveform và trạng thái SILENCE/SPEAKING với độ trễ < 80 ms; điều khiển ghi âm qua REST hoặc WebSocket.",
      feature2_title: "Adapter phần cứng",
      feature2_body:
        "Thu âm từ ALSA, giải mã khung CH9102, có bộ giả lập khi chưa có phần cứng.",
      feature3_title: "API thân thiện robot",
      feature3_body:
        "Kết nối ROS, OnlyIdeas, trigger camera, đẩy sự kiện góc đến MQTT hoặc các pipeline ML cận biên.",
      feature4_title: "Cài một lần, theo dõi mãi",
      feature4_body:
        "PWA có cache offline, biểu tượng màn hình chính — biến điện thoại thành màn hiển thị IdeasRobot.",
      stack_title: "Tổng quan stack",
      stack_item1:
        "<strong>Tornado backend</strong> — REST + WebSocket broadcast, lưu WAV, API trạng thái.",
      stack_item2:
        "<strong>Audio adapter</strong> — Lấy PCM16 từ ALSA/giả lập và lưu vào <code>recordings/</code>.",
      stack_item3:
        "<strong>Direction reader</strong> — Bắt đúng frame 0xA5 để phát góc đánh thức.",
      stack_item4:
        "<strong>PWA front-end</strong> — Waveform neon, la bàn, hướng dẫn cài và service worker.",
      stack_item5:
        "<strong>Tài liệu</strong> — Hướng dẫn Linux/Raspberry Pi và ghi chú SDK.",
      stack_highlight_title: "Sẵn sàng cho robot.lazying.art",
      stack_highlight_body:
        "Deploy `docs/` lên GitHub Pages hoặc CDN riêng, trỏ tên miền `robot.lazying.art` tới đó và proxy `/` đến máy chủ Tornado.",
      timeline_step1:
        "<span>1</span> Chọn thư mục <code>/docs</code> làm nguồn GitHub Pages.",
      timeline_step2:
        "<span>2</span> Giữ file <code>CNAME</code> với nội dung <code>robot.lazying.art</code>.",
      timeline_step3:
        "<span>3</span> Proxy <code>https://robot.lazying.art/app</code> tới backend Tornado.",
      gallery_title: "Buồng lái vận hành robot đầy cảm hứng.",
      gallery_card1_title: "Waveform",
      gallery_card1_body: "Thanh neon + badge SILENCE/SPEAKING + độ trễ liên kết.",
      gallery_card2_title: "La bàn hướng",
      gallery_card2_body: "Mũi tên động khóa vào góc — tuyệt vời để demo beamforming.",
      gallery_card3_title: "Kệ ghi âm",
      gallery_card3_body: "Một chạm để ghi/dừng, tải WAV khớp nhật ký robot.",
      cta_eyebrow: "Only Ideas · Ít vất vả hơn",
      cta_title: "Triển khai IdeasRobot, để Ops thư thái.",
      cta_body:
        "Từ Raspberry Pi trong xưởng đến dàn robot ở nhà, IdeasRobot giúp tầng cảm biến luôn gọn gàng. Fork, tùy biến hay ủng hộ đều được chào đón.",
      cta_btn_primary: "Clone trên GitHub",
      cta_btn_secondary: "Ủng hộ",
      footer_text: "© <span id=\"year\"></span> IdeasRobot · Nghệ thuật Lười Biếng",
      footer_link_github: "GitHub",
      footer_link_site: "Lazying.art",
      footer_link_donate: "Ủng hộ",
    },
  },
  es: {
    label: "Español",
    langCode: "es",
    dir: "ltr",
    strings: {
      logo_tagline: "El arte de lazying · OnlyIdeas",
      nav_features: "Funciones",
      nav_stack: "Stack",
      nav_launch: "Lanzar",
      nav_github: "GitHub",
      hero_eyebrow: "robot.lazying.art",
      hero_title: "Escucha, observa y dirige tu matriz de micrófonos desde cualquier lugar.",
      hero_body:
        "IdeasRobot combina un backend Tornado con una PWA instalable para transmitir waveforms, ángulos de activación y grabaciones del array Wheeltec M2. Ideal para automatizadores que quieren claridad sin fricción.",
      hero_btn_primary: "Abrir consola",
      hero_btn_secondary: "Ver código",
      hero_meta1_title: "72 barras",
      hero_meta1_desc: "Grid neon inspirado en IdeasGlass",
      hero_meta2_title: "Instalable",
      hero_meta2_desc: "PWA para Android / iOS / escritorio",
      hero_meta3_title: "Listo para edge",
      hero_meta3_desc: "ALSA + parsers serie para Raspberry Pi",
      hero_device_label: "Ángulo de activación",
      hero_device_state: "Hablando",
      features_eyebrow: "Por qué IdeasRobot",
      features_title: "Un cockpit sensorial sereno, no agotador.",
      features_desc:
        "Configuración mínima, visuales generosos y ganchos para flujos OnlyIdeas.",
      feature1_title: "Bucle WebSocket",
      feature1_body:
        "`/ws/stream` entrega energía, estado silencio/habla y ángulos con < 80 ms; cambia grabaciones vía REST o WS.",
      feature2_title: "Adaptadores nativos",
      feature2_body:
        "Captura ALSA con `sounddevice`, parser UART CH9102 y modo simulador sin hardware.",
      feature3_title: "API amigable para robots",
      feature3_body:
        "Listo para puentes ROS, automatizaciones OnlyIdeas o triggers de cámara hacia MQTT/BD/ML.",
      feature4_title: "Instala una vez, monitorea siempre",
      feature4_body:
        "La PWA trae cache, splash offline e íconos para fijarla en tu teléfono o tablet.",
      stack_title: "Resumen del stack",
      stack_item1:
        "<strong>Backend Tornado</strong> — Broadcast REST + WebSocket, archivos WAV, API de estado.",
      stack_item2:
        "<strong>Adaptadores de audio</strong> — Bloques PCM16 desde ALSA/simulador guardados en <code>recordings/</code>.",
      stack_item3:
        "<strong>Lector de dirección</strong> — Replica el protocolo 0xA5 para difundir ángulos.",
      stack_item4:
        "<strong>Front-end PWA</strong> — Waveform neon, brújula, prompts de instalación, service worker.",
      stack_item5:
        "<strong>Docs</strong> — Guías de arquitectura y SDK para Linux/Raspberry Pi.",
      stack_highlight_title: "Listo para robot.lazying.art",
      stack_highlight_body:
        "Publica `docs/` con GitHub Pages o CDN propia, apunta `robot.lazying.art` al sitio y reenvía `/` a tu Tornado en vivo.",
      timeline_step1:
        "<span>1</span> Configura Pages para usar la carpeta <code>/docs</code>.",
      timeline_step2:
        "<span>2</span> Añade <code>CNAME</code> con <code>robot.lazying.art</code>.",
      timeline_step3:
        "<span>3</span> Proxy de <code>https://robot.lazying.art/app</code> hacia tu backend.",
      gallery_title: "Una cabina de operaciones tranquila.",
      gallery_card1_title: "Waveform",
      gallery_card1_body: "Barras neon con insignia SILENCE/SPEAKING y latencia.",
      gallery_card2_title: "Brújula",
      gallery_card2_body: "Flecha animada que sigue el ángulo para demos de beamforming.",
      gallery_card3_title: "Estante de grabaciones",
      gallery_card3_body: "Inicio/detención con un toque y WAV listos para descargar.",
      cta_eyebrow: "Only Ideas · Menos fricción",
      cta_title: "Despliega IdeasRobot y respira hondo.",
      cta_body:
        "Desde un Raspberry Pi hasta flotas domésticas, IdeasRobot mantiene el stack sensorial elegante. Clona, remezcla o apoya su futuro.",
      cta_btn_primary: "Clonar en GitHub",
      cta_btn_secondary: "Donar",
      footer_text: "© <span id=\"year\"></span> IdeasRobot · The Art of Lazying",
      footer_link_github: "GitHub",
      footer_link_site: "Lazying.art",
      footer_link_donate: "Donar",
    },
  },
  fr: {
    label: "Français",
    langCode: "fr",
    dir: "ltr",
    strings: {
      logo_tagline: "L’art du lazyness · OnlyIdeas",
      nav_features: "Atouts",
      nav_stack: "Stack",
      nav_launch: "Lancer",
      nav_github: "GitHub",
      hero_eyebrow: "robot.lazying.art",
      hero_title: "Écoutez, visualisez et pilotez votre array microphone où que vous soyez.",
      hero_body:
        "IdeasRobot associe un backend Tornado à une PWA installable pour diffuser waveforms néon, angles de réveil et enregistrements du Wheeltec M2. Un outil pour celles et ceux qui veulent de la clarté sans lourdeur.",
      hero_btn_primary: "Ouvrir la console",
      hero_btn_secondary: "Voir le code",
      hero_meta1_title: "72 barres",
      hero_meta1_desc: "Grille néon inspirée d’IdeasGlass",
      hero_meta2_title: "Installable",
      hero_meta2_desc: "PWA Android / iOS / Desktop",
      hero_meta3_title: "Prêt edge",
      hero_meta3_desc: "ALSA + parsing série pour Raspberry Pi",
      hero_device_label: "Angle de réveil",
      hero_device_state: "En train de parler",
      features_eyebrow: "Pourquoi IdeasRobot",
      features_title: "Un cockpit sensoriel calme, sans burn-out.",
      features_desc:
        "Mise en route minimale, visuels généreux, intégration native aux workflows OnlyIdeas.",
      feature1_title: "Boucle WebSocket",
      feature1_body:
        "`/ws/stream` diffuse énergie, statut silence/parole et angles avec < 80 ms; basculez l’enregistrement via REST ou WS.",
      feature2_title: "Adaptateurs matériels",
      feature2_body:
        "Capture ALSA `sounddevice`, trames CH9102, mode simulateur pour développer sans matériel.",
      feature3_title: "API taillée pour les robots",
      feature3_body:
        "Reliez ROS, OnlyIdeas ou des triggers caméra pour pousser les événements angle vers MQTT, bases ou ML edge.",
      feature4_title: "Installez, surveillez",
      feature4_body:
        "La PWA apporte cache offline, splash dédié et icônes d’accueil.",
      stack_title: "Stack technique",
      stack_item1:
        "<strong>Backend Tornado</strong> — Diffusion REST/WebSocket, archivage WAV, API statut.",
      stack_item2:
        "<strong>Adaptateurs audio</strong> — Blocs PCM16 ALSA/simulateur stockés dans <code>recordings/</code>.",
      stack_item3:
        "<strong>Lecteur de direction</strong> — Reproduit le protocole 0xA5 pour diffuser l’angle.",
      stack_item4:
        "<strong>PWA front-end</strong> — waveforms néon, boussole, prompts d’installation, service worker.",
      stack_item5:
        "<strong>Docs</strong> — Guides architecture + SDK pour Linux/Raspberry Pi.",
      stack_highlight_title: "Prêt pour robot.lazying.art",
      stack_highlight_body:
        "Publiez `docs/` via GitHub Pages ou un CDN, pointez `robot.lazying.art` dessus, puis proxiez `/` vers Tornado.",
      timeline_step1:
        "<span>1</span> Sélectionnez <code>/docs</code> comme source Pages.",
      timeline_step2:
        "<span>2</span> Ajoutez <code>CNAME</code> = <code>robot.lazying.art</code>.",
      timeline_step3:
        "<span>3</span> Proxy <code>https://robot.lazying.art/app</code> vers votre backend.",
      gallery_title: "Un cockpit d’exploitation apaisé.",
      gallery_card1_title: "Waveform",
      gallery_card1_body: "Barres néon avec badge SILENCE/SPEAKING et latence.",
      gallery_card2_title: "Boussole",
      gallery_card2_body: "Flèche animée pour visualiser le faisceau.",
      gallery_card3_title: "Étagère d’enregistrements",
      gallery_card3_body: "Démarrer/arrêter en un clic et récupérer le WAV associé.",
      cta_eyebrow: "Only Ideas · Moins d’effort",
      cta_title: "Déployez IdeasRobot, respirez.",
      cta_body:
        "Du Raspberry Pi jusqu’aux flottes domestiques, IdeasRobot garde la couche sensorielle élégante. Forkez, remixez ou soutenez le projet.",
      cta_btn_primary: "Cloner sur GitHub",
      cta_btn_secondary: "Soutenir",
      footer_text: "© <span id=\"year\"></span> IdeasRobot · L’art du laziness",
      footer_link_github: "GitHub",
      footer_link_site: "Lazying.art",
      footer_link_donate: "Donner",
    },
  },
  ar: {
    label: "العربية",
    langCode: "ar",
    dir: "rtl",
    strings: {
      logo_tagline: "فن الـ Lazying · OnlyIdeas",
      nav_features: "الميزات",
      nav_stack: "المكدس",
      nav_launch: "تشغيل",
      nav_github: "GitHub",
      hero_eyebrow: "robot.lazying.art",
      hero_title: "استمع وشاهد ووجّه مصفوفة الميكروفونات أينما كنت.",
      hero_body:
        "IdeasRobot يجمع خادم Tornado مع PWA قابلة للتثبيت لعرض الموجات الزاهية وزوايا الاستيقاظ والتسجيلات من جهاز Wheeltec M2 — لأصحاب الأتمتة الذين يريدون وضوحاً بلا تعقيد.",
      hero_btn_primary: "فتح لوحة التحكم",
      hero_btn_secondary: "عرض المصدر",
      hero_meta1_title: "72 شريطاً",
      hero_meta1_desc: "شبكة موجية مستوحاة من IdeasGlass",
      hero_meta2_title: "تطبيق PWA",
      hero_meta2_desc: "يُثبت على Android / iOS / سطح المكتب",
      hero_meta3_title: "جاهز للحافة",
      hero_meta3_desc: "دعم ALSA وتحليل UART لـ Raspberry Pi",
      hero_device_label: "زاوية التنبيه",
      hero_device_state: "يتحدث",
      features_eyebrow: "لماذا IdeasRobot",
      features_title: "قمرة حسيّة هادئة بلا إرهاق.",
      features_desc:
        "إعداد بسيط، رسومات غنيّة، تكامل مباشر مع مهام OnlyIdeas.",
      feature1_title: "حلقة تحكم WebSocket",
      feature1_body:
        "`/ws/stream` يرسل الطاقة والحالة بمهلة أقل من 80 مللي ثانية، ويمكن تبديل التسجيل عبر REST أو WebSocket.",
      feature2_title: "تكامل مع العتاد",
      feature2_body:
        "التقاط صوت ALSA، تحليل إطارات CH9102، ووضع محاكاة للعمل بدون جهاز.",
      feature3_title: "واجهة برمجية صديقة للروبوتات",
      feature3_body:
        "اربط ROS أو OnlyIdeas أو مشغلات الكاميرا لدفع أحداث الزاوية إلى MQTT أو قواعد البيانات أو ML الطرفي.",
      feature4_title: "تثبيت واحد، مراقبة دائمة",
      feature4_body:
        "PWA يوفر ذاكرة مؤقتة وأيقونات شاشة رئيسية لتصبح هاتفك شاشة مراقبة.",
      stack_title: "نظرة على المكدس",
      stack_item1:
        "<strong>خادم Tornado</strong> — بث REST/WebSocket، أرشفة WAV، واجهات حالة.",
      stack_item2:
        "<strong>محولات الصوت</strong> — كتل PCM16 من ALSA/المحاكي تُحفظ داخل <code>recordings/</code>.",
      stack_item3:
        "<strong>قارئ الاتجاه</strong> — يطابق بروتوكول 0xA5 لبث زاوية الاستيقاظ.",
      stack_item4:
        "<strong>واجهات PWA</strong> — موجات نيّون، بوصلة، تنبيهات تثبيت، Service Worker.",
      stack_item5:
        "<strong>مراجع</strong> — توثيق المعمارية ودفتر ملاحظات SDK لـ Linux/Raspberry Pi.",
      stack_highlight_title: "جاهز لـ robot.lazying.art",
      stack_highlight_body:
        "انشر مجلد `docs/` عبر GitHub Pages أو CDN خاص، اربط النطاق `robot.lazying.art` ثم وجّه `/` إلى خادم Tornado المباشر.",
      timeline_step1:
        "<span>1</span> اختر مجلد <code>/docs</code> كمصدر GitHub Pages.",
      timeline_step2:
        "<span>2</span> أضف ملف <code>CNAME</code> بقيمة <code>robot.lazying.art</code>.",
      timeline_step3:
        "<span>3</span> وجّه <code>https://robot.lazying.art/app</code> نحو خادم Tornado.",
      gallery_title: "قمرة تشغيل روبوتات هادئة.",
      gallery_card1_title: "Waveform",
      gallery_card1_body: "أعمدة نيّون مع شارة الصمت/الكلام وزمن الاستجابة.",
      gallery_card2_title: "بوصلة الاتجاه",
      gallery_card2_body: "سهم متحرك يتبع الزاوية — مثالي لعرض تحكم الحزم.",
      gallery_card3_title: "رف التسجيل",
      gallery_card3_body: "بدء/إيقاف بنقرة واحدة مع ملفات WAV جاهزة للتنزيل.",
      cta_eyebrow: "Only Ideas · عمل أقل",
      cta_title: "انشر IdeasRobot واسترح.",
      cta_body:
        "سواء كان Raspberry Pi في ورشة أو أسطولاً منزلياً، يحافظ IdeasRobot على طبقة الاستشعار أنيقة. انسخه، طوّره أو ادعمه.",
      cta_btn_primary: "استنساخ من GitHub",
      cta_btn_secondary: "تبرع",
      footer_text: "© <span id=\"year\"></span> IdeasRobot · فن الـ Lazying",
      footer_link_github: "GitHub",
      footer_link_site: "Lazying.art",
      footer_link_donate: "تبرع",
    },
  },
};

const defaultLang = "en";

function mapNavigatorLang(lang) {
  if (!lang) return defaultLang;
  const normalized = lang.toLowerCase();
  if (normalized.startsWith("zh-cn") || normalized === "zh-hans") return "zh-Hans";
  if (normalized.startsWith("zh-tw") || normalized === "zh-hant") return "zh-Hant";
  if (normalized.startsWith("ja")) return "ja";
  if (normalized.startsWith("ko")) return "ko";
  if (normalized.startsWith("vi")) return "vi";
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("fr")) return "fr";
  if (normalized.startsWith("ar")) return "ar";
  return "en";
}

function detectLanguage() {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  if (stored && translations[stored]) {
    return stored;
  }
  const browser = mapNavigatorLang(navigator.language || navigator.userLanguage);
  return translations[browser] ? browser : defaultLang;
}

let currentLang = detectLanguage();

function applyTranslations() {
  const data = translations[currentLang] || translations[defaultLang];
  const strings = data.strings;
  document.documentElement.lang = data.langCode || currentLang;
  document.documentElement.dir = data.dir || "ltr";
  document.body.classList.toggle("rtl", data.dir === "rtl");
  if (langButton) {
    langButton.textContent = `${data.label} ▾`;
  }
  if (langMenu) {
    langMenu.querySelectorAll("li").forEach((item) => {
      item.classList.toggle("active", item.dataset.lang === currentLang);
    });
  }
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (strings[key] !== undefined) {
      el.textContent = strings[key];
    }
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (strings[key] !== undefined) {
      el.innerHTML = strings[key];
    }
  });
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem(LANGUAGE_KEY, lang);
  applyTranslations();
}

function closeMenu() {
  if (!langSwitcher) return;
  langSwitcher.classList.remove("open");
  langButton?.setAttribute("aria-expanded", "false");
}

langButton?.addEventListener("click", () => {
  if (!langSwitcher) return;
  const isOpen = langSwitcher.classList.toggle("open");
  langButton.setAttribute("aria-expanded", String(isOpen));
});

langMenu?.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", () => {
    setLanguage(item.dataset.lang);
    closeMenu();
  });
});

document.addEventListener("click", (event) => {
  if (!langSwitcher || !langButton) return;
  if (langSwitcher.contains(event.target)) return;
  closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

applyTranslations();

function initWaveBars() {
  if (!wavePreview) return;
  wavePreview.innerHTML = "";
  for (let i = 0; i < 36; i += 1) {
    const bar = document.createElement("span");
    bar.style.height = `${Math.random() * 100}%`;
    wavePreview.appendChild(bar);
  }
}

function animateWaveform() {
  const bars = wavePreview?.children || [];
  Array.from(bars).forEach((bar, idx) => {
    const amplitude = Math.abs(Math.sin(Date.now() / 400 + idx));
    bar.style.height = `${10 + amplitude * 90}%`;
  });
  requestAnimationFrame(animateWaveform);
}

function animateAngle() {
  const angle = Math.floor(Math.random() * 360);
  if (angleEl) angleEl.textContent = `${angle}°`;
  if (needle) needle.style.transform = `rotate(${angle}deg)`;
}

setInterval(animateAngle, 3600);

initWaveBars();
requestAnimationFrame(animateWaveform);

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
