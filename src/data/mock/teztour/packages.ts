import { TravelPackage } from '@/types/destinations';

/**
 * Mock data for Tez Tour travel packages
 * These are agency-specific and reference common data (hotels, meal plans, etc.)
 */
export const tezTourPackages: TravelPackage[] = [
  // Titanic Beach Lara packages
  {
    id: 'tez-titanic-beach-lara-1',
    hotelId: 'titanic-beach-lara',
    agencyId: 'teztour',
    departureCity: 'tallinn',
    departureDate: '2023-07-16T11:00:00Z',
    returnDate: '2023-07-23T19:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'ai',
    price: 879,
    pricePerPerson: 439.5,
    available: true,
    deepLink: 'https://teztour.ee/package/tez-titanic-beach-lara-1'
  },
  {
    id: 'tez-titanic-beach-lara-2',
    hotelId: 'titanic-beach-lara',
    agencyId: 'teztour',
    departureCity: 'tallinn',
    departureDate: '2023-07-23T11:00:00Z',
    returnDate: '2023-07-30T19:00:00Z',
    nights: 7,
    roomType: 'family',
    mealPlan: 'ai',
    price: 1279,
    pricePerPerson: 319.75, // For 4 people
    available: true,
    deepLink: 'https://teztour.ee/package/tez-titanic-beach-lara-2'
  },
  {
    id: 'tez-titanic-beach-lara-3',
    hotelId: 'titanic-beach-lara',
    agencyId: 'teztour',
    departureCity: 'riga',
    departureDate: '2023-07-19T09:00:00Z',
    returnDate: '2023-07-26T17:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'ai',
    price: 829,
    pricePerPerson: 414.5,
    originalPrice: 979,
    discount: 15,
    available: true,
    deepLink: 'https://teztour.ee/package/tez-titanic-beach-lara-3'
  },
  
  // Royal Holiday Palace packages
  {
    id: 'tez-royal-holiday-palace-1',
    hotelId: 'royal-holiday-palace',
    agencyId: 'teztour',
    departureCity: 'tallinn',
    departureDate: '2023-07-16T11:00:00Z',
    returnDate: '2023-07-23T19:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'uai',
    price: 979,
    pricePerPerson: 489.5,
    available: true,
    deepLink: 'https://teztour.ee/package/tez-royal-holiday-palace-1'
  },
  {
    id: 'tez-royal-holiday-palace-2',
    hotelId: 'royal-holiday-palace',
    agencyId: 'teztour',
    departureCity: 'tallinn',
    departureDate: '2023-07-23T11:00:00Z',
    returnDate: '2023-08-02T19:00:00Z',
    nights: 10,
    roomType: 'family',
    mealPlan: 'uai',
    price: 1779,
    pricePerPerson: 444.75, // For 4 people
    available: true,
    deepLink: 'https://teztour.ee/package/tez-royal-holiday-palace-2'
  },
  
  // Alaiye Resort packages
  {
    id: 'tez-alaiye-resort-1',
    hotelId: 'alaiye-resort',
    agencyId: 'teztour',
    departureCity: 'tallinn',
    departureDate: '2023-07-16T11:00:00Z',
    returnDate: '2023-07-23T19:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'ai',
    price: 779,
    pricePerPerson: 389.5,
    available: true,
    deepLink: 'https://teztour.ee/package/tez-alaiye-resort-1'
  },
  {
    id: 'tez-alaiye-resort-2',
    hotelId: 'alaiye-resort',
    agencyId: 'teztour',
    departureCity: 'riga',
    departureDate: '2023-07-19T09:00:00Z',
    returnDate: '2023-07-26T17:00:00Z',
    nights: 7,
    roomType: 'family',
    mealPlan: 'ai',
    price: 1179,
    pricePerPerson: 294.75, // For 4 people
    originalPrice: 1379,
    discount: 14,
    available: true,
    deepLink: 'https://teztour.ee/package/tez-alaiye-resort-2'
  },
  
  // Kleopatra Beach Hotel packages
  {
    id: 'tez-kleopatra-beach-hotel-1',
    hotelId: 'kleopatra-beach-hotel',
    agencyId: 'teztour',
    departureCity: 'tallinn',
    departureDate: '2023-07-16T11:00:00Z',
    returnDate: '2023-07-23T19:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'hb',
    price: 579,
    pricePerPerson: 289.5,
    available: true,
    deepLink: 'https://teztour.ee/package/tez-kleopatra-beach-hotel-1'
  },
  {
    id: 'tez-kleopatra-beach-hotel-2',
    hotelId: 'kleopatra-beach-hotel',
    agencyId: 'teztour',
    departureCity: 'tallinn',
    departureDate: '2023-07-23T11:00:00Z',
    returnDate: '2023-07-30T19:00:00Z',
    nights: 7,
    roomType: 'family',
    mealPlan: 'ai',
    price: 779,
    pricePerPerson: 259.67, // For 3 people
    originalPrice: 879,
    discount: 11,
    available: true,
    deepLink: 'https://teztour.ee/package/tez-kleopatra-beach-hotel-2'
  },
  
  // Steigenberger Al Dau Beach packages
  {
    id: 'tez-steigenberger-al-dau-beach-1',
    hotelId: 'steigenberger-al-dau-beach',
    agencyId: 'teztour',
    departureCity: 'tallinn',
    departureDate: '2023-09-11T13:00:00Z',
    returnDate: '2023-09-18T21:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'ai',
    price: 979,
    pricePerPerson: 489.5,
    available: true,
    deepLink: 'https://teztour.ee/package/tez-steigenberger-al-dau-beach-1'
  },
  {
    id: 'tez-steigenberger-al-dau-beach-2',
    hotelId: 'steigenberger-al-dau-beach',
    agencyId: 'teztour',
    departureCity: 'tallinn',
    departureDate: '2023-09-18T13:00:00Z',
    returnDate: '2023-09-28T21:00:00Z',
    nights: 10,
    roomType: 'deluxe',
    mealPlan: 'ai',
    price: 1479,
    pricePerPerson: 739.5,
    available: true,
    deepLink: 'https://teztour.ee/package/tez-steigenberger-al-dau-beach-2'
  },
  
  // Sunrise Royal Makadi packages
  {
    id: 'tez-sunrise-royal-makadi-1',
    hotelId: 'sunrise-royal-makadi',
    agencyId: 'teztour',
    departureCity: 'tallinn',
    departureDate: '2023-09-11T13:00:00Z',
    returnDate: '2023-09-18T21:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'uai',
    price: 879,
    pricePerPerson: 439.5,
    available: true,
    deepLink: 'https://teztour.ee/package/tez-sunrise-royal-makadi-1'
  },
  {
    id: 'tez-sunrise-royal-makadi-2',
    hotelId: 'sunrise-royal-makadi',
    agencyId: 'teztour',
    departureCity: 'riga',
    departureDate: '2023-09-14T11:00:00Z',
    returnDate: '2023-09-21T19:00:00Z',
    nights: 7,
    roomType: 'family',
    mealPlan: 'uai',
    price: 1279,
    pricePerPerson: 319.75, // For 4 people
    originalPrice: 1479,
    discount: 13,
    available: true,
    deepLink: 'https://teztour.ee/package/tez-sunrise-royal-makadi-2'
  }
];

/**
 * Helper function to get a Tez Tour package by ID
 * @param id Package ID
 * @returns Package object or undefined if not found
 */
export function getTezTourPackageById(id: string): TravelPackage | undefined {
  return tezTourPackages.find(pkg => pkg.id === id);
}

/**
 * Helper function to get Tez Tour packages by hotel ID
 * @param hotelId Hotel ID
 * @returns Array of packages for the hotel
 */
export function getTezTourPackagesByHotel(hotelId: string): TravelPackage[] {
  return tezTourPackages.filter(pkg => pkg.hotelId === hotelId);
}

/**
 * Helper function to get Tez Tour packages by departure city
 * @param departureCity Departure city ID
 * @returns Array of packages from the departure city
 */
export function getTezTourPackagesByDepartureCity(departureCity: string): TravelPackage[] {
  return tezTourPackages.filter(pkg => pkg.departureCity === departureCity);
}

/**
 * Mock API function to fetch Tez Tour packages
 * @returns Promise resolving to packages array
 */
export async function fetchTezTourPackages(): Promise<TravelPackage[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return tezTourPackages;
}
