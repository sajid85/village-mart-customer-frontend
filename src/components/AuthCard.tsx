'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';

interface AuthCardProps {
  isLogin?: boolean;
  children: React.ReactNode;
}

export default function AuthCard({ isLogin = true, children }: AuthCardProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <Logo />
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? 'Sign in to access your account' : 'Join us and start your journey'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div 
          className={`
            bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10
            border border-gray-100
            transform transition-all duration-500
            ${mounted ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-4 opacity-0 rotate-1'}
          `}
        >
          <div className="space-y-6">
            {children}
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {isLogin ? 'New to our platform?' : 'Already have an account?'}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href={isLogin ? '/register' : '/login'}
                className="font-medium text-green-600 hover:text-green-700 transition-colors duration-300"
              >
                {isLogin ? 'Create a new account' : 'Sign in to your account'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 