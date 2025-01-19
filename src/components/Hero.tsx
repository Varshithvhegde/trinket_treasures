export default function Hero() {
  return (
    <section className="pt-20 pb-12 sm:pb-16 lg:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-4xl font-serif tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Handcrafted Jewelry<br />
              <span className="text-rose-600">Made with Love</span>
            </h2>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl">
              Discover unique, artisanal pieces that tell a story. Each jewelry piece is carefully handcrafted 
              to bring out your individual style and personality.
            </p>
            <div className="mt-8">
              <button className="bg-rose-600 text-white px-8 py-3 rounded-full hover:bg-rose-700 
                               transition duration-300">
                Shop Collection
              </button>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <img
              src="https://picsum.photos/600/400"
              alt="Featured jewelry collection"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}