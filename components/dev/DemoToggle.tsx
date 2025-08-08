import React from 'react';
import { useDemoMode } from '../../lib/demoMode';

const DemoToggle: React.FC = () => {
  const { enabled, setEnabled } = useDemoMode();
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
      />
      <span>Demo Mode</span>
    </label>
  );
};

export default DemoToggle;
