// Mock SATs test word selector
// Picks 20 words from the bank ensuring rule coverage and difficulty spread
// Avoids repeating the exact same 20 words on consecutive attempts

import mockTestWords from '../data/mockTestWords.json';
import { loadProgress } from '../storage/progress.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function selectMockTestWords(count = 20) {
  const progress = loadProgress();
  const lastTest = progress.mockTests?.[progress.mockTests.length - 1];
  const lastWords = lastTest ? lastTest.words.map((w) => w.word) : [];

  // Group words by rule
  const byRule = {};
  for (const w of mockTestWords) {
    if (!byRule[w.rule]) byRule[w.rule] = [];
    byRule[w.rule].push(w);
  }

  const selected = [];
  const usedWords = new Set();

  // Step 1: pick 1 word from each rule group to ensure coverage
  const rules = shuffle(Object.keys(byRule));
  for (const rule of rules) {
    if (selected.length >= count) break;

    const candidates = shuffle(byRule[rule]);
    // Prefer words not in the last test
    const preferred = candidates.find((w) => !lastWords.includes(w.word) && !usedWords.has(w.word));
    const fallback = candidates.find((w) => !usedWords.has(w.word));
    const pick = preferred || fallback;

    if (pick) {
      selected.push(pick);
      usedWords.add(pick.word);
    }
  }

  // Step 2: fill remaining slots with a mix of difficulties
  if (selected.length < count) {
    const remaining = shuffle(
      mockTestWords.filter((w) => !usedWords.has(w.word))
    );

    // Prioritise words the child has struggled with
    const wordHistory = progress.wordHistory || {};
    remaining.sort((a, b) => {
      const aHistory = wordHistory[a.word];
      const bHistory = wordHistory[b.word];
      const aStruggle = aHistory ? (aHistory.attempts - aHistory.correct) : 0;
      const bStruggle = bHistory ? (bHistory.attempts - bHistory.correct) : 0;
      return bStruggle - aStruggle;
    });

    for (const w of remaining) {
      if (selected.length >= count) break;
      selected.push(w);
      usedWords.add(w.word);
    }
  }

  // Step 3: sort by difficulty (easy first, hard last — like real SATs)
  const diffOrder = { easy: 0, medium: 1, hard: 2 };
  selected.sort((a, b) => (diffOrder[a.difficulty] || 1) - (diffOrder[b.difficulty] || 1));

  return selected;
}
