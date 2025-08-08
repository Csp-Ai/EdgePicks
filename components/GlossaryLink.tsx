import Link from 'next/link';
import React from 'react';

interface Props {
  className?: string;
}

const GlossaryLink: React.FC<Props> = ({ className = '' }) => (
  <Link href="/glossary" className={`text-xs text-blue-600 hover:underline ${className}`}>
    What does this mean?
  </Link>
);

export default GlossaryLink;

