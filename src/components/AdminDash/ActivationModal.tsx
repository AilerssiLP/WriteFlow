import React from 'react';

interface ActivationModalProps {
  userName: string;
  isActive: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ActivationModal: React.FC<ActivationModalProps> = ({
  userName,
  isActive,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {isActive ? "Deactivate Account" : "Activate Account"} for {userName}
        </h2>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-4"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded bg-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
