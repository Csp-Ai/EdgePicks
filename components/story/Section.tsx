import React, { PropsWithChildren } from 'react';

interface SectionProps extends PropsWithChildren {
  title: string;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-8">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

