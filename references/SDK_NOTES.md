# Wheeltec M2 Linux SDK Deep Notes

This document dissects the vendor SDK bundles shipped inside `M2系列麦克风语音阵列客户资料V5.1_20231128/3.Linux_SDK与使用教程/`. Use it when you need to rebuild the C samples, port them to Raspberry Pi, or drive the hardware directly from Python.

## 1. SDK Variants

| Folder | Description | Key difference |
| --- | --- | --- |
| `1.原始SDK（固定音频识别）/M2_SDK/offline_mic` | “Record first, then recognize” flow. Records a fixed-length PCM file then performs offline ASR. | Simpler pipeline but poor UX because recognition waits for capture to finish. |
| `2.改进版SDK（边录边识别）/M2_SDK/offline_mic_vad` | Adds VAD-driven, streaming recognition with the same binaries plus `msc/res/asr` resources. | Better interaction: data is pushed chunk-by-chunk and VAD auto-stops recording. |

Both SDKs include:

- `audio/`: sample PCM clips.
- `bin/`: compiled demos + `msc` runtime (config + grammars).
- `doc/`: PDF manuals + `readme.txt`.
- `include/`: headers (`qisr.h`, `msp_cmn.h`, `speech_recognizer.h`, etc.).
- `libs/`: prebuilt `libmsc.so` and helper libs for `x86`, `x64`, and `arm64`.
- `samples/`: demo applications (`record_sample`, `asr_offline_record_sample`, streaming VAD samples).
- `scripts/ch9102_udev.sh`: udev rule for exposing the mic array as `/dev/wheeltec_mic`.

## 2. Dependency Checklist (Ubuntu / Raspberry Pi)

```bash
sudo apt update
sudo apt install build-essential cmake libasound2-dev libpthread-stubs0-dev \
                 libssl-dev python3-pip python3-venv alsa-utils
```

For Raspberry Pi OS 64-bit (recommended), install the ARM64 rootfs and kernel headers before compiling.

### Serial alias

Run the vendor udev helper as root so the USB bridge (CH9102/CH343) gets the friendly name:

```bash
cd .../offline_mic/scripts
sudo bash ch9102_udev.sh
# unplug / replug the mic array; confirm:
ls -l /dev/wheeltec_mic
```

The rule binds vendor `0x1a86` / product `0x55d4` and adds the device to the `dialout` group. Ensure your user belongs to `dialout` (`sudo usermod -aG dialout $USER`).

## 3. Building the Original SDK Demo (x86_64 Linux)

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX64=1
```

Outputs land in `../../bin/asr_offline_record_sample`. Required runtime files:

- `bin/msc/msc.cfg`
- `bin/msc/res/asr/*` (offline grammar)
- `bin/msc/call.bnf`
- `bin/msc/wav/*.pcm` (sample prompts)

Run:

```bash
cd ../../bin
export LD_LIBRARY_PATH=../libs/x64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

You’ll see prompts such as “待唤醒，请用唤醒词进行唤醒！” followed by recognition output.

## 4. Building on Raspberry Pi

The bundle ships `libs/arm64/libmsc.so`. On Raspberry Pi 4/5 (64-bit OS):

```bash
cd .../offline_mic/samples/asr_offline_record_sample
make clean
make LINUX_ARM64=1
cd ../../bin
export LD_LIBRARY_PATH=../libs/arm64:$LD_LIBRARY_PATH
./asr_offline_record_sample
```

For 32-bit Pi OS you would need an `armhf` build of `libmsc.so` (not provided). Use the VAD version similarly:

```bash
cd .../offline_mic_vad/samples/asr_record_sample
make clean
make LINUX_ARM64=1
```

**ALSA setup tips**

- Confirm the card index: `arecord -l`.
- Set the hardware node via `.asoundrc` or pass `--device hw:1,0` when testing with `arecord`.
- Some HATs require enabling `dtoverlay=dwc2,dr_mode=host` in `/boot/config.txt` for USB OTG.

## 5. Understanding the Sample Code

Key files under `samples/asr_offline_record_sample/`:

- `main.c`: orchestrates UART wake-word handling (`com_wakeup` thread) and recognition loop.
- `com_test.c`: parses binary frames from `/dev/wheeltec_mic`, validating `0xA5` headers, verifying checksums, and decoding JSON payloads to extract `ivw.angle`.
- `record.c` / `record.h`: ALSA capture logic (block-based PCM fetching).
- `speech_recognizer.c` / `linuxrec.c`: wrappers around the iFlytek MSC APIs (`MSPLogin`, `QISRSessionBegin`, `QISRAudioWrite`, `QISRGetResult`, etc.) defined in the `include/` headers.

Thread diagram:

```
com_wakeup (UART) ──► sets global angle + wake flags
      │
      ▼
main loop ──► triggers sr_start_listening()/sr_stop_listening()
      │
      ▼
speech_recognizer ──► feeds pcm buffers into libmsc (libmsc.so)
```

The improved VAD sample (`offline_mic_vad/samples/asr_record_sample`) uses `speech_recognizer.c` but streams audio via callbacks triggered by VAD events rather than waiting for a full recording.

## 6. Python Integration Strategies

### 6.1 Serial wake-angle feed (`pyserial`)

The binary protocol is simple: 0xA5 header, 0x01 user ID, command 0x04, payload length, message ID, JSON blob, checksum. Translating `com_test.c` into Python:

```python
import json, serial, struct, time

def open_uart(port="/dev/wheeltec_mic", baud=115200):
    return serial.Serial(port, baudrate=baud, timeout=0.1)

def frames(port="/dev/wheeltec_mic"):
    ser = open_uart(port)
    buf = bytearray()
    expected = None
    while True:
        chunk = ser.read(1)
        if not chunk:
            continue
        buf += chunk
        # align to header
        while buf and buf[0] != 0xA5:
            buf.pop(0)
            expected = None
        if len(buf) >= 2 and buf[1] != 0x01:
            buf.pop(0)
            expected = None
        if expected is None and len(buf) >= 7:
            payload_len = (buf[4] << 8) | buf[3]
            expected = payload_len + 8
        if expected and len(buf) >= expected:
            frame = bytes(buf[:expected])
            buf = buf[expected:]
            expected = None
            if checksum_ok(frame):
                yield frame

def checksum_ok(frame):
    calc = (~(sum(frame[:-1]) & 0xFF) + 1) & 0xFF
    return calc == frame[-1]

def decode_angle(frame):
    if frame[2] != 0x04:
        return None
    payload = frame[7:-1].decode()
    content = json.loads(payload)
    info = json.loads(content["content"]["info"])
    ivw = info["ivw"]
    return ivw["angle"], bool(ivw.get("ws", 1))

for frame in frames():
    angle = decode_angle(frame)
    if angle:
        print("wake from", angle)
```

### 6.2 Driving libmsc from Python (`ctypes`)

You can wrap `libmsc.so` by loading the headers as references:

```python
import ctypes, ctypes.util

libmsc = ctypes.cdll.LoadLibrary("/path/to/libs/x64/libmsc.so")

MSPLogin = libmsc.MSPLogin
MSPLogin.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_char_p]
MSPLogin.restype = ctypes.c_int

ret = MSPLogin(b"appid=xxxx", None, None)
if ret != 0:
    raise RuntimeError(f"MSPLogin failed: {ret}")
```

From there, follow the flow in `speech_recognizer.c`: call `QISRSessionBegin`, repeatedly invoke `QISRAudioWrite` with PCM16 buffers (16000 Hz, mono, little-endian), poll `QISRGetResult`, and close with `QISRSessionEnd`. For easier reuse:

1. Build `offline_mic/samples/asr_offline_record_sample/src` via CMake to produce `liboffline_record_lib.so`.
2. Load that `liboffline_record_lib.so` with `ctypes` and call exported helper functions rather than binding the raw MSC APIs yourself.

### 6.3 Using the C demo as a subprocess

If you just need ASR text, run the demo from Python and parse stdout:

```python
import subprocess, json

proc = subprocess.Popen(
    ["./asr_offline_record_sample"],
    cwd=".../offline_mic/bin",
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
)
for line in proc.stdout:
    print(line.rstrip())
```

The C sample prints recognized keywords and confidence values after each wake cycle; you can regex those lines and feed them into your higher-level robot logic.

## 7. Troubleshooting

- **`libmsc.so: cannot open shared object file`** – set `LD_LIBRARY_PATH` to the correct `libs/<arch>` directory or copy the `.so` into `/usr/local/lib` and run `sudo ldconfig`.
- **`ALSA lib pcm_hw.c: cannot open`** – confirm the card index and ensure no other process (e.g., PulseAudio) is locking the device. On Raspberry Pi, disable built-in audio in `/boot/config.txt` if you are using the mic array as the primary capture device.
- **UART frames stop arriving** – run `sudo dmesg | grep ttyCH` to ensure the USB bridge is detected; re-run `ch9102_udev.sh` after kernel updates.
- **VAD version fails to link** – improved SDK expects the updated `libmsc.so` from `offline_mic_vad/libs`; replace the older one or export `LD_LIBRARY_PATH` accordingly.

## 8. How This Ties into IdeasRobot

IdeasRobot’s Tornado backend re-implements the key behavior from the vendor samples:

- Serial parser mirrors `com_test.c` to detect wake angles.
- Audio capture relies on ALSA (via `sounddevice`) to grab PCM buffers which are then streamed to the PWA waveform.
- The backend does **not** depend on `libmsc.so`; instead it treats recorded PCM as generic audio, so you can either pipe it into the vendor ASR, Whisper, or your own models.

Use this document whenever you need to drop down to the vendor SDK level—for example, when validating a new firmware version, debugging ALSA issues on Raspberry Pi, or binding the iFlytek MSC APIs from Python.
