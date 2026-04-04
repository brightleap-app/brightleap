/**
 * Maths Session Manager
 *
 * Manages question selection, session flow, and progress tracking
 * for a maths learning session.
 *
 * Session flow: recap (if returning) → questions (adaptive) → summary
 */

// Import all question banks — Explorer Trail
import identifyingQuestions from '../data/maths/fractions/identifying.json';
import equivalentQuestions from '../data/maths/fractions/equivalent.json';
import simplifyingQuestions from '../data/maths/fractions/simplifying.json';
import comparingQuestions from '../data/maths/fractions/comparing.json';
import addingQuestions from '../data/maths/fractions/adding.json';
import subtractingQuestions from '../data/maths/fractions/subtracting.json';

// Explorer Trail — handwritten decimals and percentages
import decimalEquivalentsQuestions from '../data/maths/fractions/decimal_equivalents.json';
import comparingDecimalsQuestions from '../data/maths/fractions/comparing_decimals.json';
import addingSubtractingDecimalsQuestions from '../data/maths/fractions/adding_subtracting_decimals.json';
import percentageBasicsQuestions from '../data/maths/fractions/percentage_basics.json';
import findingPercentagesQuestions from '../data/maths/fractions/finding_percentages.json';

// Year 3/4 Trail
import y34RecognisingQuestions from '../data/maths/year34/recognising_fractions.json';
import y34CountingTenths from '../data/maths/year34/counting_tenths.json';
import y34AddSubSameDenom from '../data/maths/year34/adding_subtracting_same_denom.json';
import y34DecimalEquivalents from '../data/maths/year34/decimal_equivalents.json';
import y34EquivalentFractions from '../data/maths/year34/equivalent_fractions.json';

// Year 5/6 Trail
import y56ComparingFractions from '../data/maths/year56/comparing_fractions.json';
import y56AddSubDiffDenom from '../data/maths/year56/adding_subtracting_diff_denom.json';
import y56MultiplyingFractions from '../data/maths/year56/multiplying_fractions.json';
import y56DividingFractions from '../data/maths/year56/dividing_fractions.json';
import y56Decimals from '../data/maths/year56/decimals.json';
import y56Percentages from '../data/maths/year56/percentages.json';
import y56SatsWordProblems from '../data/maths/year56/sats_word_problems.json';

const QUESTION_BANKS = {
  // Explorer Trail
  identifying_fractions: identifyingQuestions,
  equivalent_fractions: equivalentQuestions,
  simplifying_fractions: simplifyingQuestions,
  comparing_fractions: comparingQuestions,
  adding_fractions: addingQuestions,
  subtracting_fractions: subtractingQuestions,
  // Year 3/4 Trail
  recognising_fractions: y34RecognisingQuestions,
  counting_tenths: y34CountingTenths,
  adding_subtracting_same_denom: y34AddSubSameDenom,
  decimal_equivalents: y34DecimalEquivalents,
  y34_equivalent_fractions: y34EquivalentFractions,
  // Explorer Trail — handwritten decimals and percentages
  exp_decimal_equivalents: decimalEquivalentsQuestions,
  exp_comparing_decimals: comparingDecimalsQuestions,
  exp_adding_subtracting_decimals: addingSubtractingDecimalsQuestions,
  exp_percentage_basics: percentageBasicsQuestions,
  exp_finding_percentages: findingPercentagesQuestions,
  exp_sats_word_problems: y56SatsWordProblems,
  // Year 5/6 Trail
  y56_comparing_fractions: y56ComparingFractions,
  adding_subtracting_diff_denom: y56AddSubDiffDenom,
  multiplying_fractions: y56MultiplyingFractions,
  dividing_fractions: y56DividingFractions,
  decimals: y56Decimals,
  percentages: y56Percentages,
  sats_word_problems: y56SatsWordProblems,
};

// Positive feedback messages — never say "wrong"
const CORRECT_FEEDBACK = [
  { text: 'Spot on!', emoji: '🎉' },
  { text: 'Brilliant!', emoji: '🌟' },
  { text: "You've got it!", emoji: '🎉' },
  { text: "That's right!", emoji: '⭐' },
  { text: 'Superstar!', emoji: '⭐' },
  { text: 'Nailed it!', emoji: '🔥' },
  { text: "You're on fire!", emoji: '🔥' },
  { text: 'Incredible!', emoji: '⭐' },
];

const INCORRECT_ACKNOWLEDGEMENTS = [
  'Good try! Let me show you how this one works.',
  'Nice effort! Let me walk you through it.',
  'Almost! Let me show you the way.',
  "That's a brave attempt! Here's how it works.",
  "Don't worry! Let's look at this together.",
];

/**
 * Get a random positive feedback message, avoiding the last one used
 */
let lastFeedbackIndex = -1;
export function getCorrectFeedback() {
  let idx;
  do {
    idx = Math.floor(Math.random() * CORRECT_FEEDBACK.length);
  } while (idx === lastFeedbackIndex && CORRECT_FEEDBACK.length > 1);
  lastFeedbackIndex = idx;
  return CORRECT_FEEDBACK[idx];
}

/**
 * Get a random incorrect acknowledgement
 */
export function getIncorrectAcknowledgement() {
  return INCORRECT_ACKNOWLEDGEMENTS[
    Math.floor(Math.random() * INCORRECT_ACKNOWLEDGEMENTS.length)
  ];
}

/**
 * Get questions for a topic at a given difficulty level
 */
export function getQuestionsForTopic(topicId, difficulty = null) {
  const bank = QUESTION_BANKS[topicId] || [];
  if (difficulty === null) return bank;
  return bank.filter((q) => q.difficulty <= difficulty);
}

/**
 * Select session questions — picks from the topic's bank,
 * prioritizing the current difficulty level, with some easier
 * review questions mixed in.
 */
export function selectSessionQuestions(topicId, currentDifficulty, count = 10) {
  const bank = QUESTION_BANKS[topicId] || [];
  if (bank.length === 0) return [];

  // Questions at current difficulty
  const atLevel = bank.filter((q) => q.difficulty === currentDifficulty);
  // Review questions (easier)
  const review = bank.filter((q) => q.difficulty < currentDifficulty);
  // Stretch questions (one level harder)
  const stretch = bank.filter((q) => q.difficulty === currentDifficulty + 1);

  // Shuffle helper
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // Build session: mostly current level, some review, maybe 1 stretch
  const selected = [];
  const shuffledAtLevel = shuffle(atLevel);
  const shuffledReview = shuffle(review);
  const shuffledStretch = shuffle(stretch);

  // Add review questions (up to 2)
  selected.push(...shuffledReview.slice(0, Math.min(2, shuffledReview.length)));

  // Fill with current level
  const remaining = count - selected.length;
  selected.push(...shuffledAtLevel.slice(0, Math.min(remaining - 1, shuffledAtLevel.length)));

  // Add 1 stretch question if available and we have room
  if (selected.length < count && shuffledStretch.length > 0) {
    selected.push(shuffledStretch[0]);
  }

  // If we still need more, fill from any available
  if (selected.length < count) {
    const usedIds = new Set(selected.map((q) => q.id));
    const remaining2 = shuffle(bank.filter((q) => !usedIds.has(q.id)));
    selected.push(...remaining2.slice(0, count - selected.length));
  }

  // Shuffle final order but keep review at the start
  const reviewPart = selected.filter((q) => q.difficulty < currentDifficulty);
  const mainPart = shuffle(selected.filter((q) => q.difficulty >= currentDifficulty));
  return [...reviewPart, ...mainPart].slice(0, count);
}

/**
 * Get the explanation/introduction text for a topic
 */
const TOPIC_INTROS = {
  identifying_fractions: {
    title: 'What is a Fraction?',
    explanation: 'A fraction shows part of a whole. The top number tells you how many parts you have. The bottom number tells you how many equal parts there are in total.',
    example: 'If a pizza is cut into 4 equal slices and you eat 1, you ate 1/4 of the pizza!',
  },
  equivalent_fractions: {
    title: 'Equivalent Fractions',
    explanation: 'Equivalent fractions look different but show the same amount. The key rule: whatever you do to the bottom, do the same to the top!',
    example: '1/2 is the same as 2/4 — same pizza, just cut into more slices!',
  },
  simplifying_fractions: {
    title: 'Simplifying Fractions',
    explanation: 'Simplifying means making the numbers smaller while keeping the same amount. Divide the top and bottom by the same number.',
    example: '4/8 → divide both by 4 → 1/2. Same amount, simpler numbers!',
  },
  comparing_fractions: {
    title: 'Comparing Fractions',
    explanation: 'To compare fractions, make the bottoms the same first. Then compare the tops — the bigger top wins!',
    example: 'Which is bigger: 1/3 or 1/4? Sharing between 3 gives bigger pieces than sharing between 4. So 1/3 is bigger!',
  },
  adding_fractions: {
    title: 'Adding Fractions',
    explanation: 'To add fractions: make the bottoms the same, then add the tops. The bottom stays the same!',
    example: '1/4 + 2/4 = 3/4. Same bottoms? Just add the tops!',
  },
  subtracting_fractions: {
    title: 'Subtracting Fractions',
    explanation: 'Subtracting fractions works just like adding — make the bottoms the same, then subtract the tops.',
    example: '3/4 - 1/4 = 2/4. Same bottoms? Just subtract the tops!',
  },
  // Explorer Trail topics (shared content, unique intro)
  exp_decimal_equivalents: {
    title: 'Decimal Equivalents',
    explanation: 'Decimals and fractions are two ways of showing the same thing. Think of money: 50p is 0.5 of a pound, which is 1/2.',
    example: '0.5 = 1/2, 0.25 = 1/4, 0.75 = 3/4. Learn these three and you\'re flying!',
  },
  exp_comparing_decimals: {
    title: 'Comparing Decimals',
    explanation: 'To compare decimals, think of them as money. More digits doesn\'t always mean a bigger number!',
    example: '0.5 is bigger than 0.35 — because 50p is more than 35p!',
  },
  exp_adding_subtracting_decimals: {
    title: 'Adding & Subtracting Decimals',
    explanation: 'The key rule: line up the decimal points! Then add or subtract just like whole numbers. Think of it as adding up coins.',
    example: '£1.50 + £0.75 = £2.25. Line up the dots, then add!',
  },
  exp_percentage_basics: {
    title: 'What Percentage Means',
    explanation: 'Per cent means per hundred. 50% means 50 out of 100, which is the same as a half. These come up in every SATs paper!',
    example: '50% = 1/2 = 0.5. 25% = 1/4 = 0.25. 10% = 1/10 = 0.1.',
  },
  exp_finding_percentages: {
    title: 'Finding Percentages of Amounts',
    explanation: 'The trick is to use building blocks: find 10% by dividing by 10, find 50% by halving, then combine them for any percentage!',
    example: '15% of £80: find 10% (£8) + 5% (£4) = £12. Easy!',
  },
  exp_sats_word_problems: {
    title: 'SATs Word Problems',
    explanation: 'These are mixed problems just like in the real SATs. Read carefully, work step by step, and take your time.',
    example: 'A jumper costs £40 with 25% off. 25% of £40 = £10. Sale price = £30!',
  },
  // Year 3/4 topics
  recognising_fractions: {
    title: 'Recognising Fractions',
    explanation: 'A fraction is a part of a whole thing. The bottom number says how many equal parts. The top number says how many you have.',
    example: 'Cut a cake into 4 pieces and take 1 — that\'s 1/4!',
  },
  counting_tenths: {
    title: 'Counting in Tenths',
    explanation: 'When something is split into 10 equal parts, each part is one tenth. You can count them just like whole numbers!',
    example: '1/10, 2/10, 3/10... all the way to 10/10 which is 1 whole!',
  },
  adding_subtracting_same_denom: {
    title: 'Adding & Subtracting (Same Bottom)',
    explanation: 'When the bottoms are the same, just add or subtract the tops. The bottom stays the same!',
    example: '2/5 + 1/5 = 3/5. Easy — the bottom is already the same!',
  },
  decimal_equivalents: {
    title: 'Decimals and Fractions',
    explanation: 'Decimals and fractions are two ways of showing the same thing. Think of money: 50p is 0.5 of a pound, which is 1/2.',
    example: '0.5 = 1/2, 0.25 = 1/4, 0.75 = 3/4. Learn these three and you\'re flying!',
  },
  y34_equivalent_fractions: {
    title: 'Equivalent Fractions',
    explanation: 'Equivalent fractions look different but show the same amount. Whatever you do to the bottom, do the same to the top!',
    example: '1/2 is the same as 2/4 — same pizza, just cut into more slices!',
  },
  // Year 5/6 topics
  y56_comparing_fractions: {
    title: 'Comparing Fractions',
    explanation: 'To compare fractions with different bottoms, find a common denominator. Convert both fractions, then compare the tops.',
    example: '2/3 vs 3/5: change to 10/15 vs 9/15. 10 > 9, so 2/3 is bigger!',
  },
  adding_subtracting_diff_denom: {
    title: 'Adding & Subtracting (Different Bottoms)',
    explanation: 'When the bottoms are different, find a common denominator first. Then add or subtract the tops.',
    example: '1/2 + 1/3: change to 3/6 + 2/6 = 5/6. Make the bottoms match first!',
  },
  multiplying_fractions: {
    title: 'Multiplying Fractions',
    explanation: 'To multiply fractions: multiply the tops together, then multiply the bottoms together. Nice and simple!',
    example: '1/2 × 1/3 = 1/6. Top × top, bottom × bottom!',
  },
  dividing_fractions: {
    title: 'Dividing Fractions',
    explanation: 'To divide a fraction by a whole number, keep the top the same and multiply the bottom by that number.',
    example: '1/2 ÷ 3 = 1/6. The top stays, the bottom gets bigger!',
  },
  decimals: {
    title: 'Working with Decimals',
    explanation: 'Decimals use place value — the first digit after the dot is tenths, the second is hundredths. Think of money to help!',
    example: '£1.35 means 1 pound, 3 tenths (30p) and 5 hundredths (5p).',
  },
  percentages: {
    title: 'Percentages',
    explanation: 'Per cent means per hundred. 50% means 50 out of 100, which is the same as a half.',
    example: '50% = 1/2 = 0.5. They\'re all the same amount!',
  },
  sats_word_problems: {
    title: 'SATs Word Problems',
    explanation: 'These are mixed problems just like in the real SATs. Read carefully, work step by step, and take your time.',
    example: 'A jumper costs £40 with 25% off. 25% of £40 = £10. Sale price = £30!',
  },
};

export function getTopicIntro(topicId) {
  return TOPIC_INTROS[topicId] || null;
}
