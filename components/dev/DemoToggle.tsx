"use client";

import React from 'react';
import { useDemoMode } from '@/lib/demoMode';

const DemoToggle: React.FC = () => {
  const enabled = useDemoMode();
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={enabled} readOnly />
      <span>Demo Mode</span>
    </label>
  );
};

export default DemoToggle;
