/**
 * NovIT API specific types
 * Extracted from api-integration/types/api.ts
 */

// Üldine API vastuse struktuur
export interface NovitApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  headers: Record<string, string>;
}

// Health check vastus
export interface NovitHealthResponse {
  status: 'ok' | 'error';
  message?: string;
}

// Stat API vastus
export interface NovitStatResponse {
  realdate: string;
  lastUpdate?: string;
}

// Riigi tüüp (NovIT formaat)
export interface NovitCountry {
  id: string | number;
  name: string;
  code: string;
  flag?: string;
  active?: boolean;
  popular?: boolean;
}

// Riikide API vastus
export interface NovitCountriesResponse {
  countries: NovitCountry[];
  total?: number;
}

// Kliendi riikide seadistamise vastus
export interface NovitCustomerCountriesResponse {
  success: boolean;
  countries: string[];
  message?: string;
}

// Sihtkoha tüüp (NovIT formaat)
export interface NovitDestination {
  id: string | number;
  name: string;
  country: string;
  region?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  popular?: boolean;
}

// Hotelli tüüp (NovIT formaat)
export interface NovitHotel {
  id: string | number;
  name: string;
  destination: string;
  country: string;
  stars?: number;
  rating?: number;
  amenities?: string[];
  images?: string[];
}

// Pakkumise tüüp (NovIT formaat)
export interface NovitOffer {
  id: string | number;
  hotel: NovitHotel;
  destination: NovitDestination;
  price: {
    amount: number;
    currency: string;
    originalAmount?: number;
  };
  dates: {
    departure: string;
    return: string;
  };
  duration: number;
  adults: number;
  children?: number;
  mealPlan?: string;
  room?: string;
}

// Otsingu parameetrid (NovIT formaat)
export interface NovitSearchParams {
  destination?: string;
  country?: string;
  departureCity?: string;
  departureDate?: string;
  returnDate?: string;
  adults?: number;
  children?: number;
  duration?: number;
  minPrice?: number;
  maxPrice?: number;
  stars?: number[];
  mealPlan?: string[];
  facilities?: string[];
}

// Otsingu vastus
export interface NovitSearchResponse {
  offers: NovitOffer[];
  total: number;
  page?: number;
  perPage?: number;
  hasMore?: boolean;
  filters?: {
    countries: string[];
    destinations: string[];
    priceRange: {
      min: number;
      max: number;
    };
    stars: number[];
    mealPlans: string[];
  };
}

// API viga
export interface NovitApiError {
  code: string;
  message: string;
  details?: any;
}

// API klient seadistused
export interface NovitApiClientOptions {
  apiKey?: string;
  timeout?: number;
  debug?: boolean;
  retries?: number;
}

// Krüpteerimise konfiguratsioon
export interface NovitEncryptionConfig {
  method: string;
  secretKey: string;
  secretIv: string;
  hashAlgo: string;
}

// Cache konfiguratsioon
export interface NovitCacheConfig {
  defaultTtl: number; // Time to live sekundites
  maxSize: number;    // Maksimaalne cache suurus
  enabled: boolean;   // Kas cache on lubatud
}
