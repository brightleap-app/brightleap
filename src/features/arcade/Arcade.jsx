import { Link } from 'react-router-dom';
import { loadProgress } from '../../storage/progress.js';
import { GAMES } from './gameList.js';

export default function Arcade() {
  const progress = loadProgress();
  const unlocked = progress.unlockedAnimals || [];

  return (
    <main className="min-h-screen p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="text-green-700 font-semibold min-h-[48px] min-w-[48px] flex items-center"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">🕹️ Arcade</h1>
        <div className="w-12" />
      </div>

      <p className="text-gray-500 mb-6 text-center">
        Complete habitats to unlock mini-games!
      </p>

      <div className="grid grid-cols-2 gap-4">
        {GAMES.map((game) => {
          const isUnlocked = unlocked.includes(game.habitat);

          return (
            <div key={game.id}>
              {isUnlocked ? (
                <Link
                  to={`/arcade/${game.id}`}
                  className="block p-5 rounded-2xl border-2 text-center hover:shadow-md transition-all min-h-[140px] flex flex-col items-center justify-center gap-2"
                  style={{ borderColor: game.colour, backgroundColor: `${game.colour}10` }}
                >
                  <div className="text-3xl">{game.emoji}</div>
                  <h2 className="font-bold text-sm">{game.name}</h2>
                  <p className="text-xs text-gray-500 leading-snug">{game.description}</p>
                </Link>
              ) : (
                <div className="p-5 rounded-2xl border-2 border-gray-200 bg-gray-50 text-center min-h-[140px] flex flex-col items-center justify-center gap-2 opacity-50">
                  <div className="text-3xl">🔒</div>
                  <h2 className="font-bold text-sm">{game.name}</h2>
                  <p className="text-xs text-gray-400">Complete a habitat to unlock</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
