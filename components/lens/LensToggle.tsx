import React from 'react';
import { Button } from '../ui/button';
import { useLens } from './LensContext';

const LensToggle: React.FC = () => {
  const { active, toggle } = useLens();
  return (
    <Button onClick={toggle} className="ml-2">
      {active ? 'Hide Lens' : 'Show Lens'}
    </Button>
  );
};

export default LensToggle;
