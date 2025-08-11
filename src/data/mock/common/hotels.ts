import { Hotel } from '@/types/destinations';
import { TRAVEL_IMAGES } from '@/utils/imageUtils';

/**
 * Mock data for hotels
 * Fifth level in the destination hierarchy
 */
export const hotels: Hotel[] = [
  // Antalya hotels
  {
    id: 'titanic-beach-lara',
    areaId: 'antalya',
    regionId: 'turkish-riviera',
    countryId: 'turkey',
    name: 'Titanic Beach Lara',
    slug: 'titanic-beach-lara',
    rating: 5,
    description: 'Luksuslik kuurorthotell Lara rannas, mis pakub kõik-hinnas teenust ja mitmekesiseid meelelahutusvõimalusi.',
    images: [
      TRAVEL_IMAGES.hotels.titanic_beach_lara_1,
      TRAVEL_IMAGES.hotels.titanic_beach_lara_2,
      TRAVEL_IMAGES.hotels.titanic_beach_lara_3
    ],
    features: [
      'Erarand',
      'Spaa',
      'Mitu basseini',
      'Veepark',
      'Mitu restorani',
      'Spordivõimalused',
      'Lasteklubi'
    ],
    roomTypes: [
      {
        id: 'standard',
        name: 'Standard tuba',
        capacity: 2,
        description: 'Mugav tuba kahe voodiga, sobib kahele täiskasvanule'
      },
      {
        id: 'family',
        name: 'Peretuba',
        capacity: 4,
        description: 'Suur tuba, mis sobib perele kuni nelja inimesega'
      },
      {
        id: 'suite',
        name: 'Sviit',
        capacity: 2,
        description: 'Luksuslik sviit eraldi elutoa ja magamistoaga'
      }
    ],
    availableMealPlans: ['uai', 'ai', 'hb'],
    coordinates: {
      latitude: 36.8605,
      longitude: 30.8403
    }
  },
  {
    id: 'royal-holiday-palace',
    areaId: 'antalya',
    regionId: 'turkish-riviera',
    countryId: 'turkey',
    name: 'Royal Holiday Palace',
    slug: 'royal-holiday-palace',
    rating: 5,
    description: 'Luksuslik kuurorthotell Lara rannas, mis pakub ultra-kõik-hinnas teenust ja mitmekesiseid meelelahutusvõimalusi.',
    images: [
      TRAVEL_IMAGES.hotels.royal_holiday_palace_1,
      TRAVEL_IMAGES.hotels.royal_holiday_palace_2,
      TRAVEL_IMAGES.hotels.royal_holiday_palace_3
    ],
    features: [
      'Erarand',
      'Spaa',
      'Mitu basseini',
      'Veepark',
      'Mitu restorani',
      'Spordivõimalused',
      'Lasteklubi'
    ],
    roomTypes: [
      {
        id: 'standard',
        name: 'Standard tuba',
        capacity: 2,
        description: 'Mugav tuba kahe voodiga, sobib kahele täiskasvanule'
      },
      {
        id: 'family',
        name: 'Peretuba',
        capacity: 4,
        description: 'Suur tuba, mis sobib perele kuni nelja inimesega'
      },
      {
        id: 'suite',
        name: 'Sviit',
        capacity: 2,
        description: 'Luksuslik sviit eraldi elutoa ja magamistoaga'
      }
    ],
    availableMealPlans: ['uai', 'ai'],
    coordinates: {
      latitude: 36.8547,
      longitude: 30.8522
    }
  },
  
  // Alanya hotels
  {
    id: 'alaiye-resort',
    areaId: 'alanya',
    regionId: 'turkish-riviera',
    countryId: 'turkey',
    name: 'Alaiye Resort & Spa',
    slug: 'alaiye-resort',
    rating: 5,
    description: 'Luksuslik kuurorthotell Alanya lähedal, mis pakub kõik-hinnas teenust ja mitmekesiseid meelelahutusvõimalusi.',
    images: [
      TRAVEL_IMAGES.hotels.alaiye_resort_1,
      TRAVEL_IMAGES.hotels.alaiye_resort_2,
      TRAVEL_IMAGES.hotels.alaiye_resort_3
    ],
    features: [
      'Erarand',
      'Spaa',
      'Mitu basseini',
      'Mitu restorani',
      'Spordivõimalused',
      'Lasteklubi'
    ],
    roomTypes: [
      {
        id: 'standard',
        name: 'Standard tuba',
        capacity: 2,
        description: 'Mugav tuba kahe voodiga, sobib kahele täiskasvanule'
      },
      {
        id: 'family',
        name: 'Peretuba',
        capacity: 4,
        description: 'Suur tuba, mis sobib perele kuni nelja inimesega'
      }
    ],
    availableMealPlans: ['ai', 'hb', 'bb'],
    coordinates: {
      latitude: 36.5841,
      longitude: 31.9801
    }
  },
  {
    id: 'kleopatra-beach-hotel',
    areaId: 'alanya',
    regionId: 'turkish-riviera',
    countryId: 'turkey',
    name: 'Kleopatra Beach Hotel',
    slug: 'kleopatra-beach-hotel',
    rating: 4,
    description: 'Mugav hotell Kleopatra rannas, mis pakub head hinna ja kvaliteedi suhet.',
    images: [
      TRAVEL_IMAGES.hotels.kleopatra_beach_1,
      TRAVEL_IMAGES.hotels.kleopatra_beach_2,
      TRAVEL_IMAGES.hotels.kleopatra_beach_3
    ],
    features: [
      'Lähedal rannale',
      'Bassein',
      'Restoran',
      'Baar'
    ],
    roomTypes: [
      {
        id: 'standard',
        name: 'Standard tuba',
        capacity: 2,
        description: 'Mugav tuba kahe voodiga, sobib kahele täiskasvanule'
      },
      {
        id: 'family',
        name: 'Peretuba',
        capacity: 3,
        description: 'Suur tuba, mis sobib perele kuni kolme inimesega'
      }
    ],
    availableMealPlans: ['ai', 'hb', 'bb'],
    coordinates: {
      latitude: 36.5505,
      longitude: 31.9955
    }
  },
  
  // Hurghada hotels
  {
    id: 'steigenberger-al-dau-beach',
    areaId: 'hurghada',
    regionId: 'red-sea',
    countryId: 'egypt',
    name: 'Steigenberger Al Dau Beach',
    slug: 'steigenberger-al-dau-beach',
    rating: 5,
    description: 'Luksuslik kuurorthotell Hurghadas, mis pakub kõik-hinnas teenust ja mitmekesiseid meelelahutusvõimalusi.',
    images: [
      TRAVEL_IMAGES.hotels.steigenberger_al_dau_1,
      TRAVEL_IMAGES.hotels.steigenberger_al_dau_2,
      TRAVEL_IMAGES.hotels.steigenberger_al_dau_3
    ],
    features: [
      'Erarand',
      'Spaa',
      'Mitu basseini',
      'Golfiväljak',
      'Mitu restorani',
      'Spordivõimalused',
      'Lasteklubi'
    ],
    roomTypes: [
      {
        id: 'standard',
        name: 'Standard tuba',
        capacity: 2,
        description: 'Mugav tuba kahe voodiga, sobib kahele täiskasvanule'
      },
      {
        id: 'deluxe',
        name: 'Deluxe tuba',
        capacity: 2,
        description: 'Avaramate mõõtmetega tuba, sobib kahele täiskasvanule'
      },
      {
        id: 'suite',
        name: 'Sviit',
        capacity: 2,
        description: 'Luksuslik sviit eraldi elutoa ja magamistoaga'
      }
    ],
    availableMealPlans: ['uai', 'ai', 'hb'],
    coordinates: {
      latitude: 27.1858,
      longitude: 33.8244
    }
  },
  {
    id: 'sunrise-royal-makadi',
    areaId: 'hurghada',
    regionId: 'red-sea',
    countryId: 'egypt',
    name: 'Sunrise Royal Makadi Resort',
    slug: 'sunrise-royal-makadi',
    rating: 5,
    description: 'Luksuslik kuurorthotell Makadi Bay piirkonnas, mis pakub ultra-kõik-hinnas teenust ja mitmekesiseid meelelahutusvõimalusi.',
    images: [
      TRAVEL_IMAGES.hotels.sunrise_royal_makadi_1,
      TRAVEL_IMAGES.hotels.sunrise_royal_makadi_2,
      TRAVEL_IMAGES.hotels.sunrise_royal_makadi_3
    ],
    features: [
      'Erarand',
      'Spaa',
      'Mitu basseini',
      'Veepark',
      'Mitu restorani',
      'Spordivõimalused',
      'Lasteklubi'
    ],
    roomTypes: [
      {
        id: 'standard',
        name: 'Standard tuba',
        capacity: 2,
        description: 'Mugav tuba kahe voodiga, sobib kahele täiskasvanule'
      },
      {
        id: 'family',
        name: 'Peretuba',
        capacity: 4,
        description: 'Suur tuba, mis sobib perele kuni nelja inimesega'
      },
      {
        id: 'suite',
        name: 'Sviit',
        capacity: 2,
        description: 'Luksuslik sviit eraldi elutoa ja magamistoaga'
      }
    ],
    availableMealPlans: ['uai', 'ai'],
    coordinates: {
      latitude: 27.0233,
      longitude: 33.8955
    }
  }
  
  // Add more hotels as needed
];

/**
 * Helper function to get a hotel by ID
 * @param id Hotel ID
 * @returns Hotel object or undefined if not found
 */
export function getHotelById(id: string): Hotel | undefined {
  return hotels.find(hotel => hotel.id === id);
}

/**
 * Helper function to get a hotel by slug
 * @param slug Hotel slug
 * @returns Hotel object or undefined if not found
 */
export function getHotelBySlug(slug: string): Hotel | undefined {
  return hotels.find(hotel => hotel.slug === slug);
}

/**
 * Helper function to get hotels by area ID
 * @param areaId Area ID
 * @returns Array of hotels in the area
 */
export function getHotelsByArea(areaId: string): Hotel[] {
  return hotels.filter(hotel => hotel.areaId === areaId);
}

/**
 * Helper function to get hotels by region ID
 * @param regionId Region ID
 * @returns Array of hotels in the region
 */
export function getHotelsByRegion(regionId: string): Hotel[] {
  return hotels.filter(hotel => hotel.regionId === regionId);
}

/**
 * Helper function to get hotels by country ID
 * @param countryId Country ID
 * @returns Array of hotels in the country
 */
export function getHotelsByCountry(countryId: string): Hotel[] {
  return hotels.filter(hotel => hotel.countryId === countryId);
}

/**
 * Mock API function to fetch hotels
 * @returns Promise resolving to hotels array
 */
export async function fetchHotels(): Promise<Hotel[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return hotels;
}

/**
 * Mock API function to fetch hotels by area
 * @param areaId Area ID
 * @returns Promise resolving to filtered hotels array
 */
export async function fetchHotelsByArea(areaId: string): Promise<Hotel[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return getHotelsByArea(areaId);
}
