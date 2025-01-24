import React from 'react';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-neutral-50 to-neutral-100 py-16 lg:py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-center opacity-10" 
             style={{backgroundImage: "url('https://picsum.photos/600/400')"}}></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900">
              Handcrafted Jewelry
              <span className="block text-3xl sm:text-4xl lg:text-5xl text-amber-700 mt-2">
                Made with Love
              </span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-xl leading-relaxed">
              Discover unique, artisanal pieces that tell a story. Each jewelry piece is carefully 
              handcrafted to bring out your individual style and personality, blending timeless 
              elegance with modern design.
            </p>
            <div>
              <button className="px-10 py-4 rounded-lg bg-amber-700 text-white 
                               font-medium tracking-wide 
                               hover:bg-amber-800 transition-colors 
                               shadow-md hover:shadow-lg 
                               focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2">
                Explore Collection
              </button>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <div className="relative">
              <img
                src="https://picsum.photos/600/400"
                alt="Featured jewelry collection"
                className="rounded-xl shadow-2xl transform transition 
                          hover:scale-105 hover:shadow-3xl duration-300"
              />
              <div className="absolute -bottom-6 -right-6 w-full h-full 
                              bg-amber-600 opacity-10 rounded-xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}