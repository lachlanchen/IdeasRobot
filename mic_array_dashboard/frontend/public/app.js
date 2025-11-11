const state = {
  ws: null,
  reconnectTimer: null,
  lastDirectionTs: null,
  recording: false,
  waveformBars: 72,
  levels: [],
  pingTs: 0,
  wsPath: document.querySelector('meta[name="ws-path"]')?.content || "/ws/stream",
};

const elements = {
  recordBtn: document.getElementById("recordBtn"),
  recorderStatus: document.getElementById("recorderStatus"),
  waveform: document.getElementById("waveform"),
  waveformBars: document.getElementById("waveformBars"),
  statePill: document.getElementById("statePill"),
  levelReadout: document.getElementById("levelReadout"),
  lagReadout: document.getElementById("lagReadout"),
  compassArrow: document.getElementById("compassArrow"),
  directionDetails: document.getElementById("directionDetails"),
  recordingMeta: document.getElementById("recordingMeta"),
  downloadLink: document.getElementById("downloadLink"),
  installBtn: document.getElementById("installBtn"),
};

function init() {
  buildWaveform();
  attachEvents();
  connectWebSocket();
  refreshLatestRecording();
  registerServiceWorker();
}

function buildWaveform() {
  elements.waveformBars.innerHTML = "";
  for (let i = 0; i < state.waveformBars; i += 1) {
    const bar = document.createElement("div");
    bar.className = "waveform-bar";
    elements.waveformBars.appendChild(bar);
  }
}

function attachEvents() {
  elements.recordBtn.addEventListener("click", () => {
    if (state.recording) {
      stopRecording();
    } else {
      startRecording();
    }
  });
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (evt) => {
    evt.preventDefault();
    deferredPrompt = evt;
    elements.installBtn.hidden = false;
  });
  elements.installBtn?.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      elements.installBtn.hidden = true;
    }
    deferredPrompt = null;
  });
}

function connectWebSocket() {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const url = `${protocol}://${window.location.host}${state.wsPath}`;
  state.ws = new WebSocket(url);
  state.ws.onopen = () => {
    console.log("WebSocket connected");
    if (state.reconnectTimer) {
      clearTimeout(state.reconnectTimer);
      state.reconnectTimer = null;
    }
    elements.lagReadout.textContent = "Link: live";
    state.pingTs = performance.now();
    state.ws.send(JSON.stringify({ command: "ping" }));
  };
  state.ws.onmessage = (evt) => {
    try {
      const data = JSON.parse(evt.data);
      handleMessage(data);
    } catch (err) {
      console.warn("Invalid message", err);
    }
  };
  state.ws.onclose = () => {
    console.log("WebSocket closed, retrying…");
    elements.lagReadout.textContent = "Link: reconnecting…";
    state.reconnectTimer = setTimeout(connectWebSocket, 2000);
  };
}

function handleMessage(data) {
  switch (data.type) {
    case "hello":
      if (typeof data.waveform_bars === "number") {
        state.waveformBars = data.waveform_bars;
        buildWaveform();
      }
      break;
    case "waveform":
      updateWaveform(data);
      updateDirection(data.direction);
      break;
    case "direction":
      updateDirection(data.direction);
      break;
    case "pong":
      if (state.pingTs) {
        const lag = Math.round(performance.now() - state.pingTs);
        elements.lagReadout.textContent = `Link: +${lag} ms`;
      }
      setTimeout(() => {
        if (state.ws?.readyState === WebSocket.OPEN) {
          state.pingTs = performance.now();
          state.ws.send(JSON.stringify({ command: "ping" }));
        }
      }, 5000);
      break;
    case "recording_started":
      state.recording = true;
      setRecordingUI();
      elements.recorderStatus.textContent = "Recording…";
      break;
    case "recording_stopped":
      state.recording = false;
      setRecordingUI();
      elements.recorderStatus.textContent = "Device idle";
      refreshLatestRecording();
      break;
    default:
      break;
  }
}

function updateWaveform(payload) {
  if (!payload) return;
  const { waveform = [], level = 0, state: speakingState } = payload;
  const bars = elements.waveformBars.children;
  for (let i = 0; i < bars.length; i += 1) {
    const bar = bars[i];
    const value = waveform[i] ?? 0;
    bar.style.transform = `scaleY(${Math.max(0.02, value)})`;
  }
  elements.waveform.classList.toggle("speaking", speakingState === "speaking");
  elements.statePill.textContent = speakingState === "speaking" ? "SPEAKING" : "SILENCE";
  elements.levelReadout.textContent = `Level: ${(level * 100).toFixed(0)}%`;
}

function updateDirection(direction) {
  if (!direction) {
    elements.directionDetails.textContent = "Waiting for wake-word…";
    return;
  }
  state.lastDirectionTs = direction.timestamp;
  elements.compassArrow.style.transform = `translateX(-50%) rotate(${direction.angle}deg)`;
  const mode = direction.awake ? "awake" : "sleeping";
  elements.directionDetails.textContent = `Angle: ${direction.angle}° • Device ${mode}`;
}

async function startRecording() {
  try {
    const res = await fetch("/api/recordings/start", { method: "POST" });
    if (!res.ok) throw new Error("Failed to start recording");
    const data = await res.json();
    state.recording = true;
    elements.recorderStatus.textContent = `Recording session ${data.session_id}`;
    setRecordingUI();
  } catch (err) {
    console.error(err);
    alert("Unable to start recording. Check server logs.");
  }
}

async function stopRecording() {
  try {
    const res = await fetch("/api/recordings/stop", { method: "POST" });
    if (!res.ok) throw new Error("Failed to stop recording");
    const data = await res.json();
    state.recording = false;
    elements.recorderStatus.textContent = `Stopped. Duration ${(data.duration_ms / 1000).toFixed(1)}s`;
    setRecordingUI();
    refreshLatestRecording();
  } catch (err) {
    console.error(err);
    alert("Unable to stop recording. Check server logs.");
  }
}

function setRecordingUI() {
  if (state.recording) {
    elements.recordBtn.textContent = "Stop Recording";
    elements.recordBtn.classList.add("danger");
  } else {
    elements.recordBtn.textContent = "Start Recording";
    elements.recordBtn.classList.remove("danger");
  }
}

async function refreshLatestRecording() {
  try {
    const res = await fetch("/api/recordings/latest");
    if (!res.ok) {
      elements.recordingMeta.textContent = "No recordings yet.";
      elements.downloadLink.hidden = true;
      return;
    }
    const data = await res.json();
    elements.recordingMeta.textContent = `Session ${data.session_id} – ${(data.duration_ms / 1000).toFixed(1)}s`;
    elements.downloadLink.href = `/api/recordings/${data.session_id}/audio`;
    elements.downloadLink.hidden = false;
  } catch (err) {
    console.warn(err);
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  try {
    await navigator.serviceWorker.register("/service-worker.js");
  } catch (err) {
    console.warn("SW registration failed", err);
  }
}

init();
