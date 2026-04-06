import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import habitats from '../../data/habitats.json';
import { speakWord, isSpeechAvailable } from '../../engine/speech.js';

function getRandomWords(count = 6) {
  const all = habitats.flatMap((h) => h.words.map((w) => w.word));
  return [...all].sort(() => Math.random() - 0.5).slice(0, count);
}

export default function BubblePop() {
  const [gameState, setGameState] = useState('intro');
  const [words, setWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [popped, setPopped] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [shake, setShake] = useState(false);
  const [wordComplete, setWordComplete] = useState(false);

  const currentWord = words[wordIndex];

  const setupWord = useCallback((word) => {
    const chars = word.split('');
    // Add some decoy letters
    const decoys = 'abcdefghijklmnopqrstuvwxyz'.split('').sort(() => Math.random() - 0.5).slice(0, 3);
    const allChars = [...chars, ...decoys].sort(() => Math.random() - 0.5);

    setBubbles(allChars.map((ch, i) => ({
      id: `${i}-${ch}-${Math.random()}`,
      letter: ch,
      x: 10 + (i % 4) * 22 + Math.random() * 10,
      y: 15 + Math.floor(i / 4) * 25 + Math.random() * 10,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.5,
      size: 38 + Math.random() * 12,
      alive: true,
    })));
    setPopped([]);
    setWordComplete(false);
  }, []);

  // Speak the word when it changes (for 2nd word onwards)
  const spokenRef = useRef('');
  useEffect(() => {
    if (gameState === 'playing' && currentWord && currentWord !== spokenRef.current) {
      spokenRef.current = currentWord;
      speakWord(currentWord).catch(() => {});
    }
  }, [gameState, currentWord]);

  const handleHearWord = () => {
    if (currentWord) {
      speakWord(currentWord).catch(() => {});
    }
  };

  const startGame = () => {
    const w = getRandomWords(6);
    setWords(w);
    setWordIndex(0);
    setScore(0);
    setTimeLeft(60);
    setupWord(w[0]);
    setGameState('playing');
    // Speak first word directly from user click (avoids autoplay block)
    spokenRef.current = w[0];
    speakWord(w[0]).catch(() => {});
  };

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

  // Float animation — bubbles drift and bounce off edges
  useEffect(() => {
    if (gameState !== 'playing') return;
    const frame = setInterval(() => {
      setBubbles((prev) =>
        prev.map((b) => {
          if (!b.alive) return b;
          let { x, y, dx, dy } = b;
          x += dx;
          y += dy;
          // Bounce off edges (keep within 5%–95%)
          if (x < 5 || x > 95) dx = -dx;
          if (y < 5 || y > 90) dy = -dy;
          // Add a gentle wobble so movement feels organic
          dx += (Math.random() - 0.5) * 0.04;
          dy += (Math.random() - 0.5) * 0.04;
          // Cap speed so it stays fun, not frustrating
          const maxSpeed = 0.45;
          dx = Math.max(-maxSpeed, Math.min(maxSpeed, dx));
          dy = Math.max(-maxSpeed, Math.min(maxSpeed, dy));
          return { ...b, x, y, dx, dy };
        })
      );
    }, 50);
    return () => clearInterval(frame);
  }, [gameState]);

  const handlePop = (bubble) => {
    if (!bubble.alive || gameState !== 'playing' || !currentWord || wordComplete) return;

    const nextIndex = popped.length;
    if (bubble.letter === currentWord[nextIndex]) {
      const newPopped = [...popped, bubble.letter];
      setPopped(newPopped);
      setBubbles((prev) => prev.map((b) => b.id === bubble.id ? { ...b, alive: false } : b));

      if (newPopped.length === currentWord.length) {
        setScore((s) => s + 1);
        setWordComplete(true);
        const next = wordIndex + 1;
        if (next < words.length) {
          setTimeout(() => {
            setWordIndex(next);
            setupWord(words[next]);
          }, 800);
        } else {
          setTimeout(() => setGameState('complete'), 800);
        }
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
  };

  if (gameState === 'intro') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-5">
        <div className="text-5xl">🫧</div>
        <h1 className="text-2xl font-bold">Bubble Pop</h1>

        <div className="bg-cyan-50 rounded-2xl p-5 max-w-sm text-left space-y-3">
          <p className="font-semibold text-cyan-800 text-center">How to play:</p>
          <div className="flex items-start gap-3">
            <span className="bg-cyan-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">1</span>
            <p className="text-gray-700">Listen to the word. Tap the speaker button if you need to hear it again.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-cyan-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">2</span>
            <p className="text-gray-700">Pop the letter bubbles <strong>in the right order</strong> to spell the word.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-cyan-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shrink-0">3</span>
            <p className="text-gray-700">Watch out for extra letters that don't belong!</p>
          </div>
        </div>

        <button onClick={startGame} className="px-8 py-4 bg-cyan-600 text-white rounded-2xl text-lg font-semibold hover:bg-cyan-700 transition-colors min-h-[48px]">
          Play!
        </button>
        <Link to="/arcade" className="text-sm text-gray-400 hover:text-gray-600 min-h-[48px] flex items-center">← Back to Arcade</Link>
      </main>
    );
  }

  if (gameState === 'complete') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">🎉</div>
        <h1 className="text-2xl font-bold">Bubble-icious!</h1>
        <p className="text-lg text-gray-600">You popped {score} words!</p>
        <div className="flex gap-4">
          <button onClick={startGame} className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-colors min-h-[48px]">Play Again</button>
          <Link to="/arcade" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px]">Arcade</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen flex flex-col p-4 max-w-md mx-auto select-none ${shake ? 'animate-pulse' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-600">⏱ {timeLeft}s</span>
        <span className="text-sm font-bold">🫧 {score} words</span>
      </div>

      {/* Hear word button + letter slots */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <button
          onClick={handleHearWord}
          className="w-12 h-12 rounded-full bg-cyan-100 hover:bg-cyan-200 active:bg-cyan-300 transition-colors flex items-center justify-center text-xl shrink-0"
          aria-label="Hear word again"
        >
          🔊
        </button>
        <div className="flex gap-1 flex-wrap justify-center">
          {currentWord?.split('').map((ch, i) => {
            const isFilled = i < popped.length;
            const isNext = i === popped.length && !wordComplete;
            return (
              <div
                key={i}
                className={`w-8 h-10 sm:w-9 sm:h-11 rounded-lg border-2 flex items-center justify-center text-base sm:text-lg font-bold transition-colors ${
                  isFilled
                    ? 'bg-cyan-100 border-cyan-500 text-cyan-700'
                    : isNext
                      ? 'bg-yellow-50 border-yellow-400 animate-pulse'
                      : 'bg-gray-50 border-gray-300'
                }`}
              >
                {isFilled ? popped[i] : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Word complete flash */}
      {wordComplete && (
        <div className="text-center text-green-600 font-bold text-lg mb-2 animate-bounce">
          Great!
        </div>
      )}

      {/* Bubble area */}
      <div className="flex-1 relative bg-gradient-to-b from-cyan-50 to-blue-50 rounded-2xl overflow-hidden min-h-[400px]">
        {bubbles.filter((b) => b.alive).map((b) => (
          <button
            key={b.id}
            onClick={() => handlePop(b)}
            className="absolute rounded-full bg-gradient-to-br from-white to-cyan-100 shadow-lg border border-cyan-200 flex items-center justify-center font-bold text-cyan-800 hover:scale-110 active:scale-90 transition-transform"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.size,
              height: b.size,
              transform: 'translate(-50%, -50%)',
              fontSize: b.size * 0.4,
            }}
          >
            {b.letter}
          </button>
        ))}
      </div>
    </main>
  );
}
