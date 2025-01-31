// src/app/featured/page.tsx
import { adminDb } from '@/lib/firebase';

interface FeaturedItem {
  id: string;
  name: string;
  price: string;
  imageURL: string;
  description: string;
  featured: boolean;
  inStock: boolean;
}

async function getFeaturedItems() {
  const productsSnapshot = await adminDb.collection('products')
    .where('featured', '==', true)
    .get();
  const products = productsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as FeaturedItem[];
  return products;
}

export const revalidate = 3600; // Revalidate every hour

export default async function Featured() {
  const featuredItems = await getFeaturedItems();
  if (!featuredItems.length) {
    return <></>;
  }
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
                  src={item.imageURL} 
                  alt={item.name} 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-medium text-neutral-800 mb-2">{item.name}</h3>
                <p className="text-neutral-600 text-sm mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-amber-700 font-semibold text-xl">₹{item.price}</p>
                  <span className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}