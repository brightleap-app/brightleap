import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import habitats from '../../data/habitats.json';
import { speakWord, isSpeechAvailable } from '../../engine/speech.js';
import { checkAnswer } from '../../engine/quiz.js';

function getRandomWords(count = 20) {
  const all = habitats.flatMap((h) => h.words.map((w) => w.word));
  return [...all].sort(() => Math.random() - 0.5).slice(0, count);
}

export default function SpeedSpell() {
  const [gameState, setGameState] = useState('intro');
  const [words, setWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lastResult, setLastResult] = useState(null);
  const inputRef = useRef(null);

  const currentWord = words[wordIndex];

  const startGame = () => {
    const w = getRandomWords(20);
    setWords(w);
    setWordIndex(0);
    setScore(0);
    setTimeLeft(60);
    setTyped('');
    setLastResult(null);
    setGameState('playing');
  };

  // Auto-speak word
  useEffect(() => {
    if (gameState === 'playing' && currentWord && isSpeechAvailable()) {
      speakWord(currentWord).catch(() => {});
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [gameState, currentWord]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(t); setGameState('complete'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [gameState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!typed.trim() || !currentWord) return;

    const correct = checkAnswer(typed, currentWord);
    if (correct) {
      setScore((s) => s + 1);
      setLastResult('correct');
    } else {
      setLastResult('wrong');
    }

    setTyped('');
    const next = wordIndex + 1;
    if (next < words.length) {
      setWordIndex(next);
    } else {
      setGameState('complete');
    }

    setTimeout(() => setLastResult(null), 500);
  };

  const handleHearAgain = () => {
    if (currentWord && isSpeechAvailable()) {
      speakWord(currentWord).catch(() => {});
    }
  };

  if (gameState === 'intro') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">⚡</div>
        <h1 className="text-2xl font-bold">Speed Spell</h1>
        <p className="text-gray-600">How many words can you spell correctly in 60 seconds? Listen and type as fast as you can!</p>
        <button onClick={startGame} className="px-8 py-4 bg-amber-500 text-white rounded-2xl text-lg font-semibold hover:bg-amber-600 transition-colors min-h-[48px]">
          Play!
        </button>
        <Link to="/arcade" className="text-sm text-gray-400 hover:text-gray-600 min-h-[48px] flex items-center">← Back to Arcade</Link>
      </main>
    );
  }

  if (gameState === 'complete') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">⚡</div>
        <h1 className="text-2xl font-bold">Speed Demon!</h1>
        <p className="text-lg text-gray-600">You spelled {score} words in 60 seconds!</p>
        <div className="flex gap-4">
          <button onClick={startGame} className="px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors min-h-[48px]">Play Again</button>
          <Link to="/arcade" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px]">Arcade</Link>
        </div>
      </main>
    );
  }

  // Timer bar colour
  const timerPercent = (timeLeft / 60) * 100;
  const timerColour = timeLeft > 20 ? '#f59e0b' : timeLeft > 10 ? '#f97316' : '#ef4444';

  return (
    <main className="min-h-screen flex flex-col p-4 max-w-md mx-auto">
      {/* HUD */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-600">⏱ {timeLeft}s</span>
        <span className="text-sm font-bold">⚡ {score} words</span>
      </div>

      {/* Timer bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className="h-3 rounded-full transition-all duration-1000"
          style={{ width: `${timerPercent}%`, backgroundColor: timerColour }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Feedback flash */}
        {lastResult && (
          <div className={`text-3xl ${lastResult === 'correct' ? 'text-green-500' : 'text-red-400'}`}>
            {lastResult === 'correct' ? '✓' : '✗'}
          </div>
        )}

        {/* Hear button */}
        <button
          onClick={handleHearAgain}
          className="w-20 h-20 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors flex items-center justify-center text-4xl shadow-sm"
          aria-label="Hear the word"
        >
          🔊
        </button>
        <p className="text-sm text-gray-500">Tap to hear the word</p>

        {/* Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type and go!"
            className="w-full text-center text-xl p-4 border-2 border-amber-300 rounded-xl focus:border-amber-500 focus:outline-none"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <button
            type="submit"
            disabled={!typed.trim()}
            className="w-full py-4 bg-amber-500 text-white rounded-xl text-lg font-semibold hover:bg-amber-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors min-h-[48px]"
          >
            Go! →
          </button>
        </form>
      </div>
    </main>
  );
}
