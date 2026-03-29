// Quiz state machine — present word, check answer, feedback

export const QUIZ_STATES = {
  READY: 'READY',
  LISTENING: 'LISTENING',
  TYPING: 'TYPING',
  CHECKING: 'CHECKING',
  CORRECT_FEEDBACK: 'CORRECT_FEEDBACK',
  WRONG_FEEDBACK: 'WRONG_FEEDBACK',
  HABITAT_COMPLETE: 'HABITAT_COMPLETE',
  SESSION_COMPLETE: 'SESSION_COMPLETE',
};

const CORRECT_MESSAGES = [
  'Amazing work! 🌟',
  'Brilliant! Keep going! 🎉',
  'You nailed it! 💪',
  'Superstar speller! ⭐',
  'Fantastic effort! 🏆',
  'Wonderful! You\'re on fire! 🔥',
  'Great job, explorer! 🌍',
  'That\'s the way! 👏',
];

const WRONG_MESSAGES = [
  'So close! Let\'s look at the tricky part.',
  'Good try! This one\'s a tricky word.',
  'Nearly there! Let\'s see where it went wrong.',
  'Don\'t worry — this is a tough one!',
  'Nice effort! Let\'s take another look.',
];

export function getCorrectMessage() {
  return CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
}

export function getWrongMessage() {
  return WRONG_MESSAGES[Math.floor(Math.random() * WRONG_MESSAGES.length)];
}

export function checkAnswer(typed, correct) {
  return typed.trim().toLowerCase() === correct.toLowerCase();
}

export function calculateXP(wasFirstAttempt) {
  return wasFirstAttempt ? 15 : 10; // 10 base + 5 first-attempt bonus
}

export const EXPLORER_LEVELS = [
  { level: 1, name: 'Curious Cub', xpRequired: 0 },
  { level: 2, name: 'Trail Scout', xpRequired: 50 },
  { level: 3, name: 'Jungle Tracker', xpRequired: 120 },
  { level: 4, name: 'Wildlife Spotter', xpRequired: 200 },
  { level: 5, name: 'Safari Guide', xpRequired: 300 },
  { level: 6, name: 'Expedition Leader', xpRequired: 420 },
  { level: 7, name: 'Master Explorer', xpRequired: 560 },
  { level: 8, name: 'Legendary Naturalist', xpRequired: 720 },
];

export function getExplorerLevel(xp) {
  let current = EXPLORER_LEVELS[0];
  for (const level of EXPLORER_LEVELS) {
    if (xp >= level.xpRequired) current = level;
    else break;
  }
  const nextIndex = EXPLORER_LEVELS.indexOf(current) + 1;
  const next = nextIndex < EXPLORER_LEVELS.length ? EXPLORER_LEVELS[nextIndex] : null;
  return { current, next };
}

export const HABITAT_UNLOCK_THRESHOLD = 7;
