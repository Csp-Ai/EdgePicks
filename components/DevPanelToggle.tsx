import React, { useEffect } from 'react';

const DevPanelToggle: React.FC = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === 'D') {
        const currentMode = localStorage.getItem('LIVE_MODE') || 'off';
        const newMode = currentMode === 'on' ? 'off' : 'on';
        localStorage.setItem('LIVE_MODE', newMode);
        window.location.reload();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
};

export default DevPanelToggle;