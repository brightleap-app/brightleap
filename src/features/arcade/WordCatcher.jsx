import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import habitats from '../../data/habitats.json';

function getRandomWords(count = 5) {
  const all = habitats.flatMap((h) => h.words.map((w) => w.word));
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WordCatcher() {
  const [gameState, setGameState] = useState('intro'); // intro, playing, complete
  const [words, setWords] = useState([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [letters, setLetters] = useState([]);
  const [caught, setCaught] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const intervalRef = useRef(null);

  const currentWord = words[wordIndex];

  // Set up a new word's letters
  const setupWord = useCallback((word) => {
    const chars = word.split('');
    const positioned = shuffle(chars.map((ch, i) => ({
      id: `${i}-${ch}`,
      letter: ch,
      correctIndex: i,
      x: 10 + Math.random() * 80,
      y: -10 - Math.random() * 40,
      speed: 0.3 + Math.random() * 0.3,
    })));
    setLetters(positioned);
    setCaught([]);
  }, []);

  // Start game
  const startGame = () => {
    const w = getRandomWords(6);
    setWords(w);
    setWordIndex(0);
    setScore(0);
    setTimeLeft(60);
    setupWord(w[0]);
    setGameState('playing');
  };

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setGameState('complete');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [gameState]);

  // Animate letters falling
  useEffect(() => {
    if (gameState !== 'playing') return;
    const frame = setInterval(() => {
      setLetters((prev) =>
        prev.map((l) => ({
          ...l,
          y: l.y >= 90 ? -10 - Math.random() * 20 : l.y + l.speed,
          x: l.y >= 90 ? 10 + Math.random() * 80 : l.x,
        }))
      );
    }, 50);
    return () => clearInterval(frame);
  }, [gameState]);

  // Tap a letter
  const handleTap = (letter) => {
    if (gameState !== 'playing' || !currentWord) return;
    const nextIndex = caught.length;
    if (letter.letter === currentWord[nextIndex]) {
      const newCaught = [...caught, letter.letter];
      setCaught(newCaught);
      setLetters((prev) => prev.filter((l) => l.id !== letter.id));

      // Word complete?
      if (newCaught.length === currentWord.length) {
        setScore((s) => s + 1);
        const next = wordIndex + 1;
        if (next < words.length) {
          setWordIndex(next);
          setTimeout(() => setupWord(words[next]), 300);
        } else {
          setGameState('complete');
        }
      }
    }
  };

  // Intro
  if (gameState === 'intro') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">🎯</div>
        <h1 className="text-2xl font-bold">Word Catcher</h1>
        <p className="text-gray-600">Tap the falling letters in the right order to spell the word!</p>
        <button
          onClick={startGame}
          className="px-8 py-4 bg-green-600 text-white rounded-2xl text-lg font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
        >
          Play!
        </button>
        <Link to="/arcade" className="text-sm text-gray-400 hover:text-gray-600 min-h-[48px] flex items-center">
          ← Back to Arcade
        </Link>
      </main>
    );
  }

  // Complete
  if (gameState === 'complete') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">🎉</div>
        <h1 className="text-2xl font-bold">Great Catching!</h1>
        <p className="text-lg text-gray-600">You caught {score} words!</p>
        <div className="flex gap-4">
          <button
            onClick={startGame}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors min-h-[48px]"
          >
            Play Again
          </button>
          <Link
            to="/arcade"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px]"
          >
            Arcade
          </Link>
        </div>
      </main>
    );
  }

  // Playing
  return (
    <main className="min-h-screen flex flex-col p-4 max-w-md mx-auto select-none">
      {/* HUD */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-600">⏱ {timeLeft}s</span>
        <span className="text-sm font-bold">🎯 {score} words</span>
      </div>

      {/* Target word progress */}
      <div className="flex justify-center gap-1 mb-4">
        {currentWord?.split('').map((ch, i) => (
          <div
            key={i}
            className={`w-9 h-11 rounded-lg border-2 flex items-center justify-center text-lg font-bold ${
              i < caught.length
                ? 'bg-green-100 border-green-500 text-green-700'
                : 'bg-gray-50 border-gray-300 text-gray-300'
            }`}
          >
            {i < caught.length ? caught[i] : ''}
          </div>
        ))}
      </div>

      {/* Game area */}
      <div className="flex-1 relative bg-gradient-to-b from-blue-50 to-green-50 rounded-2xl overflow-hidden min-h-[400px]">
        {letters.map((l) => (
          <button
            key={l.id}
            onClick={() => handleTap(l)}
            className="absolute w-11 h-11 rounded-full bg-white shadow-md border-2 border-blue-300 flex items-center justify-center text-lg font-bold text-blue-700 hover:bg-blue-50 active:scale-90 transition-transform"
            style={{
              left: `${l.x}%`,
              top: `${l.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {l.letter}
          </button>
        ))}
      </div>
    </main>
  );
}
