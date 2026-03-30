// Elizabeth — Animal Crossing / chibi style character
// Long blonde hair, star sunglasses, blue explorer outfit
// Expressions: happy, excited, thinking, encouraging, waving

export default function ElizabethCharacter({ mood = 'happy', size = 100 }) {
  // Chibi proportions: huge head (~60%), tiny body (~40%)
  // No visible neck or shoulders — head sits directly on body

  const eyesByMood = {
    happy: (
      <>
        {/* Star sunglasses — signature look */}
        <polygon points="36,36 38,31 44,31 40,35 42,41 36,37 30,41 32,35 28,31 34,31" fill="#9333ea" stroke="#7e22ce" strokeWidth="0.6" />
        <polygon points="64,36 66,31 72,31 68,35 70,41 64,37 58,41 60,35 56,31 62,31" fill="#9333ea" stroke="#7e22ce" strokeWidth="0.6" />
        <line x1="44" y1="35" x2="56" y2="35" stroke="#7e22ce" strokeWidth="1.2" />
        {/* Eyes behind lenses */}
        <circle cx="36" cy="36" r="1.8" fill="#1e1b4b" />
        <circle cx="64" cy="36" r="1.8" fill="#1e1b4b" />
      </>
    ),
    excited: (
      <>
        {/* Big sparkly eyes — sunglasses pushed up */}
        <circle cx="36" cy="37" r="5" fill="white" stroke="#333" strokeWidth="0.8" />
        <circle cx="64" cy="37" r="5" fill="white" stroke="#333" strokeWidth="0.8" />
        <circle cx="37" cy="36" r="3" fill="#1e1b4b" />
        <circle cx="65" cy="36" r="3" fill="#1e1b4b" />
        <circle cx="38.5" cy="34.5" r="1.2" fill="white" />
        <circle cx="66.5" cy="34.5" r="1.2" fill="white" />
        {/* Star sparkles */}
        <text x="24" y="30" fontSize="5">✨</text>
        <text x="70" y="30" fontSize="5">✨</text>
      </>
    ),
    thinking: (
      <>
        {/* Looking to the side, curious */}
        <circle cx="36" cy="37" r="4.5" fill="white" stroke="#333" strokeWidth="0.8" />
        <circle cx="64" cy="37" r="4.5" fill="white" stroke="#333" strokeWidth="0.8" />
        <circle cx="34" cy="36" r="2.8" fill="#1e1b4b" />
        <circle cx="62" cy="36" r="2.8" fill="#1e1b4b" />
        {/* One eyebrow raised */}
        <path d="M29 30 Q36 27 43 31" fill="none" stroke="#b89840" strokeWidth="1.2" />
        <path d="M57 31 Q64 27 71 30" fill="none" stroke="#b89840" strokeWidth="1.2" />
      </>
    ),
    encouraging: (
      <>
        {/* Warm closed-eye smile */}
        <path d="M29 36 Q36 32 43 36" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M57 36 Q64 32 71 36" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    waving: (
      <>
        {/* Star sunglasses */}
        <polygon points="36,36 38,31 44,31 40,35 42,41 36,37 30,41 32,35 28,31 34,31" fill="#9333ea" stroke="#7e22ce" strokeWidth="0.6" />
        <polygon points="64,36 66,31 72,31 68,35 70,41 64,37 58,41 60,35 56,31 62,31" fill="#9333ea" stroke="#7e22ce" strokeWidth="0.6" />
        <line x1="44" y1="35" x2="56" y2="35" stroke="#7e22ce" strokeWidth="1.2" />
        <circle cx="36" cy="36" r="1.8" fill="#1e1b4b" />
        <circle cx="64" cy="36" r="1.8" fill="#1e1b4b" />
      </>
    ),
  };

  const mouthByMood = {
    happy: <path d="M42 46 Q50 52 58 46" fill="none" stroke="#333" strokeWidth="1.3" strokeLinecap="round" />,
    excited: (
      <g>
        <ellipse cx="50" cy="48" rx="6" ry="4.5" fill="#333" />
        <ellipse cx="50" cy="46.5" rx="4" ry="2" fill="white" />
      </g>
    ),
    thinking: <circle cx="56" cy="47" r="2.5" fill="none" stroke="#333" strokeWidth="1.2" />,
    encouraging: (
      <path d="M40 45 Q50 54 60 45" fill="#333" stroke="none" />
    ),
    waving: (
      <path d="M40 45 Q50 54 60 45" fill="#333" stroke="none" />
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Elizabeth looking ${mood}`}
    >
      {/* === HAIR BEHIND (long, flowing) === */}
      {/* Back hair mass */}
      <ellipse cx="50" cy="32" rx="30" ry="28" fill="#d4b85c" />
      {/* Long hair flowing down behind body */}
      <path d="M22 38 Q18 55 20 82 Q22 88 28 86 Q26 65 24 45 Z" fill="#c8a951" />
      <path d="M78 38 Q82 55 80 82 Q78 88 72 86 Q74 65 76 45 Z" fill="#c8a951" />
      <path d="M28 50 Q30 70 32 85 Q40 90 50 88 Q60 90 68 85 Q70 70 72 50 Z" fill="#b89840" opacity="0.6" />

      {/* === HEAD (big round chibi head) === */}
      <circle cx="50" cy="35" r="25" fill="#fcd9b6" />

      {/* === HAIR TOP === */}
      {/* Main hair dome */}
      <path d="M25 30 Q27 8 50 5 Q73 8 75 30 Q75 20 50 15 Q25 20 25 30 Z" fill="#d4b85c" />
      {/* Volume / puff */}
      <ellipse cx="50" cy="13" rx="22" ry="9" fill="#dcc46a" />
      {/* Side-swept fringe */}
      <path d="M30 22 Q38 12 50 11 Q54 11 56 13 L52 22 Q44 16 36 22 Z" fill="#dcc46a" />
      {/* Side hair framing face */}
      <path d="M25 30 Q22 38 23 50 Q25 48 27 40 Q26 35 25 30 Z" fill="#c8a951" />
      <path d="M75 30 Q78 38 77 50 Q75 48 73 40 Q74 35 75 30 Z" fill="#c8a951" />

      {/* === FACE === */}
      {/* Blush */}
      <ellipse cx="28" cy="43" rx="5" ry="3" fill="#fca5a5" opacity="0.4" />
      <ellipse cx="72" cy="43" rx="5" ry="3" fill="#fca5a5" opacity="0.4" />

      {/* Nose */}
      <circle cx="50" cy="42" r="1" fill="#e8b89a" />

      {/* Eyes / glasses by mood */}
      {eyesByMood[mood] || eyesByMood.happy}

      {/* Mouth by mood */}
      {mouthByMood[mood] || mouthByMood.happy}

      {/* === BODY (small, round, no shoulders) === */}
      {/* Torso — rounded pill shape directly under head */}
      <ellipse cx="50" cy="68" rx="14" ry="10" fill="#3b82f6" />

      {/* Star on shirt */}
      <polygon points="50,62 51.5,65 55,65.5 52.5,68 53,71.5 50,70 47,71.5 47.5,68 45,65.5 48.5,65" fill="#93c5fd" opacity="0.5" />

      {/* === ARMS (small round nubs) === */}
      {mood === 'waving' ? (
        <>
          {/* Left arm normal */}
          <ellipse cx="35" cy="70" rx="4.5" ry="6" fill="#3b82f6" />
          <circle cx="35" cy="76" r="3.5" fill="#fcd9b6" />
          {/* Right arm waving up */}
          <ellipse cx="68" cy="60" rx="4.5" ry="6" fill="#3b82f6" transform="rotate(-30, 68, 60)" />
          <circle cx="72" cy="54" r="3.5" fill="#fcd9b6" />
        </>
      ) : (
        <>
          <ellipse cx="35" cy="70" rx="4.5" ry="6" fill="#3b82f6" />
          <circle cx="35" cy="76" r="3.5" fill="#fcd9b6" />
          <ellipse cx="65" cy="70" rx="4.5" ry="6" fill="#3b82f6" />
          <circle cx="65" cy="76" r="3.5" fill="#fcd9b6" />
        </>
      )}

      {/* === LEGS (short stubby) === */}
      <ellipse cx="44" cy="81" rx="5" ry="7" fill="#93c5fd" />
      <ellipse cx="56" cy="81" rx="5" ry="7" fill="#93c5fd" />

      {/* === SHOES (round) === */}
      <ellipse cx="44" cy="89" rx="6" ry="3.5" fill="#2563eb" />
      <ellipse cx="56" cy="89" rx="6" ry="3.5" fill="#2563eb" />

      {/* === BACKPACK STRAPS === */}
      <line x1="43" y1="60" x2="41" y2="70" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="57" y1="60" x2="59" y2="70" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" />

      {/* Thinking bubble */}
      {mood === 'thinking' && (
        <g>
          <circle cx="80" cy="20" r="2" fill="#e5e7eb" />
          <circle cx="85" cy="14" r="3" fill="#e5e7eb" />
          <circle cx="91" cy="7" r="4" fill="#e5e7eb" />
        </g>
      )}
    </svg>
  );
}
