// Kombucha Go v1.0 — popup.js
// Compatible con Firefox y Chrome mediante compat.js (api.*)

let settings  = { durationMinutes: 30, icon: 'kombucha' };
let isRunning = false;

const dot       = document.getElementById('dot');
const stateName = document.getElementById('stateName');
const stateSub  = document.getElementById('stateSub');
const tRemain   = document.getElementById('tRemain');
const tEnd      = document.getElementById('tEnd');
const wlBadge   = document.getElementById('wlBadge');
const btnMain   = document.getElementById('btnMain');
const durSlider = document.getElementById('durSlider');
const durLabel  = document.getElementById('durLabel');

// ── Escala logarítmica del slider ─────────────────────────────────────────────
// slider 0–99  → 1 min … 43.800 min (30 días)
// slider 100   → ∞ (sin límite)
const SLIDER_MAX   = 100;
const MINUTES_MIN  = 1;
const MINUTES_MAX  = 43800; // 30 días como techo práctico

function sliderToMinutes(pos) {
  if (parseInt(pos) >= SLIDER_MAX) return Infinity;
  const t = pos / (SLIDER_MAX - 1);
  return Math.round(MINUTES_MIN * Math.pow(MINUTES_MAX / MINUTES_MIN, t));
}

function minutesToSlider(min) {
  if (!isFinite(min)) return SLIDER_MAX;
  const clamped = Math.max(MINUTES_MIN, Math.min(MINUTES_MAX, min));
  const t = Math.log(clamped / MINUTES_MIN) / Math.log(MINUTES_MAX / MINUTES_MIN);
  return Math.round(t * (SLIDER_MAX - 1));
}

function formatMinutes(min) {
  if (!isFinite(min)) return '∞  Sin límite';
  if (min < 60)   return `${min} min`;
  if (min < 1440) {
    const h = min / 60;
    return Number.isInteger(h) ? `${h} h` : `${(h).toFixed(1)} h`;
  }
  const d = min / 1440;
  return Number.isInteger(d) ? `${d} día${d > 1 ? 's' : ''}` : `${(d).toFixed(1)} días`;
}

function updateSliderLabel(pos) {
  const min = sliderToMinutes(pos);
  durLabel.textContent = formatMinutes(min);
}

durSlider.addEventListener('input', () => {
  updateSliderLabel(durSlider.value);
});

durSlider.addEventListener('change', () => {
  const min = sliderToMinutes(durSlider.value);
  settings.durationMinutes = isFinite(min) ? min : 0; // 0 = infinito internamente
  saveSettings();
});

// ── Iconos ────────────────────────────────────────────────────────────────────
const iconGrid = document.getElementById('iconGrid');
Object.entries(ICONS).forEach(([key, def]) => {
  const btn = document.createElement('button');
  btn.className   = 'icon-opt';
  btn.dataset.key = key;
  btn.title       = def.label;
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(def.svg, 'image/svg+xml');
  const svgEl  = svgDoc.documentElement;
  svgEl.setAttribute('width', '16');
  svgEl.setAttribute('height', '16');
  btn.appendChild(document.adoptNode(svgEl));
  const span = document.createElement('span');
  span.textContent = def.label;
  btn.appendChild(span);
  iconGrid.appendChild(btn);
});

iconGrid.addEventListener('click', e => {
  const btn = e.target.closest('.icon-opt');
  if (!btn) return;
  settings.icon = btn.dataset.key;
  setActiveIcon(settings.icon);
  saveSettings();
});

function setActiveIcon(key) {
  iconGrid.querySelectorAll('.icon-opt').forEach(b => {
    b.classList.toggle('on', b.dataset.key === key);
  });
}

// ── Utilidades ────────────────────────────────────────────────────────────────
function fmt(s) {
  if (!s || s <= 0) return '∞';
  if (s >= 86400) {
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600);
    return `${d}d ${String(h).padStart(2,'0')}h`;
  }
  if (s >= 3600) {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

function endTime(s) {
  if (!s || s <= 0) return '∞';
  return new Date(Date.now() + s * 1000)
    .toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

// ── Render ────────────────────────────────────────────────────────────────────
function render(data) {
  if (!data) return;
  isRunning = data.running;
  if (data.settings) settings = { ...settings, ...data.settings };

  dot.classList.toggle('on', isRunning);
  stateName.textContent = isRunning ? 'Activo' : 'Inactivo';

  const infinite = !settings.durationMinutes || settings.durationMinutes <= 0;

  if (isRunning) {
    stateSub.textContent = infinite
      ? 'sin límite de tiempo'
      : `hasta las ${endTime(data.remainingSeconds)}`;
    tRemain.textContent  = infinite ? '∞' : fmt(data.remainingSeconds);
    tEnd.textContent     = infinite ? '∞' : endTime(data.remainingSeconds);
    tRemain.className    = 'tval';
    tEnd.className       = 'tval';
    btnMain.textContent  = '⏹ Detener';
    btnMain.className    = 'btn-main stop';
    wlBadge.className    = 'wl-badge on';
    wlBadge.textContent  = '🛡 Suspensión bloqueada — sistema y pantalla activos';
  } else {
    stateSub.textContent = 'Listo para iniciar';
    tRemain.textContent  = '--:--';
    tEnd.textContent     = '--:--';
    tRemain.className    = 'tval off';
    tEnd.className       = 'tval off';
    btnMain.textContent  = '▶ Iniciar';
    btnMain.className    = 'btn-main start';
    wlBadge.className    = 'wl-badge';
    wlBadge.textContent  = '🔒 Suspensión del sistema habilitada';
  }

  const sliderPos = minutesToSlider(infinite ? Infinity : settings.durationMinutes);
  durSlider.value = sliderPos;
  updateSliderLabel(sliderPos);

  setActiveIcon(settings.icon || 'kombucha');
}

function refresh() {
  api.runtime.sendMessage({ type: 'GET_STATUS' }).then(render).catch(() => {});
}

api.runtime.onMessage.addListener(msg => {
  if (msg.type === 'STATUS_UPDATE') render(msg);
});

btnMain.addEventListener('click', () => {
  api.runtime.sendMessage({
    type: isRunning ? 'STOP' : 'START',
    settings: { ...settings }
  }).then(() => refresh()).catch(() => refresh());
});

function saveSettings() {
  api.runtime.sendMessage({ type: 'SAVE_SETTINGS', settings: { ...settings } }).catch(() => {});
}

refresh();
