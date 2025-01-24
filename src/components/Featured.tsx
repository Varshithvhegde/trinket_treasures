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
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-light text-center mb-16 text-neutral-900">
          Featured Pieces
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-xl shadow-lg overflow-hidden 
                         transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-medium text-neutral-800 mb-2">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-amber-700 font-semibold text-xl">{item.price}</p>
                  {/* <button className="opacity-0 group-hover:opacity-100 
                                     bg-amber-700 text-white px-4 py-2 
                                     rounded-md text-sm transition-all duration-300
                                     hover:bg-amber-800">
                    Add to Cart
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}