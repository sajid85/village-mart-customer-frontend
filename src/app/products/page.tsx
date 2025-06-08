'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { getPlaceholderImage } from '@/utils/cloudinary';
import { useRouter } from 'next/navigation';

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

// Add image state tracking
type ImageState = 'loading' | 'loaded' | 'error';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [imageStates, setImageStates] = useState<{[key: string]: ImageState}>({});
  const router = useRouter();

  // Function to get category-specific fallback image
  const getFallbackImage = (category: string): string => {
    return getPlaceholderImage(category);
  };

  // Handle image load success
  const handleImageLoad = (productId: string) => {
    setImageStates(prev => ({
      ...prev,
      [productId]: 'loaded'
    }));
  };

  // Handle image load error
  const handleImageError = (productId: string, category: string, e: any) => {
    if (e.target) {
      const target = e.target as HTMLImageElement;
      const fallbackUrl = getFallbackImage(category);
      if (target.src !== fallbackUrl) {
        target.src = fallbackUrl;
      }
    }
    setImageStates(prev => ({
      ...prev,
      [productId]: 'error'
    }));
    console.warn(`Failed to load image for product ${productId}. Using fallback.`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3005/products');
        setProducts(response.data);
        // Initialize image states
        const initialImageStates = response.data.reduce((acc: {[key: string]: ImageState}, product: Product) => {
          acc[product.id] = 'loading';
          return acc;
        }, {});
        setImageStates(initialImageStates);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <button
          onClick={() => router.push('/cart')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          View Cart
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative aspect-square bg-gray-100">
              
              
              {/* Determine if the image URL seems valid */}
              {(() => {
                const isValidUrl = typeof product.imageUrl === 'string' && (product.imageUrl.startsWith('http') || product.imageUrl.startsWith('/'));

                if (!isValidUrl || imageStates[product.id] === 'error') {
                  // Show fallback visual if URL is invalid or image loading failed
                  return (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-500 z-0">
                      <svg 
                        className="w-12 h-12 mb-2" 
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
                      <span className="text-sm text-gray-600">Image Unavailable</span>
                    </div>
                  );
                } else {
                  // Attempt to load the image if URL seems valid
                  return (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={`object-cover transition-opacity duration-300 ${
                        imageStates[product.id] === 'loaded' ? 'opacity-100' : 'opacity-0'
                      }`}
                      priority={product.isFeatured}
                      onLoad={() => handleImageLoad(product.id)}
                      onError={(e) => handleImageError(product.id, product.category, e)}
                    />
                  );
                }
              })()}

              {/* Sale badge */}
              {product.isOnSale && (
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold z-20">
                  Sale
                </span>
              )}
            </div>
            
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through mr-2">
                      ${product.oldPrice}
                    </span>
                  )}
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price}
                  </span>
                </div>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-semibold ${
                    product.inStock
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 