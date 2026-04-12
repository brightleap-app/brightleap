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

const SUBJECTS = [
  { id: 'english', label: 'English', emoji: '📖' },
  { id: 'maths', label: 'Maths', emoji: '🧮' },
  { id: 'science', label: 'Science', emoji: '🔬', comingSoon: true },
];

// Button configs per subject — same 6 slots, different labels/destinations
const SUBJECT_ACTIONS = {
  english: [
    { to: '/trails', label: 'Start Exploring', primary: true, emoji: '' },
    { to: '/diagnostic', label: 'Explorer Quiz', emoji: '🗺️', bg: 'bg-blue-100', text: 'text-blue-800', hover: 'hover:bg-blue-200' },
    { to: '/mock-sats', label: 'Mock SATs Test', emoji: '📝', bg: 'bg-purple-100', text: 'text-purple-800', hover: 'hover:bg-purple-200' },
    { to: '/arcade', label: 'Arcade', emoji: '🕹️', bg: 'bg-red-100', text: 'text-red-800', hover: 'hover:bg-red-200' },
    { to: '/collection', label: 'My Collection', emoji: '', bg: 'bg-amber-100', text: 'text-amber-800', hover: 'hover:bg-amber-200' },
    { to: '/settings', label: 'Settings', emoji: '', bg: 'bg-gray-100', text: 'text-gray-600', hover: 'hover:bg-gray-200' },
  ],
  maths: [
    { to: '/maths', label: 'Start Learning', primary: true, emoji: '' },
    { to: '/maths/diagnostic', label: 'Maths Explorer Quiz', emoji: '🧮', bg: 'bg-blue-100', text: 'text-blue-800', hover: 'hover:bg-blue-200' },
    { to: '/maths/mock-sats', label: 'Mock SATs Test', emoji: '📝', bg: 'bg-purple-100', text: 'text-purple-800', hover: 'hover:bg-purple-200' },
    { to: '/arcade', label: 'Arcade', emoji: '🕹️', bg: 'bg-red-100', text: 'text-red-800', hover: 'hover:bg-red-200' },
    { to: '/collection', label: 'My Collection', emoji: '', bg: 'bg-amber-100', text: 'text-amber-800', hover: 'hover:bg-amber-200' },
    { to: '/settings', label: 'Settings', emoji: '', bg: 'bg-gray-100', text: 'text-gray-600', hover: 'hover:bg-gray-200' },
  ],
};

export default function Home() {
  const { isLoggedIn, childName, logout, loading } = useAuth();
  const { theme } = useTheme();
  const progress = loadProgress();
  const [elizabethMsg, setElizabethMsg] = useState(null);
  const [activeSubject, setActiveSubject] = useState(
    progress.settings?.activeSubject || 'english'
  );

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

  const handleSubjectChange = (subjectId) => {
    if (SUBJECTS.find((s) => s.id === subjectId)?.comingSoon) return;
    setActiveSubject(subjectId);
    updateProgress({ settings: { ...progress.settings, activeSubject: subjectId } });
  };

  const { current, next } = getExplorerLevel(progress.xp);

  const xpToNext = next ? next.xpRequired - progress.xp : 0;
  const xpProgress = next
    ? ((progress.xp - current.xpRequired) / (next.xpRequired - current.xpRequired)) * 100
    : 100;

  const actions = SUBJECT_ACTIONS[activeSubject] || SUBJECT_ACTIONS.english;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      {/* Avatar */}
      <Link to="/avatar" className="hover:scale-105 transition-transform">
        <AvatarDisplay avatar={progress.avatar || DEFAULT_AVATAR} size={100} />
      </Link>

      <h1 className="text-4xl font-bold">Brightleap</h1>
      <p className="text-lg text-gray-600">{theme.emoji} {theme.name}</p>

      {/* Subject selector */}
      <div className="flex gap-2 w-full max-w-xs">
        {SUBJECTS.map((subject) => {
          const isActive = activeSubject === subject.id;
          const isComingSoon = subject.comingSoon;
          return (
            <button
              key={subject.id}
              onClick={() => handleSubjectChange(subject.id)}
              disabled={isComingSoon}
              className={`flex-1 py-3 rounded-2xl font-semibold transition-all min-h-[48px] ${
                isActive
                  ? 'bg-green-600 text-white shadow-md'
                  : isComingSoon
                    ? 'bg-white/60 text-gray-600 cursor-not-allowed'
                    : 'bg-white/80 text-gray-700 hover:bg-white shadow-sm'
              }`}
            >
              <span className="text-lg">{subject.emoji}</span>
              <span className="block text-sm">{subject.label}</span>
              {isComingSoon && <span className="block text-xs mt-0.5">Coming Soon</span>}
            </button>
          );
        })}
      </div>

      {/* Greeting */}
      {isLoggedIn && childName && (
        <p className="text-green-700 font-semibold">Welcome back, {childName}!</p>
      )}

      {/* Explorer level card */}
      <div className="w-full max-w-xs bg-white/80 rounded-2xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Your Rank</p>
            <p className="text-xl font-bold">{current.name}</p>
          </div>
          {progress.bestStreak > 0 && (
            <div className="bg-amber-50 px-3 py-1 rounded-full text-sm font-semibold text-amber-700">
              🔥 {progress.bestStreak} streak
            </div>
          )}
        </div>
        {next && (
          <>
            <div className="w-full bg-amber-100 rounded-full h-3 mt-2">
              <div
                className="h-3 rounded-full bg-amber-500 transition-all duration-500"
                style={{
                  width: `${Math.min(xpProgress, 100)}%`,
                  boxShadow: '0 0 8px rgba(245, 158, 11, 0.4)',
                }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {xpToNext} XP to {next.name}
            </p>
          </>
        )}
      </div>

      {/* Action buttons — same layout for all subjects */}
      <div className="flex flex-col gap-3 mt-4 w-full max-w-xs">
        {actions.map((action, i) => {
          if (action.comingSoon) {
            return (
              <div
                key={i}
                className={`px-8 py-3 ${action.bg} ${action.text} rounded-2xl font-semibold min-h-[48px] text-center opacity-60 cursor-not-allowed`}
              >
                {action.emoji ? `${action.emoji} ` : ''}{action.label}
                <span className="block text-xs mt-0.5">Coming Soon</span>
              </div>
            );
          }

          if (action.primary) {
            return (
              <Link
                key={i}
                to={action.to}
                className="px-8 py-4 bg-green-600 text-white rounded-2xl text-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px] text-center"
              >
                {action.label}
              </Link>
            );
          }

          return (
            <Link
              key={i}
              to={action.to}
              className={`px-8 py-3 ${action.bg} ${action.text} rounded-2xl font-semibold ${action.hover} transition-colors min-h-[48px] text-center`}
            >
              {action.emoji ? `${action.emoji} ` : ''}{action.label}
            </Link>
          );
        })}
      </div>

      {/* Auth section */}
      <div className="mt-4 text-center">
        {loading ? null : isLoggedIn ? (
          <button
            onClick={logout}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors min-h-[48px]"
          >
            Log out
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-600">Playing as guest — progress saved on this device only</p>
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
        className="text-sm text-gray-600 hover:text-gray-800 transition-colors mt-2"
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
