'use client';

import { useState, useEffect } from 'react';
import { travelData } from '@/lib/travel-data';

/**
 * Test page for unified travel data API
 * Shows how SearchEngine components would use real data
 */
export default function APITestPage() {
  const [cities, setCities] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [meals, setMeals] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);

        // Load cities, meals, and ratings
        const [citiesData, mealsData, ratingsData] = await Promise.all([
          travelData.getCities(),
          travelData.getMealPlans(),
          travelData.getRatings()
        ]);

        setCities(citiesData);
        setMeals(mealsData);
        setRatings(ratingsData);

        // Auto-select first city
        if (citiesData.length > 0) {
          setSelectedCityId(citiesData[0].id);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Load destinations when city changes
  useEffect(() => {
    if (!selectedCityId) return;

    async function loadDestinations() {
      try {
        const destinationsData = await travelData.getDestinations(selectedCityId);
        setDestinations(destinationsData);
      } catch (err) {
        console.error('Failed to load destinations:', err);
        setDestinations([]);
      }
    }

    loadDestinations();
  }, [selectedCityId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Travel Data API Test</h1>
        <div className="animate-pulse">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Travel Data API Test</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Travel Data API Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Cities */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Departure Cities ({cities.length})</h2>
          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a city...</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name} ({city.country})
              </option>
            ))}
          </select>
          <div className="mt-2 text-sm text-gray-600">
            Data from: {cities.map(c => c.provider).join(', ')}
          </div>
        </div>

        {/* Destinations */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">
            Destinations ({destinations.length})
          </h2>
          {selectedCityId ? (
            <div className="space-y-1">
              {destinations.map(dest => (
                <div key={dest.id} className="p-2 bg-gray-50 rounded">
                  {dest.name}
                  {dest.nameAlt && dest.nameAlt !== dest.name && (
                    <span className="text-gray-500 text-sm"> ({dest.nameAlt})</span>
                  )}
                </div>
              ))}
              {destinations.length === 0 && (
                <div className="text-gray-500 text-sm">No destinations found</div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Select a city first</div>
          )}
        </div>

        {/* Meal Plans */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Meal Plans ({meals.length})</h2>
          <div className="space-y-1">
            {meals.map(meal => (
              <div key={meal.id} className="p-2 bg-gray-50 rounded text-sm">
                <span className="font-medium">{meal.code}</span> - {meal.name}
              </div>
            ))}
          </div>
        </div>

        {/* Hotel Ratings */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Hotel Ratings ({ratings.length})</h2>
          <div className="space-y-1">
            {ratings.map(rating => (
              <div key={rating.id} className="p-2 bg-gray-50 rounded text-sm">
                <span className="font-medium">{rating.stars}</span> {rating.name}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Cache Stats */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Cache Information</h2>
        <div className="text-sm text-gray-600">
          <p>Client-side cache is working with automatic TTL and cleanup.</p>
          <p>Cities and static data cached for 24h, destinations for 12h.</p>
          <button
            onClick={() => {
              travelData.clearCache();
              window.location.reload();
            }}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
          >
            Clear Cache & Reload
          </button>
        </div>
      </div>

      {/* Integration Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">Integration Status</h2>
        <div className="text-sm text-blue-700">
          <p>✅ Unified data API endpoints created</p>
          <p>✅ JoinUp integration working (cities & destinations)</p>
          <p>✅ Client-side caching with TTL</p>
          <p>✅ SearchEngine can now use real data</p>
          <p>🔄 Next: Update actual SearchEngine component</p>
        </div>
      </div>

    </div>
  );
}