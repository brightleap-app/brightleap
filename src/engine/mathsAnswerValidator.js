/**
 * Maths Answer Validator
 *
 * Validates answers for different question types:
 * - Fraction equivalence (cross-multiply check)
 * - Exact fraction match (for simplification questions)
 * - Multiple choice / true-false string match
 * - Decimal and percentage handling
 */

/**
 * Check if a fraction answer is correct
 */
export function isFractionCorrect(userAnswer, correctAnswer, acceptEquivalent = true) {
  const uNum = parseInt(userAnswer.numerator, 10);
  const uDen = parseInt(userAnswer.denominator, 10);
  const cNum = parseInt(correctAnswer.numerator, 10);
  const cDen = parseInt(correctAnswer.denominator, 10);

  if (isNaN(uNum) || isNaN(uDen) || uDen === 0) return false;

  if (acceptEquivalent) {
    // Cross-multiply to check equivalence: a/b = c/d if a*d === b*c
    return uNum * cDen === uDen * cNum;
  }

  // Exact match only (for simplification questions)
  return uNum === cNum && uDen === cDen;
}

/**
 * Check if a simple value answer is correct (multiple choice, true/false, number)
 */
export function isValueCorrect(userAnswer, correctAnswer) {
  const user = String(userAnswer).trim().toLowerCase();
  const correct = String(correctAnswer).trim().toLowerCase();
  return user === correct;
}

/**
 * Main validator — dispatches based on question type
 */
export function validateAnswer(question, userAnswer) {
  const { correct_answer, accept_equivalent, question_type, question_display } = question;

  // Fraction fill-in questions
  if (question_type === 'fill_in' && question_display?.format === 'fraction_equation') {
    if (typeof correct_answer === 'object' && 'numerator' in correct_answer) {
      return isFractionCorrect(userAnswer, correct_answer, accept_equivalent !== false);
    }
  }

  // Multiple choice, true/false, simple fill-in
  if (question_type === 'multiple_choice' || question_type === 'true_false') {
    return isValueCorrect(userAnswer, correct_answer);
  }

  // Simple number fill-in
  if (question_type === 'fill_in') {
    return isValueCorrect(userAnswer, correct_answer);
  }

  return false;
}
