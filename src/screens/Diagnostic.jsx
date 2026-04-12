import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import diagnosticData from '../data/diagnosticWords.json';
import { speakWord, speakSentence, isSpeechAvailable } from '../engine/speech.js';
import { checkAnswer } from '../engine/quiz.js';
import { loadProgress, saveProgress } from '../storage/progress.js';
import { useAuth } from '../auth/AuthContext.jsx';
import RegisterPrompt from '../components/RegisterPrompt.jsx';

const STATES = {
  INTRO: 'INTRO',
  READY: 'READY',
  LISTENING: 'LISTENING',
  TYPING: 'TYPING',
  GOT_IT: 'GOT_IT',
  RESULTS: 'RESULTS',
};

// Flatten all diagnostic words into a single ordered list
function buildWordList() {
  const list = [];
  for (const group of diagnosticData) {
    for (const w of group.words) {
      list.push({ ...w, habitat: group.habitat, habitatName: group.habitatName, emoji: group.emoji });
    }
  }
  return list;
}

// Determine colour band for a score out of 3
function getScoreBand(score) {
  if (score === 3) return { colour: '#22c55e', bg: '#f0fdf4', border: '#86efac', label: 'Strong!' };
  if (score === 2) return { colour: '#f59e0b', bg: '#fffbeb', border: '#fcd34d', label: 'Getting there!' };
  return { colour: '#ef4444', bg: '#fef2f2', border: '#fca5a5', label: "Let's explore this one!" };
}

export default function Diagnostic() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  if (!isLoggedIn) return <RegisterPrompt feature="the Explorer Quiz" />;

  const [words] = useState(() => buildWordList());
  const [wordIndex, setWordIndex] = useState(0);
  const [state, setState] = useState(STATES.INTRO);
  const [typed, setTyped] = useState('');
  const [results, setResults] = useState([]);

  const currentWord = words[wordIndex];
  const totalWords = words.length;

  // Auto-speak when entering READY
  const handleSpeak = useCallback(async () => {
    if (!currentWord || !isSpeechAvailable()) {
      setState(STATES.TYPING);
      return;
    }
    setState(STATES.LISTENING);
    try {
      await speakWord(currentWord.word);
    } catch {
      // Continue anyway
    }
    setState(STATES.TYPING);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentWord]);

  useEffect(() => {
    if (state === STATES.READY && currentWord) {
      handleSpeak();
    }
  }, [state, currentWord, handleSpeak]);

  // --- Intro screen ---
  if (state === STATES.INTRO) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6 max-w-md mx-auto">
        <div className="text-5xl">🗺️</div>
        <h1 className="text-2xl font-bold">Explorer Quiz</h1>
        <p className="text-gray-600 leading-relaxed">
          Let's do a quick explorer quiz so I can see which habitats you'll love the most!
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Don't worry — this isn't a test. It's just to help me help you!
          There are {totalWords} words and it takes about 5 minutes.
        </p>
        <button
          onClick={() => setState(STATES.READY)}
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Let's Go!
        </button>
        <Link
          to="/"
          className="text-sm text-gray-600 hover:text-gray-800 transition-colors min-h-[48px] flex items-center"
        >
          Maybe later
        </Link>
      </main>
    );
  }

  // --- Results screen ---
  if (state === STATES.RESULTS) {
    // Calculate scores per habitat
    const scores = {};
    for (const r of results) {
      if (!scores[r.habitat]) scores[r.habitat] = { correct: 0, total: 0, habitatName: r.habitatName, emoji: r.emoji };
      scores[r.habitat].total += 1;
      if (r.correct) scores[r.habitat].correct += 1;
    }

    const totalCorrect = results.filter((r) => r.correct).length;

    // Find strongest and weakest
    const entries = Object.entries(scores);
    const strongest = entries.reduce((a, b) => (b[1].correct > a[1].correct ? b : a));
    const weakest = entries.reduce((a, b) => (b[1].correct < a[1].correct ? b : a));

    return (
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🗺️</div>
          <h1 className="text-2xl font-bold mb-2">Your Explorer Map</h1>
          <p className="text-gray-600">
            You got {totalCorrect} out of {totalWords} — great effort!
          </p>
        </div>

        {/* Encouragement */}
        <div className="p-4 bg-green-50 rounded-xl mb-6 text-center">
          <p className="text-green-800 text-sm leading-relaxed">
            Wow, you're really good at <strong>{strongest[1].emoji} {strongest[1].habitatName}</strong> words!
            {weakest[0] !== strongest[0] && (
              <> And I can see we'll have fun exploring <strong>{weakest[1].emoji} {weakest[1].habitatName}</strong> together!</>
            )}
          </p>
        </div>

        {/* Habitat score cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {diagnosticData.map((group) => {
            const s = scores[group.habitat] || { correct: 0, total: 3 };
            const band = getScoreBand(s.correct);
            return (
              <div
                key={group.habitat}
                className="p-4 rounded-xl border-2 text-center"
                style={{ backgroundColor: band.bg, borderColor: band.border }}
              >
                <div className="text-2xl mb-1">{group.emoji}</div>
                <h3 className="font-bold text-sm mb-1">{group.habitatName}</h3>
                <p className="text-xs text-gray-600 mb-2">{group.rule}</p>
                <div className="flex justify-center gap-1 mb-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full"
                      style={{
                        backgroundColor: i < s.correct ? band.colour : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs font-semibold" style={{ color: band.colour }}>
                  {band.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            to="/habitats"
            className="w-full py-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px] text-center"
          >
            Start Exploring!
          </Link>
          <Link
            to="/"
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px] text-center"
          >
            Home
          </Link>
        </div>
      </main>
    );
  }

  // --- "Got it!" transition ---
  if (state === STATES.GOT_IT) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-4xl">👍</div>
        <p className="text-lg font-semibold text-gray-700">Got it! Next word...</p>
      </main>
    );
  }

  // --- Main quiz loop ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (state !== STATES.TYPING || !typed.trim()) return;

    const correct = checkAnswer(typed, currentWord.word);

    // Record result
    setResults((prev) => [...prev, {
      word: currentWord.word,
      habitat: currentWord.habitat,
      habitatName: currentWord.habitatName,
      emoji: currentWord.emoji,
      correct,
      typed: typed.trim(),
    }]);

    // Show "Got it!" briefly, then move to next word
    setState(STATES.GOT_IT);

    setTimeout(() => {
      const nextIndex = wordIndex + 1;
      if (nextIndex >= totalWords) {
        // Save results to progress before showing results screen
        saveResults([...results, {
          word: currentWord.word,
          habitat: currentWord.habitat,
          habitatName: currentWord.habitatName,
          emoji: currentWord.emoji,
          correct,
          typed: typed.trim(),
        }]);
        setState(STATES.RESULTS);
      } else {
        setWordIndex(nextIndex);
        setTyped('');
        setState(STATES.READY);
      }
    }, 1200);
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

  // Sentence with visible gap
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
          to="/"
          className="text-green-700 font-semibold min-h-[48px] min-w-[48px] flex items-center"
        >
          ← Back
        </Link>
        <div className="text-center">
          <span className="text-sm text-gray-600">🗺️ Explorer Quiz</span>
          <div className="text-xs text-gray-600">
            Word {wordIndex + 1} of {totalWords}
          </div>
        </div>
        <div className="w-12" />
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${(wordIndex / totalWords) * 100}%` }}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Hear buttons */}
        {(state === STATES.TYPING || state === STATES.LISTENING) && (
          <div className="text-center space-y-4">
            <button
              onClick={handleHearAgain}
              className="w-20 h-20 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors flex items-center justify-center text-4xl shadow-sm"
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
        {state === STATES.LISTENING && (
          <p className="text-gray-600 animate-pulse">Listening...</p>
        )}

        {/* Typing input */}
        {state === STATES.TYPING && (
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <input
              ref={inputRef}
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type the word here..."
              className="w-full text-center text-xl p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button
              type="submit"
              disabled={!typed.trim()}
              className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 transition-colors min-h-[48px]"
            >
              Next →
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

// Save diagnostic results to progress
function saveResults(allResults) {
  const scores = {};
  for (const r of allResults) {
    if (!scores[r.habitat]) scores[r.habitat] = 0;
    if (r.correct) scores[r.habitat] += 1;
  }

  const progress = loadProgress();
  progress.diagnosticResults = {
    dateTaken: new Date().toISOString().slice(0, 10),
    scores,
    words: allResults.map((r) => ({ word: r.word, habitat: r.habitat, correct: r.correct })),
  };
  saveProgress(progress);
}
