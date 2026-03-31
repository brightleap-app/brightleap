import { Link } from 'react-router-dom';
import { loadProgress } from '../storage/progress.js';
import { HABITAT_UNLOCK_THRESHOLD } from '../engine/quiz.js';
import { ElizabethHelpButton } from '../components/ElizabethHelper.jsx';
import { useTheme } from '../themes/ThemeContext.jsx';

export default function HabitatSelect() {
  const progress = loadProgress();
  const { habitats, colours, theme } = useTheme();

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="font-semibold min-h-[48px] min-w-[48px] flex items-center"
          style={{ color: colours.primary }}
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">{theme.emoji} {theme.name}</h1>
        <div className="w-12" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {habitats.map((habitat) => {
          const hp = progress.habitatProgress[habitat.id] || { correctWords: [], attempts: 0 };
          const correctCount = hp.correctWords.length;
          const isComplete = correctCount >= HABITAT_UNLOCK_THRESHOLD;
          const progressPercent = Math.round((correctCount / habitat.words.length) * 100);

          return (
            <Link
              key={habitat.id}
              to={`/quiz/${habitat.id}`}
              className="block p-5 rounded-2xl border-2 hover:shadow-md transition-all min-h-[140px] flex flex-col justify-between"
              style={{
                backgroundColor: isComplete ? colours.cardBg : '#ffffff',
                borderColor: isComplete ? colours.primary : colours.cardBorder,
              }}
            >
              <div>
                <div className="text-3xl mb-2">{habitat.displayEmoji}</div>
                <h2 className="text-lg font-bold mb-1">{habitat.displayName}</h2>
                <p className="text-sm text-gray-500 leading-snug">{habitat.rule}</p>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>{correctCount}/{habitat.words.length} words</span>
                  {isComplete && (
                    <span className="font-semibold" style={{ color: colours.primary }}>
                      {habitat.reward.emoji} Unlocked!
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: isComplete ? colours.primary : colours.accent,
                    }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center gap-4">
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
