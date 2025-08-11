"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Call your FastAPI /me endpoint - no need to manually get cookie
      const response = await fetch('http://localhost:8000/auth/me', { // Adjust port/path as needed
        method: 'GET',
        credentials: 'include', // This will automatically include the access_token cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token invalid, expired, or not present
        setUser(null);
      }
      
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint to clear the httpOnly cookie
      const response = await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });

      setUser(null);
      
      // The backend will redirect, but if it doesn't work, redirect manually
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Fallback: still redirect even if logout fails
      setUser(null);
      window.location.href = '/';
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`w-full border-b transition-all duration-500 fixed top-0 z-50 ${
        isScrolled 
          ? 'border-white/20 bg-black/30 backdrop-blur-xl shadow-2xl shadow-black/20' 
          : 'border-white/5 bg-transparent backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src="/favicon.ico"
                alt="Leadlift Logo"
                width={32}
                height={32}
                className="rounded-lg group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-500 group-hover:scale-105">
              Leadlift
            </div>
          </Link>

          {/* Right side navigation and actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-2">
              <NavLink href="/" label="Home" />
              {user && <NavLink href="/search" label="Search" />}
              <NavLink href="/about" label="About" />
            </nav>

            {/* Divider */}
            <div className="w-px h-6 bg-white/20" />

            {/* Auth Section */}
            {!isLoading && (
              <>
                {user ? (
                  // Authenticated user menu
                  <div className="flex items-center space-x-4">
                    <span className="text-zinc-300 text-sm">
                      Welcome, {user.name || user.email}!
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-zinc-300 hover:text-white transition-colors duration-200 font-medium hover:scale-105 transform"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  // Unauthenticated user links
                  <Link href="/auth">
                    <div className="relative inline-block group cursor-pointer">
                      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm opacity-70 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-110" />
                      <span className="relative inline-block px-6 py-2.5 text-sm font-semibold text-white bg-zinc-900 rounded-lg border border-white/20 backdrop-blur-md hover:bg-zinc-800 transition-all duration-300 hover:scale-105 shadow-lg">
                        Sign In
                      </span>
                    </div>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden relative p-2 text-zinc-300 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-lg group"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6">
              <span 
                className={`absolute left-0 top-1 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span 
                className={`absolute left-0 top-2.5 w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span 
                className={`absolute left-0 top-4 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
            
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 mt-6' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="relative">
            {/* Mobile menu background */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-md rounded-2xl border border-white/20" />
            
            <nav className="relative flex flex-col space-y-1 p-4">
              <MobileNavLink href="/" label="Home" onClick={() => setIsMobileMenuOpen(false)} />
              {user && <MobileNavLink href="/search" label="Search" onClick={() => setIsMobileMenuOpen(false)} />}
              <MobileNavLink href="/about" label="About" onClick={() => setIsMobileMenuOpen(false)} />
              
              {/* Mobile Auth Section */}
              {!isLoading && (
                <div className="pt-4 mt-4 border-t border-white/10">
                  {user ? (
                    <>
                      <div className="text-zinc-400 text-sm mb-3 px-4">
                        Welcome, {user.name || user.email}!
                      </div>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left py-3 px-4 text-zinc-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5 font-medium"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link 
                      href="/auth" 
                      className="block text-center py-3 px-4 text-zinc-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

// Desktop Navigation Link Component
function NavLink({ href, label }) {
  return (
    <Link 
      href={href} 
      className="relative px-4 py-2 text-zinc-300 hover:text-white transition-all duration-300 font-medium rounded-lg group hover:scale-105 transform"
    >
      <span className="relative z-10">{label}</span>
      
      {/* Hover background */}
      <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
    </Link>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ href, label, onClick }) {
  return (
    <Link 
      href={href} 
      className="relative block py-3 px-4 text-zinc-300 hover:text-white transition-all duration-300 font-medium rounded-lg group hover:bg-white/10 hover:scale-105 transform"
      onClick={onClick}
    >
      <span className="relative z-10 flex items-center justify-between">
        {label}
        <svg className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
      
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
}