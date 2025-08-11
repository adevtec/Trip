import { useApi, useMutation } from './useApi';

// Import types from unified API system
interface Country {
  id: string | number;
  name: string;
  code: string;
  flag?: string;
  active?: boolean;
  popular?: boolean;
}

interface CountriesResponse {
  countries: Country[];
  total?: number;
}

/**
 * Hook sihtkohtade haldamiseks NovIT API kaudu
 * Integrated with unified travel API system
 */
export function useNovitDestinations() {
  // Use the new unified travel API health endpoint to get provider info
  const {
    data,
    loading,
    error,
    refetch,
    isSuccess,
    isError
  } = useApi<CountriesResponse>(
    async () => {
      const response = await fetch('/api/travel/health');
      if (!response.ok) {
        throw new Error('Failed to fetch destination data');
      }
      const healthData = await response.json();
      
      // Return mock countries for now - can be updated when actual destination API is available
      return {
        countries: [
          { id: 'turkey', name: 'Türgi', code: 'TR', popular: true },
          { id: 'spain', name: 'Hispaania', code: 'ES', popular: true },
          { id: 'greece', name: 'Kreeka', code: 'GR', popular: true },
          { id: 'italy', name: 'Itaalia', code: 'IT', popular: true },
          { id: 'egypt', name: 'Egiptus', code: 'EG', popular: true },
          { id: 'croatia', name: 'Horvaatia', code: 'HR', popular: true },
        ],
        total: 6
      };
    },
    { immediate: true }
  );

  return {
    countries: data?.countries || [],
    total: data?.total || 0,
    loading,
    error,
    refetch,
    isSuccess,
    isError
  };
}

/**
 * Hook riikide otsimiseks/filtreerimiseks
 */
export function useDestinationSearch() {
  const { countries: allCountries, loading: loadingAll } = useNovitDestinations();

  const searchCountries = (query: string): Country[] => {
    if (!query.trim() || !allCountries) return allCountries;
    
    const searchTerm = query.toLowerCase();
    return allCountries.filter((country: Country) => 
      country.name.toLowerCase().includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm)
    );
  };

  const getCountryByCode = (code: string): Country | undefined => {
    return allCountries?.find((country: Country) => 
      country.code.toLowerCase() === code.toLowerCase()
    );
  };

  const getCountryById = (id: string | number): Country | undefined => {
    return allCountries?.find((country: Country) => 
      country.id.toString() === id.toString()
    );
  };

  return {
    countries: allCountries || [],
    loading: loadingAll,
    searchCountries,
    getCountryByCode,
    getCountryById
  };
}

/**
 * Hook populaarsete sihtkohtade jaoks
 */
export function usePopularDestinations() {
  const { countries, loading, error } = useNovitDestinations();

  const popularCountries = countries.filter((country: Country) => country.popular === true);

  return {
    destinations: popularCountries,
    loading,
    error,
    count: popularCountries.length
  };
}

/**
 * Hook reisiotsingu jaoks kasutades uut unified travel API-t
 */
export function useTravelSearch() {
  const { mutate, loading, error, data } = useMutation(
    async (searchParams: any) => {
      const response = await fetch('/api/travel/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Search failed');
      }
      
      return result;
    }
  );

  return {
    search: mutate,
    loading,
    error,
    results: data?.results || [],
    totalOffers: data?.totalOffers || 0,
    providers: data?.providers || []
  };
}
