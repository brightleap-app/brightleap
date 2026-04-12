/**
 * WorkedExample — Step-by-step solution reveal
 *
 * Shows worked solution steps one at a time. Child taps/clicks
 * to reveal each next step. Optionally shows an analogy at the end.
 */

import { useState } from 'react';

export default function WorkedExample({ steps = [], analogy, onComplete }) {
  const [visibleCount, setVisibleCount] = useState(1);
  const allVisible = visibleCount >= steps.length;

  const handleNext = () => {
    if (allVisible) {
      onComplete?.();
    } else {
      setVisibleCount((prev) => prev + 1);
    }
  };

  if (steps.length === 0) return null;

  return (
    <div className="w-full max-w-sm">
      <p className="text-sm text-gray-500 font-semibold mb-3">Let me show you how:</p>

      <div className="flex flex-col gap-2">
        {steps.slice(0, visibleCount).map((step, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl animate-fade-in"
          >
            <span className="text-blue-500 font-bold text-sm mt-0.5 flex-shrink-0">
              {i + 1}.
            </span>
            <p className="text-base">{step}</p>
          </div>
        ))}
      </div>

      {allVisible && analogy && (
        <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 animate-fade-in">
          <p className="text-sm text-amber-800">
            💡 <span className="font-semibold">Think of it like this:</span> {analogy}
          </p>
        </div>
      )}

      <button
        onClick={handleNext}
        className="mt-4 w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors min-h-[48px]"
      >
        {allVisible ? 'Got it — next question' : `Show step ${visibleCount + 1}`}
      </button>
    </div>
  );
}
