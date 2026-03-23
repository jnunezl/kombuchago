// icons.js — 10 iconos SVG en blanco para la ventana de Wake Lock

const ICONS = {
  kombucha: {
    label: 'Kombucha',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
      <!-- Tapón -->
      <rect x="8.5" y="1.5" width="7" height="2.5" rx="1.2" fill="none" stroke="white" stroke-width="1.7"/>
      <!-- Cuello del tarro -->
      <path d="M9 4 H15 V6.2" fill="none" stroke="white" stroke-width="1.7" stroke-linecap="round"/>
      <!-- Cuerpo del tarro (con hombros redondeados y base plana) -->
      <path d="M9 6.2 Q6 7.2 6 9.5 V19.5 Q6 22 12 22 Q18 22 18 19.5 V9.5 Q18 7.2 15 6.2 Z" fill="none" stroke="white" stroke-width="1.7" stroke-linejoin="round"/>
      <!-- Línea de nivel de líquido -->
      <line x1="6.8" y1="15" x2="17.2" y2="15" stroke="white" stroke-width="1" stroke-dasharray="1.8,1.2" opacity="0.55"/>
      <!-- Burbujas flotando -->
      <circle cx="10" cy="18.2" r="1.05" fill="white"/>
      <circle cx="14.2" cy="17" r="0.85" fill="white"/>
      <circle cx="11.5" cy="11.5" r="0.85" fill="white"/>
      <circle cx="13.5" cy="13.5" r="0.65" fill="white"/>
    </svg>`
  },
  bolt: {
    label: 'Rayo',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18" height="18">
      <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"/>
    </svg>`
  },
  file: {
    label: 'Fichero',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>`
  },
  gear: {
    label: 'Engranaje',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>`
  },
  music: {
    label: 'Música',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
      <circle cx="9" cy="18" r="3"/>
      <circle cx="21" cy="16" r="3"/>
      <polyline points="9 18 9 5 21 3 21 16"/>
      <line x1="9" y1="9" x2="21" y2="7"/>
    </svg>`
  },
  coffee: {
    label: 'Café',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/>
      <line x1="10" y1="1" x2="10" y2="4"/>
      <line x1="14" y1="1" x2="14" y2="4"/>
    </svg>`
  },
  clock: {
    label: 'Reloj',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>`
  },
  star: {
    label: 'Estrella',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18" height="18">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>`
  },
  shield: {
    label: 'Escudo',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>`
  },
  eye: {
    label: 'Ojo',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>`
  }
};

// Exportar para uso en wakelock.html y popup.html
if (typeof module !== 'undefined') module.exports = ICONS;
