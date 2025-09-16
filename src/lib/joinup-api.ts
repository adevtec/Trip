/**
 * JoinUp API client with automatic caching
 * Uses client-side cache to avoid repeated requests
 */

import { cache, CachePresets } from './cache';

export interface JoinUpCity {
  id: string;
  name: string;
  nameAlt: string;
  country: string;
  countryAlt: string;
  code: string;
  joinupId: number;
}

export interface JoinUpDestination {
  id: string;
  name: string;
  nameAlt: string;
  joinupId: number;
  fromCityId: string;
}

export interface JoinUpSearchParams {
  cityId: string;
  destinationId: string;
  checkin?: string; // YYYY-MM-DD
  nights?: number;
  adults: number;
  children?: number;
}

export interface JoinUpOffer {
  id: string;
  provider: 'joinup';
  hotel: {
    id?: string;
    name: string;
    rating: number;
    images: string[];
  };
  destination: string;
  resort: string;
  departure: {
    city: string;
    cityId: string;
  };
  departureDate: string;
  returnDate: string;
  nights: number;
  price: {
    total: number;
    currency: string;
    perPerson: number | null;
  };
  mealPlan: string;
  room: {
    type: string;
    capacity: number;
  };
  availability: string;
  joinup?: {
    hotelId: any;
    tourId: any;
    priceId: any;
  };
}

class JoinUpAPI {
  private baseUrl: string;

  constructor() {
    // Use current host for API calls
    this.baseUrl = typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'http://localhost:3000'; // Default for server-side calls
  }

  /**
   * Get all available departure cities
   */
  async getCities(): Promise<JoinUpCity[]> {
    return cache.getOrSet(
      'joinup_cities',
      async () => {
        const response = await fetch(`${this.baseUrl}/api/joinup/cities`);

        if (!response.ok) {
          throw new Error(`Failed to fetch cities: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch cities');
        }

        return data.cities;
      },
      CachePresets.STATIC
    );
  }

  /**
   * Get destinations for a specific departure city
   */
  async getDestinations(cityId: string): Promise<JoinUpDestination[]> {
    const cacheKey = `joinup_destinations_${cityId}`;

    return cache.getOrSet(
      cacheKey,
      async () => {
        const response = await fetch(`${this.baseUrl}/api/joinup/destinations?cityId=${cityId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch destinations: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch destinations');
        }

        return data.destinations;
      },
      CachePresets.SEMI_STATIC
    );
  }

  /**
   * Search for travel offers
   */
  async search(params: JoinUpSearchParams): Promise<JoinUpOffer[]> {
    // Create cache key from search parameters
    const cacheKey = `joinup_search_${JSON.stringify(params)}`.replace(/[^a-zA-Z0-9_]/g, '_');

    return cache.getOrSet(
      cacheKey,
      async () => {
        const response = await fetch(`${this.baseUrl}/api/joinup/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Search failed');
        }

        return data.offers;
      },
      CachePresets.DYNAMIC
    );
  }

  /**
   * Get city by ID
   */
  async getCityById(cityId: string): Promise<JoinUpCity | null> {
    const cities = await this.getCities();
    return cities.find(city => city.id === cityId) || null;
  }

  /**
   * Get destination by ID
   */
  async getDestinationById(cityId: string, destinationId: string): Promise<JoinUpDestination | null> {
    const destinations = await this.getDestinations(cityId);
    return destinations.find(dest => dest.id === destinationId) || null;
  }

  /**
   * Convert our departure city format to JoinUp format
   */
  mapDepartureCityToJoinUp(cityName: string): string | null {
    // This will be populated when we get cities from API
    const cityMap: Record<string, string> = {
      'tallinn': '2552',
      'riga': '3164',
      'vilnius': '2151',
      'palanga': '4432'
    };

    return cityMap[cityName.toLowerCase()] || null;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return cache.getStats();
  }
}

// Create singleton instance
export const joinUpAPI = new JoinUpAPI();

// Helper functions for compatibility with existing code
export async function fetchJoinUpCities(): Promise<JoinUpCity[]> {
  return joinUpAPI.getCities();
}

export async function fetchJoinUpDestinations(cityId: string): Promise<JoinUpDestination[]> {
  return joinUpAPI.getDestinations(cityId);
}

export async function searchJoinUpOffers(params: JoinUpSearchParams): Promise<JoinUpOffer[]> {
  return joinUpAPI.search(params);
}