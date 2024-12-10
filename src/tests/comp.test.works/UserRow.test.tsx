import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserRow } from '../../components/AdminDash/UserRow';
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
  isOnline: true,
  followerCount: 0,
  followingCount: 0,
  notificationsCount: 0,
};

const session: Session = {
  user: {
    image: 'admin-1.png',
    email: 'admin@example.com',
    role: 'ADMIN',
    name: 'Admin',
  },
  expires: '2099-12-31T23:59:59.999Z',
};

const setSelectedUserIds = vi.fn();
const setUsers = vi.fn();

describe('<UserRow /> interactions', () => {
  it('renders action menu when button is clicked', () => {
    render(
      <table>
        <tbody>
          <UserRow
            user={user}
            selectedUserIds={new Set()}
            setSelectedUserIds={setSelectedUserIds}
            setUsers={setUsers}
            session={session}
          />
        </tbody>
      </table>
    );

    const actionButton = screen.getByText('...');
    fireEvent.click(actionButton);
    expect(screen.getByText('Change Role')).toBeInTheDocument();
    expect(screen.getByText('Deactivate Account')).toBeInTheDocument();
    expect(screen.getByText('View Logs')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('opens and closes role change modal', async () => {
    render(
      <table>
        <tbody>
          <UserRow
            user={user}
            selectedUserIds={new Set()}
            setSelectedUserIds={setSelectedUserIds}
            setUsers={setUsers}
            session={session}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText('...'));
    fireEvent.click(screen.getByText('Change Role'));

    await waitFor(() => {
      expect(screen.getByText(`Change Role for ${user.name}`)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText(`Change Role for ${user.name}`)).not.toBeInTheDocument();
    });
  });

  it('opens and closes activation modal', async () => {
    render(
      <table>
        <tbody>
          <UserRow
            user={user}
            selectedUserIds={new Set()}
            setSelectedUserIds={setSelectedUserIds}
            setUsers={setUsers}
            session={session}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText('...'));
    fireEvent.click(screen.getByText('Deactivate Account'));

    await waitFor(() => {
      expect(screen.getByText((content) =>
        content.includes('Deactivate Account') && content.includes('John Doe')
      )).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText((content) =>
        content.includes('Deactivate Account') && content.includes('John Doe')
      )).not.toBeInTheDocument();
    });
  });

  it('opens and displays logs modal', async () => {
    render(
      <table>
        <tbody>
          <UserRow
            user={user}
            selectedUserIds={new Set()}
            setSelectedUserIds={setSelectedUserIds}
            setUsers={setUsers}
            session={session}
          />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText('...'));
    fireEvent.click(screen.getByText('View Logs'));

    await waitFor(() => {
      expect(screen.getByText((content) =>
        content.includes('Logs for') && content.includes('John Doe')
      )).toBeInTheDocument();
    });
  });
});
