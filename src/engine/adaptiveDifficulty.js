/**
 * Adaptive Difficulty Engine
 *
 * Tracks correct/incorrect streaks and adjusts difficulty:
 * - 3 correct in a row → increase difficulty by 1
 * - 2 incorrect in a row → decrease difficulty by 1
 * - Never jumps more than 1 level at a time
 */

export function createDifficultyTracker(startingDifficulty = 1, minDifficulty = 1, maxDifficulty = 4) {
  let currentDifficulty = startingDifficulty;
  let correctStreak = 0;
  let incorrectStreak = 0;

  return {
    get difficulty() {
      return currentDifficulty;
    },

    onCorrect() {
      incorrectStreak = 0;
      correctStreak++;
      if (correctStreak >= 3) {
        correctStreak = 0;
        if (currentDifficulty < maxDifficulty) {
          currentDifficulty++;
          return 'increased';
        }
      }
      return 'same';
    },

    onIncorrect() {
      correctStreak = 0;
      incorrectStreak++;
      if (incorrectStreak >= 2) {
        incorrectStreak = 0;
        if (currentDifficulty > minDifficulty) {
          currentDifficulty--;
          return 'decreased';
        }
      }
      return 'same';
    },

    reset(difficulty) {
      currentDifficulty = difficulty ?? startingDifficulty;
      correctStreak = 0;
      incorrectStreak = 0;
    },
  };
}
