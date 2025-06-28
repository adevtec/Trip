/**
 * Types and data for departure cities and their available trips
 */

/**
 * Interface for departure city data
 */
export interface DepartureCity {
  id: string;          // Unique identifier for the city
  name: string;        // Display name of the city
  code: string;        // Airport code (e.g., TLL for Tallinn)
  country: string;     // Country of the city
}

/**
 * List of available departure cities
 * Used in search engine and calendar components
 */
export const departureCities: DepartureCity[] = [
  {
    id: 'tallinn',
    name: 'Tallinn',
    code: 'TLL',
    country: 'estonia'
  },
  {
    id: 'riga',
    name: 'Riga',
    code: 'RIX',
    country: 'latvia'
  },
  {
    id: 'vilnius',
    name: 'Vilnius',
    code: 'VNO',
    country: 'lithuania'
  },
  {
    id: 'palanga',
    name: 'Palanga',
    code: 'PLQ',
    country: 'lithuania'
  },
  {
    id: 'warsaw',
    name: 'Varssavi',
    code: 'WAW',
    country: 'poland'
  }
] as const;

/**
 * Helper function to get display name for a city by its ID
 */
export function getCityDisplayName(cityId: string): string {
  return departureCities.find(city => city.id === cityId)?.name || cityId;
}

/**
 * Helper function to get airport code for a city by its ID
 */
export function getCityCode(cityId: string): string {
  return departureCities.find(city => city.id === cityId)?.code || '';
}

// Eemaldame need funktsioonid, kuna väljumiskohad tulevad reiside andmetest
export const getDepartureCitiesForDestination = (): DepartureCity[] => {
  // TODO: Implementeerida see loogika reiside andmete põhjal
  return departureCities;
};

export async function fetchDepartureCities() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return departureCities;
}
