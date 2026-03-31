import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AvatarDisplay from './AvatarDisplay.jsx';
import {
  SKIN_TONES, EYE_STYLES, MOUTH_STYLES, HAIR_STYLES, HAIR_COLOURS,
  OUTFIT_BASE, UNLOCKABLE_OUTFITS, UNLOCKABLE_ACCESSORIES,
  DEFAULT_AVATAR, checkAccessoryUnlocked,
} from './avatarOptions.js';
import { loadProgress, updateProgress } from '../../storage/progress.js';

const TABS = [
  { id: 'skin', label: 'Skin', emoji: '🎨' },
  { id: 'eyes', label: 'Eyes', emoji: '👀' },
  { id: 'mouth', label: 'Mouth', emoji: '😊' },
  { id: 'hair', label: 'Hair', emoji: '💇' },
  { id: 'colour', label: 'Hair Colour', emoji: '🌈' },
  { id: 'outfit', label: 'Outfit', emoji: '👕' },
  { id: 'extras', label: 'Extras', emoji: '✨' },
];

export default function AvatarBuilder() {
  const navigate = useNavigate();
  const progress = loadProgress();
  const saved = progress.avatar || DEFAULT_AVATAR;

  const [avatar, setAvatar] = useState({ ...DEFAULT_AVATAR, ...saved });
  const [tab, setTab] = useState('skin');

  const update = (key, value) => {
    setAvatar((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAccessory = (id) => {
    setAvatar((prev) => {
      const has = prev.accessories.includes(id);
      return {
        ...prev,
        accessories: has
          ? prev.accessories.filter((a) => a !== id)
          : [...prev.accessories, id],
      };
    });
  };

  const randomise = () => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setAvatar({
      skinTone: pick(SKIN_TONES).id,
      eyes: pick(EYE_STYLES).id,
      mouth: pick(MOUTH_STYLES).id,
      hairStyle: pick(HAIR_STYLES).id,
      hairColour: pick(HAIR_COLOURS).id,
      outfit: avatar.outfit,
      accessories: avatar.accessories,
    });
  };

  const handleSave = () => {
    updateProgress({ avatar });
    navigate('/');
  };

  // Available outfits
  const unlockedHabitats = progress.unlockedAnimals || [];
  const allOutfits = [
    OUTFIT_BASE,
    ...UNLOCKABLE_OUTFITS.map((o) => ({
      ...o,
      locked: !unlockedHabitats.includes(o.habitat),
    })),
  ];

  return (
    <main className="min-h-screen p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/"
          className="text-green-700 font-semibold min-h-[48px] min-w-[48px] flex items-center"
        >
          ← Back
        </Link>
        <h1 className="text-xl font-bold">Build Your Explorer</h1>
        <div className="w-12" />
      </div>

      {/* Avatar preview */}
      <div className="flex justify-center mb-4 py-4 bg-gray-50 rounded-2xl">
        <AvatarDisplay avatar={avatar} size={160} />
      </div>

      {/* Randomise button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={randomise}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-200 transition-colors min-h-[48px]"
        >
          🎲 Randomise!
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-4 -mx-2 px-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[44px] ${
              tab === t.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Options panel */}
      <div className="mb-6">
        {/* Skin tones */}
        {tab === 'skin' && (
          <div className="flex flex-wrap gap-3 justify-center">
            {SKIN_TONES.map((s) => (
              <button
                key={s.id}
                onClick={() => update('skinTone', s.id)}
                className={`w-14 h-14 rounded-full border-3 transition-transform ${
                  avatar.skinTone === s.id ? 'scale-110 border-green-500 ring-2 ring-green-300' : 'border-gray-200'
                }`}
                style={{ backgroundColor: s.colour, borderWidth: 3 }}
                aria-label={s.label}
              />
            ))}
          </div>
        )}

        {/* Eyes */}
        {tab === 'eyes' && (
          <div className="grid grid-cols-3 gap-3">
            {EYE_STYLES.map((e) => (
              <button
                key={e.id}
                onClick={() => update('eyes', e.id)}
                className={`p-3 rounded-xl border-2 text-center transition-colors min-h-[48px] ${
                  avatar.eyes === e.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-center mb-1">
                  <svg width="40" height="20" viewBox="0 0 40 20">
                    {e.id === 'round' && <><circle cx="10" cy="10" r="6" fill="white" stroke="#333" strokeWidth="0.8" /><circle cx="11" cy="9.5" r="3.5" fill="#1e1b4b" /><circle cx="20" cy="10" fill="none" r="0" /><circle cx="30" cy="10" r="6" fill="white" stroke="#333" strokeWidth="0.8" /><circle cx="31" cy="9.5" r="3.5" fill="#1e1b4b" /></>}
                    {e.id === 'happy' && <><path d="M2 11 Q10 5 18 11" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" /><path d="M22 11 Q30 5 38 11" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" /></>}
                    {e.id === 'curious' && <><circle cx="10" cy="10" r="6" fill="white" stroke="#333" strokeWidth="0.8" /><circle cx="8" cy="10" r="3.5" fill="#1e1b4b" /><circle cx="30" cy="10" r="6" fill="white" stroke="#333" strokeWidth="0.8" /><circle cx="28" cy="10" r="3.5" fill="#1e1b4b" /></>}
                    {e.id === 'sparkle' && <><circle cx="10" cy="10" r="6.5" fill="white" stroke="#333" strokeWidth="0.8" /><circle cx="11" cy="9" r="3.5" fill="#1e1b4b" /><circle cx="13" cy="7" r="1.5" fill="white" /><circle cx="30" cy="10" r="6.5" fill="white" stroke="#333" strokeWidth="0.8" /><circle cx="31" cy="9" r="3.5" fill="#1e1b4b" /><circle cx="33" cy="7" r="1.5" fill="white" /></>}
                    {e.id === 'cool' && <><path d="M2 10 L18 10" stroke="#333" strokeWidth="3" strokeLinecap="round" /><path d="M22 10 L38 10" stroke="#333" strokeWidth="3" strokeLinecap="round" /></>}
                    {e.id === 'wink' && <><circle cx="10" cy="10" r="6" fill="white" stroke="#333" strokeWidth="0.8" /><circle cx="11" cy="9.5" r="3.5" fill="#1e1b4b" /><path d="M22 11 Q30 5 38 11" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" /></>}
                  </svg>
                </div>
                <span className="text-xs">{e.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Mouth */}
        {tab === 'mouth' && (
          <div className="grid grid-cols-3 gap-3">
            {MOUTH_STYLES.map((m) => (
              <button
                key={m.id}
                onClick={() => update('mouth', m.id)}
                className={`p-3 rounded-xl border-2 text-center transition-colors min-h-[48px] ${
                  avatar.mouth === m.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-center mb-1">
                  <svg width="30" height="15" viewBox="0 0 30 15">
                    {m.id === 'smile' && <path d="M5 6 Q15 14 25 6" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />}
                    {m.id === 'grin' && <path d="M3 5 Q15 16 27 5" fill="#333" />}
                    {m.id === 'small' && <path d="M10 7 Q15 11 20 7" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />}
                    {m.id === 'open' && <><ellipse cx="15" cy="8" rx="6" ry="5" fill="#333" /><ellipse cx="15" cy="6" rx="4" ry="2" fill="white" /></>}
                    {m.id === 'cat' && <><path d="M6 7 Q11 11 15 7" fill="none" stroke="#333" strokeWidth="1.3" strokeLinecap="round" /><path d="M15 7 Q19 11 24 7" fill="none" stroke="#333" strokeWidth="1.3" strokeLinecap="round" /></>}
                  </svg>
                </div>
                <span className="text-xs">{m.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Hair style */}
        {tab === 'hair' && (
          <div className="grid grid-cols-2 gap-3">
            {HAIR_STYLES.map((h) => (
              <button
                key={h.id}
                onClick={() => update('hairStyle', h.id)}
                className={`p-3 rounded-xl border-2 text-center transition-colors min-h-[48px] font-semibold text-sm ${
                  avatar.hairStyle === h.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        )}

        {/* Hair colour */}
        {tab === 'colour' && (
          <div className="flex flex-wrap gap-3 justify-center">
            {HAIR_COLOURS.map((c) => (
              <button
                key={c.id}
                onClick={() => update('hairColour', c.id)}
                className={`w-12 h-12 rounded-full border-3 transition-transform ${
                  avatar.hairColour === c.id ? 'scale-110 border-green-500 ring-2 ring-green-300' : 'border-gray-200'
                }`}
                style={{ backgroundColor: c.colour, borderWidth: 3 }}
                aria-label={c.label}
              />
            ))}
          </div>
        )}

        {/* Outfit */}
        {tab === 'outfit' && (
          <div className="grid grid-cols-2 gap-3">
            {allOutfits.map((o) => (
              <button
                key={o.id}
                onClick={() => !o.locked && update('outfit', o.id)}
                disabled={o.locked}
                className={`p-3 rounded-xl border-2 text-center transition-colors min-h-[48px] ${
                  o.locked ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  avatar.outfit === o.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: o.colour }}
                />
                <span className="text-xs font-semibold">{o.label}</span>
                {o.locked && <p className="text-xs text-gray-400 mt-0.5">🔒 Locked</p>}
              </button>
            ))}
          </div>
        )}

        {/* Accessories */}
        {tab === 'extras' && (
          <div className="grid grid-cols-2 gap-3">
            {UNLOCKABLE_ACCESSORIES.map((a) => {
              const unlocked = checkAccessoryUnlocked(a.condition, progress);
              const active = avatar.accessories.includes(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => unlocked && toggleAccessory(a.id)}
                  disabled={!unlocked}
                  className={`p-3 rounded-xl border-2 text-center transition-colors min-h-[48px] ${
                    !unlocked ? 'opacity-40 cursor-not-allowed' : ''
                  } ${
                    active
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-semibold">{a.label}</span>
                  {unlocked ? (
                    <p className="text-xs text-green-600 mt-0.5">{active ? '✓ Wearing' : 'Tap to wear'}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-0.5">🔒 {a.description}</p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="w-full py-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
      >
        Done!
      </button>
    </main>
  );
}
