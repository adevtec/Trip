import { JoinUpConfig, JoinUpEndpoints } from './types';

/**
 * JoinUp Baltic API Configuration
 * Based on analysis of eksootikareisid-old PHP implementation
 */

export const JOINUP_API_BASE_URL = 'https://online.joinupbaltic.eu/export/default.php?samo_action=api';

export const JOINUP_API_ENDPOINTS: JoinUpEndpoints = {
  search: 'SearchTour_PRICES',
  countries: 'SearchTour_STATES',
  regions: 'SearchTour_TOWNS',
  meals: 'SearchTour_MEALS',
  stars: 'SearchTour_STARS',
};

export const DEFAULT_JOINUP_CONFIG: JoinUpConfig = {
  apiVersion: '1.0',
  oauthToken: process.env.JOINUP_OAUTH_TOKEN || '001dc5113e5243adb608f85536e0a403', // From old system
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
