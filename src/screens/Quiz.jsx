import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { speakWord, speakSentence, isSpeechAvailable } from '../engine/speech.js';
import { useTheme } from '../themes/ThemeContext.jsx';
import { getSessionWords } from '../engine/spacedRep.js';
import {
  QUIZ_STATES,
  checkAnswer,
  calculateXP,
  getCorrectMessage,
  getWrongMessage,
  HABITAT_UNLOCK_THRESHOLD,
} from '../engine/quiz.js';
import {
  loadProgress,
  saveProgress,
  saveWordResult,
  saveHabitatProgress,
} from '../storage/progress.js';
import ElizabethHelper from '../components/ElizabethHelper.jsx';
import { ElizabethHelpButton } from '../components/ElizabethHelper.jsx';
import dialogue from '../data/elizabethDialogue.json';
import { useAuth } from '../auth/AuthContext.jsx';
import { isHabitatLocked } from '../features/gating.js';
import RegisterPrompt from '../components/RegisterPrompt.jsx';
import { TRAILS } from '../data/trails.js';

export default function Quiz() {
  const { habitatId } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { isLoggedIn } = useAuth();

  // Get trail from URL param
  const searchParams = new URLSearchParams(window.location.search);
  const trailId = searchParams.get('trail') || 'easter';

  const { habitats: themedHabitats, colours } = useTheme();

  // Find habitat from themed habitats (original trail) or from trail data
  let habitat;
  if (trailId === 'easter') {
    habitat = themedHabitats.find((h) => h.id === habitatId);
  } else {
    const trail = TRAILS.find((t) => t.id === trailId);
    habitat = trail?.habitats.find((h) => h.id === habitatId);
  }

  // Gate locked habitats (only for original trail)
  if (trailId === 'easter' && isHabitatLocked(habitatId, isLoggedIn)) {
    return <RegisterPrompt feature="this habitat" />;
  }

  const [words, setWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [quizState, setQuizState] = useState(QUIZ_STATES.READY);
  const [typed, setTyped] = useState('');
  const [isFirstAttempt, setIsFirstAttempt] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [xpEarned, setXpEarned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [wrongStreak, setWrongStreak] = useState(0);
  const [elizabethMsg, setElizabethMsg] = useState(null);

  // Load session words on mount
  useEffect(() => {
    if (habitat) {
      const sessionWords = getSessionWords(habitat.words, 10);
      setWords(sessionWords);
    }
  }, [habitat]);

  const currentWord = words[wordIndex];

  // Auto-speak word when entering READY state
  const handleSpeak = useCallback(async () => {
    if (!currentWord || !isSpeechAvailable()) return;
    setQuizState(QUIZ_STATES.LISTENING);
    try {
      await speakWord(currentWord.word);
    } catch {
      // Speech failed — continue anyway
    }
    setQuizState(QUIZ_STATES.TYPING);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentWord]);

  useEffect(() => {
    if (quizState === QUIZ_STATES.READY && currentWord) {
      handleSpeak();
    }
  }, [quizState, currentWord, handleSpeak]);

  if (!habitat) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <p>Habitat not found.</p>
        <Link to="/habitats" className="mt-4 text-green-700 font-semibold">← Back to Habitats</Link>
      </main>
    );
  }

  if (words.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <p>Loading words...</p>
      </main>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quizState !== QUIZ_STATES.TYPING || !typed.trim()) return;

    setQuizState(QUIZ_STATES.CHECKING);
    const correct = checkAnswer(typed, currentWord.word);

    if (correct) {
      const xp = calculateXP(isFirstAttempt);
      setXpEarned(xp);
      setSessionXP((prev) => prev + xp);
      setSessionCorrect((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setFeedbackMsg(getCorrectMessage());

      // Save progress
      const progress = saveWordResult(currentWord.word, true, isFirstAttempt);
      const updatedProgress = saveHabitatProgress(habitatId, currentWord.word);

      // Update XP and streak
      const newXP = (updatedProgress.xp || 0) + xp;
      const newStreak = (updatedProgress.streak || 0) + 1;
      const bestStreak = Math.max(newStreak, updatedProgress.bestStreak || 0);
      saveProgress({ ...updatedProgress, xp: newXP, streak: newStreak, bestStreak });

      // Check habitat completion
      const hp = updatedProgress.habitatProgress[habitatId];
      if (hp && hp.correctWords.length >= HABITAT_UNLOCK_THRESHOLD) {
        const animals = updatedProgress.unlockedAnimals || [];
        if (!animals.includes(habitatId)) {
          saveProgress({
            ...loadProgress(),
            unlockedAnimals: [...animals, habitatId],
          });
        }
      }

      setWrongStreak(0);

      // Elizabeth celebrates streaks
      if (streak + 1 === 5) {
        setElizabethMsg(dialogue.quizStreak5);
      } else if (streak + 1 === 10) {
        setElizabethMsg(dialogue.quizStreak10);
      } else if (sessionCorrect === 0 && wordIndex === 0) {
        setElizabethMsg(dialogue.quizFirstCorrect);
      }

      setQuizState(QUIZ_STATES.CORRECT_FEEDBACK);
    } else {
      setStreak(0);
      setFeedbackMsg(getWrongMessage());
      const newWrongStreak = wrongStreak + 1;
      setWrongStreak(newWrongStreak);

      // Elizabeth encourages after 3 wrong in a row
      if (newWrongStreak === 3) {
        const msgs = dialogue.quizWrongStreak;
        setElizabethMsg(msgs[Math.floor(Math.random() * msgs.length)]);
      }

      // Save wrong result
      saveWordResult(currentWord.word, false, isFirstAttempt);
      const progress = loadProgress();
      saveProgress({ ...progress, streak: 0 });

      setQuizState(QUIZ_STATES.WRONG_FEEDBACK);
    }
  };

  const handleNext = () => {
    const nextIndex = wordIndex + 1;
    if (nextIndex >= words.length) {
      // Session complete
      setQuizState(QUIZ_STATES.SESSION_COMPLETE);
    } else {
      setWordIndex(nextIndex);
      setTyped('');
      setIsFirstAttempt(true);
      setFeedbackMsg('');
      setXpEarned(0);
      setQuizState(QUIZ_STATES.READY);
    }
  };

  const handleTryAgain = () => {
    setTyped('');
    setIsFirstAttempt(false);
    setFeedbackMsg('');
    setQuizState(QUIZ_STATES.READY);
  };

  const handleHearAgain = async () => {
    if (!isSpeechAvailable()) return;
    try {
      await speakWord(currentWord.word);
    } catch {
      // Ignore
    }
  };

  const handleHearSentence = async () => {
    if (!isSpeechAvailable() || !currentWord.sentence) return;
    try {
      await speakSentence(currentWord.sentence.replace('_____', currentWord.word), currentWord.word);
    } catch {
      // Ignore
    }
  };

  // Session complete screen
  if (quizState === QUIZ_STATES.SESSION_COMPLETE) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">🌍</div>
        <h1 className="text-2xl font-bold">Great exploring today!</h1>
        <p className="text-lg text-gray-600">
          You got {sessionCorrect} out of {words.length} words right
          and earned {sessionXP} XP!
        </p>
        {streak > 2 && (
          <p className="text-amber-600 font-semibold">
            Best streak this session: {streak} in a row! 🔥
          </p>
        )}
        <p className="text-gray-600">Come back tomorrow for more discoveries!</p>
        <div className="flex gap-4 mt-4">
          <Link
            to="/habitats"
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
          >
            Back to Habitats
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px]"
          >
            Home
          </Link>
        </div>
      </main>
    );
  }

  // Sentence with a visible gap marker
  const renderSentence = (sentence) => {
    if (!sentence) return null;
    const parts = sentence.split('_____');
    return (
      <span>
        {parts[0]}
        <span className="inline-block w-20 border-b-2 border-amber-400 mx-1" />
        {parts[1]}
      </span>
    );
  };

  return (
    <main className="min-h-screen flex flex-col p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/habitats"
          className="text-green-700 font-semibold min-h-[48px] min-w-[48px] flex items-center"
        >
          ← Back
        </Link>
        <div className="text-center">
          <span className="text-sm text-gray-600">{habitat.displayEmoji} {habitat.displayName}</span>
          <div className="text-xs text-gray-600">
            Word {wordIndex + 1} of {words.length}
          </div>
        </div>
        <div className="text-right min-w-[60px]">
          {streak > 0 && (
            <span className="text-amber-600 font-bold text-sm">🔥 {streak}</span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="h-2 rounded-full bg-green-500 transition-all duration-500"
          style={{ width: `${((wordIndex) / words.length) * 100}%` }}
        />
      </div>

      {/* Main quiz area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Hear buttons */}
        {(quizState === QUIZ_STATES.TYPING || quizState === QUIZ_STATES.LISTENING) && (
          <div className="text-center space-y-4">
            <button
              onClick={handleHearAgain}
              className="w-20 h-20 rounded-full bg-green-100 hover:bg-green-200 transition-colors flex items-center justify-center text-4xl shadow-sm"
              aria-label="Hear the word again"
            >
              🔊
            </button>
            <p className="text-sm text-gray-600">Tap to hear the word</p>

            {currentWord.sentence && (
              <div className="mt-3 space-y-2">
                <button
                  onClick={handleHearSentence}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors min-h-[48px]"
                >
                  📖 Hear it in a sentence
                </button>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {renderSentence(currentWord.sentence)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Listening state */}
        {quizState === QUIZ_STATES.LISTENING && (
          <p className="text-gray-600 animate-pulse">Listening...</p>
        )}

        {/* Typing input */}
        {quizState === QUIZ_STATES.TYPING && (
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <input
              ref={inputRef}
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type the word here..."
              className="w-full text-center text-xl p-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button
              type="submit"
              disabled={!typed.trim()}
              className="w-full py-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-600 transition-colors min-h-[48px]"
            >
              Check
            </button>
          </form>
        )}

        {/* Correct feedback */}
        {quizState === QUIZ_STATES.CORRECT_FEEDBACK && (
          <div className="text-center space-y-4">
            <div className="text-5xl">✨</div>
            <p className="text-xl font-bold text-green-700">{feedbackMsg}</p>
            <p className="text-3xl font-bold tracking-wider">{currentWord.word}</p>
            <p className="text-amber-600 font-semibold">+{xpEarned} XP</p>
            <button
              onClick={handleNext}
              className="px-8 py-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
            >
              Next Word →
            </button>
          </div>
        )}

        {/* Wrong feedback — scaffolded explanation */}
        {quizState === QUIZ_STATES.WRONG_FEEDBACK && (
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-amber-700">{feedbackMsg}</p>
            <p className="text-sm text-gray-600">Let me show you this word:</p>
            <div className="bg-blue-50 rounded-2xl p-5 space-y-3">
              <div className="text-3xl font-bold tracking-wider">
                {currentWord.word.split('').map((letter, i) => (
                  <span
                    key={i}
                    className={
                      currentWord.trickyParts?.includes(i)
                        ? 'text-amber-600 underline decoration-2 underline-offset-4'
                        : 'text-gray-800'
                    }
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                The highlighted letters are the tricky parts to watch out for.
              </p>
              {habitat.rule && (
                <div className="bg-white rounded-xl p-3 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    💡 <span className="font-semibold">Spelling rule:</span> {habitat.rule}
                  </p>
                </div>
              )}
              {currentWord.sentence && (
                <p className="text-sm text-gray-600 italic">
                  "{currentWord.sentence.replace('_____', currentWord.word)}"
                </p>
              )}
            </div>
            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={handleTryAgain}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
              >
                Try Again
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px]"
              >
                Skip →
              </button>
            </div>
          </div>
        )}
      </div>

      {elizabethMsg && (
        <ElizabethHelper
          mood={elizabethMsg.mood}
          message={elizabethMsg.message}
          onDismiss={() => setElizabethMsg(null)}
        />
      )}

      <ElizabethHelpButton screenKey="quiz" />
    </main>
  );
}
