/**
 * Continent mapping for known destinations
 * Maps country/destination names to geographical continents.
 *
 * NOTE: This module contains a static mapping used as a simple fallback or
 * lookup table. Primary continent information should be taken directly from
 * provider API responses when available. Do not add provider-specific
 * parsing or abstract text-search logic here.
 */

export interface ContinentInfo {
  id: string;
  name: string;
  nameEt: string;
  description?: string;
}

export const CONTINENTS: Record<string, ContinentInfo> = {
  europe: {
    id: 'europe',
    name: 'Europe',
    nameEt: 'Euroopa',
    description: 'European destinations'
  },
  asia: {
    id: 'asia',
    name: 'Asia',
    nameEt: 'Aasia',
    description: 'Asian destinations'
  },
  africa: {
    id: 'africa',
    name: 'Africa',
    nameEt: 'Aafrika',
    description: 'African destinations'
  }
};

/**
 * Static mapping of destination/country names to continent IDs.
 * Keep this list concise and provider-agnostic; it should not attempt
 * to perform fuzzy/heuristic matching. The application should prefer
 * provider-supplied continent data when available.
 */
export const DESTINATION_TO_CONTINENT: Record<string, string> = {
  // Europe - known destinations
  'Bulgaria': 'europe',
  'Cyprus': 'europe',
  'Greece': 'europe',
  'Spain': 'europe',
  'Montenegro': 'europe',
  'Portugal': 'europe',

  // Asia - known destinations
  'Turkey': 'asia',
  'Vietnam': 'asia',

  // Africa - known destinations
  'Egypt': 'africa',
  'Tunisia': 'africa'
};

/**
 * Get continent ID for a destination name
 */
export function getContinentForDestination(destinationName: string): string | null {
  return DESTINATION_TO_CONTINENT[destinationName] || null;
}

/**
 * Get all destinations for a continent
 */
export function getDestinationsForContinent(continentId: string): string[] {
  return Object.entries(DESTINATION_TO_CONTINENT)
    .filter(([_, continent]) => continent === continentId)
    .map(([destination, _]) => destination);
}

/**
 * Get continent info by ID
 */
export function getContinentInfo(continentId: string): ContinentInfo | null {
  return CONTINENTS[continentId] || null;
}

/**
 * Get all continents
 */
export function getAllContinents(): ContinentInfo[] {
  return Object.values(CONTINENTS);
}