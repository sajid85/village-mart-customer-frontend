'use client';

import { useEffect, useState, useMemo } from 'react';
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
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [stockStatus, setStockStatus] = useState<'all' | 'in' | 'out'>('all');
  const router = useRouter();

  // Dynamically get unique categories from products
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category.toLowerCase())));
    return ['all', ...cats];
  }, [products]);

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

  // Filtering logic
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory;
    const matchesMinPrice = minPrice === '' || product.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || product.price <= Number(maxPrice);
    const matchesStock =
      stockStatus === 'all' ||
      (stockStatus === 'in' && product.inStock) ||
      (stockStatus === 'out' && !product.inStock);
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesStock;
  });

  const handleAddToCart = async (product: Product) => {
    try {
      // Replace this with your actual add-to-cart logic or API call
      // Example: await addToCart(product.id);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

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
      
      {/* Main layout: sidebar + products grid */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4 flex-shrink-0 mb-6 md:mb-0">
          {/* Category Buttons */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Categories</h2>
            <div className="flex flex-wrap md:flex-col gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center w-fit
                    ${selectedCategory === category ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-green-100'}`}
                >
                  {category === 'all'
                    ? 'All Products'
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {/* Search Input */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Search</h2>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          {/* Price Range */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Price Range</h2>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="px-2 py-2 border border-gray-300 rounded-md w-24"
              />
              <span>-</span>
              <input
                type="number"
                min="0"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="px-2 py-2 border border-gray-300 rounded-md w-24"
              />
            </div>
          </div>
          {/* Stock Status */}
          <div className="mb-2">
            <h2 className="text-lg font-semibold mb-3">Stock</h2>
            <div className="flex gap-2 md:flex-col">
              <button
                onClick={() => setStockStatus('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 w-fit
                  ${stockStatus === 'all' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-green-100'}`}
              >
                All
              </button>
              <button
                onClick={() => setStockStatus('in')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 w-fit
                  ${stockStatus === 'in' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-green-100'}`}
              >
                In Stock
              </button>
              <button
                onClick={() => setStockStatus('out')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 w-fit
                  ${stockStatus === 'out' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-green-100'}`}
              >
                Out of Stock
              </button>
            </div>
          </div>
        </aside>
        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
                      onClick={() => handleAddToCart(product)}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 