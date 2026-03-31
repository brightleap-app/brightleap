import { Link, useParams } from 'react-router-dom';
import { loadProgress } from '../storage/progress.js';
import { HABITAT_UNLOCK_THRESHOLD } from '../engine/quiz.js';
import { ElizabethHelpButton } from '../components/ElizabethHelper.jsx';
import { useTheme } from '../themes/ThemeContext.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { isHabitatLocked } from '../features/gating.js';
import { getTrailById, TRAILS } from '../data/trails.js';

export default function HabitatSelect() {
  const { trailId } = useParams();
  const progress = loadProgress();
  const { colours, theme } = useTheme();
  const { isLoggedIn } = useAuth();

  const trail = getTrailById(trailId);
  const isOriginalTrail = trail.id === 'easter';

  // For original trail, use themed habitats. For new trails, use trail habitats directly.
  const { habitats: themedHabitats } = useTheme();
  const habitats = isOriginalTrail ? themedHabitats : trail.habitats;

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/trails"
          className="font-semibold min-h-[48px] min-w-[48px] flex items-center"
          style={{ color: trail.colour }}
        >
          ← Trails
        </Link>
        <div className="text-center">
          <h1 className="text-xl font-bold">{trail.emoji} {trail.name}</h1>
          <p className="text-xs text-gray-500">{trail.subtitle}</p>
        </div>
        <div className="w-12" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {habitats.map((habitat) => {
          const locked = isOriginalTrail && isHabitatLocked(habitat.id, isLoggedIn);
          const hp = progress.habitatProgress[habitat.id] || { correctWords: [], attempts: 0 };
          const correctCount = hp.correctWords.length;
          const totalWords = habitat.words?.length || 0;
          const isComplete = correctCount >= Math.min(HABITAT_UNLOCK_THRESHOLD, totalWords);
          const progressPercent = totalWords > 0 ? Math.round((correctCount / totalWords) * 100) : 0;

          const displayName = habitat.displayName || habitat.name;
          const displayEmoji = habitat.displayEmoji || habitat.emoji;
          const reward = habitat.reward || habitat.animal;

          if (locked) {
            return (
              <Link
                key={habitat.id}
                to="/register"
                className="block p-5 rounded-2xl border-2 border-gray-200 bg-gray-50 min-h-[140px] flex flex-col justify-between opacity-60"
              >
                <div>
                  <div className="text-3xl mb-2">{displayEmoji}</div>
                  <h2 className="text-lg font-bold mb-1">{displayName}</h2>
                  <p className="text-sm text-gray-400 leading-snug">{habitat.rule}</p>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-400 font-semibold">🔒 Free account required</p>
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={habitat.id}
              to={`/quiz/${habitat.id}?trail=${trail.id}`}
              className="block p-5 rounded-2xl border-2 hover:shadow-md transition-all min-h-[140px] flex flex-col justify-between"
              style={{
                backgroundColor: isComplete ? (colours?.cardBg || '#f0fdf4') : '#ffffff',
                borderColor: isComplete ? trail.colour : (colours?.cardBorder || '#e5e7eb'),
              }}
            >
              <div>
                <div className="text-3xl mb-2">{displayEmoji}</div>
                <h2 className="text-lg font-bold mb-1">{displayName}</h2>
                <p className="text-sm text-gray-500 leading-snug">{habitat.rule}</p>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>{correctCount}/{totalWords} words</span>
                  {isComplete && reward && (
                    <span className="font-semibold" style={{ color: trail.colour }}>
                      {reward.emoji} Unlocked!
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: isComplete ? trail.colour : (colours?.accent || '#f59e0b'),
                    }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {!isLoggedIn && isOriginalTrail && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl text-center">
          <p className="text-sm text-green-800">
            <Link to="/register" className="font-semibold underline">Create a free account</Link> to unlock all 8 habitats!
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-4">
        <Link
          to="/collection"
          className="px-6 py-3 bg-amber-100 text-amber-800 rounded-xl font-semibold hover:bg-amber-200 transition-colors min-h-[48px]"
        >
          My Collection
        </Link>
        <Link
          to="/settings"
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px]"
        >
          Settings
        </Link>
      </div>

      <ElizabethHelpButton screenKey="habitats" />
    </main>
  );
}
