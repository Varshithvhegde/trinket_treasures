'use client';

import { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-light text-neutral-800">Trinket Treasures</h1>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Collections
            </a>
            <a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              About
            </a>
            <a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors">
              Contact
            </a>
            <ShoppingBag className="h-6 w-6 text-neutral-600 hover:text-neutral-900 cursor-pointer transition-colors" />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg">
            <div className="flex flex-col items-center space-y-4 py-6">
              <a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                Collections
              </a>
              <a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                About
              </a>
              <a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors">
                Contact
              </a>
              <div className="flex items-center space-x-4">
                <ShoppingBag className="h-6 w-6 text-neutral-600 hover:text-neutral-900 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}