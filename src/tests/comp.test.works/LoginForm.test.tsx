import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../components/Auth/LoginForm';  
import { vi } from 'vitest';
import { login } from '@/actions/auth.action';  

vi.mock('@/actions/auth.action', () => ({
  login: vi.fn(),
}));

describe('LoginForm', () => {
  it('should render all form fields', async () => {
    render(<LoginForm />);

    await waitFor(() => expect(screen.getByTestId('email')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('password')).toBeInTheDocument());
  });

  it('should show an error if login fails', async () => {
    vi.mock('@/actions/auth.action', () => ({
      login: vi.fn().mockResolvedValueOnce({ error: 'Login failed' }),
    }));

    render(<LoginForm />);

    await userEvent.type(screen.getByTestId('email'), 'john@example.com');
    await userEvent.type(screen.getByTestId('password'), 'password123');

    console.time("loginFormSubmit"); 

    await userEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => expect(screen.getByText(/Login failed/i)).toBeInTheDocument());

    console.timeEnd("loginFormSubmit"); 
  });

  it('should submit successfully when login succeeds', async () => {
    // @ts-ignore
    (login as vi.Mock).mockResolvedValueOnce({ error: 'Login successful' });

    render(<LoginForm />);

    await userEvent.type(screen.getByTestId('email'), 'john@example.com');
    await userEvent.type(screen.getByTestId('password'), 'password123');

    await userEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => expect(screen.getByText(/Login successful/i)).toBeInTheDocument());
  });
});
