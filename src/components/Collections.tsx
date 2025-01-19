// components/Collections.js
export default function Collections() {
  const collections = [
    { 
      name: 'Bohemian', 
      image: 'https://picsum.photos/800/600?random=4',
      description: 'Free-spirited designs with natural elements'
    },
    { 
      name: 'Minimalist', 
      image: 'https://picsum.photos/800/600?random=5',
      description: 'Clean, contemporary pieces for everyday wear'
    },
    { 
      name: 'Vintage', 
      image: 'https://picsum.photos/800/600?random=6',
      description: 'Timeless pieces inspired by classic designs'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif text-center mb-4">Our Collections</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Explore our carefully curated collections, each telling its own unique story through handcrafted pieces.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg">
              <img 
                src={collection.image} 
                alt={collection.name}
                className="w-full h-96 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center 
                            justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <h3 className="text-white text-2xl font-serif mb-2">{collection.name}</h3>
                <p className="text-white text-center px-6">{collection.description}</p>
                <button className="mt-4 px-6 py-2 border-2 border-white text-white hover:bg-white 
                                 hover:text-gray-900 transition duration-300">
                  View Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}