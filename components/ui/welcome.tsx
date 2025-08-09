'use client';

import React from 'react';
import { Button } from './button';
import { toast } from '../../lib/ui/toast';

const Welcome: React.FC = () => (
  <section className="p-6 space-y-4">
    <h1 className="text-2xl font-bold">Welcome</h1>
    <Button onClick={() => toast.success('Hello from the shell!')}>
      Trigger Toast
    </Button>
  </section>
);

export default Welcome;
