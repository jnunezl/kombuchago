// Kombucha Go v1.0 — background.js
// durationMinutes = 0  →  sin límite de tiempo (∞)
// Compatible con Firefox y Chrome mediante compat.js (api.*)

const DEFAULT = { durationMinutes: 30, icon: 'kombucha' };

let state = {
  running:          false,
  remainingSeconds: 0,    // 0 cuando es infinito
  countdownId:      null,
  wakeLockOk:       false,
  wakeLockWindowId: null,
  settings:         { ...DEFAULT }
};

api.storage.local.get(['settings']).then(r => {
  if (r.settings) state.settings = { ...DEFAULT, ...r.settings };
}).catch(() => {});

const WAKELOCK_URL = api.runtime.getURL('wakelock.html');

async function openWakeLockWindow() {
  if (state.wakeLockWindowId !== null) {
    try { await api.windows.get(state.wakeLockWindowId); return; }
    catch (_) { state.wakeLockWindowId = null; }
  }
  const win = await api.windows.create({
    url: WAKELOCK_URL, type: 'popup',
    width: 60, height: 60, left: 0, top: 0, focused: false
  });
  state.wakeLockWindowId = win.id;
}

async function closeWakeLockWindow() {
  if (state.wakeLockWindowId === null) return;
  try { await api.windows.remove(state.wakeLockWindowId); } catch (_) {}
  state.wakeLockWindowId = null;
}

api.windows.onRemoved.addListener(windowId => {
  if (windowId === state.wakeLockWindowId) {
    state.wakeLockWindowId = null;
    state.wakeLockOk = false;
    if (state.running) setTimeout(openWakeLockWindow, 500);
  }
});

async function sendToWakeLockWindow(msg) {
  if (state.wakeLockWindowId === null) return;
  try {
    const tabs = await api.tabs.query({ windowId: state.wakeLockWindowId });
    if (tabs[0]) await api.tabs.sendMessage(tabs[0].id, msg);
  } catch (_) {}
}

async function start(settings) {
  if (state.running) return;
  state.settings = { ...DEFAULT, ...settings };
  state.running  = true;

  const infinite = !state.settings.durationMinutes || state.settings.durationMinutes <= 0;
  state.remainingSeconds = infinite ? 0 : state.settings.durationMinutes * 60;

  await openWakeLockWindow();

  if (!infinite) {
    state.countdownId = setInterval(() => {
      state.remainingSeconds = Math.max(0, state.remainingSeconds - 1);
      broadcastStatus();
      if (state.remainingSeconds <= 0) stop();
    }, 1000);
  } else {
    state.countdownId = setInterval(broadcastStatus, 60000);
  }

  setIcon(true);
  broadcastStatus();
  api.storage.local.set({ settings: state.settings }).catch(() => {});
}

async function stop() {
  if (!state.running) return;
  clearInterval(state.countdownId);
  state.countdownId      = null;
  state.running          = false;
  state.wakeLockOk       = false;
  state.remainingSeconds = 0;
  await sendToWakeLockWindow({ type: 'STOP_WAKELOCK' });
  await closeWakeLockWindow();
  setIcon(false);
  broadcastStatus();
}

function setIcon(active) {
  api.browserAction.setIcon({
    path: {
      48: active ? 'icons/icon48_active.png' : 'icons/icon48.png',
      96: active ? 'icons/icon96_active.png' : 'icons/icon96.png'
    }
  }).catch(() => {});
  api.browserAction.setBadgeText({ text: active ? '▶' : '' }).catch(() => {});
  api.browserAction.setBadgeBackgroundColor({ color: '#2ed573' }).catch(() => {});
}

function broadcastStatus() {
  api.runtime.sendMessage({
    type: 'STATUS_UPDATE', running: state.running,
    remainingSeconds: state.remainingSeconds,
    wakeLockOk: state.wakeLockOk, settings: state.settings
  }).catch(() => {});
}

function getStatus() {
  return {
    running: state.running, remainingSeconds: state.remainingSeconds,
    wakeLockOk: state.wakeLockOk, settings: state.settings
  };
}

api.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case 'START':
      start(msg.settings).then(() => sendResponse(getStatus()));
      return true;
    case 'STOP':
      stop().then(() => sendResponse(getStatus()));
      return true;
    case 'GET_STATUS':
      sendResponse(getStatus());
      break;
    case 'SAVE_SETTINGS':
      state.settings = { ...DEFAULT, ...msg.settings };
      api.storage.local.set({ settings: state.settings }).catch(() => {});
      sendToWakeLockWindow({ type: 'SET_ICON', icon: state.settings.icon });
      sendResponse({ ok: true });
      break;
    case 'WAKELOCK_ACQUIRED':
      state.wakeLockOk = true; broadcastStatus(); break;
    case 'WAKELOCK_RELEASED':
      state.wakeLockOk = false; broadcastStatus(); break;
    case 'WAKELOCK_ERROR':
      state.wakeLockOk = false; broadcastStatus(); break;
  }
  return true;
});
