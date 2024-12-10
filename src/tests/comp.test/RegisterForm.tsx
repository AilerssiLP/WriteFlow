
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterForm from '../../components/Auth/RegisterForm'; 
import '@testing-library/jest-dom';
import { register } from '../../actions/auth.action'; 
import { describe, it, expect, beforeEach, vi } from 'vitest';


vi.mock('../../actions/auth.action', () => ({
  register: vi.fn(),
}));

describe('<RegisterForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<RegisterForm />);

    expect(screen.queryByText("Enter your username...")).toBeInTheDocument();
    expect(screen.queryByText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryByText('button', { name: /register/i })).toBeInTheDocument();
  });

  it('updates input fields correctly', () => {
    render(<RegisterForm />);

    const nameInput = screen.getByPlaceholderText('Enter your name...');
    const usernameInput = screen.getByPlaceholderText('Enter your username...');
    const emailInput = screen.getByPlaceholderText('Enter your email...');
    const passwordInput = screen.getByPlaceholderText('Enter your password...');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nameInput).toHaveValue('John Doe');
    expect(usernameInput).toHaveValue('johndoe');
    expect(emailInput).toHaveValue('john.doe@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
