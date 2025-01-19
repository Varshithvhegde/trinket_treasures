// components/Featured.tsx
'use client';

import { useEffect, useState } from 'react';

interface FeaturedItem {
  id: string;
  name: string;
  price: string;
  image: string;
}

export default function Featured() {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await fetch('/api/featured');
        const data = await response.json();
        setFeaturedItems(data);
      } catch (error) {
        console.error('Error fetching featured items:', error);
      }
    };

    fetchFeaturedItems();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif text-center mb-12">Featured Pieces</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-rose-600 font-semibold">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}