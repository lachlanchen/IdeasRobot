const angleEl = document.getElementById("angleValue");
const needle = document.querySelector(".needle");
const wavePreview = document.getElementById("wavePreview");
const yearEl = document.getElementById("year");

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
