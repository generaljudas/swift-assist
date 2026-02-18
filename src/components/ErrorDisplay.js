import React from 'react';

const ErrorDisplay = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full mb-4 px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
    >
      {message}
    </div>
  );
};

export default ErrorDisplay;
