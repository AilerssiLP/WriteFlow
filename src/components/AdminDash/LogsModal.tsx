import React from 'react';

interface LogsModalProps {
  userName: string;
  logs: string[];
  loading: boolean;
  onClose: () => void;
}

export const LogsModal: React.FC<LogsModalProps> = ({
  userName,
  logs,
  loading,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Activity Logs for {userName}</h2>
        <button
          className="text-red-500 mb-4"
          onClick={onClose}
        >
          Close
        </button>
        {loading ? (
          <p className="text-gray-500 mt-4">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500 mt-4">No activity logs found.</p>
        ) : (
          <table className="min-w-full border-b border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="border-b border-gray-300 p-2 text-left">Activity</th>
                <th className="border-b border-gray-300 p-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-200">
                  <td className="border-b border-gray-300 p-2">{log}</td>
                  <td className="border-b border-gray-300 p-2">
                    {new Date().toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
