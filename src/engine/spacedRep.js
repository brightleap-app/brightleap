// Spaced repetition scheduling algorithm
// Prioritises words due for review, then unseen words

import { loadProgress } from '../storage/progress.js';
import { shuffle } from './shuffle.js';

export function getSessionWords(habitatWords, count = 10) {
  const progress = loadProgress();
  const now = Date.now();

  const scored = habitatWords.map((w) => {
    const history = progress.wordHistory[w.word];

    if (!history) {
      // Unseen word — priority 1 (after due words)
      return { ...w, priority: 1, lastSeen: 0 };
    }

    if (now >= history.nextReview) {
      // Due for review — highest priority
      return { ...w, priority: 0, lastSeen: history.lastSeen };
    }

    // Not yet due — lowest priority
    return { ...w, priority: 2, lastSeen: history.lastSeen };
  });

  // Keep due words first, then unseen words, then mastered words. Shuffle each
  // priority tier independently so selection order within a tier is uniform.
  const ordered = [0, 1, 2].flatMap((priority) => (
    shuffle(scored.filter((word) => word.priority === priority))
  ));

  return ordered.slice(0, count);
}

export function isWordDue(word) {
  const progress = loadProgress();
  const history = progress.wordHistory[word];
  if (!history) return true;
  return Date.now() >= history.nextReview;
}
