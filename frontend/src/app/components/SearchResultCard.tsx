import React from 'react';
import Link from 'next/link';

type BusinessResultProps = {
  business: {
    id?: string;
    displayName?: string;
    formattedAddress?: string;
    rating?: number;
    userRatingCount?: number;
  };
};

export default function SearchResultCard({ business }: BusinessResultProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center space-x-1">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400 text-sm">⭐</span>
        ))}
        {/* Half star */}
        {hasHalfStar && <span className="text-yellow-400 text-sm">⭐</span>}
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-zinc-600 text-sm">⭐</span>
        ))}
      </div>
    );
  };

  return (
    <Link href={`/businesses/${business.id}`} className="block group">
      <div className="relative overflow-hidden">
        {/* Card glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Main card */}
        <div className="relative bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group-hover:transform group-hover:scale-[1.02] cursor-pointer">
          
          {/* Header section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                {business.displayName || "Business Name"}
              </h3>
              
              {/* Business type indicator */}
              <div className="inline-flex items-center space-x-2 bg-zinc-800/50 backdrop-blur-sm border border-white/5 rounded-full px-3 py-1 text-xs">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-zinc-400">Verified Business</span>
              </div>
            </div>
            
            {/* Action arrow */}
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-white/10 group-hover:from-blue-500/40 group-hover:to-purple-500/40 transition-all duration-300">
              <span className="text-white text-sm group-hover:translate-x-0.5 transition-transform duration-300">→</span>
            </div>
          </div>

          {/* Address section */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-zinc-800/50 rounded-lg border border-white/5">
              <span className="text-zinc-400 text-sm">📍</span>
            </div>
            <div className="flex-1">
              <p className="text-zinc-300 text-sm leading-relaxed">
                {business.formattedAddress || "Address not available"}
              </p>
            </div>
          </div>

          {/* Rating section */}
          {business.rating && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {renderStars(business.rating)}
                  <span className="text-white font-semibold text-sm">
                    {business.rating.toFixed(1)}
                  </span>
                </div>
                
                <div className="h-4 w-px bg-white/20" />
                
                <span className="text-zinc-400 text-sm">
                  {business.userRatingCount?.toLocaleString() || 0} reviews
                </span>
              </div>
              
              {/* Quality indicator */}
              <div className="flex items-center space-x-2">
                {business.rating >= 4.5 && (
                  <div className="inline-flex items-center space-x-1 bg-green-500/20 border border-green-500/30 rounded-full px-2 py-1">
                    <span className="text-green-400 text-xs">✨</span>
                    <span className="text-green-300 text-xs font-medium">Top Rated</span>
                  </div>
                )}
                {business.rating >= 4.0 && business.rating < 4.5 && (
                  <div className="inline-flex items-center space-x-1 bg-blue-500/20 border border-blue-500/30 rounded-full px-2 py-1">
                    <span className="text-blue-400 text-xs">⭐</span>
                    <span className="text-blue-300 text-xs font-medium">Highly Rated</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* No rating state */}
          {!business.rating && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-sm">No ratings yet</span>
                <div className="inline-flex items-center space-x-1 bg-zinc-800/50 border border-white/5 rounded-full px-2 py-1">
                  <span className="text-zinc-400 text-xs">📊</span>
                  <span className="text-zinc-400 text-xs">New Business</span>
                </div>
              </div>
            </div>
          )}

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
        </div>
      </div>
    </Link>
  );
}