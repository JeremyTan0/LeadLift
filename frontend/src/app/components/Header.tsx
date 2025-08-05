"use client"

import React, { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full border-b border-white/10 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-300">
              Leadlift
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-zinc-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              href="/search" 
              className="text-zinc-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Search
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/search">
              <div className="relative inline-block group cursor-pointer">
                <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative inline-block px-4 py-2 text-sm font-semibold text-white bg-zinc-900 rounded-md border border-white/10 backdrop-blur-md hover:bg-zinc-800 transition-colors">
                  Get Started
                </span>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-zinc-300 hover:text-white transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg 
                className={`w-6 h-6 transform transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100 mt-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="flex flex-col space-y-4 pb-4">
            <Link 
              href="/" 
              className="text-zinc-300 hover:text-white transition-colors duration-200 font-medium py-2 border-b border-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/search" 
              className="text-zinc-300 hover:text-white transition-colors duration-200 font-medium py-2 border-b border-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Search
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}