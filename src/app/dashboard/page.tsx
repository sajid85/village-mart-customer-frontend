'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProductGrid from '@/components/ProductGrid';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PromotionalBanner from '@/components/PromotionalBanner';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, checkAuth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        router.replace('/login');
      }
    };
    verifyAuth();
  }, [router, checkAuth]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => router.push('/products')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            View Products
          </button>
          <button
            onClick={() => router.push('/orders')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            View Orders
          </button>
          <button
            onClick={() => router.push('/wishlist')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            View Wishlist
          </button>
          <button
            onClick={() => router.push('/cart')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            View Cart
          </button>
           <button
            onClick={() => router.push('/profile')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            View Profile
          </button>
        </div>

        {/* Explore Products Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Explore Products</h2>
          {/* Using the existing ProductGrid - may need adjustments for styling */}
          <ProductGrid selectedCategory="all" searchQuery={searchQuery} />
        </section>

        {/* Most Popular Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Most popular</h2>
          {/* Placeholder for most popular products grid - you can replace with a ProductGrid or similar component */}
          {/* Removed empty div */}
        </section>

        {/* Promotional Banner */}
        <PromotionalBanner />

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
} 