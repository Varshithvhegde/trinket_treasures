// src/app/collections/page.tsx
import { adminDb } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface Collection {
  id: string;
  name: string;
  imageURL: string;
  description: string;
}

// In Next.js 13+, this replaces getStaticProps
async function getCollections() {
  const collectionsSnapshot = await adminDb.collection("collections").get();
  const collections = collectionsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Collection[];

  return collections;
}

export const revalidate = 3600; // Revalidate every hour

export default async function Collections() {
  const collections = await getCollections();

  if (!collections.length) {
    return <></>;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-light text-center mb-6 text-neutral-900">
          Our Collections
        </h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-16">
          Explore our carefully curated collections, each telling its own unique
          story through handcrafted pieces.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg"
            >
              <div className="relative overflow-hidden">
                <img
                  src={collection.imageURL}
                  alt={collection.name}
                  className="w-full h-96 object-cover transform transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <div
                className="absolute inset-0 flex flex-col items-center 
                              justify-center opacity-0 group-hover:opacity-100 
                              transition-opacity duration-300 
                              bg-black bg-opacity-50 text-white p-6 text-center"
              >
                <h3 className="text-2xl font-medium mb-3">{collection.name}</h3>
                <p className="mb-4">{collection.description}</p>
                <Link
                  href={`/search?collection=${collection.name}`}
                  className="px-6 py-2 border-2 border-white 
             rounded-md hover:bg-white hover:text-neutral-900 
             transition-colors duration-300"
                >
                  View Collection
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
