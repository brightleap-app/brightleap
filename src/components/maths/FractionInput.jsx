/**
 * FractionInput — Two-box stacked input for fraction entry
 *
 * Numerator box on top, denominator on bottom, with a dividing line.
 * Auto-focuses numerator. Tab/Enter moves to denominator.
 * Uses inputmode="numeric" for mobile number keyboard.
 */

import { useRef, useEffect } from 'react';

export default function FractionInput({
  value = { numerator: '', denominator: '' },
  onChange,
  disabled = false,
  autoFocus = true,
  size = 'md',
}) {
  const numRef = useRef(null);
  const denRef = useRef(null);

  useEffect(() => {
    if (autoFocus && numRef.current) {
      numRef.current.focus();
    }
  }, [autoFocus]);

  const handleNumChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    onChange({ ...value, numerator: val });
  };

  const handleDenChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    onChange({ ...value, denominator: val });
  };

  const handleNumKeyDown = (e) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      denRef.current?.focus();
    }
  };

  const inputSizes = {
    sm: 'w-12 h-10 text-lg',
    md: 'w-16 h-12 text-2xl',
    lg: 'w-20 h-14 text-3xl',
  };

  const lineSizes = {
    sm: 'w-12 border-t-2',
    md: 'w-16 border-t-2',
    lg: 'w-20 border-t-[3px]',
  };

  const inputClass = `${inputSizes[size] || inputSizes.md} text-center font-semibold rounded-xl border-2 border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-colors`;

  return (
    <div
      className="inline-flex flex-col items-center gap-1"
      role="group"
      aria-label="Fraction input"
    >
      <label className="sr-only" htmlFor="fraction-numerator">Numerator (top number)</label>
      <input
        ref={numRef}
        id="fraction-numerator"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value.numerator}
        onChange={handleNumChange}
        onKeyDown={handleNumKeyDown}
        disabled={disabled}
        placeholder="?"
        className={inputClass}
        aria-label="Top number"
        autoComplete="off"
      />
      <div className={`${lineSizes[size] || lineSizes.md} border-gray-800`} aria-hidden="true" />
      <label className="sr-only" htmlFor="fraction-denominator">Denominator (bottom number)</label>
      <input
        ref={denRef}
        id="fraction-denominator"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value.denominator}
        onChange={handleDenChange}
        disabled={disabled}
        placeholder="?"
        className={inputClass}
        aria-label="Bottom number"
        autoComplete="off"
      />
    </div>
  );
}
