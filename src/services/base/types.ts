/**
 * Base interface for all travel service providers
 * This ensures consistent API across different providers (NovIT, JoinUp, TEZ, etc.)
 */

export interface SearchParams {
  departureCities: string[];
  destination?: string;
  areas?: string[];
  resorts?: string[];
  departureDate?: Date;
  returnDate?: Date;
  nights?: number;
  adults: number;
  children?: number;
  childrenAges?: number[];
  hotelRating?: number[];
  mealPlans?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
}

export interface TravelOffer {
  id: string;
  provider: string; // 'novit', 'joinup', 'tez', etc.
  
  // Basic info
  destination: string;
  resort: string;
  hotel: {
    name: string;
    rating: number;
    description?: string;
    images?: string[];
  };
  
  // Dates and duration
  departureDate: Date;
  returnDate: Date;
  nights: number;
  
  // Pricing
  price: {
    total: number;
    currency: string;
    perPerson?: number;
    breakdown?: {
      base: number;
      taxes: number;
      fees: number;
    };
  };
  
  // Travel details
  departure: {
    city: string;
    airport?: string;
    time?: string;
  };
  
  // Accommodation
  room: {
    type: string;
    occupancy: {
      adults: number;
      children: number;
    };
  };
  
  mealPlan: string;
  
  // Additional info
  cancellation?: {
    allowed: boolean;
    deadline?: Date;
    penalty?: number;
  };
  
  availability: {
    spaces: number;
    lastUpdated: Date;
  };
  
  // Provider specific data
  providerData?: any;
}

export interface SearchResult {
  provider: string;
  offers: TravelOffer[];
  totalCount: number;
  searchTime: number; // milliseconds
  success: boolean;
  error?: string;
}

export interface ProviderConfig {
  name: string;
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  priority?: number; // For ordering results
}

/**
 * Base abstract class that all providers must implement
 */
export abstract class TravelProvider {
  protected name: string;
  protected config: ProviderConfig;

  constructor(name: string, config: ProviderConfig) {
    this.name = name;
    this.config = config;
  }

  /**
   * Search for travel offers
   */
  abstract search(params: SearchParams): Promise<SearchResult>;

  /**
   * Get specific offer details
   */
  abstract getOffer(offerId: string): Promise<TravelOffer | null>;

  /**
   * Check if provider is available
   */
  abstract healthCheck(): Promise<boolean>;

  /**
   * Get provider name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get provider configuration
   */
  getConfig(): ProviderConfig {
    return this.config;
  }
}
