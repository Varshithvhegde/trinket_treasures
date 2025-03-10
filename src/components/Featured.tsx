// src/app/featured/page.tsx
import { adminDb } from "@/lib/firebase";
import { Card, CardContent } from "./ui/card";
import Product from "./Product";

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
  const productsSnapshot = await adminDb
    .collection("products")
    .where("featured", "==", true)
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
          {featuredItems.map((product) => (
            <Product
              key={product.id}
              product={product}
              showCollectionInfo={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
