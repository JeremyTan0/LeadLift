"use client"
import React, { useState, useEffect } from 'react';

export default function WebsiteAuditScore({ businessID }) {
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(businessID);
  useEffect(() => {
    const fetchWebsiteData = async () => {
      if (!businessID) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/businesses/web-analytics/${businessID}`, {credentials: "include"});
        
        if (!response.ok) {
          throw new Error("Failed to fetch website audit data");
        }
        
        const data = await response.json();
        console.log("Website Audit API Response:", data);
        setWebsiteData(data);
        
      } catch (error) {
        setError("Error fetching website audit data: " + error.message);
        setWebsiteData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteData();
  }, [businessID]);

  if (loading) {
    return (
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
          <div className="text-center text-zinc-500 py-8">
            <div className="text-3xl mb-2">⏳</div>
            <p>Loading website audit...</p>
          </div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
          <div className="text-center text-zinc-500 py-8">
            <div className="text-3xl mb-2">⏳</div>
            <p>Loading SEO analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
          <div className="text-center text-red-400 py-8">
            <div className="text-3xl mb-2">⚠️</div>
            <p>{error}</p>
          </div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
          <div className="text-center text-red-400 py-8">
            <div className="text-3xl mb-2">⚠️</div>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!websiteData || !websiteData.score) {
    return (
      <div className="text-center text-zinc-500 py-8">
        <div className="text-3xl mb-2">🔍</div>
        <p>No website audit data available</p>
      </div>
    );
  }

  const { score, max_score, percentage } = websiteData.score;

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (percentage) => {
    if (percentage >= 80) return 'from-green-500 to-green-600';
    if (percentage >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getScoreColorForConic = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-white mb-4">Website SEO Score</h4>
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full bg-zinc-700">
            <div 
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${getScoreGradient(percentage)} transition-all duration-500`}
              style={{
                background: `conic-gradient(from 0deg, ${getScoreColorForConic(percentage)} ${(percentage / 100) * 360}deg, #374151 0deg)`
              }}
            />
            <div className="absolute inset-2 rounded-full bg-zinc-900 flex items-center justify-center">
              <span className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                {Math.round(percentage)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm text-zinc-400">
          {score}/{max_score} points ({percentage.toFixed(1)}%)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          <h5 className="font-semibold text-white mb-2">Title Tag</h5>
          <p className="text-sm text-zinc-300">{websiteData.title_tag?.status || 'Not analyzed'}</p>
        </div>
        
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          <h5 className="font-semibold text-white mb-2">Meta Description</h5>
          <p className="text-sm text-zinc-300">{websiteData.meta_description?.status || 'Not analyzed'}</p>
        </div>
        
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          <h5 className="font-semibold text-white mb-2">Language</h5>
          <p className="text-sm text-zinc-300">{websiteData.language?.status || 'Not analyzed'}</p>
        </div>
        
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          <h5 className="font-semibold text-white mb-2">Images</h5>
          <p className="text-sm text-zinc-300">
            {websiteData.images?.total_images || 0} images, {websiteData.images?.missing_alt || 0} missing alt text
          </p>
        </div>
      </div>
    </div>
  );
}