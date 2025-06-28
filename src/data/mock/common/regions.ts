import { Region } from '@/types/destinations';
import { TRAVEL_IMAGES } from '@/utils/imageUtils';

/**
 * Mock data for regions
 * Third level in the destination hierarchy
 */
export const regions: Region[] = [
  // Turkey regions
  {
    id: 'turkish-riviera',
    countryId: 'turkey',
    name: 'Türgi Riviiera',
    slug: 'turkish-riviera',
    image: TRAVEL_IMAGES.areas.turkish_riviera,
    description: 'Kaunid rannad ja ajalooline pärand'
  },
  {
    id: 'aegean-coast',
    countryId: 'turkey',
    name: 'Egeuse rannik',
    slug: 'aegean-coast',
    image: TRAVEL_IMAGES.areas.aegean_coast,
    description: 'Türgi Egeuse rannik pakub kauneid randu ja ajaloolisi vaatamisväärsusi'
  },
  
  // Egypt regions
  {
    id: 'red-sea',
    countryId: 'egypt',
    name: 'Punane meri',
    slug: 'red-sea',
    image: TRAVEL_IMAGES.areas.red_sea,
    description: 'Punase mere piirkond pakub suurepäraseid sukeldumiskohti ja luksuslikke kuurorte'
  },
  {
    id: 'nile-valley',
    countryId: 'egypt',
    name: 'Niiluse org',
    slug: 'nile-valley',
    image: TRAVEL_IMAGES.areas.nile_valley,
    description: 'Niiluse org on täis ajaloolisi vaatamisväärsusi ja kultuuripärandit'
  },
  
  // Greece regions
  {
    id: 'crete',
    countryId: 'greece',
    name: 'Kreeta',
    slug: 'crete',
    image: TRAVEL_IMAGES.areas.crete,
    description: 'Kreeta on Kreeka suurim saar, mis pakub rikkalikku ajalugu ja kauneid randu'
  },
  {
    id: 'rhodes',
    countryId: 'greece',
    name: 'Rhodos',
    slug: 'rhodes',
    image: TRAVEL_IMAGES.areas.rhodes,
    description: 'Rhodos on Kreeka saar, mis pakub ajaloolisi vaatamisväärsusi ja kauneid randu'
  },
  {
    id: 'corfu',
    countryId: 'greece',
    name: 'Korfu',
    slug: 'corfu',
    image: TRAVEL_IMAGES.areas.corfu,
    description: 'Korfu on Kreeka saar, mis pakub looduslikku ilu ja kultuuripärandit'
  },
  
  // Spain regions
  {
    id: 'canary-islands',
    countryId: 'spain',
    name: 'Kanaari saared',
    slug: 'canary-islands',
    image: TRAVEL_IMAGES.areas.canary_islands,
    description: 'Kanaari saared pakuvad aastaringset sooja kliimat ja mitmekesist loodust'
  },
  {
    id: 'balearic-islands',
    countryId: 'spain',
    name: 'Baleaari saared',
    slug: 'balearic-islands',
    image: TRAVEL_IMAGES.areas.balearic_islands,
    description: 'Baleaari saared pakuvad kauneid randu ja elavat ööelu'
  },
  {
    id: 'costa-del-sol',
    countryId: 'spain',
    name: 'Costa del Sol',
    slug: 'costa-del-sol',
    image: TRAVEL_IMAGES.areas.costa_del_sol,
    description: 'Costa del Sol on Hispaania päikeserannik, mis pakub luksuslikke kuurorte'
  },
  
  // Italy regions
  {
    id: 'sicily',
    countryId: 'italy',
    name: 'Sitsiilia',
    slug: 'sicily',
    image: TRAVEL_IMAGES.areas.sicily,
    description: 'Sitsiilia on Itaalia suurim saar, mis pakub rikkalikku ajalugu ja kultuuri'
  },
  {
    id: 'sardinia',
    countryId: 'italy',
    name: 'Sardiinia',
    slug: 'sardinia',
    image: TRAVEL_IMAGES.areas.sardinia,
    description: 'Sardiinia on Itaalia saar, mis pakub kristallselget vett ja kauneid randu'
  },
  
  // Thailand regions
  {
    id: 'phuket',
    countryId: 'thailand',
    name: 'Phuket',
    slug: 'phuket',
    image: TRAVEL_IMAGES.areas.phuket,
    description: 'Phuket on Tai suurim saar, mis pakub kauneid randu ja elavat ööelu'
  },
  {
    id: 'krabi',
    countryId: 'thailand',
    name: 'Krabi',
    slug: 'krabi',
    image: TRAVEL_IMAGES.areas.krabi,
    description: 'Krabi pakub hingematvaid lubjakivimägesid ja kristallselget vett'
  },
  
  // Cyprus regions
  {
    id: 'paphos',
    countryId: 'cyprus',
    name: 'Paphos',
    slug: 'paphos',
    image: TRAVEL_IMAGES.areas.paphos,
    description: 'Paphos on ajalooline linn Küprosel, mis pakub rikkalikku kultuuripärandit'
  },
  {
    id: 'ayia-napa',
    countryId: 'cyprus',
    name: 'Ayia Napa',
    slug: 'ayia-napa',
    image: TRAVEL_IMAGES.areas.ayia_napa,
    description: 'Ayia Napa on tuntud oma kaunite randade ja elava ööelu poolest'
  },
  
  // Bulgaria regions
  {
    id: 'sunny-beach',
    countryId: 'bulgaria',
    name: 'Sunny Beach',
    slug: 'sunny-beach',
    image: TRAVEL_IMAGES.areas.sunny_beach,
    description: 'Sunny Beach on Bulgaaria populaarseim kuurort, mis pakub soodsat puhkust'
  },
  {
    id: 'golden-sands',
    countryId: 'bulgaria',
    name: 'Golden Sands',
    slug: 'golden-sands',
    image: TRAVEL_IMAGES.areas.golden_sands,
    description: 'Golden Sands on Bulgaaria kuurort, mis pakub kauneid liivarandu'
  }
];

/**
 * Helper function to get a region by ID
 * @param id Region ID
 * @returns Region object or undefined if not found
 */
export function getRegionById(id: string): Region | undefined {
  return regions.find(region => region.id === id);
}

/**
 * Helper function to get a region by slug
 * @param slug Region slug
 * @returns Region object or undefined if not found
 */
export function getRegionBySlug(slug: string): Region | undefined {
  return regions.find(region => region.slug === slug);
}

/**
 * Helper function to get regions by country ID
 * @param countryId Country ID
 * @returns Array of regions in the country
 */
export function getRegionsByCountry(countryId: string): Region[] {
  return regions.filter(region => region.countryId === countryId);
}

/**
 * Mock API function to fetch regions
 * @returns Promise resolving to regions array
 */
export async function fetchRegions(): Promise<Region[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return regions;
}

/**
 * Mock API function to fetch regions by country
 * @param countryId Country ID
 * @returns Promise resolving to filtered regions array
 */
export async function fetchRegionsByCountry(countryId: string): Promise<Region[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return getRegionsByCountry(countryId);
}
