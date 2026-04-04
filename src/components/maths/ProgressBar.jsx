/**
 * ProgressBar — Session progress dots
 *
 * Shows filled/empty dots representing position in the current session.
 * Correct = green, wrong = red, current = pulsing, future = grey.
 */

export default function ProgressBar({ total, current, results = [] }) {
  return (
    <div className="flex items-center gap-1.5 justify-center" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => {
        const result = results[i];
        let colour = 'bg-gray-200';
        if (result === 'correct') colour = 'bg-green-500';
        else if (result === 'wrong') colour = 'bg-red-400';
        const isCurrent = i === current;

        return (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${colour} ${
              isCurrent ? 'ring-2 ring-green-400 ring-offset-1 scale-125' : ''
            }`}
            aria-label={
              result === 'correct' ? `Question ${i + 1}: correct`
                : result === 'wrong' ? `Question ${i + 1}: incorrect`
                  : isCurrent ? `Question ${i + 1}: current`
                    : `Question ${i + 1}: upcoming`
            }
          />
        );
      })}
    </div>
  );
}
