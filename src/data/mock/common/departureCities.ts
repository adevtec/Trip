import { DepartureCity } from '@/types/destinations';

/**
 * Mock data for departure cities
 * Used in packages
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
    id: 'helsinki',
    name: 'Helsinki',
    code: 'HEL',
    country: 'finland'
  },
  {
    id: 'stockholm',
    name: 'Stockholm',
    code: 'ARN',
    country: 'sweden'
  },
  {
    id: 'warsaw',
    name: 'Varssavi',
    code: 'WAW',
    country: 'poland'
  }
];

/**
 * Helper function to get a departure city by ID
 * @param id Departure city ID
 * @returns Departure city object or undefined if not found
 */
export function getDepartureCityById(id: string): DepartureCity | undefined {
  return departureCities.find(city => city.id === id);
}

/**
 * Helper function to get a departure city by code
 * @param code Departure city code
 * @returns Departure city object or undefined if not found
 */
export function getDepartureCityByCode(code: string): DepartureCity | undefined {
  return departureCities.find(city => city.code === code);
}

/**
 * Helper function to get departure cities by country
 * @param country Country ID
 * @returns Array of departure cities in the country
 */
export function getDepartureCitiesByCountry(country: string): DepartureCity[] {
  return departureCities.filter(city => city.country === country);
}

/**
 * Mock API function to fetch departure cities
 * @returns Promise resolving to departure cities array
 */
export async function fetchDepartureCities(): Promise<DepartureCity[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return departureCities;
}
