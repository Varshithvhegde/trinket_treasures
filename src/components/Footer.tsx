export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-serif mb-4">Trinket Treasures</h3>
              <p className="text-gray-400">
                Handcrafted jewelry for the modern spirit
              </p>
            </div>
            <div>
              <h4 className="text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Collections</li>
                <li>About Us</li>
                <li>Contact</li>
                <li>Shipping & Returns</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg mb-4">Stay Connected</h4>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for updates and exclusive offers.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md 
                         focus:ring-rose-500 focus:border-rose-500 text-white"
              />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Trinket Treasures. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }