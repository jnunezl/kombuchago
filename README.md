# 🍵 Kombucha Go

> Previene la suspensión del PC desde el navegador. Sin instalaciones, sin procesos externos, sin permisos invasivos.

[![Firefox](https://img.shields.io/badge/Firefox-109%2B-orange?logo=firefox-browser)](https://addons.mozilla.org/)
[![Chrome](https://img.shields.io/badge/Chrome-compatible-blue?logo=google-chrome)](https://chrome.google.com/webstore)
[![Manifest](https://img.shields.io/badge/Manifest-V2-lightgrey)](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)
[![Versión](https://img.shields.io/badge/versión-1.0.0-green)]()
[![Licencia](https://img.shields.io/badge/licencia-MIT-blue)]()

---

## ¿Qué hace?

Kombucha Go bloquea la suspensión del sistema y la pantalla usando la [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API), sin necesidad de instalar ningún programa externo.

- ▶ **Un clic** para activar. Otro para detener.
- ⏱ **Temporizador configurable**: desde 1 minuto hasta 30 días, o sin límite (∞).
- 🛡 Mientras está activo, el sistema no se duerme ni apaga la pantalla.
- 🔋 Se detiene automáticamente al acabar el tiempo o al cerrar el navegador.
- 🎨 Elige el icono que aparece en la ventana de Wake Lock (kombucha, café, té...).

---

## Capturas

> *(Añade aquí imágenes del popup activo/inactivo)*

---

## Instalación

### Firefox

1. Descarga el [último release](../../releases/latest) (`.zip`)
2. Ve a `about:debugging` → *Este Firefox* → **Cargar complemento temporal**
3. Selecciona el archivo `.zip`

O instálalo desde [Firefox Add-ons (AMO)](https://addons.mozilla.org/) *(próximamente)*.

### Chrome / Edge

> ⚠️ Chrome está deprecando Manifest V2. Mientras se prepara la versión V3, puedes instalarlo en modo desarrollador:

1. Descarga y descomprime el [último release](../../releases/latest)
2. Ve a `chrome://extensions/` → activa **Modo desarrollador**
3. Pulsa **"Cargar extensión descomprimida"** y selecciona la carpeta

---

## Cómo funciona

```
popup.html / popup.js        →  Interfaz de usuario (slider, botón, iconos)
background.js                →  Lógica principal: estado, temporizador, mensajes
wakelock.html / wakelock.js  →  Ventana emergente mínima que mantiene el Wake Lock activo
compat.js                    →  Shim de compatibilidad Firefox/Chrome (browser vs chrome.*)
```

### Flujo

1. El usuario pulsa **Iniciar** en el popup.
2. `background.js` abre una pequeña ventana emergente (`wakelock.html`) en segundo plano.
3. `wakelock.js` llama a `navigator.wakeLock.request('screen')`, bloqueando la suspensión.
4. Si el Wake Lock se libera (p. ej. al minimizar), se reactiva automáticamente.
5. Al terminar el tiempo o pulsar **Detener**, se cierra la ventana y se libera el bloqueo.

### Compatibilidad entre navegadores

`compat.js` actúa como shim: en **Firefox** reutiliza la API `browser.*` nativa (basada en Promises); en **Chrome** envuelve `chrome.*` con callbacks en Promises equivalentes. El resto del código usa siempre el objeto `api.*` unificado.

---

## Permisos

| Permiso | Motivo |
|---|---|
| `storage` | Guardar la configuración (duración e icono elegido) |
| `tabs` | Enviar mensajes a la ventana de Wake Lock |
| `windows` | Abrir y cerrar la ventana emergente de Wake Lock |

No se accede a ninguna página web, ni se recopila ningún dato.

---

## Estructura del proyecto

```
kombuchago/
├── manifest.json       # Configuración de la extensión
├── background.js       # Proceso en segundo plano (lógica y estado)
├── compat.js           # Shim Firefox/Chrome
├── popup.html          # Interfaz de usuario
├── popup.js            # Lógica del popup
├── wakelock.html       # Ventana de Wake Lock
├── wakelock.js         # Adquisición y mantenimiento del Wake Lock
└── icons/
    ├── icon48.png
    ├── icon48_active.png
    ├── icon96.png
    └── icon96_active.png
```

---

## Desarrollo

Clona el repositorio y carga la carpeta como extensión descomprimida (ver [Instalación](#instalación)):

```bash
git clone https://github.com/jnunezl/kombuchago.git
cd kombuchago
```

No hay dependencias ni paso de compilación. Edita los archivos y recarga la extensión desde `about:debugging` (Firefox) o `chrome://extensions/` (Chrome).

---

## Roadmap

- [ ] Migración a Manifest V3 (para Chrome Web Store)
- [ ] Publicación en Firefox Add-ons (AMO)
- [ ] Soporte i18n (inglés / español)
- [ ] Notificación al finalizar el temporizador

---

## Licencia

MIT © 2026 — consulta el archivo [LICENSE](LICENSE) para más detalles.
Mantiene una pestaña siempre activa y evita que el sistema entre en modo reposo
