import { useState } from 'react';
import ElizabethCharacter from './ElizabethCharacter.jsx';
import { speakWord } from '../engine/speech.js';
import entries from '../data/wordOfDay.json';

function getTodaysEntry() {
  // Deterministic selection based on date — everyone sees the same word on the same day
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return entries[dayOfYear % entries.length];
}

export default function WordOfDay() {
  const [expanded, setExpanded] = useState(false);
  const entry = getTodaysEntry();

  if (!entry) return null;

  const handleSpeak = (e) => {
    e.stopPropagation();
    speakWord(entry.word).catch(() => {});
  };

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full max-w-xs bg-white/80 rounded-2xl shadow-sm p-4 text-left transition-all hover:bg-white"
      aria-label={`Word of the day: ${entry.word}. Tap to ${expanded ? 'hide' : 'reveal'} the fact.`}
    >
      <div className="flex items-center gap-3">
        <ElizabethCharacter mood="thinking" size={48} />
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider font-semibold text-amber-600">
            Word of the Day
          </p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold truncate">{entry.word}</p>
            <button
              onClick={handleSpeak}
              className="text-sm opacity-60 hover:opacity-100"
              aria-label={`Hear ${entry.word} spoken`}
            >
              🔊
            </button>
          </div>
        </div>
        <span className="text-xs text-gray-600">
          {expanded ? '▲' : '▼'}
        </span>
      </div>
      {expanded && (
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          {entry.fact}
        </p>
      )}
    </button>
  );
}
