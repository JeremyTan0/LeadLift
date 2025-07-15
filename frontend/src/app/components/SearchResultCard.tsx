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
  return (
    <Link href={`/businesses/${business.id}`}>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {business.displayName || "Business Name"}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          📍 {business.formattedAddress || "Address not available"}
        </p>

        {business.rating && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            ⭐ {business.rating} ({business.userRatingCount || 0} reviews)
          </p>
        )}
      </div>
    </Link>
  );
}