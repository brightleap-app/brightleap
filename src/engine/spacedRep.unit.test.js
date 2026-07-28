import { describe, it, expect, vi } from 'vitest';

vi.mock('../storage/progress.js', () => ({
  loadProgress: vi.fn(),
}));

vi.mock('./shuffle.js', () => ({
  shuffle: (items) => items,
}));

import { loadProgress } from '../storage/progress.js';
import { getSessionWords, isWordDue } from './spacedRep.js';

describe("isWordDue", () => {
  it("returns true for unseen words", () => {
    loadProgress.mockReturnValue({
      wordHistory: {},
    });

    expect(isWordDue("cat")).toBe(true);
  });
});

describe("getSessionWords", () => {
  it("prioritises due words before unseen and future words", () => {
    loadProgress.mockReturnValue({
      wordHistory: {
        apple: {
          lastSeen: 1,
          nextReview: Date.now() - 1000,
        },
        banana: {
          lastSeen: 1,
          nextReview: Date.now() + 100000,
        },
      },
    });

    const words = [{ word: "banana" }, { word: "cat" }, { word: "apple" }];

    const result = getSessionWords(words);

    expect(result.map((w) => w.word)).toEqual(["apple", "cat", "banana"]);
  });
});

it("returns only the requested number of words", () => {
  loadProgress.mockReturnValue({
    wordHistory: {},
  });

  const words = [{ word: "a" }, { word: "b" }, { word: "c" }];

  const result = getSessionWords(words, 2);

  expect(result).toHaveLength(2);
});

it("places unseen words before words that are not yet due", () => {
  loadProgress.mockReturnValue({
    wordHistory: {
      dog: {
        lastSeen: 1,
        nextReview: Date.now() + 100000,
      },
    },
  });

  const words = [{ word: "dog" }, { word: "cat" }];

  const result = getSessionWords(words);

  expect(result.map((w) => w.word)).toEqual(["cat", "dog"]);
});