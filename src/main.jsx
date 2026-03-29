import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { loadProgress } from './storage/progress.js';

// Apply saved accessibility settings on startup
const FONT_CSS = {
  system: "system-ui, -apple-system, 'Segoe UI', Verdana, Helvetica, Arial, sans-serif",
  opendyslexic: "'OpenDyslexic', sans-serif",
  'comic-sans': "'Comic Sans MS', 'Comic Sans', cursive",
};
const SIZE_CSS = { normal: '1.125rem', large: '1.35rem', 'extra-large': '1.6rem' };
const SPACING_CSS = {
  normal: { lineHeight: '1.6', letterSpacing: '0.01em' },
  relaxed: { lineHeight: '1.8', letterSpacing: '0.05em' },
  'very-relaxed': { lineHeight: '2.0', letterSpacing: '0.1em' },
};

try {
  const { settings } = loadProgress();
  if (settings) {
    const root = document.documentElement;
    if (FONT_CSS[settings.fontFamily]) root.style.setProperty('--font-family', FONT_CSS[settings.fontFamily]);
    if (SIZE_CSS[settings.fontSize]) root.style.setProperty('--font-size', SIZE_CSS[settings.fontSize]);
    if (SPACING_CSS[settings.lineSpacing]) {
      root.style.setProperty('--line-height', SPACING_CSS[settings.lineSpacing].lineHeight);
      root.style.setProperty('--letter-spacing', SPACING_CSS[settings.lineSpacing].letterSpacing);
    }
    if (settings.bgColor) root.style.setProperty('--bg-color', settings.bgColor);
  }
} catch {
  // Settings not available yet — defaults from CSS will apply
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
