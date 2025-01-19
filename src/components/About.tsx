// components/About.js
export default function About() {
  return (
    <section className="py-16 bg-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            {/* Using an artisan/jewelry maker image */}
            <img
              src="https://picsum.photos/seed/jeweler/500/600"
              alt="Artisan crafting jewelry"
              className="rounded-lg shadow-lg object-cover h-[600px] w-full"
            />
          </div>
          <div className="mt-8 lg:mt-0">
            <h2 className="text-3xl font-serif mb-6">Our Story</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Trinket Treasures began with a passion for creating unique, handcrafted jewelry 
                that celebrates individuality and artistry. Each piece is thoughtfully designed 
                and carefully crafted in our studio.
              </p>
              <p className="text-gray-600">
                As a dedicated artisan with over a decade of experience, I pour my heart into every piece, 
                ensuring that each creation tells its own unique story. My journey in jewelry making 
                started from a small workbench at home and has grown into a beloved studio where 
                creativity flows freely.
              </p>
              <p className="text-gray-600">
                We believe in sustainable practices and source our materials from ethical suppliers, 
                ensuring that every piece not only looks beautiful but also has a positive impact 
                on our world.
              </p>
              <div className="pt-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://picsum.photos/seed/signature/80/80" 
                    alt="Founder" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-serif text-lg">Sarah Anderson</h4>
                    <p className="text-gray-600">Founder & Lead Artisan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}