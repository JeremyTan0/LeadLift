"use client"
import React, { useState, useEffect } from 'react';

export default function TrendsAndMarkets({ businessName }) {
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendsData = async () => {
      if (!businessName) {
        setTrendsData(null);
        setError(null);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const encodedName = encodeURIComponent(businessName);
        const response = await fetch(`http://localhost:8000/businesses/trends/${encodedName}`, {credentials: "include"});
        
        if (!response.ok) {
          throw new Error(`Failed to fetch trends data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Trends API Response:", data);
        setTrendsData(data);
        
      } catch (error) {
        console.error("Trends fetch error:", error);
        setError("Error fetching trends data: " + error.message);
        setTrendsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendsData();
  }, [businessName]);

  console.log("Component state:", { loading, error: !!error, hasData: !!trendsData, businessName });

  if (loading) {
    return (
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
          <div className="text-center text-zinc-500 py-8">
            <div className="text-3xl mb-2">⏳</div>
            <p>Loading search trends...</p>
          </div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
          <div className="text-center text-zinc-500 py-8">
            <div className="text-3xl mb-2">⏳</div>
            <p>Loading market data...</p>
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

  if (!businessName) {
    return (
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
          <div className="text-center text-zinc-500 py-8">
            <div className="text-3xl mb-2">🔍</div>
            <p>Enter a business name to see search trends</p>
          </div>
        </div>
        <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
          <div className="text-center text-zinc-500 py-8">
            <div className="text-3xl mb-2">🌍</div>
            <p>Enter a business name to see market data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
        <SearchTrendsChart trendsData={trendsData} />
      </div>
      <div className="bg-zinc-800/50 rounded-lg border border-zinc-700 p-6">
        <ExpansionMarkets trendsData={trendsData} />
      </div>
    </div>
  );
}

function SearchTrendsChart({ trendsData }) {
  if (!trendsData) {
    return (
      <div className="text-center text-zinc-500 py-8">
        <div className="text-3xl mb-2">📊</div>
        <p>No search trends data available</p>
      </div>
    );
  }

  if (!trendsData?.search_interest) {
    return (
      <div className="text-center text-zinc-500 py-8">
        <div className="text-3xl mb-2">📊</div>
        <p>No search trends data available</p>
      </div>
    );
  }

  const searchData = trendsData.search_interest;
  
  const dataPoints = Object.entries(searchData).map(([dateStr, value]) => {
    const date = new Date(dateStr);
    
    return {
      date: date,
      dateStr: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      value: Math.round(value || 0)
    };
  }).sort((a, b) => a.date - b.date);

  const maxValue = Math.max(...dataPoints.map(d => d.value));
  const minValue = Math.min(...dataPoints.map(d => d.value));

  console.log('Debug info:', { maxValue, minValue, dataPoints: dataPoints.slice(0, 3) });

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white">Search Interest Over Time</h4>
      <div className="h-48 bg-zinc-800/30 rounded-lg p-4">
        <div className="h-full flex items-end justify-between gap-1" style={{ height: '160px' }}>
          {dataPoints.map((point, index) => {
            const heightPercentage = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
            const heightPx = Math.max((heightPercentage / 100) * 160, 4);
            
            return (
              <div key={index} className="flex flex-col items-center gap-2 flex-1 min-w-0">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm transition-all duration-300 hover:from-blue-400 hover:to-purple-400 cursor-pointer"
                  style={{ 
                    height: `${heightPx}px`,
                    maxHeight: '160px'
                  }}
                  title={`${point.dateStr}: ${point.value} (${heightPercentage.toFixed(1)}%)`}
                />
                <span className="text-xs text-zinc-400 transform -rotate-45 origin-center whitespace-nowrap">
                  {point.dateStr}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between text-sm text-zinc-400">
        <span>Min: {minValue}</span>
        <span>Max: {maxValue}</span>
      </div>
    </div>
  );
}

function ExpansionMarkets({ trendsData }) {
  if (!trendsData) {
    return (
      <div className="text-center text-zinc-500 py-8">
        <div className="text-3xl mb-2">🌍</div>
        <p>No market expansion data available</p>
      </div>
    );
  }

  if (!trendsData?.expansion_markets) {
    return (
      <div className="text-center text-zinc-500 py-8">
        <div className="text-3xl mb-2">🌍</div>
        <p>No market expansion data available</p>
      </div>
    );
  }

  const markets = Object.entries(trendsData.expansion_markets)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-white">Top Markets by Interest</h4>
      <div className="space-y-3">
        {markets.map(([region, interest], index) => (
          <div key={region} className="flex items-center gap-3">
            <span className="text-sm text-zinc-400 w-6">#{index + 1}</span>
            <div className="flex-1 flex items-center gap-3">
              <span className="text-white font-medium min-w-0 flex-shrink-0">{region}</span>
              <div className="flex-1 bg-zinc-700 rounded-full h-2 min-w-0">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(interest / Math.max(...markets.map(m => m[1]))) * 100}%` }}
                />
              </div>
              <span className="text-zinc-400 text-sm flex-shrink-0">{Math.round(interest)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}