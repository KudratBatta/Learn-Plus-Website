import React from 'react';

const LoadingSpinner = ({ size = 'medium', fullPage = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-4',
    large: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} border-indigo-600 border-t-transparent rounded-full animate-spin`}></div>
      <p className="text-slate-500 text-sm font-medium animate-pulse">Loading content...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[50vh] w-full flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
