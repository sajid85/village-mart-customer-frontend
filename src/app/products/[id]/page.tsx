'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StarIcon } from '@heroicons/react/20/solid';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { getProfile, getProduct, addToCart, addToWishlist, isInWishlist } from '@/utils/api';
import { getPlaceholderImage } from '@/utils/cloudinary';
import toast from 'react-hot-toast';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileData, productData, wishlistStatus] = await Promise.all([
          getProfile(),
          getProduct(params.id),
          isInWishlist(params.id),
        ]);
        setUser(profileData);
        setProduct(productData);
        setIsInWishlistState(wishlistStatus);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    try {
      await addToWishlist(product.id);
      setIsInWishlistState(true);
      toast.success(`${product.name} added to wishlist`);
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 
          'status' in error.response && error.response.status === 409) {
        toast.error('Product already in wishlist');
      } else {
        console.error('Failed to add to wishlist:', error);
        toast.error('Failed to add to wishlist');
      }
    }
  };

  // Function to get category-specific fallback image
  const getFallbackImage = (category: string): string => {
    return getPlaceholderImage(category);
  };

  // Handle image load success
  const handleImageLoad = () => {
    setImageState('loaded');
  };

  // Handle image load error
  const handleImageError = (e: any) => {
    if (product) {
      const target = e.target as HTMLImageElement;
      target.src = getFallbackImage(product.category);
      setImageState('error');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
                ← Back
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.firstName}!</span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  router.push('/login');
                }}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                {/* Loading spinner */}
                {imageState === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <LoadingSpinner />
                  </div>
                )}
                
                {/* Product image */}
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover transition-opacity duration-300 ${
                    imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
                  }`}
                  priority
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />

                {/* Error state */}
                {imageState === 'error' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-0">
                    <svg 
                      className="w-8 h-8 text-gray-400 mb-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <span className="text-xs text-gray-500">Image not available</span>
                  </div>
                )}

                {/* Sale badge */}
                {product.isOnSale && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold z-20">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>
                <p className="text-gray-700 mb-6">{product.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ${Number(product.oldPrice).toFixed(2)}
                    </span>
                  )}
                  {product.isOnSale && (
                    <span className="px-2 py-1 text-sm font-semibold text-white bg-red-500 rounded">
                      SALE
                    </span>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < product.rating ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Stock Status */}
              <div className="mb-8">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.inStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Quantity */}
              {product.inStock && (
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium ${
                    product.inStock
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!product.inStock}
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50"
                  disabled={isInWishlistState}
                >
                  {isInWishlistState ? (
                    <HeartIconSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 