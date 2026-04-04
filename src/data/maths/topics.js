// Maths trail and topic definitions
// Mirrors the English trail structure: Explorer / Year 3-4 / Year 5-6

export const MATHS_TRAILS = [
  {
    id: 'explorer',
    name: 'SATs Essentials',
    subtitle: 'The key topics you need for the test',
    description: 'If you only do one trail, do this one — it covers fractions, decimals & percentages',
    emoji: '🎯',
    colour: '#16a34a',
    modules: [
      {
        id: 'sats-fractions',
        name: 'Fractions',
        emoji: '🍕',
        colour: '#16a34a',
        description: 'The most important fraction skills for SATs',
        topics: [
          { id: 'identifying_fractions', name: 'Identifying Fractions', description: 'What fraction is shaded?', difficulty: 1, free: true },
          { id: 'equivalent_fractions', name: 'Equivalent Fractions', description: 'Same amount, different numbers', difficulty: 2, free: true },
          { id: 'simplifying_fractions', name: 'Simplifying Fractions', description: 'Make it simpler!', difficulty: 2, free: false },
          { id: 'comparing_fractions', name: 'Comparing Fractions', description: 'Which is bigger?', difficulty: 3, free: false },
          { id: 'adding_fractions', name: 'Adding Fractions', description: 'Put them together', difficulty: 3, free: false },
          { id: 'subtracting_fractions', name: 'Subtracting Fractions', description: 'Take them apart', difficulty: 4, free: false },
        ],
      },
      {
        id: 'sats-decimals',
        name: 'Decimals',
        emoji: '💰',
        colour: '#0ea5e9',
        description: 'Decimals and money — the key facts for SATs',
        topics: [
          { id: 'exp_decimal_equivalents', name: 'Decimal Equivalents', description: '0.5 = 1/2, 0.25 = 1/4, 0.75 = 3/4', difficulty: 1, free: false },
          { id: 'exp_comparing_decimals', name: 'Comparing Decimals', description: 'Which is bigger?', difficulty: 2, free: false },
          { id: 'exp_adding_subtracting_decimals', name: 'Adding & Subtracting', description: 'Line up the decimal points!', difficulty: 2, free: false },
        ],
      },
      {
        id: 'sats-percentages',
        name: 'Percentages',
        emoji: '📊',
        colour: '#8b5cf6',
        description: 'Percentages — what they mean and how to calculate them',
        topics: [
          { id: 'exp_percentage_basics', name: 'What Percentage Means', description: '50% = half, 25% = quarter, 10% = tenth', difficulty: 2, free: false },
          { id: 'exp_finding_percentages', name: 'Finding Percentages', description: '10% of £30, 25% off £40...', difficulty: 3, free: false },
        ],
      },
      {
        id: 'sats-mixed',
        name: 'SATs Practice',
        emoji: '📝',
        colour: '#dc2626',
        description: 'Mixed word problems just like the real SATs',
        topics: [
          { id: 'exp_sats_word_problems', name: 'SATs Word Problems', description: 'Mixed fractions, decimals & percentages', difficulty: 3, free: false },
        ],
      },
    ],
  },
  {
    id: 'year34',
    name: 'Year 3/4 Trail',
    subtitle: 'Build your foundations',
    description: 'Recognise fractions, count in tenths, simple addition with same denominators',
    emoji: '🌱',
    colour: '#0ea5e9',
    modules: [
      {
       id: 'y34-fractions',
        name: 'Fractions',
        emoji: '🍕',
        colour: '#0ea5e9',
        description: 'Halves, quarters, thirds — the building blocks of fractions',
        topics: [
          { id: 'recognising_fractions', name: 'Recognising Fractions', description: 'Halves, quarters and thirds', difficulty: 1, free: false },
          { id: 'counting_tenths', name: 'Counting in Tenths', description: 'One tenth, two tenths, three tenths...', difficulty: 1, free: false },
          { id: 'adding_subtracting_same_denom', name: 'Adding & Subtracting', description: 'Same denominator — just add the tops!', difficulty: 2, free: false },
          { id: 'y34_equivalent_fractions', name: 'Equivalent Fractions', description: 'Same amount, different numbers', difficulty: 2, free: false },
        ],
      },
      {
        id: 'y34-decimals',
        name: 'Decimals',
        emoji: '💰',
        colour: '#0ea5e9',
        description: 'Link fractions to decimals using money',
        topics: [
          { id: 'decimal_equivalents', name: 'Decimal Equivalents', description: '0.5 = 1/2, 0.25 = 1/4, 0.75 = 3/4', difficulty: 1, free: false },
        ],
      },
    ],
  },
  {
    id: 'year56',
    name: 'Year 5/6 Trail',
    subtitle: 'Master the SATs topics',
    description: 'Equivalent fractions, different denominators, decimals, percentages — everything for SATs',
    emoji: '🏔️',
    colour: '#8b5cf6',
    modules: [
      {
        id: 'y56-fractions',
        name: 'Fractions',
        emoji: '🍕',
        colour: '#8b5cf6',
        description: 'Compare, add, subtract, multiply and divide fractions',
        topics: [
          { id: 'y56_comparing_fractions', name: 'Comparing Fractions', description: 'Which is bigger? Different denominators', difficulty: 2, free: false },
          { id: 'adding_subtracting_diff_denom', name: 'Adding & Subtracting', description: 'Different denominators — find the common one!', difficulty: 3, free: false },
          { id: 'multiplying_fractions', name: 'Multiplying Fractions', description: 'Multiply tops, multiply bottoms', difficulty: 3, free: false },
          { id: 'dividing_fractions', name: 'Dividing Fractions', description: 'Dividing by a whole number', difficulty: 3, free: false },
        ],
      },
      {
        id: 'y56-decimals',
        name: 'Decimals',
        emoji: '💰',
        colour: '#0ea5e9',
        description: 'Place value, ordering, and calculating with decimals',
        topics: [
          { id: 'decimals', name: 'Decimals', description: 'Place value, ordering, adding and subtracting', difficulty: 2, free: false },
        ],
      },
      {
        id: 'y56-percentages',
        name: 'Percentages',
        emoji: '📊',
        colour: '#8b5cf6',
        description: 'Per cent means per hundred — convert and calculate',
        topics: [
          { id: 'percentages', name: 'Percentages', description: 'Convert, calculate, and solve problems', difficulty: 2, free: false },
        ],
      },
      {
        id: 'y56-sats',
        name: 'SATs Practice',
        emoji: '📝',
        colour: '#dc2626',
        description: 'Mixed word problems in SATs style',
        topics: [
          { id: 'sats_word_problems', name: 'SATs Word Problems', description: 'Mixed fractions, decimals & percentages', difficulty: 3, free: false },
        ],
      },
    ],
  },
];

export function getMathsTrailById(id) {
  return MATHS_TRAILS.find((t) => t.id === id);
}

export function getModuleById(trailId, moduleId) {
  const trail = getMathsTrailById(trailId);
  if (!trail) return null;
  return trail.modules.find((m) => m.id === moduleId);
}

export function getTopicById(trailId, moduleId, topicId) {
  const mod = getModuleById(trailId, moduleId);
  if (!mod) return null;
  return mod.topics.find((t) => t.id === topicId);
}

// Search across all trails for a module/topic by ID (used by session screens
// that don't have trail context in the URL)
export function findModuleById(moduleId) {
  for (const trail of MATHS_TRAILS) {
    const mod = trail.modules.find((m) => m.id === moduleId);
    if (mod) return mod;
  }
  return null;
}

export function findTopicById(moduleId, topicId) {
  const mod = findModuleById(moduleId);
  if (!mod) return null;
  return mod.topics.find((t) => t.id === topicId);
}
