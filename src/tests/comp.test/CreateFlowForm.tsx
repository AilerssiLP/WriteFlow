import React from 'react'; 
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../../components/Auth/RegisterForm';
import { vi } from 'vitest';
import { register } from '@/actions/auth.action';
import '@testing-library/jest-dom';

vi.mock('@/actions/auth.action', () => ({
  register: vi.fn(),
}));

describe('<RegisterForm /> Component', () => {
  beforeEach(() => {
    vi.resetAllMocks(); 
  });

  it('renders all form fields', () => {
    render(<RegisterForm />);

    console.log(screen.debug());


    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('updates input fields correctly using userEvent', async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/Name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/Username/i), 'johndoe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'johndoe@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');

    expect(screen.getByLabelText(/Name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/Username/i)).toHaveValue('johndoe');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('johndoe@example.com');
    expect(screen.getByLabelText(/Password/i)).toHaveValue('password123');
  });

  it('submits the form and handles success response', async () => {
    register.mockResolvedValue({ success: 'Registration successful!' });

    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/Name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/Username/i), 'johndoe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'johndoe@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');

    const registerButton = screen.getByRole('button', { name: /Register/i });
    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/Registration successful!/i)).toBeInTheDocument();
      expect(register).toHaveBeenCalledWith({
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'password123',
      });
    });
  });

  it('displays an error message on failed submission', async () => {
    register.mockResolvedValue({ error: 'Registration failed' });

    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/Name/i), 'Jane Doe');
    await userEvent.type(screen.getByLabelText(/Username/i), 'janedoe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'janedoe@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password456');

    const registerButton = screen.getByRole('button', { name: /Register/i });
    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });

  it('disables the submit button while form submission is pending', async () => {
    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/Name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/Username/i), 'johndoe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'johndoe@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');

    const registerButton = screen.getByRole('button', { name: /Register/i });
    await userEvent.click(registerButton);

    expect(registerButton).toBeDisabled();
  });
});
