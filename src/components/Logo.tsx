'use client';

export default function Logo() {
  return (
    <div className="flex items-center justify-center space-x-3">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full transform rotate-6 transition-transform hover:rotate-12"></div>
        <div className="absolute inset-0 bg-white rounded-full transform -rotate-3 transition-transform hover:rotate-0">
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-green-600">V</span>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
          Village Mart
        </h1>
        <p className="text-sm text-gray-500 -mt-1">Your Local Marketplace</p>
      </div>
    </div>
  );
} 