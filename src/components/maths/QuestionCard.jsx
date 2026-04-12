/**
 * QuestionCard — Question display wrapper
 *
 * Renders a maths question with its visual display area,
 * answer input, and Check Answer button. Handles different
 * question types (fill_in, multiple_choice, true_false).
 */

import { useState } from 'react';
import FractionDisplay from './FractionDisplay.jsx';
import FractionInput from './FractionInput.jsx';

export default function QuestionCard({
  question,
  onAnswer,
  disabled = false,
}) {
  const [answer, setAnswer] = useState(
    question.question_type === 'fill_in' && question.question_display?.format === 'fraction_equation'
      ? { numerator: '', denominator: '' }
      : ''
  );

  const handleSubmit = () => {
    if (disabled) return;
    onAnswer(answer);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const isFractionEquation = question.question_display?.format === 'fraction_equation';
  const isMultipleChoice = question.question_type === 'multiple_choice';
  const isTrueFalse = question.question_type === 'true_false';

  const canSubmit = isFractionEquation
    ? answer.numerator !== '' && answer.denominator !== ''
    : isMultipleChoice || isTrueFalse
      ? answer !== ''
      : answer.toString().trim() !== '';

  return (
    <div className="w-full max-w-sm flex flex-col items-center gap-5">
      {/* Question text */}
      <p className="text-xl text-center font-semibold leading-relaxed">
        {question.question_text}
      </p>

      {/* Visual display area */}
      {isFractionEquation && question.question_display && (
        <div className="flex items-center gap-4 text-2xl">
          {question.question_display.left && (
            <FractionDisplay
              numerator={question.question_display.left.numerator}
              denominator={question.question_display.left.denominator}
              size="lg"
            />
          )}
          {question.question_display.equals && (
            <span className="text-3xl font-bold">=</span>
          )}
          {question.question_display.right && (
            <div className="flex flex-col items-center gap-1">
              {question.question_display.right.numerator === '?' ||
               question.question_display.right.denominator === '?' ? (
                <FractionInput
                  value={{
                    numerator: question.question_display.right.numerator === '?'
                      ? answer.numerator
                      : question.question_display.right.numerator.toString(),
                    denominator: question.question_display.right.denominator === '?'
                      ? answer.denominator
                      : question.question_display.right.denominator.toString(),
                  }}
                  onChange={(val) => {
                    setAnswer({
                      numerator: question.question_display.right.numerator === '?'
                        ? val.numerator
                        : question.question_display.right.numerator.toString(),
                      denominator: question.question_display.right.denominator === '?'
                        ? val.denominator
                        : question.question_display.right.denominator.toString(),
                    });
                  }}
                  disabled={disabled}
                  size="lg"
                />
              ) : (
                <FractionDisplay
                  numerator={question.question_display.right.numerator}
                  denominator={question.question_display.right.denominator}
                  size="lg"
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Simple number input for non-fraction fill_in */}
      {question.question_type === 'fill_in' && !isFractionEquation && (
        <input
          type="text"
          inputMode="numeric"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type your answer"
          className="w-32 h-14 text-2xl text-center font-semibold rounded-xl border-2 border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          autoFocus
          autoComplete="off"
        />
      )}

      {/* Multiple choice */}
      {isMultipleChoice && question.options && (
        <div className="flex flex-col gap-2 w-full">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => !disabled && setAnswer(opt.value)}
              disabled={disabled}
              className={`w-full py-3 px-4 rounded-2xl text-lg font-semibold text-left transition-all min-h-[48px] ${
                answer === opt.value
                  ? 'bg-green-100 border-2 border-green-500 text-green-800'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* True/False */}
      {isTrueFalse && (
        <div className="flex gap-3 w-full">
          {['yes', 'no'].map((val) => (
            <button
              key={val}
              onClick={() => !disabled && setAnswer(val)}
              disabled={disabled}
              className={`flex-1 py-3 rounded-2xl text-lg font-semibold transition-all min-h-[48px] ${
                answer === val
                  ? 'bg-green-100 border-2 border-green-500 text-green-800'
                  : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {val === 'yes' ? 'Yes' : 'No'}
            </button>
          ))}
        </div>
      )}

      {/* Check Answer button */}
      <button
        onClick={handleSubmit}
        disabled={disabled || !canSubmit}
        className={`w-full py-4 rounded-2xl text-xl font-semibold transition-colors min-h-[48px] ${
          canSubmit && !disabled
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-200 text-gray-600 cursor-not-allowed'
        }`}
      >
        Check Answer
      </button>
    </div>
  );
}
