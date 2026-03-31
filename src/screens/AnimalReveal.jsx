import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../themes/ThemeContext.jsx';

export default function AnimalReveal() {
  const { habitatId } = useParams();
  const { habitats, colours } = useTheme();
  const habitat = habitats.find((h) => h.id === habitatId);

  if (!habitat) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <p>Habitat not found.</p>
        <Link to="/habitats" className="mt-4 font-semibold" style={{ color: colours.primary }}>← Back</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
      <div className="text-6xl animate-bounce">{habitat.reward.emoji}</div>
      <h1 className="text-3xl font-bold">You discovered the {habitat.reward.name}!</h1>
      <p className="text-lg text-gray-600 max-w-md">{habitat.reward.fact}</p>
      <div className="mt-2 px-4 py-2 rounded-xl" style={{ backgroundColor: colours.cardBg }}>
        <p className="text-sm" style={{ color: colours.primary }}>
          {habitat.displayEmoji} {habitat.displayName} complete!
        </p>
      </div>
      <div className="flex gap-4 mt-6">
        <Link
          to="/collection"
          className="px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-colors min-h-[48px]"
          style={{ backgroundColor: colours.accent }}
        >
          View Collection
        </Link>
        <Link
          to="/habitats"
          className="px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-colors min-h-[48px]"
          style={{ backgroundColor: colours.primary }}
        >
          Keep Exploring
        </Link>
      </div>
    </main>
  );
}
