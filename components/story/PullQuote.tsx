import React, { PropsWithChildren } from 'react';

export function PullQuote({ children }: PropsWithChildren) {
  return (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">
      {children}
    </blockquote>
  );
}

