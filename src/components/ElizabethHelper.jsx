import { useState, useEffect } from 'react';
import ElizabethCharacter from './ElizabethCharacter.jsx';
import { loadProgress } from '../storage/progress.js';
import dialogue from '../data/elizabethDialogue.json';

export default function ElizabethHelper({ mood = 'happy', message, onDismiss, autoHide = 8000 }) {
  const [visible, setVisible] = useState(true);

  const progress = loadProgress();
  const reduceHelpers = progress.settings?.reduceHelpers || false;

  useEffect(() => {
    if (autoHide && autoHide > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoHide);
      return () => clearTimeout(timer);
    }
  }, [autoHide, onDismiss]);

  if (reduceHelpers || !visible || !message) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 flex items-end gap-3 max-w-md mx-auto"
      onClick={handleDismiss}
      role="status"
      aria-live="polite"
    >
      <div className="flex-shrink-0">
        <ElizabethCharacter mood={mood} size={80} />
      </div>

      <div className="flex-1 bg-white rounded-2xl rounded-bl-sm shadow-lg border border-gray-200 p-4 relative">
        <p className="text-sm leading-relaxed">{message}</p>
        <button
          onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
          className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 text-xs w-6 h-6 flex items-center justify-center"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ElizabethHelpButton({ screenKey }) {
  const [showHelp, setShowHelp] = useState(false);

  const progress = loadProgress();
  const reduceHelpers = progress.settings?.reduceHelpers || false;

  if (reduceHelpers) return null;

  const helpData = dialogue.help?.[screenKey];
  if (!helpData) return null;

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-white shadow-lg border-2 border-green-300 flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Ask Elizabeth for help"
      >
        <ElizabethCharacter mood="happy" size={32} />
      </button>

      {showHelp && (
        <ElizabethHelper
          mood={helpData.mood}
          message={helpData.message}
          onDismiss={() => setShowHelp(false)}
        />
      )}
    </>
  );
}
