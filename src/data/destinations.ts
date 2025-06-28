import { TRAVEL_IMAGES } from '@/utils/imageUtils';

// 1. Põhistruktuur
// interface Continent { ... }
// interface Country { ... }
// interface Area { ... }

interface Hotel {
  id: string;
  name: string;
  resortId: string;
  rating: number;
  description: string;
  images: string[];
  features: string[];
  roomTypes: RoomType[];
  mealPlans: MealPlan[];
}

interface RoomType {
  id: string;
  name: string;
  capacity: number;
  description: string;
}

interface MealPlan {
  id: string;
  name: string;
  code: string;  // AI, HB, BB jne
  description: string;
}

// Kasuta ainult neid eksporditavaid interface'e
export interface Country {
  id: string;
  name: string;
  image: string;
  continentId: string;
  description: string;
  departureCities: string[];
  areas?: Area[];  // Teeme valikuliseks, et olemasolevad andmed töötaks
}

export interface Area {
  id: string;
  name: string;
  countryId: string;
  description: string;
  image: string;
  resorts?: Resort[];  // Teeme valikuliseks
  subAreas?: SubArea[];
}

export interface Resort {
  id: string;
  name: string;
  areaId: string;
  countryId: string;
  image: string;
  description: string;
  weatherInfo: {
    bestTimeToVisit: string;
    averageTemperature: string;
  };
  attractions: string[];
}

export interface SubArea {
  id: string;
  name: string;
  description: string;
}

export const countries: Country[] = [
  {
    id: 'egypt',
    name: 'Egiptus',
    image: TRAVEL_IMAGES.destinations.egypt,
    continentId: 'africa',
    description: 'Iidne kultuur ja kaasaegsed kuurordid',
    departureCities: ['tallinn', 'riga']
  },
  {
    id: 'turkey',
    name: 'Türgi',
    image: TRAVEL_IMAGES.destinations.turkey,
    continentId: 'asia',
    description: 'Türgi Rivieira - soe meri ja külalislahke rahvas',
    departureCities: ['tallinn', 'riga']
  }
];

export const areas: Area[] = [
  {
    id: 'turkish-riviera',
    name: 'Türgi Riviiera',
    countryId: 'turkey',
    description: 'Kaunid rannad ja ajalooline pärand',
    image: TRAVEL_IMAGES.areas.turkish_riviera,
    subAreas: [
      {
        id: 'antalya-region',
        name: 'Antalya',
        description: 'Türgi Riviiera pärl'
      },
      {
        id: 'alanya-region',
        name: 'Alanya',
        description: 'Ajalooline kuurortlinn'
      }
    ]
  },
  {
    id: 'hurghada-region',
    name: 'Hurghada',
    countryId: 'egypt',
    description: 'Hurghada piirkond',
    image: TRAVEL_IMAGES.areas.hurghada,
    subAreas: [
      {
        id: 'el-gouna',
        name: 'El Gouna',
        description: 'Luksuslik kuurortlinn',
      },
      {
        id: 'hurghada-city',
        name: 'Hurghada',
        description: 'Peamine kuurortlinn',
      },
      {
        id: 'madinat-makadi',
        name: 'Madinat Makadi',
        description: 'Rahulik kuurortpiirkond',
      },
      {
        id: 'makadi-bay',
        name: 'Makadi Bay',
        description: 'Kaunis lahepiirkond',
      },
      {
        id: 'safaga',
        name: 'Safaga',
        description: 'Ajalooline sadamalinn',
      },
      {
        id: 'sahl-hasheesh',
        name: 'Sahl Hasheesh',
        description: 'Luksuslik kuurortpiirkond',
      }
    ]
  }
];

export const resorts: Resort[] = [
  {
    id: 'hurghada',
    name: 'Hurghada',
    areaId: 'red-sea-egypt',
    countryId: 'egypt',
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
    name: 'Sharm el Sheikh',
    areaId: 'red-sea-egypt',
    countryId: 'egypt',
    image: TRAVEL_IMAGES.resorts.sharm,
    description: 'Luksuslik kuurort Siinai poolsaarel',
    weatherInfo: {
      bestTimeToVisit: 'September-Mai',
      averageTemperature: '27°C'
    },
    attractions: ['Ras Mohammed rahvuspark', 'Naama Bay', 'Tiran saar']
  },
  {
    id: 'antalya',
    name: 'Antalya',
    areaId: 'turkish-riviera',
    countryId: 'turkey',
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
    name: 'Alanya',
    areaId: 'turkish-riviera',
    countryId: 'turkey',
    image: TRAVEL_IMAGES.resorts.alanya,
    description: 'Ajalooline kuurortlinn',
    weatherInfo: {
      bestTimeToVisit: 'Mai-September',
      averageTemperature: '24°C'
    },
    attractions: ['Alanya kindlus', 'Kleopatra rand', 'Dim koobas']
  }
];

// Mock API calls
export async function fetchCountries() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return countries;
}

export async function fetchAreas() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return areas;
}

export async function fetchResorts() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return resorts;
}

export function getDestinationName(destinationId: string): string {
  return countries.find(country => country.id === destinationId)?.name || destinationId;
} 