/**
 * JoinUp Baltic API Types
 * Based on analysis of eksootikareisid-old PHP implementation
 */

export interface JoinUpConfig {
  apiVersion: string;
  oauthToken: string;
  baseUrl: string;
}

export interface JoinUpEndpoints {
  // Core search endpoints
  townfroms: string;
  states: string;
  checkin: string;
  nights: string;
  prices: string;
  hotels: string;

  // Filter endpoints
  stars: string;
  meals: string;
  towns: string;

  // Detail endpoints
  hotelinfo: string;
  room_placement: string;
  cancel_policies: string;
  payment_policies: string;

  // Booking endpoints
  calc: string;
  booking: string;

  // Currency endpoints
  currencies: string;
  rates: string;

  // Flight endpoints
  tickets_prices: string;

  // Legacy mappings for backward compatibility
  search: string;
  countries: string;
  regions: string;
}

export interface JoinUpCountry {
  id: string;
  name: string;
}

export interface JoinUpRegion {
  id: string;
  name: string;
  countryId?: string;
}

export interface JoinUpMeal {
  id: string;
  name: string;
  code: string;
}

export interface JoinUpStar {
  id: string;
  name: string;
  rating: number;
}

export interface JoinUpSearchParams {
  TOWNFROMINC?: string; // Departure city
  STATEINC?: string;    // Country
  TOURID?: string;      // Tour ID
  adults?: number;
  children?: number;
  startDate?: string;
  endDate?: string;
  meal?: string;
  stars?: string;
}

export interface JoinUpOffer {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: number;
  hotel: string;
  country: string;
  region: string;
  meal: string;
  stars: number;
  departureDate: string;
  returnDate: string;
  availability: number;
}

export interface JoinUpApiResponse<T> {
  success: boolean;
  items?: {
    item: T[];
  };
  error?: string;
}

/**
 * JoinUp API City/Country Correspondence Maps
 * Based on analysis of PHP code
 */
export const JOINUP_DEPARTURE_CITIES = {
  "3746": "2552", // TALLINN
  "523": "3164"   // RIGA
} as const;

export const JOINUP_COUNTRY_CORRESPONDENCE = {
  "5732": "9",     // Egypt
  "7067498": "4",  // Greece
  "5733": "5",     // Spain
  "138865": "17",  // Sri Lanka
  "1104": "8",     // Turkey
} as const;
