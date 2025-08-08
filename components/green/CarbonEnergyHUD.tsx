'use client';

import React, { useEffect, useState } from 'react';

const CO2_PER_INTERACTION = 0.2; // grams of CO2 per interaction
const ENERGY_PER_INTERACTION = 0.0005; // kWh per interaction

const CarbonEnergyHUD: React.FC = () => {
  const [interactions, setInteractions] = useState(0);
  const [lowImpact, setLowImpact] = useState(false);

  useEffect(() => {
    const increment = () => setInteractions((i) => i + 1);
    window.addEventListener('click', increment);
    window.addEventListener('keydown', increment);
    return () => {
      window.removeEventListener('click', increment);
      window.removeEventListener('keydown', increment);
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (lowImpact) {
      html.classList.add('low-impact');
    } else {
      html.classList.remove('low-impact');
    }
  }, [lowImpact]);

  const co2 = (interactions * CO2_PER_INTERACTION).toFixed(2);
  const energy = (interactions * ENERGY_PER_INTERACTION).toFixed(4);

  return (
    <div className="fixed bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded shadow text-xs text-gray-800 dark:text-gray-100">
      <div>
        <strong>{co2}</strong>g CO₂ / <strong>{energy}</strong>kWh
      </div>
      <label className="flex items-center gap-1 mt-2">
        <input
          type="checkbox"
          checked={lowImpact}
          onChange={(e) => setLowImpact(e.target.checked)}
        />
        <span>Low-impact mode</span>
      </label>
    </div>
  );
};

export default CarbonEnergyHUD;
