import React from 'react';
import { signIn } from 'next-auth/react';
import { Button } from './ui/button';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        onClick={handleContentClick}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Sign in</h2>
        <Button className="w-full" onClick={() => signIn('google')}>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default SignInModal;
