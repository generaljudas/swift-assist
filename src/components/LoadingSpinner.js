import React from 'react';

const LoadingSpinner = () => (
  <div className="inline-block bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
    <div className="flex items-center space-x-2" aria-label="Loading" role="status">
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
      <div
        className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
        style={{ animationDelay: '0.2s' }}
      />
      <div
        className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  </div>
);

export default LoadingSpinner;
