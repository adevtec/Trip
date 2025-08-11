import { TRAVEL_IMAGES } from "@/utils/imageUtils";

// Põhistruktuur
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
  code: string; // AI, HB, BB jne
  description: string;
}

// Kasutavad interface'id
export interface Country {
  id: string;
  name: string;
  image: string;
  continentId: string;
  description: string;
  departureCities: string[];
  areas?: Area[];
}

export interface Area {
  id: string;
  name: string;
  countryId: string;
  description: string;
  image: string;
  resorts?: Resort[];
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
    id: "egypt",
    name: "Egiptus",
    image: TRAVEL_IMAGES.destinations.egypt,
    continentId: "africa",
    description: "Iidne kultuur ja kaasaegsed kuurordid",
    departureCities: ["tallinn", "riga"],
  },
  {
    id: "turkey",
    name: "Türgi",
    image: TRAVEL_IMAGES.destinations.turkey,
    continentId: "asia",
    description: "Türgi Rivieria - soe meri ja külalislahke rahvas",
    departureCities: ["tallinn", "riga"],
  },
  {
    id: "greece",
    name: "Kreeka",
    image: TRAVEL_IMAGES.destinations.greece,
    continentId: "europe",
    description: "Antiiksed templid ja saareparadiis",
    departureCities: ["tallinn", "riga"],
  },
  {
    id: "spain",
    name: "Hispaania",
    image: TRAVEL_IMAGES.destinations.spain,
    continentId: "europe",
    description: "Soe kliima ja rikkalik kultuur",
    departureCities: ["tallinn", "riga"],
  },
  {
    id: "italy",
    name: "Itaalia",
    image: TRAVEL_IMAGES.destinations.italy,
    continentId: "europe",
    description: "Kunsti ja kultuuri keskus",
    departureCities: ["tallinn", "riga"],
  },
  {
    id: "cyprus",
    name: "Küpros",
    image: TRAVEL_IMAGES.destinations.cyprus,
    continentId: "europe",
    description: "Armastuseisland Vahemere südes",
    departureCities: ["tallinn", "riga"],
  },
  {
    id: "bulgaria",
    name: "Bulgaaria",
    image: TRAVEL_IMAGES.destinations.bulgaria,
    continentId: "europe",
    description: "Mustamere kuurordid ja mäestik",
    departureCities: ["tallinn", "riga"],
  },
  {
    id: "thailand",
    name: "Tai",
    image: TRAVEL_IMAGES.destinations.thailand,
    continentId: "asia",
    description: "Troopiline paradiis Aasias",
    departureCities: ["tallinn", "riga"],
  },
];

export const areas: Area[] = [
  {
    id: "turkish-riviera",
    name: "Türgi Riviiera",
    countryId: "turkey",
    description: "Kaunid rannad ja ajalooline pärand",
    image: TRAVEL_IMAGES.areas.turkish_riviera,
    subAreas: [
      {
        id: "antalya-region",
        name: "Antalya",
        description: "Türgi Riviiera pärl",
      },
      {
        id: "alanya-region",
        name: "Alanya",
        description: "Ajalooline kuurortlinn",
      },
    ],
  },
  {
    id: "hurghada-region",
    name: "Hurghada",
    countryId: "egypt",
    description: "Hurghada piirkond",
    image: TRAVEL_IMAGES.areas.hurghada,
    subAreas: [
      {
        id: "el-gouna",
        name: "El Gouna",
        description: "Luksuslik kuurortlinn",
      },
      {
        id: "hurghada-city",
        name: "Hurghada",
        description: "Peamine kuurortlinn",
      },
      {
        id: "madinat-makadi",
        name: "Madinat Makadi",
        description: "Rahulik kuurortpiirkond",
      },
      {
        id: "makadi-bay",
        name: "Makadi Bay",
        description: "Kaunis lahepiirkond",
      },
      {
        id: "safaga",
        name: "Safaga",
        description: "Ajalooline sadamalinn",
      },
      {
        id: "sahl-hasheesh",
        name: "Sahl Hasheesh",
        description: "Luksuslik kuurortpiirkond",
      },
    ],
  },
  {
    id: "sharm-el-sheikh",
    name: "Sharm el Sheikh",
    countryId: "egypt",
    description: "Siinai poolsaare kuurortpiirkond",
    image: TRAVEL_IMAGES.areas.red_sea,
    subAreas: [
      {
        id: "naama-bay",
        name: "Naama Bay",
        description: "Peamine turismipiirkond",
      },
      {
        id: "sharks-bay",
        name: "Sharks Bay",
        description: "Kaunis sukeldumispaik",
      },
    ],
  },
  {
    id: "crete",
    name: "Kreeta",
    countryId: "greece",
    description: "Kreeka suurim saar",
    image: TRAVEL_IMAGES.areas.crete,
    subAreas: [
      {
        id: "heraklion",
        name: "Heraklion",
        description: "Saare pealinn",
      },
      {
        id: "chania",
        name: "Chania",
        description: "Ajalooline sadamalinn",
      },
    ],
  },
  {
    id: "rhodes",
    name: "Rhodos",
    countryId: "greece",
    description: "Rüütlisaar",
    image: TRAVEL_IMAGES.areas.rhodes,
    subAreas: [
      {
        id: "rhodes-town",
        name: "Rhodose linn",
        description: "Keskaegne linn",
      },
      {
        id: "faliraki",
        name: "Faliraki",
        description: "Populaarne kuurort",
      },
    ],
  },
  {
    id: "canary-islands",
    name: "Kanaari saared",
    countryId: "spain",
    description: "Troopilised saared Atlandi ookeanis",
    image: TRAVEL_IMAGES.areas.canary_islands,
    subAreas: [
      {
        id: "tenerife",
        name: "Tenerife",
        description: "Suurim Kanaari saar",
      },
      {
        id: "gran-canaria",
        name: "Gran Canaria",
        description: "Minimaailmak",
      },
    ],
  },
  {
    id: "costa-del-sol",
    name: "Costa del Sol",
    countryId: "spain",
    description: "Päikeseline rannik",
    image: TRAVEL_IMAGES.areas.costa_del_sol,
    subAreas: [
      {
        id: "marbella",
        name: "Marbella",
        description: "Luksuslik kuurortlinn",
      },
      {
        id: "torremolinos",
        name: "Torremolinos",
        description: "Elav ööelu",
      },
    ],
  },
  {
    id: "amalfi-coast",
    name: "Amalfi rannik",
    countryId: "italy",
    description: "Üks maailma kauneimaid ranniku",
    image: TRAVEL_IMAGES.areas.costa_del_sol,
    subAreas: [
      {
        id: "positano",
        name: "Positano",
        description: "Vertikaal linn",
      },
      {
        id: "amalfi",
        name: "Amalfi",
        description: "Ajalooline mereväelinn",
      },
    ],
  },
  {
    id: "ayia-napa",
    name: "Ayia Napa",
    countryId: "cyprus",
    description: "Noorte armastatud kuurort",
    image: TRAVEL_IMAGES.areas.ayia_napa,
    subAreas: [
      {
        id: "nissi-beach",
        name: "Nissi Beach",
        description: "Kuulus rand",
      },
    ],
  },
  {
    id: "paphos",
    name: "Paphos",
    countryId: "cyprus",
    description: "Armastuseisland ja kultuurilinnad",
    image: TRAVEL_IMAGES.areas.paphos,
    subAreas: [
      {
        id: "coral-bay",
        name: "Coral Bay",
        description: "Perekondlik rand",
      },
    ],
  },
  {
    id: "sunny-beach",
    name: "Sunny Beach",
    countryId: "bulgaria",
    description: "Mustamere suurim kuurort",
    image: TRAVEL_IMAGES.areas.sunny_beach,
    subAreas: [
      {
        id: "nessebar",
        name: "Nessebar",
        description: "UNESCO maailmapärand",
      },
    ],
  },
  {
    id: "phuket",
    name: "Phuket",
    countryId: "thailand",
    description: "Tai lõunaosa pärl",
    image: TRAVEL_IMAGES.areas.phuket,
    subAreas: [
      {
        id: "patong",
        name: "Patong",
        description: "Elav ööelu ja rand",
      },
      {
        id: "kata",
        name: "Kata",
        description: "Rahulik perekondlik piirkond",
      },
    ],
  },
];

export const resorts: Resort[] = [
  {
    id: "antalya-kemer",
    name: "Kemer",
    areaId: "turkish-riviera",
    countryId: "turkey",
    image: TRAVEL_IMAGES.resorts.antalya,
    description: "Mägede ja mere vahel asuv kuurort",
    weatherInfo: {
      bestTimeToVisit: "Mai - oktoober",
      averageTemperature: "25°C",
    },
    attractions: ["Antalya vanalinn", "Kemer Marina", "Göynük kanjon"],
  },
  {
    id: "hurghada-main",
    name: "Hurghada",
    areaId: "hurghada-region",
    countryId: "egypt",
    image: TRAVEL_IMAGES.resorts.hurghada,
    description: "Sukeldumise ja snorgeldamise paradiis",
    weatherInfo: {
      bestTimeToVisit: "Oktoober - aprill",
      averageTemperature: "28°C",
    },
    attractions: ["Giftun saared", "Hurghada Marina", "Korallrahud"],
  },
  {
    id: "sharm-main",
    name: "Sharm el Sheikh",
    areaId: "sharm-el-sheikh",
    countryId: "egypt",
    image: TRAVEL_IMAGES.resorts.sharm,
    description: "Siinai poolsaare kuurortlinnad",
    weatherInfo: {
      bestTimeToVisit: "September - mai",
      averageTemperature: "26°C",
    },
    attractions: ["Ras Mohammed", "Naama Bay", "St. Catherine klooster"],
  },
];
