/**
 * NovIT React Hooks
 * Integrated with unified travel API system
 */

// Core hooks
export { useApi, useMutation } from './useApi';

// Destination hooks
export { 
  useNovitDestinations, 
  useDestinationSearch, 
  usePopularDestinations,
  useTravelSearch 
} from './useDestinations';

// Customer hooks
export { 
  useCustomerCountries, 
  useUpdateCustomerCountries, 
  useCustomerPreferences,
  useApiValidation 
} from './useCustomers';

/**
 * Quick usage example:
 * 
 * ```typescript
 * import { useTravelSearch, usePopularDestinations } from '@/hooks/novit';
 * 
 * function SearchPage() {
 *   const { destinations } = usePopularDestinations();
 *   const { search, loading, results } = useTravelSearch();
 *   
 *   const handleSearch = () => {
 *     search({
 *       departureCities: ['Tallinn'],
 *       destination: 'Türgi',
 *       adults: 2
 *     });
 *   };
 *   
 *   return (
 *     <div>
 *       {destinations.map(dest => <div key={dest.id}>{dest.name}</div>)}
 *       <button onClick={handleSearch} disabled={loading}>
 *         Search {loading && '...'}
 *       </button>
 *       {results.map(result => <div key={result.provider}>...</div>)}
 *     </div>
 *   );
 * }
 * ```
 */
