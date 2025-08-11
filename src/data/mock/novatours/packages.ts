import { TravelPackage } from '@/types/destinations';

/**
 * Mock data for Novatours travel packages
 * These are agency-specific and reference common data (hotels, meal plans, etc.)
 */
export const novatoursPackages: TravelPackage[] = [
  // Titanic Beach Lara packages
  {
    id: 'nova-titanic-beach-lara-1',
    hotelId: 'titanic-beach-lara',
    agencyId: 'novatours',
    departureCity: 'tallinn',
    departureDate: '2023-07-15T10:00:00Z',
    returnDate: '2023-07-22T18:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'ai',
    price: 899,
    pricePerPerson: 449.5,
    available: true,
    deepLink: 'https://novatours.ee/package/nova-titanic-beach-lara-1'
  },
  {
    id: 'nova-titanic-beach-lara-2',
    hotelId: 'titanic-beach-lara',
    agencyId: 'novatours',
    departureCity: 'tallinn',
    departureDate: '2023-07-22T10:00:00Z',
    returnDate: '2023-07-29T18:00:00Z',
    nights: 7,
    roomType: 'family',
    mealPlan: 'ai',
    price: 1299,
    pricePerPerson: 324.75, // For 4 people
    available: true,
    deepLink: 'https://novatours.ee/package/nova-titanic-beach-lara-2'
  },
  {
    id: 'nova-titanic-beach-lara-3',
    hotelId: 'titanic-beach-lara',
    agencyId: 'novatours',
    departureCity: 'riga',
    departureDate: '2023-07-18T08:00:00Z',
    returnDate: '2023-07-25T16:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'ai',
    price: 849,
    pricePerPerson: 424.5,
    originalPrice: 999,
    discount: 15,
    available: true,
    deepLink: 'https://novatours.ee/package/nova-titanic-beach-lara-3'
  },
  
  // Royal Holiday Palace packages
  {
    id: 'nova-royal-holiday-palace-1',
    hotelId: 'royal-holiday-palace',
    agencyId: 'novatours',
    departureCity: 'tallinn',
    departureDate: '2023-07-15T10:00:00Z',
    returnDate: '2023-07-22T18:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'uai',
    price: 999,
    pricePerPerson: 499.5,
    available: true,
    deepLink: 'https://novatours.ee/package/nova-royal-holiday-palace-1'
  },
  {
    id: 'nova-royal-holiday-palace-2',
    hotelId: 'royal-holiday-palace',
    agencyId: 'novatours',
    departureCity: 'tallinn',
    departureDate: '2023-07-22T10:00:00Z',
    returnDate: '2023-08-01T18:00:00Z',
    nights: 10,
    roomType: 'family',
    mealPlan: 'uai',
    price: 1799,
    pricePerPerson: 449.75, // For 4 people
    available: true,
    deepLink: 'https://novatours.ee/package/nova-royal-holiday-palace-2'
  },
  
  // Alaiye Resort packages
  {
    id: 'nova-alaiye-resort-1',
    hotelId: 'alaiye-resort',
    agencyId: 'novatours',
    departureCity: 'tallinn',
    departureDate: '2023-07-15T10:00:00Z',
    returnDate: '2023-07-22T18:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'ai',
    price: 799,
    pricePerPerson: 399.5,
    available: true,
    deepLink: 'https://novatours.ee/package/nova-alaiye-resort-1'
  },
  {
    id: 'nova-alaiye-resort-2',
    hotelId: 'alaiye-resort',
    agencyId: 'novatours',
    departureCity: 'riga',
    departureDate: '2023-07-18T08:00:00Z',
    returnDate: '2023-07-25T16:00:00Z',
    nights: 7,
    roomType: 'family',
    mealPlan: 'ai',
    price: 1199,
    pricePerPerson: 299.75, // For 4 people
    originalPrice: 1399,
    discount: 14,
    available: true,
    deepLink: 'https://novatours.ee/package/nova-alaiye-resort-2'
  },
  
  // Kleopatra Beach Hotel packages
  {
    id: 'nova-kleopatra-beach-hotel-1',
    hotelId: 'kleopatra-beach-hotel',
    agencyId: 'novatours',
    departureCity: 'tallinn',
    departureDate: '2023-07-15T10:00:00Z',
    returnDate: '2023-07-22T18:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'hb',
    price: 599,
    pricePerPerson: 299.5,
    available: true,
    deepLink: 'https://novatours.ee/package/nova-kleopatra-beach-hotel-1'
  },
  {
    id: 'nova-kleopatra-beach-hotel-2',
    hotelId: 'kleopatra-beach-hotel',
    agencyId: 'novatours',
    departureCity: 'tallinn',
    departureDate: '2023-07-22T10:00:00Z',
    returnDate: '2023-07-29T18:00:00Z',
    nights: 7,
    roomType: 'family',
    mealPlan: 'ai',
    price: 799,
    pricePerPerson: 266.33, // For 3 people
    originalPrice: 899,
    discount: 11,
    available: true,
    deepLink: 'https://novatours.ee/package/nova-kleopatra-beach-hotel-2'
  },
  
  // Steigenberger Al Dau Beach packages
  {
    id: 'nova-steigenberger-al-dau-beach-1',
    hotelId: 'steigenberger-al-dau-beach',
    agencyId: 'novatours',
    departureCity: 'tallinn',
    departureDate: '2023-09-10T12:00:00Z',
    returnDate: '2023-09-17T20:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'ai',
    price: 999,
    pricePerPerson: 499.5,
    available: true,
    deepLink: 'https://novatours.ee/package/nova-steigenberger-al-dau-beach-1'
  },
  {
    id: 'nova-steigenberger-al-dau-beach-2',
    hotelId: 'steigenberger-al-dau-beach',
    agencyId: 'novatours',
    departureCity: 'tallinn',
    departureDate: '2023-09-17T12:00:00Z',
    returnDate: '2023-09-27T20:00:00Z',
    nights: 10,
    roomType: 'deluxe',
    mealPlan: 'ai',
    price: 1499,
    pricePerPerson: 749.5,
    available: true,
    deepLink: 'https://novatours.ee/package/nova-steigenberger-al-dau-beach-2'
  },
  
  // Sunrise Royal Makadi packages
  {
    id: 'nova-sunrise-royal-makadi-1',
    hotelId: 'sunrise-royal-makadi',
    agencyId: 'novatours',
    departureCity: 'tallinn',
    departureDate: '2023-09-10T12:00:00Z',
    returnDate: '2023-09-17T20:00:00Z',
    nights: 7,
    roomType: 'standard',
    mealPlan: 'uai',
    price: 899,
    pricePerPerson: 449.5,
    available: true,
    deepLink: 'https://novatours.ee/package/nova-sunrise-royal-makadi-1'
  },
  {
    id: 'nova-sunrise-royal-makadi-2',
    hotelId: 'sunrise-royal-makadi',
    agencyId: 'novatours',
    departureCity: 'riga',
    departureDate: '2023-09-13T10:00:00Z',
    returnDate: '2023-09-20T18:00:00Z',
    nights: 7,
    roomType: 'family',
    mealPlan: 'uai',
    price: 1299,
    pricePerPerson: 324.75, // For 4 people
    originalPrice: 1499,
    discount: 13,
    available: true,
    deepLink: 'https://novatours.ee/package/nova-sunrise-royal-makadi-2'
  }
];

/**
 * Helper function to get a Novatours package by ID
 * @param id Package ID
 * @returns Package object or undefined if not found
 */
export function getNovatoursPackageById(id: string): TravelPackage | undefined {
  return novatoursPackages.find(pkg => pkg.id === id);
}

/**
 * Helper function to get Novatours packages by hotel ID
 * @param hotelId Hotel ID
 * @returns Array of packages for the hotel
 */
export function getNovatoursPackagesByHotel(hotelId: string): TravelPackage[] {
  return novatoursPackages.filter(pkg => pkg.hotelId === hotelId);
}

/**
 * Helper function to get Novatours packages by departure city
 * @param departureCity Departure city ID
 * @returns Array of packages from the departure city
 */
export function getNovatoursPackagesByDepartureCity(departureCity: string): TravelPackage[] {
  return novatoursPackages.filter(pkg => pkg.departureCity === departureCity);
}

/**
 * Mock API function to fetch Novatours packages
 * @returns Promise resolving to packages array
 */
export async function fetchNovatoursPackages(): Promise<TravelPackage[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return novatoursPackages;
}
