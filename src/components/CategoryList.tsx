'use client';

import { useState } from 'react';

const categories = [
  { id: 'all', name: 'All Products', icon: '🛍️' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'audio', name: 'Audio', icon: '🎧' },
  { id: 'accessories', name: 'Accessories', icon: '⌨️' },
];

interface CategoryListProps {
  onCategoryChange: (category: string) => void;
}

export default function CategoryList({ onCategoryChange }: CategoryListProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`
              px-6 py-3 rounded-full text-sm font-medium 
              transition-all duration-200 
              flex items-center space-x-2
              transform hover:scale-105
              ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }
            `}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 