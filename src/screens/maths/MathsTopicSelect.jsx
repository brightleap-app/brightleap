import { useParams, Link } from 'react-router-dom';
import { loadProgress } from '../../storage/progress.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useTheme } from '../../themes/ThemeContext.jsx';
import { getModuleById } from '../../data/maths/topics.js';
import RegisterPrompt from '../../components/RegisterPrompt.jsx';
import { ElizabethHelpButton } from '../../components/ElizabethHelper.jsx';
import { useState } from 'react';

export default function MathsTopicSelect() {
  const { trailId, moduleId } = useParams();
  const { isLoggedIn } = useAuth();
  const { mathsHabitats, colours } = useTheme();
  const progress = loadProgress();
  const mathsProgress = progress.mathsProgress || {};
  const unlockedMathsAnimals = progress.unlockedMathsAnimals || [];
  const [showGate, setShowGate] = useState(false);

  const mod = getModuleById(trailId, moduleId);

  if (!mod) {
    return (
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <Link to={`/maths/trail/${trailId}`} className="text-green-700 font-semibold min-h-[48px] inline-flex items-center">
          ← Back
        </Link>
        <p className="text-center text-gray-600 mt-8">Module not found.</p>
      </main>
    );
  }

  if (showGate) {
    return <RegisterPrompt onBack={() => setShowGate(false)} />;
  }

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          to={`/maths/trail/${trailId}`}
          className="font-semibold min-h-[48px] min-w-[48px] flex items-center"
          style={{ color: mod.colour }}
        >
          ← Back
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold">{mod.emoji} {mod.name}</h1>
          <p className="text-xs text-gray-600">{mod.description}</p>
        </div>
        <div className="w-12" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mod.topics.map((topic) => {
          const tp = mathsProgress[moduleId]?.[topic.id];
          const status = tp?.status || 'not_started';
          const isGated = !topic.free && !isLoggedIn;
          const isMastered = status === 'mastered';
          const isUnlocked = unlockedMathsAnimals.includes(topic.id);
          const themed = mathsHabitats[topic.id];
          const questionsAttempted = tp?.questionsAttempted || 0;
          const accuracy = tp?.accuracy ? Math.round(tp.accuracy * 100) : 0;

          // Progress as percentage (mastered = 100%, practising = 66%, in_progress = 33%)
          const progressPercent = isMastered ? 100 : status === 'practising' ? 66 : status === 'in_progress' ? 33 : 0;

          const displayName = themed?.name || topic.name;
          const displayEmoji = themed?.emoji || '📐';
          const reward = themed?.reward;

          if (isGated) {
            return (
              <button
                key={topic.id}
                onClick={() => setShowGate(true)}
                className="block p-5 rounded-2xl bg-white/60 shadow-sm min-h-[140px] flex flex-col justify-between opacity-60 text-left w-full"
              >
                <div>
                  <div className="text-3xl mb-2">{displayEmoji}</div>
                  <h2 className="text-lg font-bold mb-1">{displayName}</h2>
                  <p className="text-sm text-gray-600 leading-snug">{topic.description}</p>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-600 font-semibold">🔒 Free account required</p>
                </div>
              </button>
            );
          }

          return (
            <Link
              key={topic.id}
              to={`/maths/session/${moduleId}/${topic.id}`}
              className="block p-5 rounded-2xl border-2 hover:shadow-md transition-all min-h-[140px] flex flex-col justify-between"
              style={{
                backgroundColor: isMastered ? (colours?.cardBg || '#f0fdf4') : '#ffffff',
                borderColor: isMastered ? mod.colour : (colours?.cardBorder || '#e5e7eb'),
              }}
            >
              <div>
                <div className="text-3xl mb-2">{displayEmoji}</div>
                <h2 className="text-lg font-bold mb-1">{displayName}</h2>
                <p className="text-sm text-gray-600 leading-snug">{topic.description}</p>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>
                    {questionsAttempted > 0 ? `${accuracy}%` : 'New'}
                  </span>
                  {isUnlocked && reward && (
                    <span className="font-semibold" style={{ color: mod.colour }}>
                      {reward.emoji} Unlocked!
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: isMastered ? mod.colour : (colours?.accent || '#f59e0b'),
                    }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <ElizabethHelpButton screenKey="mathsSession" />
    </main>
  );
}
