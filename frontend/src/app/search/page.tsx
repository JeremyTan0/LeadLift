"use client";
import { useState, useEffect } from "react";
import SearchResultCard from "../components/SearchResultCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const handleSearch = async (e, searchQuery = null) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const queryToSearch = searchQuery || query;
    
    if (!queryToSearch.trim()) {
      setError("Please enter a search query");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`http://localhost:8000/businesses?query=${encodeURIComponent(queryToSearch)}`, {credentials: "include"});
      
      if (!response.ok) {
        throw new Error("Failed to fetch businesses");
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      setBusinesses(data.businesses || []);
      
    } catch (error) {
      setError("Error fetching businesses: " + error.message);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white relative overflow-hidden bg-zinc-950">
      {/* Dynamic background gradient */}
      <div 
        className="absolute inset-0 opacity-20 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.08), rgba(236, 72, 153, 0.08), transparent 50%)`
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float opacity-60"
            style={{
              left: `${15 + i * 12}%`,
              top: `${10 + (i % 4) * 25}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${4 + i * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* Main content with top padding for fixed header */}
      <div className="relative z-10 max-w-6xl mx-auto p-6 pt-28 py-12">
        {/* Header Section */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center space-x-2 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-sm mb-6">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-zinc-300">AI-Powered Business Discovery</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold leading-none mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white">
              Find Your
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
              Perfect Prospects
            </span>
          </h1>
          
          <p className="text-zinc-300 text-xl max-w-2xl mx-auto">
            Discover qualified leads with our intelligent business search engine
          </p>
        </div>

        {/* Search Form */}
        <div className={`mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative group">
              {/* Search input glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
              
              <div className="relative flex items-center bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Restaurants in New Jersey, Tech startups in Austin, Dentists near me..." 
                    className="w-full px-8 py-6 text-lg bg-transparent text-white placeholder-zinc-400 focus:outline-none"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="relative px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2 min-w-[140px] justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Searching</span>
                    </>
                  ) : (
                    <>
                      <span>Search</span>
                      <span className="text-xl">🎯</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
          
          {/* Quick search suggestions */}
          <div className="max-w-3xl mx-auto mt-6 flex flex-wrap justify-center gap-3">
            {['Restaurants in NYC', 'Tech companies', 'Medical practices', 'Real estate agents'].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion);
                  handleSearch(null, suggestion);
                }}
                className="px-4 py-2 bg-zinc-900/30 backdrop-blur-md border border-white/10 rounded-full text-zinc-300 text-sm hover:border-white/20 hover:bg-zinc-800/40 transition-all duration-300 hover:scale-105"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 transition-all duration-500 animate-shake">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur opacity-20" />
              <div className="relative bg-red-900/20 backdrop-blur-md border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-red-200 font-medium">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center space-x-4 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl px-8 py-6">
              <div className="relative">
                <div className="w-8 h-8 border-4 border-blue-500/30 rounded-full"></div>
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0"></div>
              </div>
              <span className="text-zinc-300 text-lg font-medium">Discovering businesses...</span>
            </div>
          </div>
        )}

        {/* Results Section */}
        {businesses.length > 0 && !loading && (
          <div className="transition-all duration-1000 animate-fade-in">
            {/* Results header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-3 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 mb-4">
                <span className="text-green-400 text-xl">✨</span>
                <span className="text-zinc-300 font-medium">
                  Found {businesses.length} perfect match{businesses.length !== 1 ? 'es' : ''}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Your Prospects Await
              </h2>
            </div>
            
            {/* Results grid */}
            <div className="grid gap-6 md:gap-8">
              {businesses.map((business, index) => (
                <div 
                  key={index} 
                  className="animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <SearchResultCard business={business} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state when no results */}
        {businesses.length === 0 && !loading && query && !error && (
          <div className="text-center py-16">
            <div className="mb-6">
              <span className="text-6xl opacity-50">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-zinc-300 mb-4">No businesses found</h3>
            <p className="text-zinc-400 max-w-md mx-auto">
              Try adjusting your search terms or explore different business types and locations.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </main>
  );
}