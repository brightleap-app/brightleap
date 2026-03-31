import { Link } from 'react-router-dom';
import { TRAILS } from '../data/trails.js';
import { loadProgress } from '../storage/progress.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { ElizabethHelpButton } from '../components/ElizabethHelper.jsx';

export default function TrailSelect() {
  const progress = loadProgress();
  const { isLoggedIn } = useAuth();

  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="text-green-700 font-semibold min-h-[48px] min-w-[48px] flex items-center"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">Choose Your Trail</h1>
        <div className="w-12" />
      </div>

      <div className="space-y-4">
        {TRAILS.map((trail) => {
          const locked = trail.id !== 'easter' && !isLoggedIn;

          // Count progress for this trail
          const trailProgress = trail.habitats.reduce((total, h) => {
            const hp = progress.habitatProgress[h.id];
            return total + (hp ? hp.correctWords.length : 0);
          }, 0);
          const progressPercent = Math.round((trailProgress / trail.wordCount) * 100);

          return (
            <Link
              key={trail.id}
              to={locked ? '/register' : `/habitats/${trail.id}`}
              className={`block p-6 rounded-2xl border-2 hover:shadow-md transition-all ${locked ? 'opacity-60' : ''}`}
              style={{ borderColor: trail.colour + '60' }}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{trail.emoji}</div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold">{trail.name}</h2>
                  <p className="text-sm font-semibold" style={{ color: trail.colour }}>
                    {trail.subtitle}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{trail.description}</p>

                  {/* Progress bar or lock */}
                  {locked ? (
                    <p className="text-xs text-gray-400 font-semibold mt-3">🔒 Free account required</p>
                  ) : (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{trailProgress}/{trail.wordCount} words</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${progressPercent}%`,
                            backgroundColor: trail.colour,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <ElizabethHelpButton screenKey="habitats" />
    </main>
  );
}
