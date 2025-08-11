"use client"
import React, { useState, useEffect } from 'react';
import { Facebook, Instagram } from "lucide-react";

function formatFollowers(num) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } 
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

export default function AISummary({ businessID }) {
  const [aiInfo, setAiInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSummaryData = async () => {
      if (!businessID) return;
      
      try {
        setLoading(true)

        const aiResponse = await fetch(`http://localhost:8000/businesses/summary/${businessID}`, {credentials: "include"});

        if (!aiResponse.ok) {
          throw new Error("Failed to fetch AI analysis");
        }
        
        const response = await aiResponse.json();
        setAiInfo(response);
        
      } catch (error) {
        setError("Error fetching AI analysis: " + error.message);
        setAiInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [businessID]);

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading Summary Card */}
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl animate-spin">⏳</div>
            <div className="h-6 bg-zinc-700 rounded w-32 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-zinc-700 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-zinc-700 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-zinc-700 rounded w-4/6 animate-pulse"></div>
          </div>
        </div>

        {/* Loading Red Flags Card */}
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl animate-pulse">🚩</div>
            <div className="h-6 bg-zinc-700 rounded w-28 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                <div className="h-4 bg-zinc-700 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-3 bg-zinc-700 rounded w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Social Media Card */}
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl animate-pulse">📱</div>
            <div className="h-6 bg-zinc-700 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 p-6 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                <div className="w-14 h-14 bg-zinc-700 rounded-xl animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-zinc-700 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-zinc-700 rounded w-32 animate-pulse"></div>
                  <div className="h-5 bg-zinc-700 rounded w-28 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-red-500/20 p-8 hover:border-red-500/30 transition-all duration-300">
        <div className="text-center text-red-400 py-8">
          <div className="text-6xl mb-4 animate-bounce-slow">⚠️</div>
          <h3 className="text-xl font-bold mb-2 text-red-300">Unable to Load AI Analysis</h3>
          <p className="text-zinc-400 leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all duration-300 text-red-300 hover:text-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!aiInfo) {
    return (
      <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
        <div className="text-center text-zinc-500 py-8">
          <div className="text-6xl mb-4 animate-bounce-slow">🔍</div>
          <h3 className="text-xl font-bold mb-2 text-zinc-300">No AI Analysis Available</h3>
          <p className="text-zinc-400">Analysis data could not be found for this business.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {aiInfo != null && aiInfo["business_summary"] && (
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300 animate-fade-in">
          <h3 className="text-2xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white">📜 Summary</h3>
          <p className="text-zinc-300 leading-relaxed text-lg">
            {aiInfo["business_summary"]}
          </p>
        </div>
      )}

      {aiInfo != null && aiInfo["red_flags"] && aiInfo["red_flags"].length > 0 && (
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300 animate-fade-in delay-100">
          <h3 className="text-2xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-red-400">🚩 Red Flags</h3>
          <ul className="text-zinc-300 leading-relaxed space-y-4">
            {aiInfo["red_flags"].map((flag, index) => (
              <li key={index} className="flex items-start p-4 bg-red-500/5 rounded-xl border border-red-500/20">
                <span className="text-red-400 mr-3 mt-1 text-lg">•</span>
                <div>
                  <div className="font-semibold text-red-300 mb-2">{flag[0]}</div>
                  <div className="text-zinc-400">{flag[1]}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {aiInfo != null && (aiInfo["fb_followers"] || aiInfo["ig_followers"]) && (
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300 animate-fade-in delay-200">
          <h3 className="text-2xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">📱 Social Media Presence</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {aiInfo["fb_followers"] && (
              <div className="flex items-center gap-4 p-6 bg-zinc-900/30 backdrop-blur-md rounded-xl border border-white/10 hover:border-blue-400/50 hover:scale-105 transition-all duration-300">
                <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30">
                  <Facebook className="w-8 h-8 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-zinc-400 mb-1">Facebook</div>
                  <div className="text-base font-medium text-blue-300 mb-1">
                    {aiInfo["fb_followers"][0][0]}
                  </div>
                  <div className="text-xl font-bold text-white">
                    {formatFollowers(aiInfo["fb_followers"][0][1])} followers
                  </div>
                </div>
              </div>
            )}
            {aiInfo["ig_followers"] && (
              <div className="flex items-center gap-4 p-6 bg-zinc-900/30 backdrop-blur-md rounded-xl border border-white/10 hover:border-pink-400/50 hover:scale-105 transition-all duration-300">
                <div className="p-3 rounded-xl bg-pink-600/20 border border-pink-500/30">
                  <Instagram className="w-8 h-8 text-pink-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-zinc-400 mb-1">Instagram</div>
                  <div className="text-base font-medium text-pink-300 mb-1">
                    {aiInfo["ig_followers"][0][0]}
                  </div>
                  <div className="text-xl font-bold text-white">
                    {formatFollowers(aiInfo["ig_followers"][0][1])} followers
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
}