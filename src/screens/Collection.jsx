import { Link } from 'react-router-dom';
import { loadProgress } from '../storage/progress.js';
import { useTheme } from '../themes/ThemeContext.jsx';

export default function Collection() {
  const progress = loadProgress();
  const unlockedAnimals = progress.unlockedAnimals || [];
  const unlockedMathsAnimals = progress.unlockedMathsAnimals || [];
  const { habitats, mathsHabitats, colours, theme } = useTheme();

  const totalEnglish = habitats.length;
  const totalMaths = Object.keys(mathsHabitats).length;
  const totalUnlocked = unlockedAnimals.length + unlockedMathsAnimals.length;
  const totalAll = totalEnglish + totalMaths;

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
        <h1 className="text-2xl font-bold">My Collection</h1>
        <div className="w-12" />
      </div>

      <p className="text-gray-600 mb-6">
        {totalUnlocked} of {totalAll} discoveries made
      </p>

      {/* English animals */}
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        📖 English
        <span className="text-sm font-normal text-gray-600">{unlockedAnimals.length}/{totalEnglish}</span>
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {habitats.map((habitat) => {
          const isUnlocked = unlockedAnimals.includes(habitat.id);

          return (
            <div
              key={habitat.id}
              className="p-5 rounded-2xl border-2 text-center"
              style={{
                borderColor: isUnlocked ? colours.accent : colours.cardBorder,
                backgroundColor: isUnlocked ? colours.cardBg : '#f9fafb',
              }}
            >
              <div className="text-4xl mb-2">
                {isUnlocked ? habitat.reward.emoji : '❓'}
              </div>
              <h2 className="font-bold mb-1">
                {isUnlocked ? habitat.reward.name : '???'}
              </h2>
              <p className="text-xs text-gray-600 mb-2">
                {habitat.displayEmoji} {habitat.displayName}
              </p>
              {isUnlocked ? (
                <p className="text-sm text-gray-600 leading-snug">
                  {habitat.reward.fact}
                </p>
              ) : (
                <p className="text-sm text-gray-600 italic">
                  Complete {habitat.displayName} to discover this!
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Maths animals */}
      {totalMaths > 0 && (
        <>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            🧮 Maths
            <span className="text-sm font-normal text-gray-600">{unlockedMathsAnimals.length}/{totalMaths}</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(mathsHabitats).map(([topicId, habitat]) => {
              const isUnlocked = unlockedMathsAnimals.includes(topicId);

              return (
                <div
                  key={topicId}
                  className="p-5 rounded-2xl border-2 text-center"
                  style={{
                    borderColor: isUnlocked ? colours.accent : colours.cardBorder,
                    backgroundColor: isUnlocked ? colours.cardBg : '#f9fafb',
                  }}
                >
                  <div className="text-4xl mb-2">
                    {isUnlocked ? habitat.reward.emoji : '❓'}
                  </div>
                  <h2 className="font-bold mb-1">
                    {isUnlocked ? habitat.reward.name : '???'}
                  </h2>
                  <p className="text-xs text-gray-600 mb-2">
                    {habitat.emoji} {habitat.name}
                  </p>
                  {isUnlocked ? (
                    <p className="text-sm text-gray-600 leading-snug">
                      {habitat.reward.fact}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600 italic">
                      Master {habitat.name} to discover this!
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
