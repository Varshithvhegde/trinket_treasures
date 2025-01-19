// components/Featured.js
export default function Featured() {
  const featuredItems = [
    { 
      name: 'Crystal Necklace', 
      price: '$89', 
      image: 'https://picsum.photos/300/300?random=1' 
    },
    { 
      name: 'Pearl Earrings', 
      price: '$65', 
      image: 'https://picsum.photos/300/300?random=2' 
    },
    { 
      name: 'Gold Bracelet', 
      price: '$120', 
      image: 'https://picsum.photos/300/300?random=3' 
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif text-center mb-12">Featured Pieces</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
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
  )
}