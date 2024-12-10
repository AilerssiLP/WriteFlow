import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserRole } from '../../components/AdminDash/UserRole';
import { CustomUser, Role } from '../../types/UserType';
import { Session } from 'next-auth';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';

const user: CustomUser = {
  id: 'user-1',
  name: 'John Doe',
  username: 'john_doe',
  email: 'john.doe@example.com',
  emailVerified: null,
  image: null,
  coverImage: null,
  password: null,
  role: 'USER' as Role,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  followers: [],
  followingCount: 0,
  followerCount: 0,
  notificationsCount: 0,
  isOnline: true,
};

const sessionUser: CustomUser = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@example.com',
  username: 'admin_user',
  emailVerified: null,
  image: 'admin-avatar.png',
  coverImage: null,
  password: null,
  role: 'ADMIN' as Role,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  followers: [],
  followingCount: 0,
  followerCount: 0,
  notificationsCount: 0,
  isOnline: true,
};

const session: Session = {
  user: sessionUser,
  expires: '2099-12-31T23:59:59.999Z',
};

const setSelectedUserIds = vi.fn();
const setUsers = vi.fn();

vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('<UserRole /> interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(
      <table>
        <tbody>
          <UserRole
            user={user}
            selectedUserIds={new Set()}
            setSelectedUserIds={setSelectedUserIds}
            setUsers={setUsers}
            session={session}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/john.doe@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/USER/)).toBeInTheDocument();
    expect(screen.getByText(/Activated/)).toBeInTheDocument();
  });

  it('shows an alert when attempting to change the role of the logged-in user', () => {
    render(
      <table>
        <tbody>
          <UserRole
            user={sessionUser}
            selectedUserIds={new Set()}
            setSelectedUserIds={setSelectedUserIds}
            setUsers={setUsers}
            session={session}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText(/ADMIN/));
    expect(window.alert).toHaveBeenCalledWith('You cannot change your own role.');
  });

  it('shows an alert when attempting to deactivate the logged-in user', () => {
    render(
      <table>
        <tbody>
          <UserRole
            user={sessionUser}
            selectedUserIds={new Set()}
            setSelectedUserIds={setSelectedUserIds}
            setUsers={setUsers}
            session={session}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText(/Activated/));
    expect(window.alert).toHaveBeenCalledWith('You cannot change your own status.');
  });
});
