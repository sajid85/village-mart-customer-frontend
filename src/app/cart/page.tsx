'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';
import { getCart, updateCartQuantity, removeFromCart } from '@/utils/api';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number | string;
    imageUrl: string;
    description: string;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchCartItems();
  }, [router]);

  const fetchCartItems = async () => {
    try {
      const items = await getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      toast.error('Failed to load cart items');
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await updateCartQuantity(itemId, newQuantity);
      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      toast.success('Quantity updated');
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      setCartItems(cartItems.filter(item => item.id !== itemId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    }
  };

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  const calculateItemTotal = (item: CartItem): string => {
    const price = typeof item.product.price === 'string' ? 
      parseFloat(item.product.price) : item.product.price;
    return (price * item.quantity).toFixed(2);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.product.price === 'string' ? 
        parseFloat(item.product.price) : item.product.price;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-gray-600 text-lg mb-6">Your cart is empty. Time to fill it with some delicious items!</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors duration-300 font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <h2 className="text-xl font-semibold p-6 border-b border-gray-200 text-gray-800">Items in Your Cart ({cartItems.length})</h2>
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="p-6 flex items-center space-x-6">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-28 h-28 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 mb-4">
                      ${formatPrice(item.product.price)} each
                    </p>
                      <p className="text-lg font-bold text-gray-900">
                        ${calculateItemTotal(item)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <label htmlFor={`quantity-${item.id}`} className="text-sm font-medium text-gray-700">Quantity:</label>
                        <select
                          id={`quantity-${item.id}`}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          className="rounded-md border-gray-300 shadow-sm text-sm focus:border-green-500 focus:ring-green-500"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-300 p-1 rounded-full hover:bg-red-50"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-fit sticky top-8">
             <h2 className="text-xl font-semibold p-6 border-b border-gray-200 text-gray-800">Order Summary</h2>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-medium text-gray-900">${calculateTotal()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Order Total</span>
                <span className="text-xl font-bold text-green-600">${calculateTotal()}</span>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-3 px-6 bg-green-600 text-white rounded-md text-lg font-semibold hover:bg-green-700 transition-colors duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 