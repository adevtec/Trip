/**
 * Unified Travel Hooks
 * Consolidated from all provider-specific hooks
 */

// Universal travel hooks
export { useTravel, useTravelHealth, usePopularDestinations } from './useTravel';

// NovIT-specific hooks (legacy, use useTravel instead)
export { 
  useApi, 
  useMutation,
  useNovitDestinations, 
  useDestinationSearch, 
  useTravelSearch,
  useCustomerCountries,
  useUpdateCustomerCountries,
  useCustomerPreferences,
  useApiValidation 
} from './novit';

// Re-export for backward compatibility
export * from './novit';

/**
 * Recommended usage:
 * 
 * For new code, use the universal hooks:
 * ```typescript
 * import { useTravel, useTravelHealth } from '@/hooks';
 * 
 * function TravelSearch() {
 *   const { search, loading, results, error } = useTravel();
 *   const { checkHealth, isHealthy } = useTravelHealth();
 *   
 *   const handleSearch = async () => {
 *     try {
 *       await search({
 *         departureCities: ['Tallinn'],
 *         destination: 'Türgi',
 *         adults: 2,
 *       });
 *     } catch (error) {
 *       console.error('Search failed:', error);
 *     }
 *   };
 *   
 *   return (
 *     <div>
 *       <button onClick={handleSearch} disabled={loading}>
 *         Search {loading && '(Loading...)'}
 *       </button>
 *       {results.map(offer => (
 *         <div key={offer.id}>{offer.title}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 * 
 * For existing code using NovIT hooks:
 * ```typescript
 * import { useTravelSearch } from '@/hooks'; // Still works
 * ```
 */
