"use client"
import React, { useState, useEffect } from 'react';

export default function SEOScore({ businessID }) {
  const [seoScore, setSeoScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBusinessScore = async () => {
      if (!businessID) return;
      
      try {
        setLoading(true)

        const scoreResponse = await fetch(`http://localhost:8000/businesses/score/${businessID}`, {credentials: "include"});

        if (!scoreResponse.ok) {
          throw new Error("Failed to fetch overall score");
        }
        
        const score = await scoreResponse.json();
        setSeoScore(score);
        
      } catch (error) {
        setError("Error fetching overall score: " + error.message);
        setSeoScore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessScore();
  }, [businessID]);

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "bg-gradient-to-r from-green-500 to-emerald-500";
    } else if (score >= 60) {
      return "bg-gradient-to-r from-yellow-500 to-orange-500";
    } else if (score >= 40) {
      return "bg-gradient-to-r from-orange-500 to-red-500";
    } else {
      return "bg-gradient-to-r from-red-600 to-red-700";
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-2 rounded-full text-sm font-medium bg-zinc-800/50 text-zinc-400 border border-zinc-700 backdrop-blur-md animate-pulse">
        <span className="mr-1">⏳</span>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-2 rounded-full text-sm font-medium bg-red-900/30 text-red-400 border border-red-500/30 backdrop-blur-md">
        <span className="mr-1">⚠️</span>
        Score Error
      </div>
    );
  }

  if (!seoScore && seoScore !== 0) {
    return (
      <div className="px-4 py-2 rounded-full text-sm font-medium bg-zinc-800/50 text-zinc-500 border border-zinc-700 backdrop-blur-md">
        <span className="mr-1">🔍</span>
        No Score
      </div>
    );
  }

  return (
    <div className={`px-4 py-2 rounded-full text-sm font-medium text-white border border-white/10 backdrop-blur-md hover:scale-105 transition-all duration-300 ${getScoreColor(seoScore)}`}>
      SEO Score: {seoScore}/100
    </div>
  );
}