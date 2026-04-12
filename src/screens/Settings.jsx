import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadProgress, updateProgress } from '../storage/progress.js';
import { ALL_THEMES } from '../themes/ThemeContext.jsx';

const FONT_OPTIONS = [
  { value: 'lexend', label: 'Lexend (Default)', css: "'Lexend', system-ui, -apple-system, 'Segoe UI', Verdana, Helvetica, Arial, sans-serif" },
  { value: 'opendyslexic', label: 'OpenDyslexic', css: "'OpenDyslexic', sans-serif" },
  { value: 'comic-sans', label: 'Comic Sans', css: "'Comic Sans MS', 'Comic Sans', cursive" },
  { value: 'system', label: 'System', css: "system-ui, -apple-system, 'Segoe UI', Verdana, Helvetica, Arial, sans-serif" },
];

const SIZE_OPTIONS = [
  { value: 'normal', label: 'Normal', css: '1.125rem' },
  { value: 'large', label: 'Large', css: '1.35rem' },
  { value: 'extra-large', label: 'Extra Large', css: '1.6rem' },
];

const SPACING_OPTIONS = [
  { value: 'normal', label: 'Normal', lineHeight: '1.6', letterSpacing: '0.01em' },
  { value: 'relaxed', label: 'Relaxed', lineHeight: '1.8', letterSpacing: '0.05em' },
  { value: 'very-relaxed', label: 'Very Relaxed', lineHeight: '2.0', letterSpacing: '0.1em' },
];

const BG_OPTIONS = [
  { value: '#FFFBF0', label: 'Warm Cream', swatch: '#FFFBF0' },
  { value: '#ffffff', label: 'White', swatch: '#ffffff' },
  { value: '#e8f4f8', label: 'Soft Blue', swatch: '#e8f4f8' },
  { value: '#e8f5e9', label: 'Soft Green', swatch: '#e8f5e9' },
];

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    const progress = loadProgress();
    const saved = progress.settings || {};
    // Migrate old defaults to new defaults
    if (!saved.fontFamily || saved.fontFamily === 'system') saved.fontFamily = 'lexend';
    if (!saved.bgColor || saved.bgColor === '#ffffff' || saved.bgColor === '#e8f4f8') saved.bgColor = '#FFFBF0';
    if (!saved.fontSize) saved.fontSize = 'normal';
    if (!saved.lineSpacing) saved.lineSpacing = 'normal';
    return saved;
  });

  // Apply settings to CSS custom properties in real time
  useEffect(() => {
    const root = document.documentElement;
    const font = FONT_OPTIONS.find((f) => f.value === settings.fontFamily);
    const size = SIZE_OPTIONS.find((s) => s.value === settings.fontSize);
    const spacing = SPACING_OPTIONS.find((s) => s.value === settings.lineSpacing);

    if (font) root.style.setProperty('--font-family', font.css);
    if (size) root.style.setProperty('--font-size', size.css);
    if (spacing) {
      root.style.setProperty('--line-height', spacing.lineHeight);
      root.style.setProperty('--letter-spacing', spacing.letterSpacing);
    }
    root.style.setProperty('--bg-color', settings.bgColor);
  }, [settings]);

  const update = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    updateProgress({ settings: next });
  };

  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/habitats"
          className="text-green-700 font-semibold min-h-[48px] min-w-[48px] flex items-center"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="w-12" />
      </div>

      {/* Theme */}
      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">Theme</h2>
        <div className="grid grid-cols-2 gap-3">
          {ALL_THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                update('theme', t.id);
                // Force re-render by navigating back to settings
                window.location.reload();
              }}
              className={`p-4 rounded-xl border-2 text-center transition-colors min-h-[48px] ${
                settings.theme === t.id || (!settings.theme && t.id === 'wildlife')
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{t.emoji}</div>
              <div className="font-semibold text-sm">{t.name}</div>
              <p className="text-xs text-gray-600 mt-1 leading-snug">{t.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Font */}
      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">Font</h2>
        <div className="space-y-2">
          {FONT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('fontFamily', opt.value)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors min-h-[48px] ${
                settings.fontFamily === opt.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ fontFamily: opt.css }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Text size */}
      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">Text Size</h2>
        <div className="flex gap-2">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('fontSize', opt.value)}
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-colors min-h-[48px] font-semibold ${
                settings.fontSize === opt.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Line spacing */}
      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">Spacing</h2>
        <div className="flex gap-2">
          {SPACING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('lineSpacing', opt.value)}
              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-colors min-h-[48px] font-semibold ${
                settings.lineSpacing === opt.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Background colour */}
      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">Background Colour</h2>
        <div className="flex gap-3">
          {BG_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('bgColor', opt.value)}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors min-h-[48px] ${
                settings.bgColor === opt.value
                  ? 'border-green-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="w-10 h-10 rounded-full border border-gray-300"
                style={{ backgroundColor: opt.swatch }}
              />
              <span className="text-xs">{opt.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Elizabeth helper */}
      <section className="mb-8">
        <h2 className="font-bold text-lg mb-3">Elizabeth Helper</h2>
        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-white/80 shadow-sm">
          <input
            type="checkbox"
            checked={settings.reduceHelpers || false}
            onChange={(e) => update('reduceHelpers', e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <div>
            <span className="font-semibold">Reduce helpers</span>
            <p className="text-xs text-gray-600 mt-0.5">Hide Elizabeth's pop-up tips and help button</p>
          </div>
        </label>
      </section>

      {/* Live Preview */}
      <section
        className="p-5 rounded-xl shadow-sm mb-8"
        style={{
          fontFamily: FONT_OPTIONS.find((f) => f.value === settings.fontFamily)?.css,
          fontSize: SIZE_OPTIONS.find((s) => s.value === settings.fontSize)?.css,
          lineHeight: SPACING_OPTIONS.find((s) => s.value === settings.lineSpacing)?.lineHeight,
          letterSpacing: SPACING_OPTIONS.find((s) => s.value === settings.lineSpacing)?.letterSpacing,
          backgroundColor: settings.bgColor,
        }}
      >
        <h2 className="font-bold text-lg mb-2">Live Preview</h2>
        <p>The quick brown fox jumps over the lazy dog.</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
          This is how text will look throughout the app with your chosen settings.
        </p>
      </section>
    </main>
  );
}
