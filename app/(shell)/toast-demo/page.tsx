'use client';

import React, { useEffect } from 'react';
import { toast } from '@/lib/ui/toast';

export default function ToastDemoPage() {
  useEffect(() => {
    toast.success('Success toast');
    toast.error('Error toast');
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Loading toast',
        success: 'Loaded toast',
        error: 'Failed toast',
      },
    );
  }, []);

  return <p>Toast demo</p>;
}
