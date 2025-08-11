'use client';

import React from 'react';
import Nav from './nav';
import ThemeToggle from '../ThemeToggle';
import { cn } from '@/lib/utils';

const Header: React.FC = () => (
  <header className={cn('flex items-center justify-between p-4 border-b')}> 
    <Nav />
    <ThemeToggle />
  </header>
);

export default Header;
