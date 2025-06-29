import { useApi, useMutation } from './useApi';

// Import types from services (will be moved from api-integration)
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
 * Moved and adapted from api-integration/hooks/useDestinations.ts
 */
export function useNovitDestinations() {
  // Use the new travel services API
  const {
    data,
    loading,
    error,
    refetch,
    isSuccess,
    isError
  } = useApi<CountriesResponse>(
    async () => {
      const response = await fetch('/api/travel/search?departureCities=Tallinn&adults=2');
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }
      return response.json();
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
 * Hook reisiotsingu jaoks kasutades uut travel services API-t
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
      
      return response.json();
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
