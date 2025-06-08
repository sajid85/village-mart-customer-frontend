import React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const HeroSection = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    console.log('Subscribing with email:', email);

    toast.success('Thank you for subscribing!');

    setEmail('');
  };

  return (
    <section className="relative bg-green-100 h-96 flex items-center justify-center overflow-hidden">
      {/* Background Image Placeholder */}
      {/* Add your background image here, leave src blank for now */}
      <img 
        src="" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />

      <div className="relative z-10 text-center text-gray-800">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Start shopping at Our local shops</h1>
        <p className="text-lg md:text-xl mb-8">Start shopping and save on you first order</p>
        
        {/* Search Input and Button Placeholder */}
        <div className="flex justify-center">
          <input 
            type="text" 
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button 
            onClick={handleSubscribe}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-r-md"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 