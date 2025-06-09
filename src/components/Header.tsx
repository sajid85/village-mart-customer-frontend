'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCartIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline';
import { getProfile } from '@/utils/api';
import Logo from './Logo';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const router = useRouter();
  const pathname = usePathname(); // <-- ADD THIS LINE
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      fetchUser();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo and Back Button */}
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          {pathname !== '/' && (
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="ml-1">Back</span>
            </button>
          )}
          {/* Logo */}
          <Logo />
        </div>

        {/* Search Bar */}
        <div className="flex-grow mx-4 max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Icons/Buttons */}
        <div className="flex items-center space-x-4">
          {/* Wishlist Icon */}
          <button 
            onClick={() => router.push('/wishlist')}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
          >
            <HeartIcon className="h-6 w-6" />
          </button>
          {/* Cart Icon */}
          <button 
            onClick={() => router.push('/cart')}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
          >
             <ShoppingCartIcon className="h-6 w-6" />
          </button>
           {/* User Profile Icon */}
           <button 
             onClick={() => router.push('/profile')}
             className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
            >
             <UserIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
