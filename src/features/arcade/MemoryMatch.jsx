import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import habitats from '../../data/habitats.json';

function getMatchPairs(count = 6) {
  const words = habitats.flatMap((h) => h.words.map((w) => w.word));
  const selected = [...words].sort(() => Math.random() - 0.5).slice(0, count);

  // Create pairs: word + scrambled version
  const cards = [];
  selected.forEach((word, i) => {
    cards.push({ id: `w-${i}`, type: 'word', word, display: word, pairId: i });
    // Show word split into syllable-like chunks for the match
    const hint = word.split('').join(' ');
    cards.push({ id: `h-${i}`, type: 'hint', word, display: hint, pairId: i });
  });

  return cards.sort(() => Math.random() - 0.5);
}

export default function MemoryMatch() {
  const [gameState, setGameState] = useState('intro');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);

  const startGame = () => {
    setCards(getMatchPairs(6));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTimeLeft(90);
    setGameState('playing');
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

  // Check for matches
  useEffect(() => {
    if (flipped.length !== 2) return;

    const [a, b] = flipped;
    setMoves((m) => m + 1);

    if (a.pairId === b.pairId) {
      // Match!
      setMatched((prev) => [...prev, a.pairId]);
      setFlipped([]);

      // Check if all matched
      if (matched.length + 1 === cards.length / 2) {
        setTimeout(() => setGameState('complete'), 500);
      }
    } else {
      // No match — flip back
      setTimeout(() => setFlipped([]), 800);
    }
  }, [flipped]);

  const handleFlip = (card) => {
    if (gameState !== 'playing') return;
    if (flipped.length >= 2) return;
    if (flipped.some((f) => f.id === card.id)) return;
    if (matched.includes(card.pairId)) return;

    setFlipped((prev) => [...prev, card]);
  };

  if (gameState === 'intro') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">🧠</div>
        <h1 className="text-2xl font-bold">Memory Match</h1>
        <p className="text-gray-600">Flip cards to match each word with its spaced-out spelling!</p>
        <button onClick={startGame} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-lg font-semibold hover:bg-indigo-700 transition-colors min-h-[48px]">
          Play!
        </button>
        <Link to="/arcade" className="text-sm text-gray-400 hover:text-gray-600 min-h-[48px] flex items-center">← Back to Arcade</Link>
      </main>
    );
  }

  if (gameState === 'complete') {
    const allMatched = matched.length === cards.length / 2;
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-5xl">{allMatched ? '🧠' : '⏰'}</div>
        <h1 className="text-2xl font-bold">{allMatched ? 'Perfect Memory!' : 'Time\'s Up!'}</h1>
        <p className="text-lg text-gray-600">
          {allMatched
            ? `You matched all ${matched.length} pairs in ${moves} moves!`
            : `You matched ${matched.length} of ${cards.length / 2} pairs.`}
        </p>
        <div className="flex gap-4">
          <button onClick={startGame} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors min-h-[48px]">Play Again</button>
          <Link to="/arcade" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors min-h-[48px]">Arcade</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col p-4 max-w-md mx-auto select-none">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-gray-600">⏱ {timeLeft}s</span>
        <span className="text-sm font-bold">🧠 {matched.length}/{cards.length / 2} pairs</span>
        <span className="text-xs text-gray-400">{moves} moves</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {cards.map((card) => {
          const isFlipped = flipped.some((f) => f.id === card.id);
          const isMatched = matched.includes(card.pairId);
          const showFace = isFlipped || isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card)}
              className={`aspect-square rounded-xl border-2 flex items-center justify-center p-1 text-center transition-all min-h-[48px] ${
                isMatched
                  ? 'bg-green-100 border-green-400'
                  : showFace
                  ? 'bg-indigo-50 border-indigo-400'
                  : 'bg-indigo-600 border-indigo-700 hover:bg-indigo-500'
              }`}
            >
              {showFace ? (
                <span className={`font-bold leading-tight ${
                  card.type === 'word' ? 'text-sm' : 'text-xs tracking-wider text-indigo-600'
                }`}>
                  {card.display}
                </span>
              ) : (
                <span className="text-2xl text-white">?</span>
              )}
            </button>
          );
        })}
      </div>
    </main>
  );
}
