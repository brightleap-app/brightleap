// Avatar customisation options
// All options are inclusive and gender-neutral

export const SKIN_TONES = [
  { id: 'light', colour: '#fcd9b6', label: 'Light' },
  { id: 'fair', colour: '#f5c6a0', label: 'Fair' },
  { id: 'medium', colour: '#d4a574', label: 'Medium' },
  { id: 'olive', colour: '#c68e5b', label: 'Olive' },
  { id: 'tan', colour: '#a0714f', label: 'Tan' },
  { id: 'brown', colour: '#8b5e3c', label: 'Brown' },
  { id: 'dark-brown', colour: '#6b4226', label: 'Dark Brown' },
  { id: 'deep', colour: '#4a2d17', label: 'Deep' },
];

export const EYE_STYLES = [
  { id: 'round', label: 'Round' },
  { id: 'happy', label: 'Happy' },
  { id: 'curious', label: 'Curious' },
  { id: 'sparkle', label: 'Sparkle' },
  { id: 'cool', label: 'Cool' },
  { id: 'wink', label: 'Wink' },
];

export const MOUTH_STYLES = [
  { id: 'smile', label: 'Smile' },
  { id: 'grin', label: 'Grin' },
  { id: 'small', label: 'Small Smile' },
  { id: 'open', label: 'Open Smile' },
  { id: 'cat', label: 'Cat Mouth' },
];

export const HAIR_STYLES = [
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'long', label: 'Long' },
  { id: 'curly', label: 'Curly' },
  { id: 'braids', label: 'Braids' },
  { id: 'ponytail', label: 'Ponytail' },
  { id: 'buzz', label: 'Buzz Cut' },
  { id: 'afro', label: 'Afro' },
  { id: 'messy', label: 'Messy' },
  { id: 'bob', label: 'Bob' },
];

export const HAIR_COLOURS = [
  { id: 'brown', colour: '#6b4226', label: 'Brown' },
  { id: 'dark-brown', colour: '#3d2314', label: 'Dark Brown' },
  { id: 'black', colour: '#1a1a2e', label: 'Black' },
  { id: 'blonde', colour: '#d4b85c', label: 'Blonde' },
  { id: 'red', colour: '#b84c2a', label: 'Red' },
  { id: 'auburn', colour: '#8b3a2a', label: 'Auburn' },
  { id: 'pink', colour: '#e879a8', label: 'Pink' },
  { id: 'blue', colour: '#5b8fd4', label: 'Blue' },
  { id: 'purple', colour: '#9b6bc4', label: 'Purple' },
  { id: 'grey', colour: '#9ca3af', label: 'Grey' },
];

export const OUTFIT_BASE = { id: 'explorer', label: 'Explorer', colour: '#3b82f6' };

export const UNLOCKABLE_OUTFITS = [
  { id: 'jungle-vest', label: 'Jungle Vest', colour: '#16a34a', habitat: 'jungle' },
  { id: 'ocean-suit', label: 'Diving Suit', colour: '#0ea5e9', habitat: 'ocean' },
  { id: 'savannah-khakis', label: 'Safari Khakis', colour: '#ca8a04', habitat: 'savannah' },
  { id: 'arctic-coat', label: 'Snow Coat', colour: '#e0f2fe', habitat: 'arctic' },
  { id: 'rainforest-poncho', label: 'Rainforest Poncho', colour: '#22c55e', habitat: 'rainforest' },
  { id: 'desert-scarf', label: 'Desert Scarf', colour: '#f59e0b', habitat: 'desert' },
  { id: 'mountain-gear', label: 'Climbing Gear', colour: '#6b7280', habitat: 'mountains' },
  { id: 'grasslands-ranger', label: 'Ranger Uniform', colour: '#65a30d', habitat: 'grasslands' },
];

export const UNLOCKABLE_ACCESSORIES = [
  { id: 'hat', label: 'Explorer Hat', condition: 'firstHabitat', description: 'Complete your first habitat' },
  { id: 'binoculars', label: 'Binoculars', condition: 'streak10', description: 'Reach a 10-word streak' },
  { id: 'backpack', label: 'Backpack', condition: 'level3', description: 'Reach Level 3' },
  { id: 'compass', label: 'Compass Badge', condition: 'diagnostic', description: 'Complete the diagnostic' },
  { id: 'medal', label: 'Gold Medal', condition: 'mockSats', description: 'Complete a mock SATs test' },
  { id: 'star-glasses', label: 'Star Glasses', condition: 'level5', description: 'Reach Level 5' },
];

export const DEFAULT_AVATAR = {
  skinTone: 'light',
  eyes: 'round',
  mouth: 'smile',
  hairStyle: 'medium',
  hairColour: 'brown',
  outfit: 'explorer',
  accessories: [],
};

export function checkAccessoryUnlocked(conditionId, progress) {
  switch (conditionId) {
    case 'firstHabitat': return (progress.unlockedAnimals || []).length >= 1;
    case 'streak10': return (progress.bestStreak || 0) >= 10;
    case 'level3': return (progress.xp || 0) >= 120;
    case 'level5': return (progress.xp || 0) >= 300;
    case 'diagnostic': return !!progress.diagnosticResults;
    case 'mockSats': return (progress.mockTests || []).length >= 1;
    default: return false;
  }
}
