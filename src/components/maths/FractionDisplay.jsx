/**
 * FractionDisplay — Visual stacked fraction rendering
 *
 * Displays a fraction in accessible stacked format (numerator over denominator)
 * with a clear dividing line. Screen readers announce "X over Y".
 */

const SIZES = {
  sm: { num: 'text-lg', line: 'w-8 border-t-2', den: 'text-lg', gap: 'gap-0.5' },
  md: { num: 'text-2xl', line: 'w-12 border-t-2', den: 'text-2xl', gap: 'gap-1' },
  lg: { num: 'text-4xl', line: 'w-16 border-t-[3px]', den: 'text-4xl', gap: 'gap-1' },
};

const HIGHLIGHT_COLOURS = {
  numerator: { num: 'text-blue-600 font-bold', den: '' },
  denominator: { num: '', den: 'text-red-600 font-bold' },
  both: { num: 'text-blue-600 font-bold', den: 'text-red-600 font-bold' },
  none: { num: '', den: '' },
};

export default function FractionDisplay({
  numerator,
  denominator,
  size = 'md',
  highlight = 'none',
  animated = false,
  className = '',
}) {
  const s = SIZES[size] || SIZES.md;
  const h = HIGHLIGHT_COLOURS[highlight] || HIGHLIGHT_COLOURS.none;

  return (
    <div
      className={`inline-flex flex-col items-center ${s.gap} ${className}`}
      role="math"
      aria-label={`${numerator} over ${denominator}`}
    >
      <span
        className={`${s.num} font-semibold leading-tight ${h.num} ${
          animated ? 'animate-fade-in' : ''
        }`}
      >
        {numerator}
      </span>
      <div className={`${s.line} border-gray-800`} aria-hidden="true" />
      <span
        className={`${s.den} font-semibold leading-tight ${h.den} ${
          animated ? 'animate-fade-in' : ''
        }`}
      >
        {denominator}
      </span>
    </div>
  );
}
