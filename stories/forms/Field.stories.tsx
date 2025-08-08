import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Field, useFieldContext } from '../../components/forms/Field';
import { Label } from '../../components/forms/Label';
import { Error } from '../../components/forms/Error';
import { cn } from '../../lib/utils';

const meta: Meta<typeof Field> = {
  title: 'Forms/Field',
  component: Field,
};

export default meta;

const TextInput = (
  props: React.InputHTMLAttributes<HTMLInputElement>
): JSX.Element => {
  const { id, error, errorId } = useFieldContext();
  return (
    <input
      id={id}
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}
      className={cn(
        'border rounded px-2 py-1',
        error ? 'border-red-500' : 'border-green-500'
      )}
      {...props}
    />
  );
};

type Story = StoryObj<typeof Field>;

export const ErrorState: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    const error = value.length < 3 ? 'Must be at least 3 characters' : undefined;

    return (
      <Field error={error}>
        <Label>Name</Label>
        <TextInput value={value} onChange={(e) => setValue(e.target.value)} />
        <Error />
      </Field>
    );
  },
};

export const SuccessState: Story = {
  render: () => {
    const [value, setValue] = React.useState('Edge');
    const error = value.length < 3 ? 'Must be at least 3 characters' : undefined;

    return (
      <Field error={error}>
        <Label>Name</Label>
        <TextInput value={value} onChange={(e) => setValue(e.target.value)} />
        <Error />
        {!error && <p className="text-sm text-green-600">Looks good!</p>}
      </Field>
    );
  },
};
