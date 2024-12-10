
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToggleSidebar from '@/components/Sidebar/ToggleSidebar';
import '@testing-library/jest-dom';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { signOut } from 'next-auth/react';

import { TextEncoder, TextDecoder as NodeTextDecoder } from 'util';

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = NodeTextDecoder;

vi.mock('@/auth', () => ({
    auth: vi.fn(() => ({ user: { id: 'mock-user-id' } })),
  }));
  

const mockFindUnique = vi.fn();
vi.mock('@/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: mockFindUnique,
    },
  },
}));

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

describe('<ToggleSidebar /> Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when there is no session', async () => {
    const { auth } = await import('@/auth');
    (auth as jest.Mock).mockResolvedValue(null);

    render(<ToggleSidebar />);
    expect(screen.queryByText('Feeds')).not.toBeInTheDocument();
  });

  it('should render the user information when session is present', async () => {
    const { auth } = await import('@/auth');
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: 'user-1',
      },
    });

    mockFindUnique.mockResolvedValue({
      id: 'user-1',
      name: 'John Doe',
      image: null,
      role: 'USER',
      followers: [],
    });

    render(<ToggleSidebar />);

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Feeds')).toBeInTheDocument();
    expect(screen.getByText('Friends')).toBeInTheDocument();
  });

  it('should show Admin Dashboard for non-USER roles', async () => {
    const { auth } = await import('@/auth');
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: 'admin-1',
      },
    });

    mockFindUnique.mockResolvedValue({
      id: 'admin-1',
      name: 'Admin User',
      image: null,
      role: 'ADMIN',
      followers: [],
    });

    render(<ToggleSidebar />);

    expect(await screen.findByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('should trigger logout when clicking the Logout button', async () => {
    const { auth } = await import('@/auth');
    (auth as jest.Mock).mockResolvedValue({
      user: {
        id: 'user-1',
      },
    });

    mockFindUnique.mockResolvedValue({
      id: 'user-1',
      name: 'John Doe',
      image: null,
      role: 'USER',
      followers: [],
    });

    render(<ToggleSidebar />);

    const logoutButton = await screen.findByText('Logout');
    fireEvent.click(logoutButton);

    expect(signOut).toHaveBeenCalled();
  });
});
