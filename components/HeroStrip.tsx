import React from 'react';

export default function HeroStrip() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' });
    window.location.hash = 'games';
  };

  return (
    <section className="text-center py-8 space-y-4">
      <p className="text-xl font-medium">
        Win more pick’em with explainable AI
      </p>
      <a
        href="#games"
        onClick={handleClick}
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        See live games
      </a>
    </section>
  );
}

