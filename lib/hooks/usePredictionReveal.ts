import { useSession } from 'next-auth/react';
import { useState } from 'react';

const usePredictionReveal = () => {
  const { data: session, status } = useSession();
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [showModal, setShowModal] = useState(false);

  const handleReveal = (idx: number) => {
    if (session) {
      setRevealed((prev) => ({ ...prev, [idx]: true }));
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  return { revealed, showModal, handleReveal, closeModal, session, status };
};

export default usePredictionReveal;
