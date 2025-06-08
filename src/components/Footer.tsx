'use client'

import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="flex flex-col items-start">
          {/* Logo Placeholder */}
          {/* Add your logo image here, leave src blank */}
          <img src="" alt="Fresh Grocery Logo" className="h-10 w-auto mb-4" />
          <p className="text-gray-600 text-sm">{/* Add a brief description here */}</p>
        </div>

        {/* Account Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Account</h4>
          <ul>
            <li className="mb-2"><Link href="/wishlist" className="text-gray-600 hover:text-gray-900">Wishlist</Link></li>
            <li className="mb-2"><Link href="/cart" className="text-gray-600 hover:text-gray-900">Cart</Link></li>
            <li className="mb-2"><Link href="/orders" className="text-gray-600 hover:text-gray-900">Track Order</Link></li>
            <li className="mb-2"><Link href="/orders" className="text-gray-600 hover:text-gray-900">Shipping Details</Link></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Useful Links</h4>
          <ul>
            <li className="mb-2"><Link href="/about" className="text-gray-600 hover:text-gray-900">About Us</Link></li>
            <li className="mb-2"><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contacts</Link></li>
            <li className="mb-2"><Link href="/" className="text-gray-600 hover:text-gray-900">Hot Deals</Link></li>
            <li className="mb-2"><Link href="/" className="text-gray-600 hover:text-gray-900">Promotions</Link></li>
          </ul>
        </div>

        {/* Help Center */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Help Center</h4>
          <ul>
            <li className="mb-2"><Link href="/" className="text-gray-600 hover:text-gray-900">Payments</Link></li>
            <li className="mb-2"><Link href="/" className="text-gray-600 hover:text-gray-900">Refund</Link></li>
            <li className="mb-2"><Link href="/checkout" className="text-gray-600 hover:text-gray-900">Checkout</Link></li>
            <li className="mb-2"><Link href="/" className="text-gray-600 hover:text-gray-900">Shipping</Link></li>
            <li className="mb-2"><Link href="/" className="text-gray-600 hover:text-gray-900">Q&A</Link></li>
            <li className="mb-2"><Link href="/" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-8">
        © 2025 All rights reserved sajid
      </div>
    </footer>
  )
}

export default Footer
