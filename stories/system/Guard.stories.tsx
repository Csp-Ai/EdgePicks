import type { Meta, StoryObj } from '@storybook/react';
import Guard from '../../components/system/Guard';

const mockUseSession = jest.fn();
jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
}));

const meta: Meta<typeof Guard> = {
  title: 'system/Guard',
  component: Guard,
};
export default meta;

type Story = StoryObj<typeof Guard>;

export const Demo: Story = {
  render: () => {
    mockUseSession.mockReturnValue({ data: { user: { name: 'Demo' } }, status: 'authenticated' });
    return (
      <Guard>
        {() => <div className="p-4 border rounded">Protected Content</div>}
      </Guard>
    );
  },
};

export const WithFallback: Story = {
  render: () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    return (
      <Guard fallback={<div className="p-4 border rounded">Denied</div>}>
        {() => <div className="p-4 border rounded">Protected Content</div>}
      </Guard>
    );
  },
};

