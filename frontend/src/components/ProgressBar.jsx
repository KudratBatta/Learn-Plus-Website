import React from 'react';

const ProgressBar = ({ value, showText = true, size = 'md' }) => {
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const progress = Math.min(Math.max(value || 0, 0), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-600">
        {showText && <span>Course Progress</span>}
        {showText && <span>{progress}%</span>}
      </div>
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`rounded-full transition-all duration-500 ease-out ${
            progress === 100
              ? 'bg-emerald-600'
              : progress === 50
                ? 'bg-orange-500'
                : progress === 25
                  ? 'bg-yellow-500'
                  : progress > 0
                    ? 'bg-indigo-600'
                    : 'bg-white'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

    </div>
  );
};

export default ProgressBar;
