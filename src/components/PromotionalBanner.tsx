import React from 'react';

const PromotionalBanner = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Free Delivery Banner */}
      <div className="relative bg-gray-200 h-64 rounded-lg overflow-hidden flex items-center justify-center">
        {/* Background Image Placeholder */}
        {/* Add your background image here, leave src blank */}
        <img 
          src="" 
          alt="Free Delivery Promotion" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Free Delivery over 5000</h3>
          <p className="mb-4">shop 5000 bdt product and get free delivery any where</p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md">
            Shop Now
          </button>
        </div>
      </div>

      {/* Organic Food Banner */}
      <div className="relative bg-gray-200 h-64 rounded-lg overflow-hidden flex items-center justify-center">
        {/* Background Image Placeholder */}
        {/* Add your background image here, leave src blank */}
        <img 
          src="" 
          alt="Organic Food Promotion" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Organic Food</h3>
          <p className="mb-4">Save upto 3500 bdt on your first order</p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner; 