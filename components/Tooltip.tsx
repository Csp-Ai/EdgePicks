import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, className }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative inline-block ${className || ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <div className="absolute z-10 w-48 p-2 text-xs text-white bg-gray-800 rounded shadow-lg -top-8 left-1/2 -translate-x-1/2">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
