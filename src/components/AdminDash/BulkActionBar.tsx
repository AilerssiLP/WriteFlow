import React from "react";
import { CustomUser, Role } from "../../types/UserType";
import { Session } from "next-auth";

interface BulkActionBarProps {
  selectedUserIds: Set<string>;
  users: CustomUser[];
  setUsers: React.Dispatch<React.SetStateAction<CustomUser[]>>;
  resetSelection: () => void;
  session: Session;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedUserIds,
  users,
  setUsers,
  resetSelection,
  session,
}) => {
  const changeRoleOfSelectedUsers = async (newRole: Role) => {
    try {
      console.log('Attempting to change roles for users:', Array.from(selectedUserIds));
      console.log('New role:', newRole);

      if (selectedUserIds.size === 0) {
        console.error('No users selected for role change.');
        return;
      }

      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: Array.from(selectedUserIds), role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to change roles.");
      }

      console.log('Role change successful. Updating local state.');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUserIds.has(user.id) ? { ...user, role: newRole } : user
        )
      );

      resetSelection();
    } catch (error) {
      console.error("Failed to change roles of selected users.", error);
      alert("Failed to change roles of selected users.");
    }
  };

  const deleteSelectedUsers = async () => {
    try {
      console.log('Attempting to delete users:', Array.from(selectedUserIds));
  
      if (selectedUserIds.size === 0) {
        console.error('No users selected for deletion.');
        return;
      }

      const response = await fetch("/api/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: Array.from(selectedUserIds) }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete users.");
      }
  
      console.log('User deletion successful. Updating local state.');
      setUsers((prevUsers) => prevUsers.filter((user) => !selectedUserIds.has(user.id)));
      resetSelection();
    } catch (error) {
      console.error("Failed to delete selected users.", error);
      alert("Failed to delete selected users.");
    }
  };
  

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
      <button onClick={resetSelection} className="px-4 py-2 border rounded">
        Reset
      </button>
      <button onClick={() => changeRoleOfSelectedUsers("USER")} className="px-4 py-2 border rounded">
        Change to USER
      </button>
      <button onClick={() => changeRoleOfSelectedUsers("MODERATOR")} className="px-4 py-2 border rounded">
        Change to MODERATOR
      </button>
      <button onClick={() => changeRoleOfSelectedUsers("ADMIN")} className="px-4 py-2 border rounded">
        Change to ADMIN
      </button>
      <button onClick={deleteSelectedUsers} className="px-4 py-2 text-red-500 border border-red-500 rounded">
        Delete selected
      </button>
    </div>
  );
};
