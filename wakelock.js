// Kombucha Go v1.0 — wakelock.js
// Mantiene el Wake Lock activo y muestra el icono seleccionado.
// Compatible con Firefox y Chrome mediante compat.js (api.*)

let wakeLock = null;

function renderIcon(iconKey) {
  const key  = iconKey || 'kombucha';
  const icon = ICONS[key] || ICONS['kombucha'];
  document.getElementById('icon-container').innerHTML = icon.svg;
}

api.storage.local.get(['settings']).then(r => {
  renderIcon(r.settings && r.settings.icon ? r.settings.icon : 'kombucha');
}).catch(() => renderIcon('kombucha'));

api.runtime.onMessage.addListener(msg => {
  if (msg.type === 'SET_ICON')      renderIcon(msg.icon);
  if (msg.type === 'STOP_WAKELOCK') {
    if (wakeLock) { wakeLock.release(); wakeLock = null; }
  }
});

async function acquireWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    api.runtime.sendMessage({ type: 'WAKELOCK_ACQUIRED' }).catch(() => {});
    wakeLock.addEventListener('release', () => {
      api.runtime.sendMessage({ type: 'WAKELOCK_RELEASED' }).catch(() => {});
      setTimeout(acquireWakeLock, 200);
    });
  } catch (err) {
    api.runtime.sendMessage({ type: 'WAKELOCK_ERROR', msg: err.message }).catch(() => {});
    setTimeout(acquireWakeLock, 2000);
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && !wakeLock) acquireWakeLock();
});

acquireWakeLock();
