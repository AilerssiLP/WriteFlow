import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchUser from '../../components/SearchUser/SearchUser';
import { User } from '../../types/UserType';
import '@testing-library/jest-dom';

const mockUserData: User[] = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    emailVerified: null,
    image: null,
    coverImage: null,
    password: null,
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
    isOnline: true,
    followerCount: 0,
    followingCount: 1,
    notificationsCount: 0,
    isActive: true,
  },
];

vi.mock('../ui/input', () => ({
  Input: ({ ...props }) => <input {...props} />,
}));

vi.mock('../ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock('../Friends/SearchUserCard', () => ({
  default: ({ userData }) => <div>{userData.name}</div>,
}));

describe('<SearchUser />', () => {
  it('renders the SearchUser component with input and button', () => {
    render(<SearchUser data={mockUserData} />);

    const inputElement = screen.getByPlaceholderText('Search User...');
    expect(inputElement).toBeInTheDocument();

    const buttonElement = screen.getByRole('button', { name: /search/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('renders user cards based on the provided data', () => {
    render(<SearchUser data={mockUserData} />);

    const userCardElement = screen.getByText('John Doe');
    expect(userCardElement).toBeInTheDocument();
  });

  it('simulates form submission and input change', () => {
    render(<SearchUser data={mockUserData} />);

    const inputElement = screen.getByPlaceholderText('Search User...') as HTMLInputElement;
    const buttonElement = screen.getByRole('button', { name: /search/i });

    fireEvent.change(inputElement, { target: { value: 'John' } });
    expect(inputElement.value).toBe('John');

    fireEvent.click(buttonElement);
  });
});
