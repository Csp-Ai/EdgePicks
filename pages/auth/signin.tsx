import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={() => signIn('credentials')}
        className="px-4 py-2 bg-blue-600 text-white rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        Continue
      </button>
    </div>
  );
}
