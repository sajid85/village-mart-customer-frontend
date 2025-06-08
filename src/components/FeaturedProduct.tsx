'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/20/solid';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { getPlaceholderImage } from '@/utils/cloudinary';
import { addToCart } from '@/utils/api';
import toast from 'react-hot-toast';

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

type ImageState = 'loading' | 'loaded' | 'error';

export default function FeaturedProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageState, setImageState] = useState<ImageState>('loading');

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products/featured');
        const data = await response.json();
        setProduct(data);
        setImageState('loading');
      } catch (error) {
        console.error('Failed to fetch featured product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProduct();
  }, []);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  // Handle image load success
  const handleImageLoad = () => {
    setImageState('loaded');
  };

  // Handle image load error
  const handleImageError = (e: any) => {
    if (product && e.target) {
      const target = e.target as HTMLImageElement;
      const fallbackUrl = getPlaceholderImage(product.category);
      if (target.src !== fallbackUrl) {
        target.src = fallbackUrl;
      }
    }
    setImageState('error');
  };

  if (loading || !product) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 relative">
          {/* Loading spinner */}
          {imageState === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          )}

          {/* Product image */}
          <Image
            src={product.imageUrl || getPlaceholderImage(product.category)}
            alt={product.name}
            width={600}
            height={600}
            className={`w-full h-96 object-cover transition-opacity duration-300 ${
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
                className="w-12 h-12 text-gray-400 mb-2" 
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
              <span className="text-sm text-gray-500">Image not available</span>
            </div>
          )}

          {product.isOnSale && (
            <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-semibold rounded-full z-20">
              SALE
            </span>
          )}
        </div>
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-4">
            <h3 className="text-sm text-gray-500 mb-2">{product.category}</h3>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h2>
            <div className="flex items-center mb-4">
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
              <span className="text-sm text-gray-500 ml-2">
                ({product.reviewCount} reviews)
              </span>
            </div>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                product.inStock
                  ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 