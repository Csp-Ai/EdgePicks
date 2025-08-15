import * as React from 'react';
import { cn } from '@/lib/utils';

interface FieldContextValue {
  id: string;
  errorId: string;
  error?: string;
}

const FieldContext = React.createContext<FieldContextValue | undefined>(undefined);

export const useFieldContext = (): FieldContextValue => {
  const context = React.useContext(FieldContext);
  if (!context) {
    throw new Error('Field components must be used within a <Field>');
  }
  return context;
};

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  error?: string;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ children, id, error, className, ...props }, ref) => {
    const reactId = React.useId();
    const fieldId = id ?? reactId;
    const errorId = `${fieldId}-error`;

    return (
      <FieldContext.Provider value={{ id: fieldId, errorId, error }}>
        <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props}>
          {children}
        </div>
      </FieldContext.Provider>
    );
  }
);
Field.displayName = 'Field';
