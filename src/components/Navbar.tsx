import { ShoppingBag } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-serif text-gray-800">Trinket Treasures</h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <a className="text-gray-600 hover:text-gray-900">Collections</a>
              <a className="text-gray-600 hover:text-gray-900">About</a>
              <a className="text-gray-600 hover:text-gray-900">Contact</a>
              <ShoppingBag className="h-6 w-6 text-gray-600 hover:text-gray-900 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}