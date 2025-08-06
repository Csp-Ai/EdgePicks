import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import UpcomingGamesPanel from '../../components/UpcomingGamesPanel';
import PredictionTracker from '../../components/PredictionTracker';
import SignInModal from '../../components/SignInModal';
import { FADE_DURATION, EASE } from '../../lib/animations';
import usePredictionReveal from '../../lib/hooks/usePredictionReveal';

const PublicMatchupsPage: React.FC = () => {
  const { revealed, showModal, handleReveal, closeModal, session } =
    usePredictionReveal();

  return (
    <main className="min-h-screen bg-gray-50 p-6 space-y-4">
      <p className="text-center text-gray-700">
        Sign in to unlock full predictions. Here are a few upcoming matchups:
      </p>
      <UpcomingGamesPanel
        maxVisible={3}
        hideValues={!session}
        cardWrapper={({ index, children }) => (
          <div className="w-full">
            <AnimatePresence mode="wait" initial={false}>
              {revealed[index] ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: FADE_DURATION, ease: EASE }}
                >
                  {children}
                </motion.div>
              ) : (
                <PredictionTracker
                  revealedIndex={index}
                  onReveal={() => handleReveal(index)}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      />
      <SignInModal isOpen={showModal} onClose={closeModal} />
    </main>
  );
};

export default PublicMatchupsPage;
