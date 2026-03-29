import { useParams, Link } from 'react-router-dom';
import habitats from '../data/habitats.json';

export default function AnimalReveal() {
  const { habitatId } = useParams();
  const habitat = habitats.find((h) => h.id === habitatId);

  if (!habitat) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <p>Habitat not found.</p>
        <Link to="/habitats" className="mt-4 text-green-700 font-semibold">← Back to Habitats</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
      <div className="text-6xl animate-bounce">{habitat.animal.emoji}</div>
      <h1 className="text-3xl font-bold">You discovered the {habitat.animal.name}!</h1>
      <p className="text-lg text-gray-600 max-w-md">{habitat.animal.fact}</p>
      <div className="mt-2 px-4 py-2 bg-green-50 rounded-xl">
        <p className="text-sm text-green-700">
          {habitat.emoji} {habitat.name} habitat complete!
        </p>
      </div>
      <div className="flex gap-4 mt-6">
        <Link
          to="/collection"
          className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors min-h-[48px]"
        >
          View Collection
        </Link>
        <Link
          to="/habitats"
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Keep Exploring
        </Link>
      </div>
    </main>
  );
}
