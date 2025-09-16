import { JoinUpConfig, JoinUpEndpoints } from './types';

/**
 * JoinUp Baltic API Configuration
 * Based on analysis of eksootikareisid-old PHP implementation
 */

// Development and Production URLs
export const JOINUP_API_URLS = {
  development: 'https://devonline.joinupbaltic.eu/export/default.php?samo_action=api',
  production: 'https://online.joinupbaltic.eu/export/default.php?samo_action=api',
} as const;

export const JOINUP_API_BASE_URL = process.env.NODE_ENV === 'production'
  ? JOINUP_API_URLS.production
  : JOINUP_API_URLS.development;

export const JOINUP_API_ENDPOINTS: JoinUpEndpoints = {
  // Core search endpoints
  townfroms: 'SearchTour_TOWNFROMS',
  states: 'SearchTour_STATES',
  checkin: 'SearchTour_CHECKIN',
  nights: 'SearchTour_NIGHTS',
  prices: 'SearchTour_PRICES',
  hotels: 'SearchTour_HOTELS',

  // Filter endpoints
  stars: 'SearchTour_STARS',
  meals: 'SearchTour_MEALS',
  towns: 'SearchTour_TOWNS',

  // Detail endpoints
  hotelinfo: 'SearchTour_HOTELINFO',
  room_placement: 'SearchTour_ROOM_PLACEMENT',
  cancel_policies: 'SearchTour_CANCEL_POLICIES',
  payment_policies: 'SearchTour_PAYMENT_POLICIES',

  // Booking endpoints
  calc: 'SearchTour_CALC',
  booking: 'SearchTour_BRON',

  // Currency endpoints
  currencies: 'Currency_CURRENCIES',
  rates: 'Currency_RATES',

  // Flight endpoints
  tickets_prices: 'Tickets_PRICES',

  // Legacy mappings for backward compatibility
  search: 'SearchTour_PRICES',
  countries: 'SearchTour_STATES',
  regions: 'SearchTour_TOWNS',
};

/**
 * JoinUp API Credentials Configuration
 * These should be set in environment variables
 */
export interface JoinUpCredentials {
  oauth_token: string;
  client_id: string;
  client_secret: string;
  partner: string;
  partpass: string;
  alias: string;
  psw: string;
}

export const getJoinUpCredentials = (): JoinUpCredentials => {
  const isDev = process.env.NODE_ENV !== 'production';
  const prefix = isDev ? 'JOINUP_DEV_' : 'JOINUP_PROD_';

  return {
    oauth_token: process.env[`${prefix}OAUTH_TOKEN`] || '',
    client_id: process.env[`${prefix}CLIENT_ID`] || '',
    client_secret: process.env[`${prefix}CLIENT_SECRET`] || '',
    partner: process.env[`${prefix}PARTNER`] || '',
    partpass: process.env[`${prefix}PARTPASS`] || '',
    alias: process.env[`${prefix}ALIAS`] || '',
    psw: process.env[`${prefix}PSW`] || '',
  };
};

export const DEFAULT_JOINUP_CONFIG: JoinUpConfig = {
  apiVersion: '1.0',
  oauthToken: getJoinUpCredentials().oauth_token,
  baseUrl: JOINUP_API_BASE_URL,
};

export const JOINUP_SUPPORTED_CURRENCIES = ['EUR', 'USD'] as const;

export const JOINUP_MEAL_TYPES = [
  { code: 'BB', name: 'Breakfast' },
  { code: 'HB', name: 'Half Board' },
  { code: 'FB', name: 'Full Board' },
  { code: 'AI', name: 'All Inclusive' },
  { code: 'UAI', name: 'Ultra All Inclusive' },
] as const;

export const JOINUP_HOTEL_RATINGS = [1, 2, 3, 4, 5] as const;

/**
 * JoinUp API Request Headers
 */
export const JOINUP_REQUEST_HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/xml',
  'User-Agent': 'EksootikareisidApp/1.0',
};

/**
 * JoinUp API Response Parser Configuration
 */
export const JOINUP_PARSER_CONFIG = {
  encoding: 'utf-8',
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
 * JoinUp API Rate Limiting
 */
export const JOINUP_RATE_LIMITS = {
  requestsPerMinute: 60,
  requestsPerHour: 1000,
  requestsPerDay: 10000,
};

/**
 * JoinUp API Error Codes
 */
export const JOINUP_ERROR_CODES = {
  INVALID_API_KEY: 'apiKey provided, but invalid',
  BLACKLISTED_IP: 'blacklisted address',
  AUTHENTICATION_FAILED: 'AUTH_FAILED',
  INVALID_PARAMETERS: 'INVALID_PARAMS',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT',
  SERVER_ERROR: 'SERVER_ERROR',
  NO_RESULTS: 'NO_RESULTS',
} as const;
