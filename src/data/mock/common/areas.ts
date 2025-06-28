import { Area } from '@/types/destinations';
import { TRAVEL_IMAGES } from '@/utils/imageUtils';

/**
 * Mock data for areas
 * Fourth level in the destination hierarchy
 */
export const areas: Area[] = [
  // Turkish Riviera areas
  {
    id: 'antalya',
    regionId: 'turkish-riviera',
    countryId: 'turkey',
    name: 'Antalya',
    slug: 'antalya',
    image: TRAVEL_IMAGES.resorts.antalya,
    description: 'Türgi Riviiera pärl',
    weatherInfo: {
      bestTimeToVisit: 'Aprill-Oktoober',
      averageTemperature: '25°C'
    },
    attractions: ['Vanalinn', 'Düden kosk', 'Konyaalti rand']
  },
  {
    id: 'alanya',
    regionId: 'turkish-riviera',
    countryId: 'turkey',
    name: 'Alanya',
    slug: 'alanya',
    image: TRAVEL_IMAGES.resorts.alanya,
    description: 'Ajalooline kuurortlinn',
    weatherInfo: {
      bestTimeToVisit: 'Mai-September',
      averageTemperature: '24°C'
    },
    attractions: ['Alanya kindlus', 'Kleopatra rand', 'Dim koobas']
  },
  {
    id: 'side',
    regionId: 'turkish-riviera',
    countryId: 'turkey',
    name: 'Side',
    slug: 'side',
    image: TRAVEL_IMAGES.resorts.side,
    description: 'Ajalooline kuurortlinn kaunite randadega',
    weatherInfo: {
      bestTimeToVisit: 'Mai-September',
      averageTemperature: '25°C'
    },
    attractions: ['Apollo tempel', 'Side vanalinn', 'Manavgat kosk']
  },
  {
    id: 'kemer',
    regionId: 'turkish-riviera',
    countryId: 'turkey',
    name: 'Kemer',
    slug: 'kemer',
    image: TRAVEL_IMAGES.resorts.kemer,
    description: 'Mägede ja mere vahel asuv kuurort',
    weatherInfo: {
      bestTimeToVisit: 'Mai-September',
      averageTemperature: '24°C'
    },
    attractions: ['Phaselis', 'Olympos', 'Tahtali mägi']
  },
  
  // Aegean Coast areas
  {
    id: 'bodrum',
    regionId: 'aegean-coast',
    countryId: 'turkey',
    name: 'Bodrum',
    slug: 'bodrum',
    image: TRAVEL_IMAGES.resorts.bodrum,
    description: 'Luksuslik kuurortlinn Egeuse mere ääres',
    weatherInfo: {
      bestTimeToVisit: 'Mai-September',
      averageTemperature: '25°C'
    },
    attractions: ['Bodrumi kindlus', 'Halikarnasos mausoleum', 'Bitez rand']
  },
  {
    id: 'marmaris',
    regionId: 'aegean-coast',
    countryId: 'turkey',
    name: 'Marmaris',
    slug: 'marmaris',
    image: TRAVEL_IMAGES.resorts.marmaris,
    description: 'Elav kuurortlinn kaunite randadega',
    weatherInfo: {
      bestTimeToVisit: 'Mai-September',
      averageTemperature: '24°C'
    },
    attractions: ['Marmarise kindlus', 'Icmeler rand', 'Marmarise sadam']
  },
  
  // Red Sea areas
  {
    id: 'hurghada',
    regionId: 'red-sea',
    countryId: 'egypt',
    name: 'Hurghada',
    slug: 'hurghada',
    image: TRAVEL_IMAGES.resorts.hurghada,
    description: 'Populaarne kuurortlinn Punase mere ääres',
    weatherInfo: {
      bestTimeToVisit: 'Oktoober-Aprill',
      averageTemperature: '26°C'
    },
    attractions: ['Korallid', 'Veespordikeskus', 'Vanalinn']
  },
  {
    id: 'sharm-el-sheikh',
    regionId: 'red-sea',
    countryId: 'egypt',
    name: 'Sharm el Sheikh',
    slug: 'sharm-el-sheikh',
    image: TRAVEL_IMAGES.resorts.sharm,
    description: 'Luksuslik kuurort Siinai poolsaarel',
    weatherInfo: {
      bestTimeToVisit: 'September-Mai',
      averageTemperature: '27°C'
    },
    attractions: ['Ras Mohammed rahvuspark', 'Naama Bay', 'Tiran saar']
  },
  {
    id: 'marsa-alam',
    regionId: 'red-sea',
    countryId: 'egypt',
    name: 'Marsa Alam',
    slug: 'marsa-alam',
    image: TRAVEL_IMAGES.resorts.marsa_alam,
    description: 'Kasvav kuurort Punase mere lõunaosas',
    weatherInfo: {
      bestTimeToVisit: 'Oktoober-Aprill',
      averageTemperature: '28°C'
    },
    attractions: ['Abu Dabbab laht', 'Wadi El Gemal rahvuspark', 'Delfiinide maja']
  },
  
  // Nile Valley areas
  {
    id: 'luxor',
    regionId: 'nile-valley',
    countryId: 'egypt',
    name: 'Luxor',
    slug: 'luxor',
    image: TRAVEL_IMAGES.resorts.luxor,
    description: 'Ajalooline linn Niiluse orus',
    weatherInfo: {
      bestTimeToVisit: 'Oktoober-Aprill',
      averageTemperature: '25°C'
    },
    attractions: ['Karnaki tempel', 'Kuningate org', 'Luxori tempel']
  },
  {
    id: 'aswan',
    regionId: 'nile-valley',
    countryId: 'egypt',
    name: 'Aswan',
    slug: 'aswan',
    image: TRAVEL_IMAGES.resorts.aswan,
    description: 'Lõunapoolseim Egiptuse linn Niiluse orus',
    weatherInfo: {
      bestTimeToVisit: 'Oktoober-Aprill',
      averageTemperature: '26°C'
    },
    attractions: ['Philae tempel', 'Aswani tamm', 'Elephantine saar']
  }
  
  // Add more areas as needed for other regions
];

/**
 * Helper function to get an area by ID
 * @param id Area ID
 * @returns Area object or undefined if not found
 */
export function getAreaById(id: string): Area | undefined {
  return areas.find(area => area.id === id);
}

/**
 * Helper function to get an area by slug
 * @param slug Area slug
 * @returns Area object or undefined if not found
 */
export function getAreaBySlug(slug: string): Area | undefined {
  return areas.find(area => area.slug === slug);
}

/**
 * Helper function to get areas by region ID
 * @param regionId Region ID
 * @returns Array of areas in the region
 */
export function getAreasByRegion(regionId: string): Area[] {
  return areas.filter(area => area.regionId === regionId);
}

/**
 * Helper function to get areas by country ID
 * @param countryId Country ID
 * @returns Array of areas in the country
 */
export function getAreasByCountry(countryId: string): Area[] {
  return areas.filter(area => area.countryId === countryId);
}

/**
 * Mock API function to fetch areas
 * @returns Promise resolving to areas array
 */
export async function fetchAreas(): Promise<Area[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return areas;
}

/**
 * Mock API function to fetch areas by region
 * @param regionId Region ID
 * @returns Promise resolving to filtered areas array
 */
export async function fetchAreasByRegion(regionId: string): Promise<Area[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return getAreasByRegion(regionId);
}
