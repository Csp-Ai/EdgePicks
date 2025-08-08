import React, { useId, useState } from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  reason: string;
  className?: string;
  children: React.ReactNode;
}

const ReasoningDisclosure: React.FC<Props> = ({
  reason,
  className = '',
  children,
  ...buttonProps
}) => {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div>
      <button
        type="button"
        className={className}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        {...buttonProps}
      >
        {children}
      </button>
      <div id={id} hidden={!open} className="mt-1 text-xs text-gray-600">
        {reason}
      </div>
    </div>
  );
};

export default ReasoningDisclosure;

