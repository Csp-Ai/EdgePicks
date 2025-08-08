'use client';

import React from 'react';
import { Button } from './button';
import { triggerToast } from '../../lib/useToast';

const Welcome: React.FC = () => (
  <section className="p-6 space-y-4">
    <h1 className="text-2xl font-bold">Welcome</h1>
    <Button onClick={() => triggerToast({ message: 'Hello from the shell!', type: 'success' })}>
      Trigger Toast
    </Button>
  </section>
);

export default Welcome;
