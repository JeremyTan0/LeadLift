"use client"

import React, { useState, useEffect, use } from 'react';
import TrendsAndMarkets from '@/app/components/TrendsAndMarkets';
import WebsiteAudit from '@/app/components/WebsiteAudit';
import AISummary from '@/app/components/Summary';
import SEOScore from '@/app/components/SEOScore';

type BusinessDetailProps = {
  params: {
    id: string;
  };
};


function PhotoGallery({ photos, businessName, business }) {
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
    if (currentPhoto) {
      return currentPhoto;
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

      {/* Action Buttons */}
      <div className="flex gap-4">
        <a 
          href={`tel:${business.localPhone}`}
          className="relative inline-block group flex-1"
        >
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-lg opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse group-hover:animate-none scale-105 group-hover:scale-110" />
          <span className="relative inline-block w-full px-8 py-4 text-lg font-bold text-white bg-zinc-900 rounded-2xl border border-white/20 backdrop-blur-md hover:bg-zinc-800 transition-all duration-300 hover:scale-105 shadow-2xl text-center">
            <span className="inline mr-2">📤</span>
            Contact Now
          </span>
        </a>
        
        <button className="px-6 py-4 bg-zinc-900/50 backdrop-blur-md border border-white/20 rounded-2xl hover:border-white/40 hover:bg-zinc-800/50 transition-all duration-300 hover:scale-105">
          <span className="text-lg">❤️</span>
        </button>
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
  
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Looking up business ID:', resolvedParams.id);
        
        const response = await fetch(`http://localhost:8000/businesses/${resolvedParams.id}`, {
          cache: "no-store",
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error('Failed to load business data');
        }

        const businessData = await response.json();
        setBusiness(businessData);

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


  return (
    <>
    <main className="min-h-screen text-white relative overflow-hidden">
      {/* Dynamic background gradient */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(600px circle at 50% 50%, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1), transparent 50%)`
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-28">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Business Info */}
            <div className="space-y-6 transition-all duration-1000 opacity-100 translate-y-0">
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white animate-gradient-x">
                    {business.name}
                  </h1>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(business.status)} bg-zinc-900/50 backdrop-blur-md border border-white/10`}>
                    {business.status}
                  </span>
                  <SEOScore businessID={resolvedParams.id}/>
                </div>
                
                <p className="text-zinc-300 text-lg leading-relaxed">
                  {business.summary}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 p-6 bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {renderStars(business.rating)}
                  </div>
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    {business.rating}
                  </span>
                </div>
                <div className="text-zinc-300">
                  <span className="font-medium text-white">{business.totalReviews?.toLocaleString()}</span> reviews
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-4 bg-zinc-900/30 backdrop-blur-md rounded-lg border border-white/5 hover:border-white/20 transition-all duration-300 text-zinc-300 hover:text-white">
                  <span className="text-blue-400 text-lg">📍</span>
                  <span>{business.address}</span>
                </div>
                
                {business.localPhone && (
                  <div className="flex items-center gap-3 p-4 bg-zinc-900/30 backdrop-blur-md rounded-lg border border-white/5 hover:border-white/20 transition-all duration-300 text-zinc-300 hover:text-white">
                    <span className="text-green-400 text-lg">📞</span>
                    <a href={`tel:${business.localPhone}`} className="hover:underline">
                      {business.localPhone}
                    </a>
                  </div>
                )}
                
                {business.website && (
                  <div className="flex items-center gap-3 p-4 bg-zinc-900/30 backdrop-blur-md rounded-lg border border-white/5 hover:border-white/20 transition-all duration-300 text-zinc-300 hover:text-white">
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
            </div>

            {/* Right Column - Photos */}
            <div className="space-y-6 transition-all duration-1000 delay-200 opacity-100 translate-y-0">
              <PhotoGallery photos={business.photos} businessName={business.name} business={business} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="border-b border-white/10">
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
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10 backdrop-blur-md rounded-t-lg'
                    : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-300 hover:bg-white/5 backdrop-blur-md rounded-t-lg'
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <AISummary businessID={resolvedParams.id}/>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
            <TrendsAndMarkets businessName={business.name} />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
            <WebsiteAudit businessID={business.id} />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Review Summary */}
            {business.reviewSummary && (
              <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300 animate-fade-in">
                <h3 className="text-2xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400">🗣️ What People Are Saying</h3>
                <p className="text-zinc-300 leading-relaxed text-lg">
                  {business.reviewSummary}
                </p>
              </div>
            )}

            {business.reviews && business.reviews.length > 0 ? (
              <div className="grid gap-6">
                {business.reviews.map((review, index) => (
                  <div key={index} className="bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 hover:border-white/20 hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg shadow-lg">
                          {review.author?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-lg">{review.author}</h4>
                          <p className="text-sm text-zinc-400">{review.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-zinc-300 leading-relaxed text-lg">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-zinc-400 py-16">
                <div className="text-6xl mb-6 animate-bounce-slow">📝</div>
                <p className="text-xl">No reviews available</p>
              </div>
            )}
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
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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
      `}</style>
    </main>
    </>
);
}