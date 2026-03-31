import { SKIN_TONES, HAIR_COLOURS, OUTFIT_BASE, UNLOCKABLE_OUTFITS } from './avatarOptions.js';

function getSkinColour(id) {
  return SKIN_TONES.find((s) => s.id === id)?.colour || '#fcd9b6';
}

function getHairColour(id) {
  return HAIR_COLOURS.find((h) => h.id === id)?.colour || '#6b4226';
}

function getOutfitColour(id) {
  if (id === 'explorer') return OUTFIT_BASE.colour;
  return UNLOCKABLE_OUTFITS.find((o) => o.id === id)?.colour || OUTFIT_BASE.colour;
}

// Darken a colour slightly for shading
function shade(hex, amount = 0.15) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (num & 0xff) - Math.round(255 * amount));
  return `rgb(${r},${g},${b})`;
}

function HairBack({ style, colour }) {
  const c = colour;
  const d = shade(c, 0.1);
  switch (style) {
    case 'long':
      return (
        <>
          <ellipse cx="50" cy="32" rx="30" ry="28" fill={c} />
          <path d={`M22 38 Q18 55 20 82 Q22 88 28 86 Q26 65 24 45 Z`} fill={d} />
          <path d={`M78 38 Q82 55 80 82 Q78 88 72 86 Q74 65 76 45 Z`} fill={d} />
          <path d="M28 50 Q30 70 32 85 Q40 90 50 88 Q60 90 68 85 Q70 70 72 50 Z" fill={d} opacity="0.5" />
        </>
      );
    case 'braids':
      return (
        <>
          <ellipse cx="50" cy="32" rx="30" ry="28" fill={c} />
          <rect x="24" y="40" width="7" height="50" rx="3.5" fill={d} />
          <rect x="69" y="40" width="7" height="50" rx="3.5" fill={d} />
          <circle cx="27.5" cy="90" r="4" fill={c} />
          <circle cx="72.5" cy="90" r="4" fill={c} />
        </>
      );
    case 'ponytail':
      return (
        <>
          <ellipse cx="50" cy="32" rx="30" ry="28" fill={c} />
          <rect x="47" y="10" width="8" height="55" rx="4" fill={d} transform="rotate(10, 50, 30)" />
          <circle cx="58" cy="65" r="5" fill={c} />
        </>
      );
    case 'afro':
      return <ellipse cx="50" cy="30" rx="35" ry="33" fill={c} />;
    default:
      return <ellipse cx="50" cy="32" rx="30" ry="28" fill={c} />;
  }
}

function HairFront({ style, colour }) {
  const c = colour;
  const d = shade(c, 0.08);
  const light = shade(c, -0.1);

  const dome = <path d={`M25 30 Q27 8 50 5 Q73 8 75 30 Q75 20 50 15 Q25 20 25 30 Z`} fill={c} />;
  const puff = <ellipse cx="50" cy="13" rx="22" ry="9" fill={light} />;

  switch (style) {
    case 'short':
      return (
        <>
          {dome}
          <path d="M28 24 Q40 14 50 13 Q60 14 72 24 Q68 18 50 16 Q32 18 28 24 Z" fill={light} />
        </>
      );
    case 'medium':
      return (
        <>
          {dome}{puff}
          <path d="M25 30 Q22 38 23 48 Q25 46 27 38 Z" fill={d} />
          <path d="M75 30 Q78 38 77 48 Q75 46 73 38 Z" fill={d} />
          <path d="M30 22 Q38 12 50 11 Q54 11 56 13 L52 22 Q44 16 36 22 Z" fill={light} />
        </>
      );
    case 'long':
      return (
        <>
          {dome}{puff}
          <path d="M25 30 Q22 38 23 50 Q25 48 27 40 Z" fill={d} />
          <path d="M75 30 Q78 38 77 50 Q75 48 73 40 Z" fill={d} />
          <path d="M30 22 Q38 12 50 11 Q54 11 56 13 L52 22 Q44 16 36 22 Z" fill={light} />
        </>
      );
    case 'curly':
      return (
        <>
          <ellipse cx="50" cy="18" rx="26" ry="14" fill={c} />
          {[25, 32, 40, 48, 56, 64, 72].map((x, i) => (
            <circle key={i} cx={x} cy={14 + (i % 2) * 3} r={5} fill={light} />
          ))}
          <circle cx="22" cy="32" r="6" fill={c} />
          <circle cx="78" cy="32" r="6" fill={c} />
          <circle cx="20" cy="42" r="5" fill={d} />
          <circle cx="80" cy="42" r="5" fill={d} />
        </>
      );
    case 'braids':
      return (
        <>
          {dome}
          <path d="M30 22 Q40 14 50 13 Q60 14 70 22 Q64 17 50 16 Q36 17 30 22 Z" fill={light} />
        </>
      );
    case 'ponytail':
      return (
        <>
          {dome}{puff}
          <path d="M30 22 Q38 12 50 11 Q54 11 56 13 L52 22 Q44 16 36 22 Z" fill={light} />
        </>
      );
    case 'buzz':
      return (
        <path d="M26 32 Q28 12 50 9 Q72 12 74 32 Q72 22 50 18 Q28 22 26 32 Z" fill={c} />
      );
    case 'afro':
      return (
        <>
          <ellipse cx="50" cy="18" rx="30" ry="16" fill={colour} />
          {[22, 30, 38, 46, 54, 62, 70, 78].map((x, i) => (
            <circle key={i} cx={x} cy={10 + (i % 2) * 4} r={6} fill={light} />
          ))}
        </>
      );
    case 'messy':
      return (
        <>
          {dome}
          <path d="M28 20 L32 10 L36 22" fill={c} />
          <path d="M42 18 L46 6 L50 16" fill={light} />
          <path d="M56 18 L60 8 L64 20" fill={c} />
          <path d="M68 22 L72 12 L74 26" fill={light} />
          <path d="M25 30 Q22 40 24 48 Q26 44 27 36 Z" fill={d} />
          <path d="M75 30 Q78 40 76 48 Q74 44 73 36 Z" fill={d} />
        </>
      );
    case 'bob':
      return (
        <>
          {dome}{puff}
          <path d="M23 30 Q20 40 23 52 Q26 48 25 36 Z" fill={d} />
          <path d="M77 30 Q80 40 77 52 Q74 48 75 36 Z" fill={d} />
          <path d="M30 22 Q38 12 50 11 Q54 11 56 13 L52 22 Q44 16 36 22 Z" fill={light} />
        </>
      );
    default:
      return <>{dome}{puff}</>;
  }
}

function Eyes({ style, skin }) {
  switch (style) {
    case 'round':
      return (
        <>
          <circle cx="36" cy="37" r="5" fill="white" stroke="#333" strokeWidth="0.8" />
          <circle cx="64" cy="37" r="5" fill="white" stroke="#333" strokeWidth="0.8" />
          <circle cx="37" cy="36.5" r="3" fill="#1e1b4b" />
          <circle cx="65" cy="36.5" r="3" fill="#1e1b4b" />
          <circle cx="38.2" cy="35" r="1.2" fill="white" />
          <circle cx="66.2" cy="35" r="1.2" fill="white" />
        </>
      );
    case 'happy':
      return (
        <>
          <path d="M29 37 Q36 32 43 37" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
          <path d="M57 37 Q64 32 71 37" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case 'curious':
      return (
        <>
          <circle cx="36" cy="37" r="5" fill="white" stroke="#333" strokeWidth="0.8" />
          <circle cx="64" cy="37" r="5" fill="white" stroke="#333" strokeWidth="0.8" />
          <circle cx="34" cy="37" r="3" fill="#1e1b4b" />
          <circle cx="62" cy="37" r="3" fill="#1e1b4b" />
          <path d="M29 31 Q36 28 43 32" fill="none" stroke="#333" strokeWidth="1.2" />
        </>
      );
    case 'sparkle':
      return (
        <>
          <circle cx="36" cy="37" r="5.5" fill="white" stroke="#333" strokeWidth="0.8" />
          <circle cx="64" cy="37" r="5.5" fill="white" stroke="#333" strokeWidth="0.8" />
          <circle cx="37" cy="36" r="3.2" fill="#1e1b4b" />
          <circle cx="65" cy="36" r="3.2" fill="#1e1b4b" />
          <circle cx="38.5" cy="34.5" r="1.5" fill="white" />
          <circle cx="66.5" cy="34.5" r="1.5" fill="white" />
          <circle cx="35" cy="38" r="0.8" fill="white" />
          <circle cx="63" cy="38" r="0.8" fill="white" />
        </>
      );
    case 'cool':
      return (
        <>
          <path d="M28 36 L44 36" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M56 36 L72 36" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    case 'wink':
      return (
        <>
          <circle cx="36" cy="37" r="5" fill="white" stroke="#333" strokeWidth="0.8" />
          <circle cx="37" cy="36.5" r="3" fill="#1e1b4b" />
          <circle cx="38.2" cy="35" r="1.2" fill="white" />
          <path d="M57 37 Q64 32 71 37" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    default:
      return <Eyes style="round" skin={skin} />;
  }
}

function Mouth({ style }) {
  switch (style) {
    case 'smile':
      return <path d="M42 47 Q50 53 58 47" fill="none" stroke="#333" strokeWidth="1.3" strokeLinecap="round" />;
    case 'grin':
      return <path d="M38 46 Q50 56 62 46" fill="#333" stroke="none" />;
    case 'small':
      return <path d="M45 48 Q50 51 55 48" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />;
    case 'open':
      return (
        <g>
          <ellipse cx="50" cy="49" rx="6" ry="4.5" fill="#333" />
          <ellipse cx="50" cy="47.5" rx="4" ry="2" fill="white" />
        </g>
      );
    case 'cat':
      return (
        <>
          <path d="M42 47 Q46 50 50 47" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M50 47 Q54 50 58 47" fill="none" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
        </>
      );
    default:
      return <Mouth style="smile" />;
  }
}

function Accessories({ items, outfitColour }) {
  return (
    <>
      {items.includes('hat') && (
        <g>
          <ellipse cx="50" cy="8" rx="24" ry="5" fill="#8b6914" />
          <path d="M32 8 Q34 -5 50 -7 Q66 -5 68 8 Z" fill="#a67c2e" />
          <rect x="30" y="6" width="40" height="4" rx="2" fill="#8b6914" />
        </g>
      )}
      {items.includes('binoculars') && (
        <g>
          <line x1="42" y1="58" x2="42" y2="64" stroke="#333" strokeWidth="1.5" />
          <line x1="58" y1="58" x2="58" y2="64" stroke="#333" strokeWidth="1.5" />
          <circle cx="42" cy="66" r="3" fill="#444" stroke="#333" strokeWidth="0.8" />
          <circle cx="58" cy="66" r="3" fill="#444" stroke="#333" strokeWidth="0.8" />
          <line x1="45" y1="65" x2="55" y2="65" stroke="#333" strokeWidth="1" />
        </g>
      )}
      {items.includes('backpack') && (
        <g>
          <rect x="38" y="62" width="24" height="18" rx="5" fill={shade(outfitColour, 0.15)} />
          <rect x="42" y="66" width="16" height="6" rx="2" fill={shade(outfitColour, 0.25)} />
        </g>
      )}
      {items.includes('compass') && (
        <g>
          <circle cx="42" cy="65" r="4" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
          <line x1="42" y1="62" x2="42" y2="65" stroke="red" strokeWidth="1" />
          <line x1="42" y1="65" x2="42" y2="68" stroke="white" strokeWidth="1" />
        </g>
      )}
      {items.includes('medal') && (
        <g>
          <line x1="44" y1="58" x2="50" y2="64" stroke="#eab308" strokeWidth="1.5" />
          <line x1="56" y1="58" x2="50" y2="64" stroke="#eab308" strokeWidth="1.5" />
          <circle cx="50" cy="67" r="4" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
          <text x="48" y="69.5" fontSize="5" fill="#92400e" fontWeight="bold">1</text>
        </g>
      )}
      {items.includes('star-glasses') && (
        <>
          <polygon points="36,36 38,31 44,31 40,35 42,41 36,37 30,41 32,35 28,31 34,31" fill="#9333ea" stroke="#7e22ce" strokeWidth="0.6" />
          <polygon points="64,36 66,31 72,31 68,35 70,41 64,37 58,41 60,35 56,31 62,31" fill="#9333ea" stroke="#7e22ce" strokeWidth="0.6" />
          <line x1="44" y1="35" x2="56" y2="35" stroke="#7e22ce" strokeWidth="1.2" />
        </>
      )}
    </>
  );
}

export default function AvatarDisplay({ avatar, size = 100 }) {
  const skin = getSkinColour(avatar.skinTone);
  const hair = getHairColour(avatar.hairColour);
  const outfit = getOutfitColour(avatar.outfit);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Your avatar"
    >
      {/* Hair behind */}
      <HairBack style={avatar.hairStyle} colour={hair} />

      {/* Body */}
      <ellipse cx="50" cy="68" rx="14" ry="10" fill={outfit} />

      {/* Arms */}
      <ellipse cx="35" cy="70" rx="4.5" ry="6" fill={outfit} />
      <circle cx="35" cy="76" r="3.5" fill={skin} />
      <ellipse cx="65" cy="70" rx="4.5" ry="6" fill={outfit} />
      <circle cx="65" cy="76" r="3.5" fill={skin} />

      {/* Legs */}
      <ellipse cx="44" cy="81" rx="5" ry="7" fill={shade(outfit, -0.15)} />
      <ellipse cx="56" cy="81" rx="5" ry="7" fill={shade(outfit, -0.15)} />

      {/* Shoes */}
      <ellipse cx="44" cy="89" rx="6" ry="3.5" fill={shade(outfit, 0.2)} />
      <ellipse cx="56" cy="89" rx="6" ry="3.5" fill={shade(outfit, 0.2)} />

      {/* Head */}
      <circle cx="50" cy="35" r="25" fill={skin} />

      {/* Hair front */}
      <HairFront style={avatar.hairStyle} colour={hair} />

      {/* Blush */}
      <ellipse cx="28" cy="43" rx="5" ry="3" fill="#fca5a5" opacity="0.35" />
      <ellipse cx="72" cy="43" rx="5" ry="3" fill="#fca5a5" opacity="0.35" />

      {/* Nose */}
      <circle cx="50" cy="42" r="1" fill={shade(skin, 0.08)} />

      {/* Eyes */}
      <Eyes style={avatar.eyes} skin={skin} />

      {/* Mouth */}
      <Mouth style={avatar.mouth} />

      {/* Accessories */}
      <Accessories items={avatar.accessories || []} outfitColour={outfit} />
    </svg>
  );
}
