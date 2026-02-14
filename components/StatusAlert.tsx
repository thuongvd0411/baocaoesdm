
import React from 'react';

interface StatusAlertProps {
  type: 'loading' | 'error' | 'success';
  message: string;
}

const StatusAlert: React.FC<StatusAlertProps> = ({ type, message }) => {
  const styles = {
    loading: "bg-indigo-50 border-indigo-200 text-indigo-700",
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700"
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[type]} animate-pulse mb-6 flex items-center gap-3`}>
      {type === 'loading' && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {type === 'error' && (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default StatusAlert;
