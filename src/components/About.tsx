export default function About() {
  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="relative group">
            <img
              src="https://picsum.photos/seed/jeweler/500/600"
              alt="Artisan crafting jewelry"
              className="rounded-xl shadow-2xl object-cover h-[600px] w-full 
                         transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute -bottom-6 -right-6 w-full h-full 
                            bg-amber-600 opacity-10 rounded-xl -z-10"></div>
          </div>
          <div className="mt-8 lg:mt-0 space-y-6">
            <h2 className="text-4xl font-light text-neutral-900 mb-6">Our Story</h2>
            <div className="space-y-4">
              <p className="text-neutral-600 leading-relaxed">
                Trinket Treasures emerged from a deep passion for creating unique, handcrafted jewelry 
                that celebrates individuality and artistry. Each piece is meticulously designed 
                and carefully crafted in our intimate studio, transforming raw materials into wearable art.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                With over a decade of experience, our journey began on a small workbench at home 
                and has blossomed into a creative sanctuary where inspiration knows no bounds. 
                Every creation tells a story, connecting the wearer to a world of craftsmanship 
                and personal expression.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                We're committed to sustainable practices, partnering with ethical suppliers to ensure 
                that our jewelry not only looks beautiful but contributes positively to our global community.
              </p>
              <div className="pt-6 flex items-center space-x-6">
                <img 
                  src="https://picsum.photos/seed/signature/120/120" 
                  alt="Founder" 
                  className="w-20 h-20 rounded-full object-cover 
                             shadow-md transition-transform hover:scale-110"
                />
                <div>
                  <h4 className="text-xl font-medium text-neutral-900">Sarah Anderson</h4>
                  <p className="text-neutral-600">Founder & Lead Artisan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}