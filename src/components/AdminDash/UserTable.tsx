import React, { useState } from "react";
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
  const [sortConfig, setSortConfig] = useState<{ key: keyof CustomUser; direction: "asc" | "desc" } | null>(null);

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig) return users;
    const sorted = [...users];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [users, sortConfig]);

  const handleSort = (key: keyof CustomUser) => {
    setSortConfig((prev) => {
      if (prev?.key === key && prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  const handleSelectAllChange = () => {
    setSelectedUserIds(
      new Set(
        selectedUserIds.size === sortedUsers.length
          ? []
          : sortedUsers.map((user) => user.id)
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
              checked={selectedUserIds.size === sortedUsers.length && sortedUsers.length > 0}
              onChange={handleSelectAllChange}
            />
          </th>
          {["name", "email", "role", "isActive"].map((field) => (
            <th
              key={field}
              className="border-b border-gray-300 p-4 text-left align-middle cursor-pointer"
              onClick={() => handleSort(field as keyof CustomUser)}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {sortConfig?.key === field && (
                <span>
                  {sortConfig.direction === "asc" ? " ↑" : " ↓"}
                </span>
              )}
            </th>
          ))}
          <th className="border-b border-gray-300 p-4 text-left align-middle">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedUsers.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center p-4 text-gray-500">
              No users found.
            </td>
          </tr>
        ) : (
          sortedUsers.map((user) => (
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
