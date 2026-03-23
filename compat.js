// Kombucha Go v1.0 — compat.js
// Shim de compatibilidad entre navegadores.
// En Firefox, `browser` ya existe de forma nativa (Promise-based) → no-op.
// En Chrome, `browser` no existe → envuelve chrome.* en Promises.

const api = (() => {
  if (typeof browser !== 'undefined') return browser;

  // Convierte una función con callback al estilo chrome.* en una Promise
  function p(fn, ctx) {
    return function (...args) {
      return new Promise((resolve, reject) => {
        fn.call(ctx, ...args, function (result) {
          const err = chrome.runtime.lastError;
          if (err) reject(new Error(err.message));
          else resolve(result);
        });
      });
    };
  }

  // Chrome MV2: chrome.browserAction / Chrome MV3: chrome.action
  const actionAPI = chrome.action || chrome.browserAction;

  return {
    storage: {
      local: {
        get: p(chrome.storage.local.get, chrome.storage.local),
        set: p(chrome.storage.local.set, chrome.storage.local),
      }
    },
    runtime: {
      getURL: chrome.runtime.getURL.bind(chrome.runtime),
      // sendMessage: silencia el error "no listener" cuando el popup está cerrado
      sendMessage: function (...args) {
        return new Promise((resolve) => {
          chrome.runtime.sendMessage(...args, function (result) {
            void chrome.runtime.lastError; // consume el error para evitar warning
            resolve(result);
          });
        });
      },
      onMessage: chrome.runtime.onMessage,
    },
    windows: {
      create:    p(chrome.windows.create,  chrome.windows),
      remove:    p(chrome.windows.remove,  chrome.windows),
      get:       p(chrome.windows.get,     chrome.windows),
      onRemoved: chrome.windows.onRemoved,
    },
    tabs: {
      query:       p(chrome.tabs.query,       chrome.tabs),
      sendMessage: p(chrome.tabs.sendMessage, chrome.tabs),
    },
    browserAction: actionAPI ? {
      setIcon:                 p(actionAPI.setIcon,                 actionAPI),
      setBadgeText:            p(actionAPI.setBadgeText,            actionAPI),
      setBadgeBackgroundColor: p(actionAPI.setBadgeBackgroundColor, actionAPI),
    } : {},
  };
})();
