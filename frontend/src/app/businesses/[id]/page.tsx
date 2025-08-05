"use client"

import React, { useState, useEffect, use } from 'react';
import TrendsAndMarkets from '@/app/components/TrendsAndMarkets';
import WebsiteAudit from '@/app/components/WebsiteAudit';
import { Facebook, Instagram } from "lucide-react";

type BusinessDetailProps = {
  params: {
    id: string;
  };
};

function PhotoGallery({ photos, businessName }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  console.log('Photos received in PhotoGallery:', photos);

  if (!photos || photos.length === 0) {
    return (
      <div className="aspect-video rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
        <div className="text-center text-zinc-500">
          <div className="text-4xl mb-2">👥</div>
          <p>No photos available</p>
        </div>
      </div>
    );
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const getCurrentPhotoUrl = () => {
    const currentPhoto = photos[currentPhotoIndex];
    if (currentPhoto && currentPhoto.photoUri) {
      return currentPhoto.photoUri;
    }
    return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop';
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700">
          <img
            src={getCurrentPhotoUrl()}
            alt={`${businessName} - Photo ${currentPhotoIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Image failed to load:', e.target.src);
              e.target.src = 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop';
            }}
          />
          
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                aria-label="Previous photo"
              >
                <span className="text-white text-xl">‹</span>
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                aria-label="Next photo"
              >
                <span className="text-white text-xl">›</span>
              </button>
            </>
          )}
          
          {/* Photo counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 rounded-full text-white text-sm">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        </div>
        
        {photos.length > 1 && (
          <div className="flex gap-2 mt-4 justify-center">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentPhotoIndex ? 'bg-white' : 'bg-zinc-600'
                }`}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default function BusinessDetail({ params }: BusinessDetailProps) {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [seoScore, setSeoScore] = useState(null);
  const [aiInfo, setAiInfo] = useState(null);
  
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Looking up business ID:', resolvedParams.id);
        
        const response = await fetch(`http://127.0.0.1:8000/businesses/${resolvedParams.id}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error('Failed to load business data');
        }

        const businessData = await response.json();
        setBusiness(businessData);

        const scoreResponse = await fetch(`http://127.0.0.1:8000/businesses/score/${resolvedParams.id}`);
        if (scoreResponse.ok) {
          const score = await scoreResponse.json();
          setSeoScore(score);
        }

        const aiResponse = await fetch(`http://127.0.0.1:8000/businesses/summary/${resolvedParams.id}`);
        if (aiResponse.ok) {
          const response = await aiResponse.json();
          setAiInfo(response);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

    };

    fetchBusiness();
  }, [resolvedParams.id]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-400'
        }`}
      >
        ★
      </span>
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPERATIONAL':
        return 'text-green-400';
      case 'CLOSED':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-blue-400 mb-4 text-4xl">⏳</div>
          <p className="text-zinc-300 text-lg">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4 text-4xl">❌</div>
          <p className="text-zinc-300 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-400 mb-4 text-4xl">❓</div>
          <p className="text-zinc-300 text-lg">Business not found</p>
        </div>
      </div>
    );
  }

  console.log(business);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Business Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white">
                    {business.name}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(business.status)} bg-zinc-800/50 border border-zinc-700`}>
                    {business.status}
                  </span>
                  {seoScore !== null && (
                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-600 to-blue-600 text-white border border-green-500/30">
                      SEO Score: {seoScore}/100
                    </div>
                  )}
                </div>
                
                <p className="text-zinc-300 text-lg leading-relaxed">
                  {business.summary}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {renderStars(business.rating)}
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {business.rating}
                  </span>
                </div>
                <div className="text-zinc-400">
                  <span className="font-medium text-white">{business.totalReviews?.toLocaleString()}</span> reviews
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid gap-4">
                <div className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors">
                  <span className="text-blue-400 text-lg">📍</span>
                  <span>{business.address}</span>
                </div>
                
                {business.localPhone && (
                  <div className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors">
                    <span className="text-green-400 text-lg">📞</span>
                    <a href={`tel:${business.localPhone}`} className="hover:underline">
                      {business.localPhone}
                    </a>
                  </div>
                )}
                
                {business.website && (
                  <div className="flex items-center gap-3 text-zinc-300 hover:text-white transition-colors">
                    <span className="text-purple-400 text-lg">🌐</span>
                    <a 
                      href={business.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      Visit Website
                      <span className="text-sm">↗</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <a 
                  href={`tel:${business.localPhone}`}
                  className="relative inline-block group flex-1"
                >
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
                  <span className="relative inline-block w-full px-6 py-3 text-lg font-semibold text-white bg-zinc-900 rounded-lg border border-white/10 backdrop-blur-md hover:bg-zinc-800 transition-colors text-center">
                    <span className="inline mr-2">📤</span>
                    Contact Now
                  </span>
                </a>
                
                <button className="px-6 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:bg-zinc-700/50 transition-colors">
                  <span className="text-lg">❤️</span>
                </button>
              </div>
            </div>

            {/* Right Column - Photos */}
            <div className="space-y-6">
              <PhotoGallery photos={business.photos} businessName={business.name} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-b border-zinc-700">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'trends', label: 'Search Trends', icon: '📈' },
              { id: 'audit', label: 'Website Audit', icon: '🔍' },
              { id: 'reviews', label: 'Reviews', icon: '⭐' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Summary */}
            {aiInfo != null && (
              <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                <h3 className="text-xl font-bold mb-4 text-white">📜 Summary</h3>
                <p className="text-zinc-300 leading-relaxed">
                  {aiInfo["business_summary"]}
                </p>
              </div>
            )}

            {aiInfo != null && (
              <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                <h3 className="text-xl font-bold mb-4 text-white">🚩 Red Flags</h3>
                <ul className="text-zinc-300 leading-relaxed space-y-3">
                  {aiInfo["red_flags"].map((flag, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-400 mr-2 mt-1">•</span>
                      <div>
                        <div className="font-semibold text-red-300">{flag[0]}</div>
                        <div className="text-zinc-400 text-sm mt-1">{flag[1]}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {aiInfo != null && (aiInfo["fb_followers"] || aiInfo["ig_followers"]) && (
              <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                <h3 className="text-xl font-bold mb-4 text-white">📱 Social Media Presence</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {aiInfo["fb_followers"] && (
                    <div className="flex items-center gap-3 p-4 bg-zinc-700/30 rounded-lg border border-zinc-600">
                      <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30">
                        <Facebook className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-zinc-400">Facebook</div>
                        <div className="text-base font-medium text-blue-300">
                          {aiInfo["fb_followers"][0]}
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {typeof aiInfo["fb_followers"][1] === 'number' ? 
                            aiInfo["fb_followers"][1].toLocaleString() : 
                            aiInfo["fb_followers"][1]
                          } followers
                        </div>
                      </div>
                    </div>
                  )}
                  {aiInfo["ig_followers"] && (
                    <div className="flex items-center gap-3 p-4 bg-zinc-700/30 rounded-lg border border-zinc-600">
                      <div className="p-2 rounded-lg bg-pink-600/20 border border-pink-500/30">
                        <Instagram className="w-6 h-6 text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-zinc-400">Instagram</div>
                        <div className="text-base font-medium text-pink-300">
                          {aiInfo["ig_followers"][0]}
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {typeof aiInfo["ig_followers"][1] === 'number' ? 
                            aiInfo["ig_followers"][1].toLocaleString() : 
                            aiInfo["ig_followers"][1]
                          } followers
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trends' && (
          <TrendsAndMarkets businessName={business.name} />
        )}

        {activeTab === 'audit' && (
          <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
            <WebsiteAudit businessID={business.id} />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {/* Review Summary */}
            {business.reviewSummary && (
              <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6 mb-4">
                <h3 className="text-xl font-bold mb-4 text-white">🗣️ What People Are Saying</h3>
                <p className="text-zinc-300 leading-relaxed">
                  {business.reviewSummary}
                </p>
              </div>
            )}

            {business.reviews && business.reviews.length > 0 ? (
              <div className="grid gap-6">
                {business.reviews.map((review, index) => (
                  <div key={index} className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                          {review.author?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{review.author}</h4>
                          <p className="text-sm text-zinc-400">{review.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-zinc-500 py-8">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-lg">No reviews available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}