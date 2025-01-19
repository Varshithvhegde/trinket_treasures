export default function Contact() {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions about our pieces or custom orders? We'd love to hear from you!
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 
                         focus:border-rose-500"
              />
              <textarea
                placeholder="Your message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 
                         focus:border-rose-500"
              />
              <button className="bg-rose-600 text-white px-8 py-3 rounded-full hover:bg-rose-700 
                               transition duration-300">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    )
  }