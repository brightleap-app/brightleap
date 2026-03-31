// Trail definitions — groups of habitats for different learning paths
import originalHabitats from './habitats.json';
import year34Habitats from './year34Habitats.json';
import year56Habitats from './year56Habitats.json';

// Add emojis and reward animals to the new trails
const Y34_EXTRAS = [
  { emoji: '🔇', animal: { name: 'Silent Owl', emoji: '🦉', fact: 'Owls can fly almost silently because of the special shape of their wing feathers.' } },
  { emoji: '✌️', animal: { name: 'Twin Panda', emoji: '🐼', fact: 'Giant pandas spend up to 16 hours a day eating bamboo to get enough energy.' } },
  { emoji: '👻', animal: { name: 'Ghost Bat', emoji: '🦇', fact: 'Bats are the only mammals that can truly fly, and they use echoes to find their way in the dark.' } },
  { emoji: '🎭', animal: { name: 'Chameleon', emoji: '🦎', fact: 'Chameleons can move their eyes independently — each eye can look in a different direction!' } },
  { emoji: '🧈', animal: { name: 'Smooth Seal', emoji: '🦭', fact: 'Seals can hold their breath underwater for up to two hours when diving for food.' } },
  { emoji: '🎪', animal: { name: 'Circus Monkey', emoji: '🐒', fact: 'Monkeys use over 30 different sounds to communicate with each other.' } },
  { emoji: '🧩', animal: { name: 'Pattern Peacock', emoji: '🦚', fact: 'A peacock\'s tail feathers can be over 1.5 metres long and have eye-shaped patterns.' } },
  { emoji: '🌀', animal: { name: 'Puzzle Platypus', emoji: '🦆', fact: 'The platypus is one of only five species of mammals that lay eggs.' } },
];

const Y56_EXTRAS = [
  { emoji: '✌️', animal: { name: 'Double Eagle', emoji: '🦅', fact: 'Golden eagles can dive at speeds over 150 miles per hour to catch their prey.' } },
  { emoji: '🔇', animal: { name: 'Stealth Tiger', emoji: '🐯', fact: 'Every tiger has a unique pattern of stripes, just like human fingerprints.' } },
  { emoji: '📚', animal: { name: 'Scholar Elephant', emoji: '🐘', fact: 'Elephants have the largest brains of any land animal and can remember things for decades.' } },
  { emoji: '👻', animal: { name: 'Phantom Wolf', emoji: '🐺', fact: 'Wolves can communicate with each other through howls that travel up to 10 miles.' } },
  { emoji: '🧈', animal: { name: 'Velvet Otter', emoji: '🦦', fact: 'Sea otters hold hands while sleeping so they don\'t drift apart in the ocean.' } },
  { emoji: '🎪', animal: { name: 'Master Crane', emoji: '🦩', fact: 'Flamingos are born grey or white and turn pink from the shrimp they eat.' } },
  { emoji: '🧩', animal: { name: 'Code Gecko', emoji: '🦎', fact: 'Geckos can walk on ceilings using millions of tiny hairs on their feet that grip surfaces.' } },
  { emoji: '🌀', animal: { name: 'Enigma Narwhal', emoji: '🦄', fact: 'A narwhal\'s tusk is actually a giant tooth that can grow up to 3 metres long.' } },
];

// Enrich habitat data with emojis and animals
function enrichHabitats(habitats, extras) {
  return habitats.map((h, i) => ({
    ...h,
    emoji: extras[i]?.emoji || '📖',
    animal: extras[i]?.animal || { name: 'Mystery Animal', emoji: '❓', fact: 'Keep exploring to discover this animal!' },
  }));
}

export const TRAILS = [
  {
    id: 'easter',
    name: 'Explorer Trail',
    subtitle: 'Your SATs spelling list',
    description: '80 core words from your teacher\'s revision list',
    emoji: '🐾',
    colour: '#16a34a',
    habitats: originalHabitats,
    wordCount: 80,
  },
  {
    id: 'year34',
    name: 'Year 3/4 Trail',
    subtitle: 'Build your foundations',
    description: 'The complete Year 3/4 statutory word list — 109 words',
    emoji: '🌱',
    colour: '#0ea5e9',
    habitats: enrichHabitats(year34Habitats, Y34_EXTRAS),
    wordCount: 109,
  },
  {
    id: 'year56',
    name: 'Year 5/6 Trail',
    subtitle: 'Master the full curriculum',
    description: 'The complete Year 5/6 statutory word list — 104 words',
    emoji: '🏔️',
    colour: '#8b5cf6',
    habitats: enrichHabitats(year56Habitats, Y56_EXTRAS),
    wordCount: 104,
  },
];

export function getTrailById(id) {
  return TRAILS.find((t) => t.id === id) || TRAILS[0];
}
