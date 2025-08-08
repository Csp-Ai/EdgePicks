import React from 'react';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      if (typeof (el as HTMLElement).focus === 'function') {
        (el as HTMLElement).focus();
      }
    }, 300);
  }
}

export default function HeroStrip() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollToId('live-games');
  };

  return (
    <section className="text-center py-12 px-4 sm:px-6 lg:px-8 space-y-6">
      <p className="text-xl font-medium">
        Win more pick’em with explainable AI
      </p>
      <button
        onClick={handleClick}
        className="px-6 py-3 mx-auto rounded-full bg-blue-600 text-white hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        See live games
      </button>
    </section>
  );
}

