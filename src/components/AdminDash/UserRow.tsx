import React, { useState, useRef, useEffect } from "react";
import { CustomUser, Role } from "../../types/UserType";
import { Session } from "next-auth";
import { RoleChangeModal } from "./RoleChangeModal";
import { ActivationModal } from "./ActivationModal";
import { LogsModal } from "./LogsModal";

interface UserRowProps {
  user: CustomUser;
  selectedUserIds: Set<string>;
  setSelectedUserIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setUsers: React.Dispatch<React.SetStateAction<CustomUser[]>>;
  session: Session;
}

export const UserRow: React.FC<UserRowProps> = ({
  user,
  selectedUserIds,
  setSelectedUserIds,
  setUsers,
  session,
}) => {
  const [actionMenuUserId, setActionMenuUserId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showRoleChangeModal, setShowRoleChangeModal] = useState<boolean>(false);
  const [showActivationModal, setShowActivationModal] = useState<boolean>(false);
  const [showLogsModal, setShowLogsModal] = useState<boolean>(false);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<CustomUser | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActionMenuUserId(null);
      }
      if (showRoleChangeModal || showActivationModal || showLogsModal) {
        const modal = document.querySelector('.modal');
        if (modal && !modal.contains(event.target as Node)) {
          setShowRoleChangeModal(false);
          setShowActivationModal(false);
          setShowLogsModal(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showRoleChangeModal, showActivationModal, showLogsModal]);

  const handleCheckboxChange = () => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(user.id)) {
        newSet.delete(user.id);
      } else {
        newSet.add(user.id);
      }
      return newSet;
    });
  };

  const handleRoleChange = () => {
    if (session.user.id === user.id) {
      alert("You cannot change your own role.");
      return;
    }
    setUserToEdit(user);
    setShowRoleChangeModal(true);
  };

  const handleToggleActiveStatus = () => {
    if (session.user.id === user.id) {
      alert("You cannot change your own status.");
      return;
    }
    setShowActivationModal(true);
  };

  const handleDeleteUser = async () => {
    if (session.user.id === user.id) {
      alert("You cannot delete your own account.");
      return;
    }
  
    try {

      const response = await fetch(`/api/users/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: [user.id] }), 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
  

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setLogs((prevLogs) => [...prevLogs, `Deleted user ${user.name}`]);
  
      alert(`User ${user.name} deleted successfully!`);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user from the database.');
    }
  };


  const handleViewLogs = async () => {
    console.log(`Fetching logs for user ${user.id}`);
    setLoadingLogs(true);
    setShowLogsModal(true);
    try {
      const fetchedLogs = await new Promise<string[]>((resolve) => {
        setTimeout(() => {
          resolve([
            `Viewed profile for ${user.name}`,
            `Changed role to ADMIN for ${user.name}`,
            `Deactivated account for ${user.name}`,
          ]);
        }, 1000);
      });
      setLogs(fetchedLogs);
    } catch (error) {
      console.error("Error fetching logs: ", error);
      setLogs(["Failed to fetch logs"]);
    } finally {
      setLoadingLogs(false);
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  const confirmRoleChange = async (newRole: Role) => {
    if (session.user.id === user.id) {
      alert("You cannot change your own role.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting to change role for:", user.id, "to", newRole);

      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: [user.id], role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to change role.");
      }

      console.log("Role change successful. Updating local state.");

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error("Failed to change role for user.", error);
      alert("Failed to change role.");
    } finally {
      setIsLoading(false); 
    }
  };
  
  

  const confirmToggleActiveStatus = async () => {
    console.log(`Confirming status change for ${user.name}`);
    
    try {
      const response = await fetch('/api/users/activation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,  
          isActive: !user.isActive, 
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update activation status.");
      }
  
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      );
      
      setLogs((prevLogs) => [
        ...prevLogs,
        `${user.isActive ? "Deactivated" : "Activated"} account for ${user.name}`,
      ]);
      setShowActivationModal(false);
    } catch (error) {
      console.error("Error updating activation status:", error);
      alert("Failed to update activation status.");
    }
  };
  

  return (
    <>
      <tr className="hover:bg-gray-100 transition duration-200 border-b border-gray-200">
        <td className="p-4 text-left align-middle">
          <input
            type="checkbox"
            className="w-6 h-6"
            checked={selectedUserIds.has(user.id)}
            onChange={handleCheckboxChange}
          />
        </td>
        <td className="p-4 text-left align-middle">{user.name}</td>
        <td className="p-4 text-left align-middle">{user.email}</td>
        <td className="p-4 text-left align-middle">
          <button
            onClick={handleRoleChange}
            className="text-blue-500 hover:underline"
          >
            {user.role}
          </button>
        </td>
        <td className="p-4 text-left align-middle">
          <button
            onClick={handleToggleActiveStatus}
            className="text-blue-500 hover:underline"
          >
            {user.isActive ? "Activated" : "Deactivated"}
          </button>
        </td>
        <td className="p-4 text-left align-middle relative">
          <button
            className="p-2 hover:bg-gray-200 rounded-full"
            onClick={() =>
              setActionMenuUserId(actionMenuUserId === user.id ? null : user.id)
            }
          >
            ...
          </button>
          {actionMenuUserId === user.id && (
            <div
              ref={actionMenuRef}
              className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg p-3 z-50 border border-gray-300"
            >
              <button
                onClick={handleRoleChange}
                className="block text-left w-full text-gray-800 hover:bg-gray-100 px-4 py-2 rounded"
              >
                Change Role
              </button>
              <button
                onClick={handleToggleActiveStatus}
                className="block text-left w-full text-gray-800 hover:bg-gray-100 px-4 py-2 rounded"
              >
                {user.isActive ? "Deactivate Account" : "Activate Account"}
              </button>
              <button
                onClick={handleViewLogs}
                className="block text-left w-full text-gray-800 hover:bg-gray-100 px-4 py-2 rounded"
              >
                View Logs
              </button>
              <button
                onClick={handleDeleteUser}
                className="block text-left w-full text-red-600 hover:bg-gray-100 px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </td>
      </tr>

      {showRoleChangeModal && userToEdit && (
        <RoleChangeModal
          userName={userToEdit?.name ?? ""}
          currentRole={userToEdit.role}
          onConfirm={confirmRoleChange}
          onCancel={() => setShowRoleChangeModal(false)}
        />
      )}

      {showActivationModal && (
        <ActivationModal
          userName={user?.name ?? ""}
          isActive={user.isActive}
          onConfirm={confirmToggleActiveStatus}
          onCancel={() => setShowActivationModal(false)}
        />
      )}

      {showLogsModal && (
        <LogsModal
          userName={user?.name ?? ""}
          logs={logs}
          loading={loadingLogs}
          onClose={() => setShowLogsModal(false)}
        />
      )}
    </>
  );
};
