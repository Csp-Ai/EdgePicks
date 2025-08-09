import React from 'react';
import DemoToggle from '../components/dev/DemoToggle';

const DevPage: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Developer Tools</h1>
      <DemoToggle />
    </div>
  );
};

export default DevPage;
