'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { getWishlist, removeFromWishlist, addToCart } from '@/utils/api';
import toast from 'react-hot-toast';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number | string;
    imageUrl: string;
    description: string;
    inStock: boolean;
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchWishlistItems();
  }, [router]);

  const fetchWishlistItems = async () => {
    try {
      const items = await getWishlist();
      setWishlistItems(items);
    } catch (error) {
      console.error('Failed to fetch wishlist items:', error);
      toast.error('Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromWishlist(itemId);
      setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId);
      toast.success('Item added to cart');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {item.product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {item.product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900">
                    ${formatPrice(item.product.price)}
                  </span>
                  <span className={`text-sm ${item.product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {item.product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleAddToCart(item.product.id)}
                    disabled={!item.product.inStock}
                    className={`flex items-center px-4 py-2 rounded-md ${
                      item.product.inStock
                        ? 'bg-green-600 text-white hover:bg-green-700 transition-colors duration-300'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 