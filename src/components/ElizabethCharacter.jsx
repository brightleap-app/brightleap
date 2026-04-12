// Elizabeth — illustrated character (AI-generated PNGs)
// Blonde hair, star sunglasses, teal explorer outfit
// Moods: happy, excited, thinking, encouraging, waving, celebrating

const MOOD_TO_IMAGE = {
  happy: '/images/elizabeth/happy.png',
  excited: '/images/elizabeth/celebrating.png',
  thinking: '/images/elizabeth/thinking.png',
  encouraging: '/images/elizabeth/encouraging.png',
  waving: '/images/elizabeth/waving.png',
  celebrating: '/images/elizabeth/celebrating.png',
};

export default function ElizabethCharacter({ mood = 'happy', size = 100 }) {
  const src = MOOD_TO_IMAGE[mood] || MOOD_TO_IMAGE.happy;

  return (
    <img
      src={src}
      alt={`Elizabeth looking ${mood}`}
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain' }}
      draggable={false}
    />
  );
}
