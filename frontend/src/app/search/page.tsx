"use client";

import { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/businesses?query=${encodeURIComponent(query)}`);
      
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
        Search Businesses
      </h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Restaurants in New Jersey..." 
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">⚠️ {error}</p>
        </div>
      )}

      {businesses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Search Results ({businesses.length} found)
          </h2>
          <div className="space-y-4">
            {businesses.map((business, index) => (
              <SearchResultCard key={index} business={business} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}