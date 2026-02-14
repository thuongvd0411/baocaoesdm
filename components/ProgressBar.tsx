
import React from 'react';

interface ProgressBarProps {
  progress: number;
  message?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, message }) => {
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-indigo-700">{message || 'Đang xử lý...'}</span>
        <span className="text-sm font-medium text-indigo-700">{progress}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
