'use client';

import { useState } from 'react';
import Loading from '../loading';

export default function TestLoadingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    // Simulate a 3-second loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Loading Screen Test</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 mb-4">
            Click the button below to see the loading screen in action.
          </p>
          
          <button
            onClick={simulateLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Show Loading Screen
          </button>
        </div>

        {isLoading && (
          <div className="fixed inset-0 z-50">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
} 