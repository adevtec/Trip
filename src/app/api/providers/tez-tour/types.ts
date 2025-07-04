/**
 * TEZ Tour API Types
 * Based on analysis of eksootikareisid-old PHP implementation
 */

export interface TezTourConfig {
  apiVersion: 'V1' | 'V2';
  locale: string;
  authentication: boolean;
  username?: string;
  password?: string;
}

export interface TezTourEndpoints {
  countries: string;
  regions: string;
  cities: string;
  hotels: string;
  general: string;
  gallery: string;
  minPrice: string;
  pansions: string;
  roomTypes: string;
  attributes: string;
  accommodations: string;
  hotelClasses: string;
  hotelClassesByDeparture: string;
  pansionsByDeparture: string;
  search: string;
}

export interface TezTourCountry {
  id: string;
  name: string;
}

export interface TezTourRegion {
  id: string;
  name: string;
  countryId: string;
}

export interface TezTourCity {
  id: string;
  name: string;
  regionId: string;
}

export interface TezTourHotel {
  id: string;
  name: string;
  countryId: string;
  regionId: string;
  cityId: string;
  rating: string;
  description?: string;
  images?: string[];
  attributes?: string[];
  roomTypes?: TezTourRoomType[];
  pansions?: TezTourPansion[];
  minPrice?: number;
}

export interface TezTourRoomType {
  id: string;
  name: string;
  capacity: number;
}

export interface TezTourPansion {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface TezTourSearchParams {
  countryId?: string;
  regionId?: string;
  cityId?: string;
  hotelId?: string;
  departureId?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  childrenAges?: number[];
  pansionId?: string;
  roomTypeId?: string;
  hotelClassId?: string;
}

export interface TezTourSearchResult {
  offers: TezTourOffer[];
  totalCount: number;
  searchTime: number;
}

export interface TezTourOffer {
  id: string;
  hotelId: string;
  hotelName: string;
  price: number;
  currency: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomType: string;
  pansion: string;
  nights: number;
  description?: string;
  images?: string[];
}

export interface TezTourApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
