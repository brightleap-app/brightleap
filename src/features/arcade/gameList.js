// Mini-game definitions
// Each game is unlocked by completing a habitat

export const GAMES = [
  {
    id: 'word-catcher',
    name: 'Word Catcher',
    emoji: '🎯',
    description: 'Tap the falling letters in the right order to spell the word!',
    habitat: 'jungle',
    colour: '#16a34a',
  },
  {
    id: 'bubble-pop',
    name: 'Bubble Pop',
    emoji: '🫧',
    description: 'Pop the bubbles in the right order to spell each word!',
    habitat: 'ocean',
    colour: '#0ea5e9',
  },
  {
    id: 'speed-spell',
    name: 'Speed Spell',
    emoji: '⚡',
    description: 'How many words can you spell in 60 seconds?',
    habitat: 'savannah',
    colour: '#f59e0b',
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    emoji: '🧠',
    description: 'Flip the cards to match words with their spellings!',
    habitat: 'arctic',
    colour: '#6366f1',
  },
];

export function isGameUnlocked(gameId, progress) {
  const game = GAMES.find((g) => g.id === gameId);
  if (!game) return false;
  return (progress.unlockedAnimals || []).includes(game.habitat);
}
