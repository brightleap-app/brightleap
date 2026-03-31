import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { speakWord, speakSentence, isSpeechAvailable } from '../engine/speech.js';
import { checkAnswer } from '../engine/quiz.js';
import { selectMockTestWords } from '../engine/mockTestSelector.js';
import { loadProgress, saveProgress } from '../storage/progress.js';
import { useAuth } from '../auth/AuthContext.jsx';
import RegisterPrompt from '../components/RegisterPrompt.jsx';

const STATES = {
  INTRO: 'INTRO',
  READY: 'READY',
  SPEAKING_SENTENCE: 'SPEAKING_SENTENCE',
  SPEAKING_WORD: 'SPEAKING_WORD',
  SPEAKING_SENTENCE_AGAIN: 'SPEAKING_SENTENCE_AGAIN',
  TYPING: 'TYPING',
  PAUSED: 'PAUSED',
  RESULTS: 'RESULTS',
};

const SCORE_BRACKETS = [
  { min: 18, label: 'SATs Superstar!', emoji: '⭐' },
  { min: 14, label: 'Explorer Expert!', emoji: '🌟' },
  { min: 10, label: 'Getting Stronger!', emoji: '💪' },
  { min: 0, label: 'Keep Exploring!', emoji: '🌱' },
];

function getBracket(score) {
  return SCORE_BRACKETS.find((b) => score >= b.min);
}

export default function MockSATs() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const startTimeRef = useRef(null);
  const hasSavedRef = useRef(false);

  const [words, setWords] = useState(() => selectMockTestWords(20));
  const [wordIndex, setWordIndex] = useState(0);
  const [state, setState] = useState(STATES.INTRO);
  const [typed, setTyped] = useState('');
  const [results, setResults] = useState([]);
  const [elapsed, setElapsed] = useState(0);

  const currentWord = words[wordIndex];
  const totalWords = words.length;

  // Timer
  useEffect(() => {
    if (state !== STATES.INTRO && state !== STATES.RESULTS && state !== STATES.PAUSED) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      const interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state]);

  // Save results when test completes
  useEffect(() => {
    if (state === STATES.RESULTS && !hasSavedRef.current) {
      hasSavedRef.current = true;
      const score = results.filter((r) => r.correct).length;
      const progress = loadProgress();
      const mockTests = progress.mockTests || [];
      mockTests.push({
        date: new Date().toISOString().slice(0, 10),
        score,
        total: totalWords,
        elapsed,
        words: results.map((r) => ({ word: r.word, correct: r.correct, typed: r.typed })),
      });
      saveProgress({ ...progress, mockTests });
    }
  }, [state, results, totalWords, elapsed]);

  // SATs-authentic speaking sequence: sentence → word → sentence again
  const handleSpeakSequence = useCallback(async () => {
    if (!currentWord) return;

    if (isSpeechAvailable() && currentWord.sentence) {
      setState(STATES.SPEAKING_SENTENCE);
      try {
        await speakSentence(currentWord.sentence.replace('_____', currentWord.word));
      } catch { /* continue */ }

      setState(STATES.SPEAKING_WORD);
      try {
        await speakWord(currentWord.word);
      } catch { /* continue */ }

      setState(STATES.SPEAKING_SENTENCE_AGAIN);
      try {
        await speakSentence(currentWord.sentence.replace('_____', currentWord.word));
      } catch { /* continue */ }
    }

    setState(STATES.TYPING);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentWord]);

  useEffect(() => {
    if (state === STATES.READY && currentWord) {
      handleSpeakSequence();
    }
  }, [state, currentWord, handleSpeakSequence]);

  // Gate: require registration
  if (!isLoggedIn) return <RegisterPrompt feature="Mock SATs Tests" />;

  // --- Handlers ---
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state !== STATES.TYPING || !typed.trim()) return;

    const correct = checkAnswer(typed, currentWord.word);
    setResults((prev) => [...prev, { word: currentWord.word, correct, typed: typed.trim() }]);

    const nextIndex = wordIndex + 1;
    if (nextIndex >= totalWords) {
      setState(STATES.RESULTS);
    } else {
      setWordIndex(nextIndex);
      setTyped('');
      setState(STATES.READY);
    }
  };

  const handleHearAgain = async () => {
    if (!isSpeechAvailable()) return;
    try {
      if (currentWord.sentence) {
        await speakSentence(currentWord.sentence.replace('_____', currentWord.word));
      }
      await speakWord(currentWord.word);
      if (currentWord.sentence) {
        await speakSentence(currentWord.sentence.replace('_____', currentWord.word));
      }
    } catch { /* ignore */ }
  };

  const renderSentence = (sentence) => {
    if (!sentence) return null;
    const parts = sentence.split('_____');
    return (
      <span>
        {parts[0]}
        <span className="inline-block w-20 border-b-2 border-gray-400 mx-1" />
        {parts[1]}
      </span>
    );
  };

  const handleRetry = () => {
    setWords(selectMockTestWords(20));
    setWordIndex(0);
    setResults([]);
    setElapsed(0);
    startTimeRef.current = null;
    hasSavedRef.current = false;
    setState(STATES.INTRO);
  };

  // --- Renders ---

  // Intro
  if (state === STATES.INTRO) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6 max-w-md mx-auto">
        <div className="text-5xl">📝</div>
        <h1 className="text-2xl font-bold">Mock SATs Spelling Test</h1>
        <p className="text-gray-600 leading-relaxed">
          Ready to try a practice SATs spelling test? This one works just like the real thing —
          I'll read you 20 words and you spell them.
        </p>
        <p className="text-gray-500 text-sm leading-relaxed">
          You won't get any clues this time, but don't worry — it's just practice! You've got this!
        </p>
        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 text-left space-y-2">
          <p><strong>How it works:</strong></p>
          <p>1. You'll hear the word in a sentence</p>
          <p>2. Then the word on its own</p>
          <p>3. Then the sentence again</p>
          <p>4. Type the word and press Next</p>
          <p>You can press "Hear it again" at any time.</p>
        </div>
        <button
          onClick={() => setState(STATES.READY)}
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Start Test
        </button>
        <Link
          to="/"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors min-h-[48px] flex items-center"
        >
          Maybe later
        </Link>
      </main>
    );
  }

  // Paused
  if (state === STATES.PAUSED) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">☕</div>
        <h1 className="text-2xl font-bold">Take a Break</h1>
        <p className="text-gray-600">Need a breather? That's okay! Come back when you're ready.</p>
        <p className="text-sm text-gray-400">Word {wordIndex + 1} of {totalWords}</p>
        <button
          onClick={() => setState(STATES.READY)}
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Continue
        </button>
      </main>
    );
  }

  // Results
  if (state === STATES.RESULTS) {
    const score = results.filter((r) => r.correct).length;
    const bracket = getBracket(score);

    const progress = loadProgress();
    const prevTests = (progress.mockTests || []).slice(0, -1);
    const lastScore = prevTests.length > 0 ? prevTests[prevTests.length - 1].score : null;

    return (
      <main className="min-h-screen p-6 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{bracket.emoji}</div>
          <h1 className="text-2xl font-bold mb-2">
            You got {score} out of {totalWords}!
          </h1>
          <p className="text-xl font-semibold text-green-700">{bracket.label}</p>
          <p className="text-sm text-gray-400 mt-2">Time: {formatTime(elapsed)}</p>

          {lastScore !== null && (
            <div className="mt-3 p-3 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                {score > lastScore
                  ? `That's ${score - lastScore} more than last time! Amazing improvement! 🎉`
                  : score === lastScore
                  ? "Same score as last time — you're staying consistent! 💪"
                  : "Keep practising — you'll beat your last score soon! 🌱"}
              </p>
              <p className="text-xs text-blue-600 mt-1">Last test: {lastScore}/{totalWords}</p>
            </div>
          )}
        </div>

        <h2 className="font-bold text-lg mb-3">Your Answers</h2>
        <div className="space-y-2 mb-8">
          {results.map((r, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border flex items-center gap-3 ${
                r.correct ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
              }`}
            >
              <span className="text-lg">{r.correct ? '✓' : '✗'}</span>
              <div className="flex-1">
                <span className="font-semibold">{r.word}</span>
                {!r.correct && (
                  <span className="text-sm text-gray-500 ml-2">
                    (you wrote: {r.typed})
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{i + 1}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {results.some((r) => !r.correct) && (
            <Link
              to="/habitats"
              className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors min-h-[48px] text-center"
            >
              Practise My Tricky Words
            </Link>
          )}
          <button
            onClick={handleRetry}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
          >
            Try Another Test
          </button>
          <Link
            to="/"
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px] text-center"
          >
            Home
          </Link>
        </div>

        {prevTests.length > 0 && (
          <div className="mt-8">
            <h2 className="font-bold text-lg mb-3">Previous Tests</h2>
            <div className="space-y-2">
              {[...prevTests].reverse().slice(0, 5).map((t, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t.date}</span>
                  <span className="font-semibold">{t.score}/{t.total}</span>
                  <span className="text-xs text-gray-400">{formatTime(t.elapsed)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    );
  }

  // Loading
  if (!currentWord) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <p>Loading test...</p>
      </main>
    );
  }

  // Main test loop (READY, SPEAKING_*, TYPING)
  const isSpeaking = [STATES.READY, STATES.SPEAKING_SENTENCE, STATES.SPEAKING_WORD, STATES.SPEAKING_SENTENCE_AGAIN].includes(state);

  return (
    <main className="min-h-screen flex flex-col p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setState(STATES.PAUSED)}
          className="text-gray-500 font-semibold min-h-[48px] min-w-[48px] flex items-center text-sm"
        >
          Pause
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-600 font-semibold">Spelling Test</span>
          <div className="text-xs text-gray-400">
            Word {wordIndex + 1} of {totalWords}
          </div>
        </div>
        <div className="w-12" />
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="h-2 rounded-full bg-gray-500 transition-all duration-500"
          style={{ width: `${(wordIndex / totalWords) * 100}%` }}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {isSpeaking && (
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl animate-pulse">
              🔊
            </div>
            <p className="text-sm text-gray-500">
              {state === STATES.READY && 'Getting ready...'}
              {state === STATES.SPEAKING_SENTENCE && 'Listening to the sentence...'}
              {state === STATES.SPEAKING_WORD && 'Listening to the word...'}
              {state === STATES.SPEAKING_SENTENCE_AGAIN && 'Listening to the sentence again...'}
            </p>
          </div>
        )}

        {state === STATES.TYPING && (
          <div className="w-full space-y-6">
            {currentWord.sentence && (
              <p className="text-center text-gray-600 leading-relaxed">
                {renderSentence(currentWord.sentence)}
              </p>
            )}

            <div className="text-center">
              <button
                onClick={handleHearAgain}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors min-h-[48px]"
              >
                🔊 Hear it again
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
              <input
                ref={inputRef}
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Type the word here..."
                className="w-full text-center text-xl p-4 border-2 border-gray-300 rounded-xl focus:border-gray-500 focus:outline-none"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <button
                type="submit"
                disabled={!typed.trim()}
                className="w-full py-4 bg-gray-700 text-white rounded-xl text-lg font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 transition-colors min-h-[48px]"
              >
                Next →
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
