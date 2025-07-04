import { useState, useCallback } from 'react';
import { SearchParams, TravelOffer, TravelProvider } from '@/app/api';

/**
 * Universal Travel Hook
 * Works with all travel providers through the unified API
 */
export function useTravel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TravelOffer[]>([]);
  const [providers, setProviders] = useState<TravelProvider[]>([]);
  const [totalOffers, setTotalOffers] = useState(0);

  /**
   * Search for travel offers
   */
  const search = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/travel/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.results || []);
      setProviders(data.providers || []);
      setTotalOffers(data.totalOffers || 0);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get search by URL params (for GET requests)
   */
  const searchByParams = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchParams = new URLSearchParams();
      
      // Add search parameters
      if (params.departureCities) searchParams.set('departureCities', params.departureCities.join(','));
      if (params.destination) searchParams.set('destination', params.destination);
      if (params.areas) searchParams.set('areas', params.areas.join(','));
      if (params.resorts) searchParams.set('resorts', params.resorts.join(','));
      if (params.departureDate) searchParams.set('departureDate', params.departureDate.toISOString().split('T')[0]);
      if (params.returnDate) searchParams.set('returnDate', params.returnDate.toISOString().split('T')[0]);
      if (params.nights) searchParams.set('nights', params.nights.toString());
      if (params.adults) searchParams.set('adults', params.adults.toString());
      if (params.children) searchParams.set('children', params.children.toString());
      if (params.childrenAges) searchParams.set('childrenAges', params.childrenAges.join(','));
      if (params.hotelRating) searchParams.set('hotelRating', params.hotelRating.join(','));
      if (params.mealPlans) searchParams.set('mealPlans', params.mealPlans.join(','));
      if (params.priceRange?.min) searchParams.set('priceMin', params.priceRange.min.toString());
      if (params.priceRange?.max) searchParams.set('priceMax', params.priceRange.max.toString());

      const response = await fetch(`/api/travel/search?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.results || []);
      setProviders(data.providers || []);
      setTotalOffers(data.totalOffers || 0);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset search state
   */
  const reset = useCallback(() => {
    setResults([]);
    setProviders([]);
    setTotalOffers(0);
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    results,
    providers,
    totalOffers,
    
    // Actions
    search,
    searchByParams,
    reset,
    
    // Computed
    hasResults: results.length > 0,
    hasError: error !== null,
    isSuccess: !loading && !error && results.length > 0,
  };
}

/**
 * Hook for checking travel API health
 */
export function useTravelHealth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<any>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/travel/health');

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }

      const data = await response.json();
      setHealth(data);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    health,
    checkHealth,
    isHealthy: health?.status === 'operational',
    healthyProviders: health?.stats?.healthyProviders || 0,
    totalProviders: Object.keys(health?.providers || {}).length,
  };
}

/**
 * Hook for popular destinations
 */
export function usePopularDestinations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<any[]>([]);

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, return mock popular destinations
      // This can be replaced with actual API call when available
      const mockDestinations = [
        { id: 'turkey', name: 'Türgi', code: 'TR', popular: true },
        { id: 'spain', name: 'Hispaania', code: 'ES', popular: true },
        { id: 'greece', name: 'Kreeka', code: 'GR', popular: true },
        { id: 'italy', name: 'Itaalia', code: 'IT', popular: true },
        { id: 'egypt', name: 'Egiptus', code: 'EG', popular: true },
        { id: 'croatia', name: 'Horvaatia', code: 'HR', popular: true },
      ];
      
      setDestinations(mockDestinations);
      return mockDestinations;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    destinations,
    fetchDestinations,
    hasDestinations: destinations.length > 0,
  };
}
