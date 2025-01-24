export default function Contact() {
  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-light text-neutral-900 mb-6">Get in Touch</h2>
          <p className="text-neutral-600 mb-12 max-w-xl mx-auto">
            Have questions about our pieces or custom orders? We're here to help you find the perfect jewelry that speaks to your style.
          </p>
          <form className="space-y-6 bg-white shadow-xl rounded-xl p-8 sm:p-12">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-amber-600 
                         transition-all duration-300"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-amber-600 
                         transition-all duration-300"
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-amber-600 
                         transition-all duration-300"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-amber-700 text-white px-8 py-4 rounded-lg 
                         hover:bg-amber-800 transition-colors duration-300 
                         font-medium tracking-wide shadow-md hover:shadow-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}