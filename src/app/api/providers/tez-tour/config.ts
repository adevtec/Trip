import { TezTourConfig, TezTourEndpoints } from './types';

/**
 * TEZ Tour API Configuration
 * Based on analysis of eksootikareisid-old PHP implementation
 */

export const TEZ_TOUR_API_ENDPOINTS: Record<'V1' | 'V2', TezTourEndpoints> = {
  V1: {
    countries: 'https://xml.tezapi.eu/portal-xmlgate/countries.xml',
    regions: 'https://xml.tezapi.eu/portal-xmlgate/regions.xml',
    cities: 'https://xml.tezapi.eu/portal-xmlgate/cities.xml',
    hotels: 'https://xml.tezapi.eu/portal-xmlgate/hotels.xml',
    general: 'https://xml.tezapi.eu/portal-xmlgate/hotel.xml',
    gallery: 'https://xml.tezapi.eu/portal-xmlgate/hotelGallery',
    minPrice: 'https://xml.tezapi.eu/portal-xmlgate/hotelMinPrice',
    pansions: 'https://xml.tezapi.eu/portal-xmlgate/hotelPansion',
    roomTypes: 'https://xml.tezapi.eu/portal-xmlgate/hotelRoomType',
    attributes: 'https://xml.tezapi.eu/portal-xmlgate/hotelAttributes',
    accommodations: 'https://xml.tezapi.eu/tariffsearch/accommodations',
    hotelClasses: 'https://xml.tezapi.eu/xmlgate/list/hotelTypes.xml',
    hotelClassesByDeparture: 'https://xml.tezapi.eu/tariffsearch/hotelClasses',
    pansionsByDeparture: 'https://xml.tezapi.eu/tariffsearch/pansionRandbs',
    search: 'https://xml.tezapi.eu/tariffsearch/getResult',
  },
  V2: {
    countries: 'https://xml.tezapi.eu/xmlgate/list/countries.xml',
    regions: 'https://xml.tezapi.eu/xmlgate/list/regions.xml',
    cities: 'https://xml.tezapi.eu/xmlgate/list/cities.xml',
    hotels: 'https://xml.tezapi.eu/xmlgate/list/hotels.xml',
    general: 'https://xml.tezapi.eu/portal-xmlgate/hotel.xml',
    gallery: 'https://xml.tezapi.eu/portal-xmlgate/hotelGallery',
    minPrice: 'https://xml.tezapi.eu/portal-xmlgate/hotelMinPrice',
    pansions: 'https://xml.tezapi.eu/portal-xmlgate/hotelPansion',
    roomTypes: 'https://xml.tezapi.eu/portal-xmlgate/hotelRoomType',
    attributes: 'https://xml.tezapi.eu/portal-xmlgate/hotelAttributes',
    accommodations: 'https://xml.tezapi.eu/tariffsearch/accommodations',
    hotelClasses: 'https://xml.tezapi.eu/xmlgate/list/hotelTypes.xml',
    hotelClassesByDeparture: 'https://xml.tezapi.eu/tariffsearch/hotelClasses',
    pansionsByDeparture: 'https://xml.tezapi.eu/tariffsearch/pansionRandbs',
    search: 'https://xml.tezapi.eu/tariffsearch/getResult',
  },
};

export const DEFAULT_TEZ_TOUR_CONFIG: TezTourConfig = {
  apiVersion: 'V2',
  locale: 'et',
  authentication: true,
  username: process.env.TEZ_TOUR_USERNAME || '',
  password: process.env.TEZ_TOUR_PASSWORD || '',
};

export const TEZ_TOUR_SUPPORTED_LOCALES = ['et', 'en', 'ru', 'lv', 'lt'] as const;

export const TEZ_TOUR_CURRENCY_CODES = ['EUR', 'USD', 'RUB'] as const;

export const TEZ_TOUR_PANSION_CODES = [
  'BB',  // Breakfast
  'HB',  // Half Board
  'FB',  // Full Board
  'AI',  // All Inclusive
  'UAI', // Ultra All Inclusive
  'RO',  // Room Only
] as const;

export const TEZ_TOUR_HOTEL_RATINGS = ['1', '2', '3', '4', '5'] as const;

/**
 * TEZ Tour API Request Headers
 */
export const TEZ_TOUR_REQUEST_HEADERS = {
  'Content-Type': 'application/xml',
  'Accept': 'application/xml',
  'User-Agent': 'EksootikareisidApp/1.0',
};

/**
 * TEZ Tour API Response Parser Configuration
 */
export const TEZ_TOUR_PARSER_CONFIG = {
  encoding: 'windows-1251',
  xmlParseOptions: {
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    parseAttributeValue: true,
    parseNodeValue: true,
    trimValues: true,
  },
};

/**
 * TEZ Tour Image URL Templates
 */
export const TEZ_TOUR_IMAGE_URLS = {
  hotel: 'https://s.tez-tour.com/hotel/{hotelId}/{imageId}',
  tripadvisor: 'https://s.tez-tour.com/hotel/{hotelId}/tripadvisor{imageNumber}_{imageId}.JPG',
  gallery: 'https://s.tez-tour.com/hotel/{hotelId}/gallery/{imageId}',
};

/**
 * TEZ Tour API Rate Limiting
 */
export const TEZ_TOUR_RATE_LIMITS = {
  requestsPerMinute: 60,
  requestsPerHour: 1000,
  requestsPerDay: 10000,
};

/**
 * TEZ Tour API Error Codes
 */
export const TEZ_TOUR_ERROR_CODES = {
  AUTHENTICATION_FAILED: 'AUTH_FAILED',
  INVALID_PARAMETERS: 'INVALID_PARAMS',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT',
  SERVER_ERROR: 'SERVER_ERROR',
  DISABLED_IP: 'DISABLED_IP',
  NO_RESULTS: 'NO_RESULTS',
} as const;
