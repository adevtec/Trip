import { Continent } from '@/types/destinations';
import { TRAVEL_IMAGES } from '@/utils/imageUtils';

/**
 * Mock data for continents
 * Top level in the destination hierarchy
 */
export const continents: Continent[] = [
  {
    id: 'europe',
    name: 'Euroopa',
    slug: 'europe',
    image: TRAVEL_IMAGES.continents.europe,
    description: 'Avasta Euroopa mitmekesine kultuur, ajalooline arhitektuur ja kaasaegsed metropolid.'
  },
  {
    id: 'asia',
    name: 'Aasia',
    slug: 'asia',
    image: TRAVEL_IMAGES.continents.asia,
    description: 'Eksootilised rannad, iidsed templid ja maitsev köök ootavad Sind Aasias.'
  },
  {
    id: 'africa',
    name: 'Aafrika',
    slug: 'africa',
    image: TRAVEL_IMAGES.continents.africa,
    description: 'Aafrika pakub nii looduslikku mitmekesisust kui ka rikkalikku kultuuripärandit.'
  },
  {
    id: 'north-america',
    name: 'Põhja-Ameerika',
    slug: 'north-america',
    image: TRAVEL_IMAGES.continents['north-america'],
    description: 'Põhja-Ameerika pakub mitmekesiseid maastikke, dünaamilisi linnu ja rikkalikku kultuuripärandit.'
  },
  {
    id: 'south-america',
    name: 'Lõuna-Ameerika',
    slug: 'south-america',
    image: TRAVEL_IMAGES.continents['south-america'],
    description: 'Lõuna-Ameerika on täis elujõudu, värve ja looduslikku ilu.'
  },
  {
    id: 'oceania',
    name: 'Okeaania',
    slug: 'oceania',
    image: TRAVEL_IMAGES.continents.oceania,
    description: 'Okeaania pakub paradiislikke saari, unikaalset loodust ja põnevat kultuuri.'
  }
];

/**
 * Helper function to get a continent by ID
 * @param id Continent ID
 * @returns Continent object or undefined if not found
 */
export function getContinentById(id: string): Continent | undefined {
  return continents.find(continent => continent.id === id);
}

/**
 * Helper function to get a continent by slug
 * @param slug Continent slug
 * @returns Continent object or undefined if not found
 */
export function getContinentBySlug(slug: string): Continent | undefined {
  return continents.find(continent => continent.slug === slug);
}

/**
 * Mock API function to fetch continents
 * @returns Promise resolving to continents array
 */
export async function fetchContinents(): Promise<Continent[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return continents;
}
