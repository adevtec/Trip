import { Country } from '@/types/destinations';
import { TRAVEL_IMAGES } from '@/utils/imageUtils';

/**
 * Mock data for countries
 * Second level in the destination hierarchy
 */
export const countries: Country[] = [
  {
    id: 'turkey',
    continentId: 'asia',
    name: 'Türgi',
    slug: 'turkey',
    image: TRAVEL_IMAGES.destinations.turkey,
    description: 'Türgi Riviiera - soe meri ja külalislahke rahvas',
    departureCities: ['tallinn', 'riga', 'vilnius']
  },
  {
    id: 'egypt',
    continentId: 'africa',
    name: 'Egiptus',
    slug: 'egypt',
    image: TRAVEL_IMAGES.destinations.egypt,
    description: 'Iidne kultuur ja kaasaegsed kuurordid',
    departureCities: ['tallinn', 'riga']
  },
  {
    id: 'greece',
    continentId: 'europe',
    name: 'Kreeka',
    slug: 'greece',
    image: TRAVEL_IMAGES.destinations.greece,
    description: 'Kreeka saared pakuvad päikest, merd ja rikkalikku ajalugu',
    departureCities: ['tallinn', 'riga', 'vilnius']
  },
  {
    id: 'spain',
    continentId: 'europe',
    name: 'Hispaania',
    slug: 'spain',
    image: TRAVEL_IMAGES.destinations.spain,
    description: 'Hispaania rannikud ja saared pakuvad päikest ja meelelahutust',
    departureCities: ['tallinn', 'riga', 'vilnius']
  },
  {
    id: 'italy',
    continentId: 'europe',
    name: 'Itaalia',
    slug: 'italy',
    image: TRAVEL_IMAGES.destinations.italy,
    description: 'Itaalia pakub rikkalikku ajalugu, kultuuri ja maitsvat toitu',
    departureCities: ['tallinn', 'riga']
  },
  {
    id: 'thailand',
    continentId: 'asia',
    name: 'Tai',
    slug: 'thailand',
    image: TRAVEL_IMAGES.destinations.thailand,
    description: 'Tai pakub eksootilisi randu, templeid ja maitsvat kööki',
    departureCities: ['tallinn']
  },
  {
    id: 'cyprus',
    continentId: 'europe',
    name: 'Küpros',
    slug: 'cyprus',
    image: TRAVEL_IMAGES.destinations.cyprus,
    description: 'Küpros on Vahemere pärl, kus kohtuvad erinevad kultuurid',
    departureCities: ['tallinn', 'riga']
  },
  {
    id: 'bulgaria',
    continentId: 'europe',
    name: 'Bulgaaria',
    slug: 'bulgaria',
    image: TRAVEL_IMAGES.destinations.bulgaria,
    description: 'Bulgaaria Musta mere rannik pakub soodsat puhkust',
    departureCities: ['tallinn', 'riga', 'vilnius']
  }
];

/**
 * Helper function to get a country by ID
 * @param id Country ID
 * @returns Country object or undefined if not found
 */
export function getCountryById(id: string): Country | undefined {
  return countries.find(country => country.id === id);
}

/**
 * Helper function to get a country by slug
 * @param slug Country slug
 * @returns Country object or undefined if not found
 */
export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find(country => country.slug === slug);
}

/**
 * Helper function to get countries by continent ID
 * @param continentId Continent ID
 * @returns Array of countries in the continent
 */
export function getCountriesByContinent(continentId: string): Country[] {
  return countries.filter(country => country.continentId === continentId);
}

/**
 * Mock API function to fetch countries
 * @returns Promise resolving to countries array
 */
export async function fetchCountries(): Promise<Country[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return countries;
}

/**
 * Mock API function to fetch countries by continent
 * @param continentId Continent ID
 * @returns Promise resolving to filtered countries array
 */
export async function fetchCountriesByContinent(continentId: string): Promise<Country[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return getCountriesByContinent(continentId);
}
