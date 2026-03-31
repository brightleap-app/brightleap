import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadProgress, updateProgress } from '../storage/progress.js';
import { getExplorerLevel } from '../engine/quiz.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { useTheme } from '../themes/ThemeContext.jsx';
import ElizabethHelper from '../components/ElizabethHelper.jsx';
import { ElizabethHelpButton } from '../components/ElizabethHelper.jsx';
import dialogue from '../data/elizabethDialogue.json';
import AvatarDisplay from '../features/avatars/AvatarDisplay.jsx';
import { DEFAULT_AVATAR } from '../features/avatars/avatarOptions.js';

export default function Home() {
  const { isLoggedIn, childName, logout, loading } = useAuth();
  const { theme } = useTheme();
  const progress = loadProgress();
  const [elizabethMsg, setElizabethMsg] = useState(null);

  useEffect(() => {
    const isFirstVisit = !progress.hasVisited;
    if (isFirstVisit) {
      setElizabethMsg({
        mood: dialogue.firstVisit.mood,
        message: dialogue.firstVisit.messages.join(' '),
      });
      updateProgress({ hasVisited: true });
    } else if (progress.streak > 0) {
      setElizabethMsg(dialogue.returnVisitWithStreak);
    } else {
      const msgs = dialogue.returnVisit;
      setElizabethMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    }
  }, []);
  const { current, next } = getExplorerLevel(progress.xp);

  const xpToNext = next ? next.xpRequired - progress.xp : 0;
  const xpProgress = next
    ? ((progress.xp - current.xpRequired) / (next.xpRequired - current.xpRequired)) * 100
    : 100;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      {/* Avatar */}
      <Link to="/avatar" className="hover:scale-105 transition-transform">
        <AvatarDisplay avatar={progress.avatar || DEFAULT_AVATAR} size={100} />
      </Link>

      <h1 className="text-4xl font-bold">Brightleap</h1>
      <p className="text-lg text-gray-500">{theme.emoji} {theme.name}</p>

      {/* Greeting */}
      {isLoggedIn && childName && (
        <p className="text-green-700 font-semibold">Welcome back, {childName}!</p>
      )}

      {/* Explorer level */}
      <div className="text-center mt-2">
        <p className="text-sm text-gray-400">Level {current.level}</p>
        <p className="text-xl font-bold text-green-700">{current.name}</p>
        <p className="text-amber-600 font-semibold mt-1">⭐ {progress.xp} XP</p>
      </div>

      {/* XP progress to next level */}
      {next && (
        <div className="w-full max-w-xs">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 text-center mt-1">
            {xpToNext} XP to {next.name}
          </p>
        </div>
      )}

      {/* Streak */}
      {progress.bestStreak > 0 && (
        <p className="text-sm text-amber-600">
          🔥 Best streak: {progress.bestStreak} in a row
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-4 w-full max-w-xs">
        <Link
          to="/habitats"
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px] text-center"
        >
          Start Exploring
        </Link>
        <Link
          to="/diagnostic"
          className="px-8 py-3 bg-blue-100 text-blue-800 rounded-2xl font-semibold hover:bg-blue-200 transition-colors min-h-[48px] text-center"
        >
          🗺️ Explorer Quiz
        </Link>
        <Link
          to="/mock-sats"
          className="px-8 py-3 bg-purple-100 text-purple-800 rounded-2xl font-semibold hover:bg-purple-200 transition-colors min-h-[48px] text-center"
        >
          📝 Mock SATs Test
        </Link>
        <Link
          to="/collection"
          className="px-8 py-3 bg-amber-100 text-amber-800 rounded-2xl font-semibold hover:bg-amber-200 transition-colors min-h-[48px] text-center"
        >
          My Collection
        </Link>
        <Link
          to="/settings"
          className="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px] text-center"
        >
          Settings
        </Link>
      </div>

      {/* Auth section */}
      <div className="mt-4 text-center">
        {loading ? null : isLoggedIn ? (
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors min-h-[48px]"
          >
            Log out
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-400">Playing as guest — progress saved on this device only</p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/login"
                className="text-sm text-green-700 font-semibold hover:text-green-800 min-h-[48px] flex items-center"
              >
                Log in
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                to="/register"
                className="text-sm text-green-700 font-semibold hover:text-green-800 min-h-[48px] flex items-center"
              >
                Create account
              </Link>
            </div>
          </div>
        )}
      </div>
      <Link
        to="/about"
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors mt-2"
      >
        About Brightleap
      </Link>

      {elizabethMsg && (
        <ElizabethHelper
          mood={elizabethMsg.mood}
          message={elizabethMsg.message}
          onDismiss={() => setElizabethMsg(null)}
        />
      )}

      <ElizabethHelpButton screenKey="home" />
    </main>
  );
}
