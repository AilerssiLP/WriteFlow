import React from "react";
import { UserRow } from "./UserRow";
import { CustomUser, Role } from "../../types/UserType"; 
import { Session } from "next-auth";

interface UserTableProps {
  users: CustomUser[];
  setUsers: React.Dispatch<React.SetStateAction<CustomUser[]>>;
  selectedUserIds: Set<string>;
  setSelectedUserIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  session: Session;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  setUsers,
  selectedUserIds,
  setSelectedUserIds,
  session,
}) => {
  

  const handleSelectAllChange = () => {
    setSelectedUserIds(
      new Set(
        selectedUserIds.size === users.length
          ? [] 
          : users.map((user) => user.id) 
      )
    );
  };

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          <th className="border-b border-gray-300 p-4 text-left align-middle">
            <input
              type="checkbox"
              className="w-6 h-6"
              checked={selectedUserIds.size === users.length && users.length > 0}
              onChange={handleSelectAllChange}
            />
          </th>
          {["name", "email", "role", "isActive"].map((field) => (
            <th key={field} className="border-b border-gray-300 p-4 text-left align-middle">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </th>
          ))}
          <th className="border-b border-gray-300 p-4 text-left align-middle">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center p-4 text-gray-500">
              No users found.
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              selectedUserIds={selectedUserIds}
              setSelectedUserIds={setSelectedUserIds}
              setUsers={setUsers}
              session={session}
            />
          ))
        )}
      </tbody>
    </table>
  );
};
