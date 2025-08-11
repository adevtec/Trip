'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TravelOffer } from '@/app/api/base/types';
import { Building, Calendar, MapPin, Star, Utensils, ArrowUpDown, Filter, X } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { et } from 'date-fns/locale';

/**
 * Search results page component
 * Displays search results in a grid view with filtering and sorting options
 */
export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State for search results
  const [results, setResults] = useState<TravelOffer[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters and sorting
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<any>({});
  const [availableFilters, setAvailableFilters] = useState<any>({});
  const [showFilters, setShowFilters] = useState(false);

  // Ref for virtualized list
  const parentRef = useRef<HTMLDivElement>(null);

  // Function to fetch search results
  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build search parameters from URL query params
      const departureCities = searchParams.get('departureCities')?.split(',') || [];
      const destination = searchParams.get('destination') || undefined;
      const departureDate = searchParams.get('departureDate') || undefined;
      const nights = searchParams.get('nights') ? parseInt(searchParams.get('nights')!, 10) : undefined;
      const adults = parseInt(searchParams.get('adults') || '1', 10);
      const children = parseInt(searchParams.get('children') || '0', 10);

      // Additional filters
      const hotelRating = searchParams.getAll('hotelRating').map(r => parseInt(r, 10));
      const mealPlans = searchParams.getAll('mealPlan');
      const areas = searchParams.getAll('area');

      // Create search request
      const searchRequest = {
        departureCities,
        destination,
        departureDate,
        nights,
        adults,
        children,
        hotelRating: hotelRating.length > 0 ? hotelRating : undefined,
        mealPlans: mealPlans.length > 0 ? mealPlans : undefined,
        areas: areas.length > 0 ? areas : undefined,
        sortBy,
        sortOrder,
        page: 1,
        pageSize: 100 // Load more results at once for virtualization
      };

      // Call search API (updated to use new travel API)
      const response = await fetch('/api/travel/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Otsingul tekkis viga');
      }

      const data = await response.json();

      // Process the new API response format
      if (data.success && data.results) {
        // Flatten all offers from all providers
        const allOffers = data.results.reduce((acc: any[], providerResult: any) => {
          if (providerResult.offers) {
            return acc.concat(providerResult.offers);
          }
          return acc;
        }, []);

        // Update state with flattened results
        setResults(allOffers);
        setTotalResults(allOffers.length);
        // Note: availableFilters not available in new API, using empty object
        setAvailableFilters({});
      } else {
        setResults([]);
        setTotalResults(0);
        setAvailableFilters({});
      }

      // Update filters state based on URL params
      setFilters({
        hotelRating: hotelRating,
        mealPlans: mealPlans,
        areas: areas
      });

    } catch (error) {
      console.error('Error fetching search results:', error);
      setError(error instanceof Error ? error.message : 'Otsingul tekkis viga');
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, sortBy, sortOrder]);

  // Fetch results when search params or sorting changes
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Set up virtualizer
  const rowVirtualizer = useVirtualizer({
    count: results.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300, // Estimated height of each result card
    overscan: 5 // Number of items to render outside of the visible area
  });

  // Function to update URL with new filters
  const updateFilters = (newFilters: any) => {
    // Create new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString());

    // Clear existing filter params
    params.delete('hotelRating');
    params.delete('mealPlan');
    params.delete('area');

    // Add new filter params
    if (newFilters.hotelRating && newFilters.hotelRating.length > 0) {
      newFilters.hotelRating.forEach((rating: number) => {
        params.append('hotelRating', rating.toString());
      });
    }

    if (newFilters.mealPlans && newFilters.mealPlans.length > 0) {
      newFilters.mealPlans.forEach((plan: string) => {
        params.append('mealPlan', plan);
      });
    }

    if (newFilters.areas && newFilters.areas.length > 0) {
      newFilters.areas.forEach((area: string) => {
        params.append('area', area);
      });
    }

    // Update sort params
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);

    // Update URL
    router.push(`/search?${params.toString()}`);
  };

  // Function to toggle sort order
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Change sort field and reset to ascending
      setSortBy(field);
      setSortOrder('asc');
    }

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', field);
    params.set('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc');
    router.push(`/search?${params.toString()}`);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Otsingutulemused</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Otsingutulemused</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>{error}</p>
          <button
            onClick={fetchResults}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Proovi uuesti
          </button>
        </div>
      </div>
    );
  }

  // Render empty results
  if (results.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Otsingutulemused</h1>
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-md text-center">
          <p className="text-gray-600 mb-4">Kahjuks ei leitud ühtegi sobivat reisi.</p>
          <p className="text-gray-600 mb-4">Proovi muuta otsingukriteeriumeid.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Tagasi otsingusse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header with result count and filter toggle */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          Leitud {totalResults} reisi
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          {showFilters ? <X size={18} /> : <Filter size={18} />}
          {showFilters ? 'Peida filtrid' : 'Näita filtreid'}
        </button>
      </div>

      {/* Filters section */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hotel rating filter */}
            <div>
              <h3 className="font-semibold mb-2">Hotelli tase</h3>
              <div className="flex flex-wrap gap-2">
                {availableFilters.hotelRatings?.map((rating: number) => (
                  <button
                    key={rating}
                    onClick={() => {
                      const newRatings = filters.hotelRating?.includes(rating)
                        ? filters.hotelRating.filter((r: number) => r !== rating)
                        : [...(filters.hotelRating || []), rating];

                      const newFilters = {
                        ...filters,
                        hotelRating: newRatings
                      };

                      setFilters(newFilters);
                      updateFilters(newFilters);
                    }}
                    className={`px-3 py-1 rounded flex items-center gap-1 ${
                      filters.hotelRating?.includes(rating)
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-300'
                    }`}
                  >
                    {rating} <Star size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Meal plan filter */}
            <div>
              <h3 className="font-semibold mb-2">Toitlustus</h3>
              <div className="flex flex-wrap gap-2">
                {availableFilters.mealPlans?.map((plan: string) => (
                  <button
                    key={plan}
                    onClick={() => {
                      const newPlans = filters.mealPlans?.includes(plan)
                        ? filters.mealPlans.filter((p: string) => p !== plan)
                        : [...(filters.mealPlans || []), plan];

                      const newFilters = {
                        ...filters,
                        mealPlans: newPlans
                      };

                      setFilters(newFilters);
                      updateFilters(newFilters);
                    }}
                    className={`px-3 py-1 rounded ${
                      filters.mealPlans?.includes(plan)
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-300'
                    }`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
            </div>

            {/* Locations filter */}
            <div>
              <h3 className="font-semibold mb-2">Piirkonnad</h3>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableFilters.locations?.areas?.map((area: string) => (
                  <button
                    key={area}
                    onClick={() => {
                      const newAreas = filters.areas?.includes(area)
                        ? filters.areas.filter((a: string) => a !== area)
                        : [...(filters.areas || []), area];

                      const newFilters = {
                        ...filters,
                        areas: newAreas
                      };

                      setFilters(newFilters);
                      updateFilters(newFilters);
                    }}
                    className={`px-3 py-1 rounded ${
                      filters.areas?.includes(area)
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-300'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort options */}
            <div>
              <h3 className="font-semibold mb-2">Sorteeri</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleSort('price')}
                  className={`px-3 py-1 rounded flex items-center gap-1 ${
                    sortBy === 'price' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-300'
                  }`}
                >
                  Hind {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => toggleSort('rating')}
                  className={`px-3 py-1 rounded flex items-center gap-1 ${
                    sortBy === 'rating' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-300'
                  }`}
                >
                  Tase {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => toggleSort('date')}
                  className={`px-3 py-1 rounded flex items-center gap-1 ${
                    sortBy === 'date' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-300'
                  }`}
                >
                  Kuupäev {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => toggleSort('nights')}
                  className={`px-3 py-1 rounded flex items-center gap-1 ${
                    sortBy === 'nights' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-300'
                  }`}
                >
                  Ööde arv {sortBy === 'nights' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => toggleSort('name')}
                  className={`px-3 py-1 rounded flex items-center gap-1 ${
                    sortBy === 'name' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-300'
                  }`}
                >
                  Hotelli nimi {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results grid with virtualization */}
      <div
        ref={parentRef}
        className="h-[800px] overflow-auto"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const result = results[virtualRow.index];
            return (
              <div
                key={result.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <ResultCard result={result} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Result card component
 * Displays a single search result
 */
function ResultCard({ result }: { result: TravelOffer }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 h-[280px] flex">
      {/* Image */}
      <div className="w-1/3 relative">
        <Image
          src={result.hotel.images?.[0] || '/placeholder.jpg'}
          alt={result.hotel.name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Content */}
      <div className="w-2/3 p-4 flex flex-col">
        {/* Header */}
        <div className="mb-2">
          <h2 className="text-xl font-bold">{result.hotel.name}</h2>
          <div className="flex items-center gap-1 text-yellow-500">
            {Array.from({ length: result.hotel.rating }).map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 mb-1">
          <MapPin size={16} />
          <span>{result.resort}, {result.destination}</span>
        </div>

        {/* Departure */}
        <div className="flex items-center gap-1 text-gray-600 mb-1">
          <Building size={16} />
          <span>Väljumine: {result.departure.city}</span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-1 text-gray-600 mb-1">
          <Calendar size={16} />
          <span>
            {format(new Date(result.departureDate), 'dd.MM.yyyy', { locale: et })} -
            {format(new Date(result.returnDate), 'dd.MM.yyyy', { locale: et })}
            ({result.nights} ööd)
          </span>
        </div>

        {/* Meal plan */}
        <div className="flex items-center gap-1 text-gray-600 mb-1">
          <Utensils size={16} />
          <span>{result.mealPlan}</span>
        </div>

        {/* Room type */}
        <div className="text-gray-600 mb-1">
          <span>Tuba: {result.room.type}</span>
        </div>

        {/* Price and button */}
        <div className="mt-auto flex justify-between items-end">
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {result.price.total} {result.price.currency}
            </div>
            {result.price.perPerson && (
              <div className="text-sm text-gray-500">
                {result.price.perPerson} {result.price.currency} inimese kohta
              </div>
            )}
          </div>

          <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
            Vaata pakkumist
          </button>
        </div>
      </div>
    </div>
  );
}
