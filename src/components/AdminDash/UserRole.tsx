import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { CustomUser, Role } from "../../types/UserType";
import { Session } from "next-auth";

interface UserRowProps {
  user: CustomUser;
  selectedUserIds: Set<string>;
  setSelectedUserIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setUsers: React.Dispatch<React.SetStateAction<CustomUser[]>>;
  session: Session;
}

export const UserRole: React.FC<UserRowProps> = ({
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActionMenuUserId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setShowRoleChangeModal(true);
  };

  const handleToggleActiveStatus = () => {
    if (session.user.id === user.id) {
      alert("You cannot change your own status.");
      return;
    }
    setShowActivationModal(true);
  };

  const handleDeleteUser = () => {
    if (session.user.id === user.id) {
      alert("You cannot delete your own account.");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    setLogs((prevLogs) => [...prevLogs, `Deleted user ${user.name}`]);
  };

  const handleViewLogs = () => {
    console.log(`Viewing logs for user ${user.id}`);
    alert(`Logs for user: ${user.name} \n${logs.join("\n")}`);
  };

  const confirmRoleChange = (newRole: Role) => {
    console.log("Updating role for:", user.id, "to:", newRole);
  
    setUsers((prev) => {
      const updatedUsers = prev.map((u) =>
        u.id === user.id ? { ...u, role: newRole } : u
      );
      console.log("Updated Users:", updatedUsers);
      return updatedUsers;
    });
  
    setLogs((prevLogs) => [...prevLogs, `Changed role for ${user.name} to ${newRole}`]);
  
    setShowRoleChangeModal(false);
  };
  

  const confirmToggleActiveStatus = () => {
    console.log(`Confirming status change for ${user.name}`);
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
    );
    setLogs((prevLogs) => [
      ...prevLogs,
      `${user.isActive ? "Deactivated" : "Activated"} account for ${user.name}`,
    ]);
    setShowActivationModal(false);
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

      {showRoleChangeModal &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Change Role for {user.name}</h2>
              <div className="space-y-4">
                {["USER", "ADMIN", "MODERATOR"].map((role) => (
                  <button
                    key={role}
                    onClick={() => confirmRoleChange(role as Role)}
                    className={`px-4 py-2 text-sm rounded ${
                      user.role === role ? "bg-gray-300 text-gray-800" : "bg-blue-500 text-white"
                    }`}
                    disabled={user.role === role}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRoleChangeModal(false)}
                className="mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded bg-white"
              >
                Cancel
              </button>
            </div>
          </div>,
          document.body 
        )}

      {showActivationModal &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                {user.isActive ? "Deactivate Account" : "Activate Account"} for {user.name}
              </h2>
              <button
                onClick={confirmToggleActiveStatus}
                className="px-4 py-2 bg-blue-500 text-white rounded mr-4"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowActivationModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded bg-white"
              >
                Cancel
              </button>
            </div>
          </div>,
          document.body 
        )}
    </>
  );
};
