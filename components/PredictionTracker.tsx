import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FADE_DURATION, EASE } from '../lib/animations';
import { logUiEvent } from '../lib/logUiEvent';

interface Props {
  onReveal: () => void;
  /**
   * Time in milliseconds before advancing to the next step.
   * Defaults to 1500ms.
   */
  stepDuration?: number;
  /**
   * Index of the prediction being revealed, used for analytics logging.
   */
  revealedIndex?: number;
}

const steps = [
  'Collecting Stats...',
  'Analyzing Trends...',
  'Crunching Agent Results...',
  'Pick Ready – Click to Reveal',
];

const PredictionTracker: React.FC<Props> = ({
  onReveal,
  stepDuration = 1500,
  revealedIndex,
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < steps.length - 1) {
      const timer = setTimeout(() => setIndex((i) => i + 1), stepDuration);
      return () => clearTimeout(timer);
    }
  }, [index, stepDuration]);

  const isFinal = index === steps.length - 1;

  useEffect(() => {
    if (isFinal) {
      const extras = revealedIndex !== undefined ? { revealedIndex } : undefined;
      logUiEvent('prediction_tracker_complete', extras);
    }
  }, [isFinal, revealedIndex]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: FADE_DURATION, ease: EASE }}
        className={`p-4 text-center rounded ${
          isFinal ? 'bg-blue-600 text-white cursor-pointer' : 'bg-gray-100 text-gray-700'
        }`}
        onClick={isFinal ? onReveal : undefined}
      >
        {steps[index]}
      </motion.div>
    </AnimatePresence>
  );
};

export default PredictionTracker;

