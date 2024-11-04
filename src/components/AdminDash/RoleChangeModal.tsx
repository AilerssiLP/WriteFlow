import React from 'react';
import { Role } from '../../types/UserType';

interface RoleChangeModalProps {
  userName: string;
  currentRole: Role;
  onConfirm: (newRole: Role) => void;
  onCancel: () => void;
}

export const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
  userName,
  currentRole,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Change Role for {userName}</h2>
        <div className="space-y-4">
          {["USER", "ADMIN", "MODERATOR"].map((role) => (
            <button
              key={role}
              onClick={() => onConfirm(role as Role)}
              className={`px-4 py-2 text-sm rounded ${
                currentRole === role ? "bg-gray-300 text-gray-800" : "bg-blue-500 text-white"
              }`}
              disabled={currentRole === role}
            >
              {role}
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          className="mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded bg-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
