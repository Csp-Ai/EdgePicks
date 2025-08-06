import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function usePredictionReveal() {
  const { data: session } = useSession();
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [showModal, setShowModal] = useState(false);

  const handleReveal = (idx: number) => {
    if (session) {
      setRevealed((prev) => ({ ...prev, [idx]: true }));
    } else {
      setShowModal(true);
    }
  };

  return { revealed, handleReveal, showModal, setShowModal };
}
