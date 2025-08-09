import React from 'react';

interface MethodCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function MethodCard({ title, description, children }: MethodCardProps) {
  return (
    <div className="border rounded p-4 mb-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-700 mb-2">{description}</p>
      {children}
    </div>
  );
}

