import React from 'react';

interface Props {
  showDebug: boolean;
  onToggleDebug: () => void;
}

const Footer: React.FC<Props> = ({ showDebug, onToggleDebug }) => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow-sm">
      <div className="container max-w-screen-xl mx-auto flex items-center justify-between p-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:opacity-80 transition"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.012c0 4.424 2.865 8.181 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.221-.253-4.556-1.113-4.556-4.952 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844a9.56 9.56 0 012.506.337c1.909-1.295 2.748-1.026 2.748-1.026.546 1.376.203 2.393.1 2.646.64.7 1.028 1.594 1.028 2.687 0 3.848-2.338 4.695-4.566 4.944.359.309.679.919.679 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.482A10.013 10.013 0 0022 12.012C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span>GitHub</span>
          </a>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition"
          >
            <img src="/vercel.svg" alt="Vercel" className="h-4" />
          </a>
          <span className="hidden sm:inline">Built by modular AI agents</span>
        </div>
        <button
          onClick={onToggleDebug}
          className="px-2 py-1 border rounded hover:bg-gray-50 transition"
        >
          {showDebug ? 'Hide Debug' : '⚙️ Debug'}
        </button>
      </div>
    </footer>
  );
};

export default Footer;
