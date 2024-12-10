import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../../components/Auth/RegisterForm'; 
import { register } from '@/actions/auth.action';  
import {vi } from 'vitest';

vi.mock('@/actions/auth.action', () => ({
  register: vi.fn(),
}));

describe('RegisterForm', () => {
  it('should render all form fields', async () => {
    render(<RegisterForm />);

    await waitFor(() => expect(screen.getByTestId('name')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('username')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('email')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('password')).toBeInTheDocument());
  });

  it('should show an error if registration fails', async () => {
    // @ts-ignore
    (register as vi.Mock).mockResolvedValueOnce({ error: 'Registration failed' });

    render(<RegisterForm />);

    await userEvent.type(screen.getByTestId('name'), 'John Doe');
    await userEvent.type(screen.getByTestId('username'), 'john_doe');
    await userEvent.type(screen.getByTestId('email'), 'john@example.com');
    await userEvent.type(screen.getByTestId('password'), 'password123');


    await userEvent.click(screen.getByRole('button', { name: /Register/i }));


    await waitFor(() => expect(screen.getByText(/Registration failed/i)).toBeInTheDocument());
  });

  it('should submit successfully when registration succeeds', async () => {
    // @ts-ignore
    (register as vi.Mock).mockResolvedValueOnce({ success: 'Registration successful' });

    render(<RegisterForm />);

    await userEvent.type(screen.getByTestId('name'), 'John Doe');
    await userEvent.type(screen.getByTestId('username'), 'john_doe');
    await userEvent.type(screen.getByTestId('email'), 'john@example.com');
    await userEvent.type(screen.getByTestId('password'), 'password123');

    await userEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => expect(screen.getByText(/Registration successful/i)).toBeInTheDocument());
  });
});
