'use client';

import React from 'react';
import { ToastProvider } from '../../lib/useToast';

const Toaster: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>{children}</ToastProvider>
);

export default Toaster;
