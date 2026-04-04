import { Link } from 'react-router-dom';
import { loadProgress } from '../../storage/progress.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import { MATHS_TRAILS } from '../../data/maths/topics.js';
import { ElizabethHelpButton } from '../../components/ElizabethHelper.jsx';

export default function MathsDashboard() {
  const { isLoggedIn } = useAuth();
  const progress = loadProgress();
  const mathsProgress = progress.mathsProgress || {};

  function getTrailProgress(trail) {
    if (trail.comingSoon || trail.modules.length === 0) return { total: 0, mastered: 0, percent: 0 };
    let total = 0;
    let mastered = 0;
    for (const mod of trail.modules) {
      for (const topic of mod.topics) {
        total++;
        const tp = mathsProgress[mod.id]?.[topic.id];
        if (tp?.status === 'mastered') mastered++;
      }
    }
    return { total, mastered, percent: total > 0 ? Math.round((mastered / total) * 100) : 0 };
  }

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
        {MATHS_TRAILS.map((trail) => {
          const locked = trail.comingSoon;
          const gated = trail.id !== 'explorer' && !isLoggedIn && !locked;
          const { total, mastered, percent } = getTrailProgress(trail);

          return (
            <Link
              key={trail.id}
              to={locked ? '#' : gated ? '/register' : `/maths/trail/${trail.id}`}
              onClick={locked ? (e) => e.preventDefault() : undefined}
              className={`block p-6 rounded-2xl border-2 hover:shadow-md transition-all ${
                locked || gated ? 'opacity-60' : ''
              }`}
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

                  {locked ? (
                    <p className="text-xs text-gray-400 font-semibold mt-3">🔒 Coming Soon</p>
                  ) : gated ? (
                    <p className="text-xs text-gray-400 font-semibold mt-3">🔒 Free account required</p>
                  ) : (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{mastered}/{total} topics mastered</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${percent}%`,
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

      <ElizabethHelpButton screenKey="mathsDashboard" />
    </main>
  );
}
