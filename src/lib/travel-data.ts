/**
 * Travel data client for SearchEngine
 * Uses unified data API endpoints with caching
 */

import { cache, CachePresets } from './cache';

export interface TravelCity {
  id: string;
  name: string;
  nameAlt: string;
  country: string;
  provider: string;
  code: string;
}

export interface TravelDestination {
  id: string;
  name: string;
  nameAlt: string;
  provider: string;
  fromCityId: string;
}

export interface TravelRegion {
  id: string;
  name: string;
  provider: string;
}

export interface TravelHotel {
  id: string;
  name: string;
  provider: string;
}

export interface TravelMealPlan {
  id: string;
  name: string;
  code: string;
}

export interface TravelRating {
  id: string;
  name: string;
  value: number;
  stars: string;
}

export interface TravelCheckinDate {
  date: string; // YYYY-MM-DD format
  destinations: string[];
  availableOffers: number;
  minPrice: number | null;
  maxPrice: number | null;
  provider: string;
}

class TravelDataAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : 'http://localhost:3000';
    console.log('🌐 TravelDataAPI baseUrl:', this.baseUrl);
  }

  /**
   * Get departure cities for SearchEngine dropdown
   */
  async getCities(): Promise<TravelCity[]> {
    return cache.getOrSet(
      'travel_cities',
      async () => {
        const url = `${this.baseUrl}/api/travel/data?type=cities`;
        const response = await fetch(url);

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
  async getDestinations(cityId: string): Promise<TravelDestination[]> {
    const cacheKey = `travel_destinations_${cityId}`;

    return cache.getOrSet(
      cacheKey,
      async () => {
        const response = await fetch(`${this.baseUrl}/api/travel/data?type=destinations&cityId=${cityId}`);

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
   * Get regions for a destination
   */
  async getRegions(cityId?: string, destinationId?: string): Promise<TravelRegion[]> {
    const cacheKey = `travel_regions_${cityId}_${destinationId}`;

    return cache.getOrSet(
      cacheKey,
      async () => {
        const params = new URLSearchParams({ type: 'regions' });
        if (cityId) params.append('cityId', cityId);
        if (destinationId) params.append('destinationId', destinationId);

        const response = await fetch(`${this.baseUrl}/api/travel/data?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch regions: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch regions');
        }

        return data.regions;
      },
      CachePresets.SHORT
    );
  }

  /**
   * Get hotels for autocomplete
   */
  async getHotels(query: string): Promise<TravelHotel[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const cacheKey = `travel_hotels_${query.toLowerCase()}`;

    return cache.getOrSet(
      cacheKey,
      async () => {
        const response = await fetch(`${this.baseUrl}/api/travel/data?type=hotels&query=${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch hotels: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch hotels');
        }

        return data.hotels;
      },
      CachePresets.SHORT
    );
  }

  /**
   * Get meal plans for SearchEngine
   */
  async getMealPlans(): Promise<TravelMealPlan[]> {
    return cache.getOrSet(
      'travel_meal_plans',
      async () => {
        const response = await fetch(`${this.baseUrl}/api/travel/data?type=meals`);

        if (!response.ok) {
          throw new Error(`Failed to fetch meal plans: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch meal plans');
        }

        return data.mealPlans;
      },
      CachePresets.STATIC
    );
  }

  /**
   * Get hotel ratings for SearchEngine
   */
  async getRatings(): Promise<TravelRating[]> {
    return cache.getOrSet(
      'travel_ratings',
      async () => {
        const response = await fetch(`${this.baseUrl}/api/travel/data?type=ratings`);

        if (!response.ok) {
          throw new Error(`Failed to fetch ratings: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch ratings');
        }

        return data.ratings;
      },
      CachePresets.STATIC
    );
  }

  /**
   * Get available check-in dates for departure calendar
   */
  async getCheckinDates(cityId: string, destinationId?: string): Promise<TravelCheckinDate[]> {
    const cacheKey = `travel_checkin_${cityId}_${destinationId || 'all'}`;

    return cache.getOrSet(
      cacheKey,
      async () => {
        const params = new URLSearchParams({ type: 'checkin', cityId });
        if (destinationId) params.append('destinationId', destinationId);

        const response = await fetch(`${this.baseUrl}/api/travel/data?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch checkin dates: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch checkin dates');
        }

        return data.checkinDates;
      },
      CachePresets.SHORT // 6 hours cache for dynamic data
    );
  }

  /**
   * Map city name to city ID (for backwards compatibility)
   */
  async getCityIdByName(cityName: string): Promise<string | null> {
    const cities = await this.getCities();
    const city = cities.find(c =>
      c.name.toLowerCase() === cityName.toLowerCase() ||
      c.nameAlt.toLowerCase() === cityName.toLowerCase()
    );
    return city ? city.id : null;
  }

  /**
   * Map destination name to destination ID
   */
  async getDestinationIdByName(cityId: string, destinationName: string): Promise<string | null> {
    const destinations = await this.getDestinations(cityId);
    const destination = destinations.find(d =>
      d.name.toLowerCase() === destinationName.toLowerCase() ||
      d.nameAlt.toLowerCase() === destinationName.toLowerCase()
    );
    return destination ? destination.id : null;
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
export const travelData = new TravelDataAPI();

// Helper functions for compatibility
export async function fetchTravelCities(): Promise<TravelCity[]> {
  return travelData.getCities();
}

export async function fetchTravelDestinations(cityId: string): Promise<TravelDestination[]> {
  return travelData.getDestinations(cityId);
}

export async function fetchTravelRegions(cityId?: string, destinationId?: string): Promise<TravelRegion[]> {
  return travelData.getRegions(cityId, destinationId);
}