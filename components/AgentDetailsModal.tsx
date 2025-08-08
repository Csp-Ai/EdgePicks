import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';

interface AgentDetails {
  name: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  weight: number;
  accuracy: number;
}

interface AgentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AgentDetails;
}

const focusableSelectors =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const AgentDetailsModal: React.FC<AgentDetailsModalProps> = ({ isOpen, onClose, agent }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;

    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelectors);
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = () => onClose();
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="agent-details-title"
        className="bg-white w-full max-w-md rounded p-4 shadow-md text-gray-900"
        ref={modalRef}
        onClick={stopPropagation}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="agent-details-title" className="text-lg font-semibold">
            {agent.name}
          </h2>
          <Button ref={closeButtonRef} onClick={onClose} aria-label="Close" className="px-2 py-1">
            Close
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Purpose:</span> {agent.purpose}
          </p>
          <p>
            <span className="font-semibold">Inputs:</span> {agent.inputs.join(', ')}
          </p>
          <p>
            <span className="font-semibold">Outputs:</span> {agent.outputs.join(', ')}
          </p>
          <p>
            <span className="font-semibold">Weight:</span> {agent.weight}
          </p>
          <p>
            <span className="font-semibold">Last Accuracy:</span> {agent.accuracy}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsModal;

