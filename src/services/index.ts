/**
 * Travel Services - Unified API for multiple travel providers
 * 
 * This module provides a unified interface for searching and booking
 * travel offers from multiple providers (NovIT, JoinUp, TEZ, ANEX, etc.)
 */

// Base types and interfaces
export type {
  SearchParams,
  TravelOffer,
  SearchResult,
  ProviderConfig
} from './base/types';

export { TravelProvider } from './base/types';
export { TravelAggregator } from './base/aggregator';

// Provider implementations
export { NovITProvider } from './providers/novit/provider';
export { JoinUpProvider } from './providers/joinup/provider';

// Configuration and setup
export {
  createTravelAggregator,
  getDefaultAggregator,
  getProviderConfig,
  getAllProviderConfigs,
  updateProviderConfig,
  toggleProvider,
  resetDefaultAggregator
} from './config';

/**
 * Quick start example:
 * 
 * ```typescript
 * import { getDefaultAggregator } from '@/services';
 * 
 * const aggregator = getDefaultAggregator();
 * const results = await aggregator.search({
 *   departureCities: ['Tallinn'],
 *   destination: 'Türgi',
 *   adults: 2,
 *   departureDate: new Date('2024-07-15')
 * });
 * ```
 */
