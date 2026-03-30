// Elizabeth — Animal Crossing / chibi style character
// Based on: blonde bob hair, star sunglasses, blue explorer outfit
// Expressions: happy, excited, thinking, encouraging, waving

export default function ElizabethCharacter({ mood = 'happy', size = 100 }) {
  const s = size;
  const scale = s / 100;

  // Expression-specific elements
  const eyes = {
    happy: (
      <>
        {/* Star sunglasses — her signature look */}
        <g transform="translate(35, 38)">
          {/* Left star */}
          <polygon points="0,-8 2,-3 8,-3 3,1 5,7 0,3 -5,7 -3,1 -8,-3 -2,-3" fill="#9333ea" stroke="#7e22ce" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="2.5" fill="#1e1b4b" />
        </g>
        <g transform="translate(65, 38)">
          {/* Right star */}
          <polygon points="0,-8 2,-3 8,-3 3,1 5,7 0,3 -5,7 -3,1 -8,-3 -2,-3" fill="#9333ea" stroke="#7e22ce" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="2.5" fill="#1e1b4b" />
        </g>
        {/* Bridge */}
        <line x1="43" y1="38" x2="57" y2="38" stroke="#7e22ce" strokeWidth="1.5" />
      </>
    ),
    excited: (
      <>
        {/* Wide sparkly eyes — no sunglasses for excited */}
        <g transform="translate(35, 38)">
          <polygon points="0,-9 2.5,-3.5 9,-3.5 3.5,1 5.5,7.5 0,3.5 -5.5,7.5 -3.5,1 -9,-3.5 -2.5,-3.5" fill="#f9a8d4" stroke="#ec4899" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3" fill="#1e1b4b" />
          <circle cx="1.5" cy="-1.5" r="1" fill="white" />
        </g>
        <g transform="translate(65, 38)">
          <polygon points="0,-9 2.5,-3.5 9,-3.5 3.5,1 5.5,7.5 0,3.5 -5.5,7.5 -3.5,1 -9,-3.5 -2.5,-3.5" fill="#f9a8d4" stroke="#ec4899" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3" fill="#1e1b4b" />
          <circle cx="1.5" cy="-1.5" r="1" fill="white" />
        </g>
      </>
    ),
    thinking: (
      <>
        {/* Sunglasses tilted up on head — regular eyes visible */}
        <g transform="translate(35, 40)">
          <ellipse cx="0" cy="0" rx="5" ry="5.5" fill="white" stroke="#333" strokeWidth="1" />
          <circle cx="1" cy="0" r="3" fill="#1e1b4b" />
          <circle cx="2" cy="-1" r="1" fill="white" />
        </g>
        <g transform="translate(65, 40)">
          <ellipse cx="0" cy="0" rx="5" ry="5.5" fill="white" stroke="#333" strokeWidth="1" />
          <circle cx="-2" cy="-1" r="3" fill="#1e1b4b" />
          <circle cx="-1" cy="-2" r="1" fill="white" />
        </g>
        {/* Eyebrow raised */}
        <path d="M28 30 Q35 26 42 30" fill="none" stroke="#8b6914" strokeWidth="1.5" />
        <path d="M58 30 Q65 28 72 31" fill="none" stroke="#8b6914" strokeWidth="1.5" />
      </>
    ),
    encouraging: (
      <>
        {/* Warm closed-eye smile — like a gentle nod */}
        <path d="M28 39 Q35 35 42 39" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        <path d="M58 39 Q65 35 72 39" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        {/* Little sparkles */}
        <text x="22" y="34" fontSize="6" fill="#f59e0b">✨</text>
        <text x="72" y="34" fontSize="6" fill="#f59e0b">✨</text>
      </>
    ),
    waving: (
      <>
        {/* Star sunglasses */}
        <g transform="translate(35, 38)">
          <polygon points="0,-8 2,-3 8,-3 3,1 5,7 0,3 -5,7 -3,1 -8,-3 -2,-3" fill="#9333ea" stroke="#7e22ce" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="2.5" fill="#1e1b4b" />
        </g>
        <g transform="translate(65, 38)">
          <polygon points="0,-8 2,-3 8,-3 3,1 5,7 0,3 -5,7 -3,1 -8,-3 -2,-3" fill="#9333ea" stroke="#7e22ce" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="2.5" fill="#1e1b4b" />
        </g>
        <line x1="43" y1="38" x2="57" y2="38" stroke="#7e22ce" strokeWidth="1.5" />
      </>
    ),
  };

  const mouths = {
    happy: <path d="M40 50 Q50 58 60 50" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />,
    excited: (
      <g>
        <ellipse cx="50" cy="53" rx="7" ry="5" fill="#333" />
        <ellipse cx="50" cy="51" rx="5" ry="2.5" fill="#fff" />
      </g>
    ),
    thinking: <circle cx="58" cy="52" r="3" fill="#333" />,
    encouraging: (
      <path d="M38 49 Q50 60 62 49" fill="#333" stroke="#333" strokeWidth="1" strokeLinecap="round" />
    ),
    waving: (
      <path d="M38 49 Q50 60 62 49" fill="#333" stroke="#333" strokeWidth="1" strokeLinecap="round" />
    ),
  };

  // Blush cheeks
  const blush = (
    <>
      <ellipse cx="26" cy="48" rx="6" ry="3.5" fill="#fca5a5" opacity="0.5" />
      <ellipse cx="74" cy="48" rx="6" ry="3.5" fill="#fca5a5" opacity="0.5" />
    </>
  );

  // Waving arm
  const wavingArm = mood === 'waving' ? (
    <g transform="translate(82, 62) rotate(-20)">
      <ellipse cx="0" cy="0" rx="5" ry="12" fill="#3b82f6" />
      <circle cx="0" cy="-14" r="5" fill="#fcd9b6" />
    </g>
  ) : null;

  // Thinking bubble
  const thinkingBubble = mood === 'thinking' ? (
    <g>
      <circle cx="82" cy="22" r="2.5" fill="#e5e7eb" />
      <circle cx="87" cy="16" r="3.5" fill="#e5e7eb" />
      <circle cx="93" cy="8" r="5" fill="#e5e7eb" />
    </g>
  ) : null;

  return (
    <svg
      width={s}
      height={s * 1.2}
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Elizabeth looking ${mood}`}
    >
      {thinkingBubble}

      {/* Hair behind head — long blonde flowing down */}
      <ellipse cx="50" cy="35" rx="33" ry="30" fill="#d4b85c" />
      {/* Long hair flowing down behind body */}
      <path d="M20 35 Q18 60 22 90 Q26 100 30 95 Q28 70 25 45 Z" fill="#c8a951" />
      <path d="M80 35 Q82 60 78 90 Q74 100 70 95 Q72 70 75 45 Z" fill="#c8a951" />
      {/* Centre back hair */}
      <path d="M35 55 Q38 75 36 95 Q42 100 50 98 Q58 100 64 95 Q62 75 65 55 Z" fill="#b89840" />

      {/* Head */}
      <ellipse cx="50" cy="38" rx="27" ry="25" fill="#fcd9b6" />

      {/* Hair top — long blonde */}
      <path d="M23 28 Q25 10 50 8 Q75 10 77 28 L77 35 Q75 20 50 18 Q25 20 23 35 Z" fill="#d4b85c" />
      {/* Side hair flowing over shoulders */}
      <path d="M23 28 Q18 40 20 65 Q22 70 26 68 Q24 50 25 35 Z" fill="#c8a951" />
      <path d="M77 28 Q82 40 80 65 Q78 70 74 68 Q76 50 75 35 Z" fill="#c8a951" />
      {/* Fringe — side-swept */}
      <path d="M28 25 Q35 15 50 14 Q55 14 58 16 L55 24 Q45 18 35 24 Z" fill="#dcc46a" />

      {/* Eyes / Sunglasses based on mood */}
      {eyes[mood] || eyes.happy}

      {/* Blush */}
      {blush}

      {/* Mouth based on mood */}
      {mouths[mood] || mouths.happy}

      {/* Nose — tiny dot */}
      <circle cx="50" cy="45" r="1.2" fill="#e8b89a" />

      {/* Body — blue top */}
      <rect x="35" y="65" width="30" height="22" rx="8" fill="#3b82f6" />
      {/* Star pattern on top */}
      <text x="44" y="80" fontSize="8" fill="#60a5fa" opacity="0.6">⭐</text>

      {/* Arms */}
      <ellipse cx="30" cy="74" rx="5" ry="11" fill="#3b82f6" />
      <circle cx="30" cy="85" r="4.5" fill="#fcd9b6" />
      {mood !== 'waving' && (
        <>
          <ellipse cx="70" cy="74" rx="5" ry="11" fill="#3b82f6" />
          <circle cx="70" cy="85" r="4.5" fill="#fcd9b6" />
        </>
      )}
      {wavingArm}

      {/* Legs — light blue jeans */}
      <rect x="38" y="85" width="10" height="18" rx="4" fill="#93c5fd" />
      <rect x="52" y="85" width="10" height="18" rx="4" fill="#93c5fd" />

      {/* Shoes — blue */}
      <ellipse cx="43" cy="104" rx="7" ry="4" fill="#2563eb" />
      <ellipse cx="57" cy="104" rx="7" ry="4" fill="#2563eb" />

      {/* Backpack strap */}
      <line x1="40" y1="66" x2="38" y2="78" stroke="#1d4ed8" strokeWidth="2" />
      <line x1="60" y1="66" x2="62" y2="78" stroke="#1d4ed8" strokeWidth="2" />
    </svg>
  );
}
