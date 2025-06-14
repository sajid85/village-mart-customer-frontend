import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Bouncing Carrot */}
        <div className="animate-bounce">
          <svg
            className="w-16 h-16 text-orange-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L4 12h16L12 2z" />
            <path
              className="text-green-600"
              d="M12 2L4 12h16L12 2z"
              transform="translate(0, 12) scale(0.5)"
            />
          </svg>
        </div>
        
        {/* Loading Text */}
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Fresh Vegetables...
          </h2>
          <p className="text-sm text-gray-500">
            Please wait while we gather the freshest produce for you
          </p>
        </div>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
} 