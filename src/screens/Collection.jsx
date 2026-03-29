import { Link } from 'react-router-dom';
import habitats from '../data/habitats.json';
import { loadProgress } from '../storage/progress.js';

export default function Collection() {
  const progress = loadProgress();
  const unlockedAnimals = progress.unlockedAnimals || [];

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/habitats"
          className="text-green-700 font-semibold min-h-[48px] min-w-[48px] flex items-center"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">My Collection</h1>
        <div className="w-12" />
      </div>

      <p className="text-gray-500 mb-6">
        {unlockedAnimals.length} of {habitats.length} animals discovered
      </p>

      <div className="grid grid-cols-2 gap-4">
        {habitats.map((habitat) => {
          const isUnlocked = unlockedAnimals.includes(habitat.id);

          return (
            <div
              key={habitat.id}
              className={`p-5 rounded-2xl border-2 text-center ${
                isUnlocked
                  ? 'border-amber-300 bg-amber-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="text-4xl mb-2">
                {isUnlocked ? habitat.animal.emoji : '❓'}
              </div>
              <h2 className="font-bold mb-1">
                {isUnlocked ? habitat.animal.name : '???'}
              </h2>
              <p className="text-xs text-gray-500 mb-2">
                {habitat.emoji} {habitat.name}
              </p>
              {isUnlocked ? (
                <p className="text-sm text-gray-600 leading-snug">
                  {habitat.animal.fact}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Complete the {habitat.name} habitat to discover this animal!
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
