import {TRAVEL_IMAGES} from '@/utils/imageUtils';

export interface Continent {
  id: string;
  name: string;
  image: string;
  slug: string;
  description: string;
}

export interface Region {
  id: string;
  name: string;
  continentId: string;
  image: string;
  slug: string;
  description: string;
  popularDestinations: string[];  // City IDs
}

export interface City {
  id: string;
  name: string;
  regionId: string;
  image: string;
  slug: string;
  description: string;
  averagePrice: number;
  weatherInfo: {
    bestTimeToVisit: string;
    averageTemperature: string;
  };
  attractions: string[];
}

export interface Destination {
  name: string;
  image: string;
  price: string;
  slug: string;
}

export interface LastMinuteDeal extends Destination {
  duration: string;
  originalPrice: string;
}

export const continents: Continent[] = [
  {
    id: 'europe',
    name: 'Euroopa',
    image: TRAVEL_IMAGES.continents.europe,
    slug: 'europe',
    description: 'Avasta Euroopa mitmekesine kultuur, ajalooline arhitektuur ja kaasaegsed metropolid.'
  },
  {
    id: 'asia',
    name: 'Aasia',
    image: TRAVEL_IMAGES.continents.asia,
    slug: 'asia',
    description: 'Eksootilised rannad, iidsed templid ja maitsev köök ootavad Sind Aasias.'
  },
  {
    id: 'africa',
    name: 'Aafrika',
    image: TRAVEL_IMAGES.continents.africa,
    slug: 'africa',
    description: 'Aafrika on maailma suurim põhja-lõuna suundumine, mis kattub 60 kraadiga laiuskraadiga.'
  },
  {
    id: 'north-america',
    name: 'Põhja-Ameerika',
    image: TRAVEL_IMAGES.continents['north-america'],
    slug: 'north-america',
    description: 'Põhja-Ameerika on maailma suurim kontinent, mis kattub 100 kraadiga laiuskraadiga.'
  },
  {
    id: 'south-america',
    name: 'Lõuna-Ameerika',
    image: TRAVEL_IMAGES.continents['south-america'],
    slug: 'south-america',
    description: 'Lõuna-Ameerika on maailma suurim kontinent, mis kattub 52 kraadiga laiuskraadiga.'
  },
  {
    id: 'oceania',
    name: 'Okeaania',
    image: TRAVEL_IMAGES.continents.oceania,
    slug: 'oceania',
    description: 'Okeaania on maailma suurim kontinent, mis kattub 25 kraadiga laiuskraadiga.'
  }
];

export const regions: Region[] = [
  {
    id: 'mediterranean',
    name: 'Vahemere piirkond',
    continentId: 'europe',
    image: TRAVEL_IMAGES.regions.mediterranean,
    slug: 'mediterranean',
    description: 'Soe kliima, kristallselge vesi ja rikkalik ajalugu.',
    popularDestinations: ['antalya', 'rhodes', 'crete']
  },
  {
    id: 'atlantic',
    name: 'Atlantiline piirkond',
    continentId: 'europe',
    image: TRAVEL_IMAGES.regions.atlantic,
    slug: 'atlantic',
    description: 'Atlantiline piirkond on maailma suurim kontinent, mis kattub 100 kraadiga laiuskraadiga.',
    popularDestinations: ['london', 'paris', 'madrid']
  },
  {
    id: 'indian',
    name: 'Indian piirkond',
    continentId: 'asia',
    image: TRAVEL_IMAGES.regions.indian,
    slug: 'indian',
    description: 'Indian piirkond on maailma suurim kontinent, mis kattub 25 kraadiga laiuskraadiga.',
    popularDestinations: ['delhi', 'bangkok', 'tokyo']
  },
  {
    id: 'african',
    name: 'Aafrika piirkond',
    continentId: 'africa',
    image: TRAVEL_IMAGES.regions.african,
    slug: 'african',
    description: 'Aafrika piirkond on maailma suurim kontinent, mis kattub 60 kraadiga laiuskraadiga.',
    popularDestinations: ['cape-town', 'lagos', 'accra']
  },
  {
    id: 'north-american',
    name: 'Põhja-Ameerika piirkond',
    continentId: 'north-america',
    image: TRAVEL_IMAGES.regions['north-american'],
    slug: 'north-american',
    description: 'Põhja-Ameerika piirkond on maailma suurim kontinent, mis kattub 100 kraadiga laiuskraadiga.',
    popularDestinations: ['new-york', 'toronto', 'vancouver']
  },
  {
    id: 'south-american',
    name: 'Lõuna-Ameerika piirkond',
    continentId: 'south-america',
    image: TRAVEL_IMAGES.regions['south-american'],
    slug: 'south-american',
    description: 'Lõuna-Ameerika piirkond on maailma suurim kontinent, mis kattub 52 kraadiga laiuskraadiga.',
    popularDestinations: ['buenos-aires', 'santiago', 'sao-paulo']
  },
  {
    id: 'pacific',
    name: 'Tpacifiline piirkond',
    continentId: 'oceania',
    image: TRAVEL_IMAGES.regions.pacific,
    slug: 'pacific',
    description: 'Tpacifiline piirkond on maailma suurim kontinent, mis kattub 25 kraadiga laiuskraadiga.',
    popularDestinations: ['sydney', 'tokyo', 'auckland']
  },
  {
    id: 'australian',
    name: 'Ausstraliline piirkond',
    continentId: 'oceania',
    image: TRAVEL_IMAGES.regions.australian,
    slug: 'australian',
    description: 'Ausstraliline piirkond on maailma suurim kontinent, mis kattub 25 kraadiga laiuskraadiga.',
    popularDestinations: ['melbourne', 'perth', 'brisbane']
  }
];

export const cities: City[] = [
  {
    id: 'antalya',
    name: 'Antalya',
    regionId: 'mediterranean',
    image: TRAVEL_IMAGES.destinations.antalya,
    slug: 'antalya',
    description: 'Türgi Rivieira pärl, kus kohtuvad ajalugu ja kaasaegne mugavus.',
    averagePrice: 599,
    weatherInfo: {
      bestTimeToVisit: 'Mai-Oktoober',
      averageTemperature: '25°C'
    },
    attractions: ['Vanalinn', 'Düden kosk', 'Konyaalti rand']
  },
  {
    id: 'london',
    name: 'London',
    regionId: 'atlantic',
    image: TRAVEL_IMAGES.destinations.london,
    slug: 'london',
    description: 'Suur linn, mis asub Anglias pealinnas.',
    averagePrice: 799,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '15°C'
    },
    attractions: ['Big Ben', 'Tower of London', 'Buckingham Palace']
  },
  {
    id: 'paris',
    name: 'Paris',
    regionId: 'atlantic',
    image: TRAVEL_IMAGES.destinations.paris,
    slug: 'paris',
    description: 'Prantsuse pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 899,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '18°C'
    },
    attractions: ['Eiffeli torn', 'Louvre', 'Seine jõgi']
  },
  {
    id: 'madrid',
    name: 'Madrid',
    regionId: 'atlantic',
    image: TRAVEL_IMAGES.destinations.madrid,
    slug: 'madrid',
    description: 'Hispaania pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 699,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '20°C'
    },
    attractions: ['Puerta del Sol', 'El Prado', 'Retiro park']
  },
  {
    id: 'delhi',
    name: 'Delhi',
    regionId: 'indian',
    image: TRAVEL_IMAGES.destinations.delhi,
    slug: 'delhi',
    description: 'Indias pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 499,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '28°C'
    },
    attractions: ['Red Fort', 'Qutub Minar', 'Jama Masjid']
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    regionId: 'indian',
    image: TRAVEL_IMAGES.destinations.bangkok,
    slug: 'bangkok',
    description: 'Tailandi pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 599,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '27°C'
    },
    attractions: ['Wat Phra Kaew', 'Wat Arun', 'Khao San Road']
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    regionId: 'indian',
    image: TRAVEL_IMAGES.destinations.tokyo,
    slug: 'tokyo',
    description: 'Japani pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 799,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '22°C'
    },
    attractions: ['Tokyo Tower', 'Senso-ji', 'Shibuya Crossing']
  },
  {
    id: 'cape-town',
    name: 'Cape Town',
    regionId: 'african',
    image: TRAVEL_IMAGES.destinations['cape-town'],
    slug: 'cape-town',
    description: 'Süd-Aafrika pealinn, mis asub Lübis külgetorni külgedel.',
    averagePrice: 899,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '18°C'
    },
    attractions: ['Table Mountain', 'Robben Island', 'V&D Waterfront']
  },
  {
    id: 'lagos',
    name: 'Lagos',
    regionId: 'african',
    image: TRAVEL_IMAGES.destinations.lagos,
    slug: 'lagos',
    description: 'Nigeri pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 599,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '25°C'
    },
    attractions: ['National Museum', 'Eko Park', 'Lekki Conservation Centre']
  },
  {
    id: 'accra',
    name: 'Accra',
    regionId: 'african',
    image: TRAVEL_IMAGES.destinations.accra,
    slug: 'accra',
    description: 'Ghana pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 499,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '27°C'
    },
    attractions: ['National Museum', 'Kakum National Park', 'Labadi Beach']
  },
  {
    id: 'new-york',
    name: 'New York',
    regionId: 'north-american',
    image: TRAVEL_IMAGES.destinations['new-york'],
    slug: 'new-york',
    description: 'Ameerika Ühendriikide pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 999,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '20°C'
    },
    attractions: ['Times Square', 'Statue of Liberty', 'Central Park']
  },
  {
    id: 'toronto',
    name: 'Toronto',
    regionId: 'north-american',
    image: TRAVEL_IMAGES.destinations.toronto,
    slug: 'toronto',
    description: 'Kanada pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 899,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '18°C'
    },
    attractions: ['CN Tower', 'Royal Ontario Museum', 'Toronto Islands']
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    regionId: 'north-american',
    image: TRAVEL_IMAGES.destinations.vancouver,
    slug: 'vancouver',
    description: 'Kanada pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 799,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '15°C'
    },
    attractions: ['Stanley Park', 'Granville Island', 'Grouse Mountain']
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    regionId: 'south-american',
    image: TRAVEL_IMAGES.destinations['buenos-aires'],
    slug: 'buenos-aires',
    description: 'Argentiina pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 699,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '18°C'
    },
    attractions: ['Teatro Colón', 'Plaza de Mayo', 'Recoleta Cemetery']
  },
  {
    id: 'santiago',
    name: 'Santiago',
    regionId: 'south-american',
    image: TRAVEL_IMAGES.destinations.santiago,
    slug: 'santiago',
    description: 'Chili pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 599,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '17°C'
    },
    attractions: ['Plaza de Armas', 'San Cristóbal Hill', 'La Moneda']
  },
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    regionId: 'south-american',
    image: TRAVEL_IMAGES.destinations['sao-paulo'],
    slug: 'sao-paulo',
    description: 'Brasiilia pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 799,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '22°C'
    },
    attractions: ['São Paulo Cathedral', 'Ibirapuera Park', 'MASP']
  },
  {
    id: 'sydney',
    name: 'Sydney',
    regionId: 'pacific',
    image: TRAVEL_IMAGES.destinations.sydney,
    slug: 'sydney',
    description: 'Austraalia pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 899,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '20°C'
    },
    attractions: ['Sydney Opera House', 'Sydney Harbour Bridge', 'Bondi Beach']
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    regionId: 'pacific',
    image: TRAVEL_IMAGES.destinations.tokyo,
    slug: 'tokyo',
    description: 'Japani pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 799,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '22°C'
    },
    attractions: ['Tokyo Tower', 'Senso-ji', 'Shibuya Crossing']
  },
  {
    id: 'auckland',
    name: 'Auckland',
    regionId: 'pacific',
    image: TRAVEL_IMAGES.destinations.auckland,
    slug: 'auckland',
    description: 'Nova-Mere pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 799,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '18°C'
    },
    attractions: ['Sky Tower', 'Auckland Museum', 'Viaduct Harbour']
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    regionId: 'pacific',
    image: TRAVEL_IMAGES.destinations.melbourne,
    slug: 'melbourne',
    description: 'Austraalia pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 699,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '18°C'
    },
    attractions: ['Flinders Street Station', 'Royal Botanic Garden', 'South Melbourne Market']
  },
  {
    id: 'perth',
    name: 'Perth',
    regionId: 'pacific',
    image: TRAVEL_IMAGES.destinations.perth,
    slug: 'perth',
    description: 'Austraalia pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 599,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '18°C'
    },
    attractions: ['Kings Park', 'Perth Zoo', 'Fremantle Markets']
  },
  {
    id: 'brisbane',
    name: 'Brisbane',
    regionId: 'pacific',
    image: TRAVEL_IMAGES.destinations.brisbane,
    slug: 'brisbane',
    description: 'Austraalia pealinn, mis on tuntud ka kui "Linn, kus kõik on võimalik".',
    averagePrice: 599,
    weatherInfo: {
      bestTimeToVisit: 'Kevad-Autumn',
      averageTemperature: '20°C'
    },
    attractions: ['Brisbane River', 'City Botanic Gardens', 'South Brisbane Markets']
  }
];

export const popularDestinations: Destination[] = [
  { name: "Bali", image: TRAVEL_IMAGES.destinations.bali, price: "€599", slug: "bali" },
  { name: "Maldiivid", image: TRAVEL_IMAGES.destinations.maldives, price: "€899", slug: "maldives" },
  { name: "Dubai", image: TRAVEL_IMAGES.destinations.dubai, price: "€699", slug: "dubai" },
  { name: "Tenerife", image: TRAVEL_IMAGES.destinations.tenerife, price: "€499", slug: "tenerife" },
  { name: "Phuket", image: TRAVEL_IMAGES.destinations.phuket, price: "€799", slug: "phuket" },
  { name: "Mauritius", image: TRAVEL_IMAGES.destinations.mauritius, price: "€999", slug: "mauritius" },
  { name: "Seišellid", image: TRAVEL_IMAGES.destinations.seychelles, price: "€1099", slug: "seychelles" },
  { name: "Cancun", image: TRAVEL_IMAGES.destinations.cancun, price: "€899", slug: "cancun" },
  { name: "Santorini", image: TRAVEL_IMAGES.destinations.santorini, price: "€599", slug: "santorini" }
];

export const lastMinuteDeals: LastMinuteDeal[] = [
  {
    name: "Maldiivid",
    image: TRAVEL_IMAGES.destinations.maldives,
    price: "€799",
    originalPrice: "€1299",
    duration: "7 ööd, All Inclusive",
    slug: "maldives-last-minute"
  },
  {
    name: "Dubai",
    image: TRAVEL_IMAGES.destinations.dubai,
    price: "€499",
    originalPrice: "€899",
    duration: "5 ööd, Hommikusöögiga",
    slug: "dubai-last-minute"
  },
  {
    name: "Tenerife",
    image: TRAVEL_IMAGES.destinations.tenerife,
    price: "€399",
    originalPrice: "€699",
    duration: "7 ööd, All Inclusive",
    slug: "tenerife-last-minute"
  }
];
