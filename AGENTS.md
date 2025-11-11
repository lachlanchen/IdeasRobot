# Repository Guidelines

## Project Structure & Module Organization
Core assets live in `M2系列麦克风语音阵列客户资料V5.1_20231128`. Hardware briefs, firmware, and tooling stay under `1.麦克风阵列产品资料`, while platform SDKs sit in numbered siblings like `2.ROS_SDK与使用教程` and `3.Linux_SDK与使用教程`. Inside `3.Linux_SDK与使用教程/Linux_SDK`, both `1.原始SDK（固定音频识别）/M2_SDK/offline_mic` and `2.改进版SDK（边录边识别）/M2_SDK/offline_mic_vad` share the `audio/`, `bin/`, `doc/`, `include/`, `libs/`, `samples/`, `scripts/` pattern—add new modules by mirroring that structure and keep shared grammars under `bin/msc`.

## Build, Test, and Development Commands
Run sample builds from their folder so the Makefile picks the right include and lib paths:
- `cd .../samples/asr_offline_record_sample && make LINUX64=1` (swap the flag for x86/arm64 or call the `32bit_make.sh`/`64bit_make.sh` wrappers) to compile the fixed-clip recognizer into `../../bin/`.
- `cd samples/asr_offline_record_sample/src && cmake -S . -B build && cmake --build build` refreshes `offline_record_lib` when changing recorder internals.
- `scripts/ch9102_udev.sh` installs udev rules that expose `/dev/wheeltec_mic`; rerun after kernel or USB VID updates.

## Coding Style & Naming Conventions
C files follow four-space indents, K&R braces, and snake_case identifiers (`samples/asr_offline_record_sample/main.c`). Keep hardware globals in headers, prefix UART helpers with `com_`, and wrap multi-line documentation in the banner comment used across samples. Favor descriptive filenames such as `speech_recognizer.c` and `record_sample.c`. Format C/C++ changes with `clang-format -style="{IndentWidth: 4}"`; shell scripts must stay POSIX-compliant.

## Testing Guidelines
Automated tests are not available, so treat the `bin/` demos as regression checks. After every build, run `bin/record_sample` to confirm PCM capture saves into `audio/`, then run `bin/asr_offline_record_sample` (or the VAD counterpart) with logging enabled in `bin/msc/msc.cfg` to verify wake-word angles, confidence, and grammar updates. Archive terminal logs and any updated `*.bnf` files with your review.

## Commit & Pull Request Guidelines
Use imperative, Conventional-Commit summaries (`feat: refine vad wake pipeline`) that mention the SDK variant touched. The body should list the hardware, OS, compiler triple, and commands executed. Reference linked tickets or customer requests, note whether binaries or docs moved, and state if device flashing is required. Pull requests must include reproduction steps, log excerpts for ASR accuracy changes, and screenshots when GUI or CAD assets change.

## Hardware & Configuration Tips
Record new USB IDs or baud-rate tweaks inside `scripts/ch9102_udev.sh` and `doc/readme.txt`. Do not hard-code APPID/APIKey inside source; load them through environment variables consumed by `msc.cfg`. When adding binaries or grammars, update `资料更新记录.txt` and store proof audio under the matching `audio/` directory.
