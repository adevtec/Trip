/**
 * Mock data index file
 * Exports all mock data from the mock directory
 */

// Common data
export * from './common/continents';
export * from './common/countries';
export * from './common/regions';
export * from './common/areas';
export * from './common/hotels';
export * from './common/mealPlans';
export * from './common/departureCities';

// Agency-specific data
export * from './novatours/packages';
export * from './teztour/packages';

// Combined data functions

import { TravelPackage } from '@/types/destinations';
import { novatoursPackages } from './novatours/packages';
import { tezTourPackages } from './teztour/packages';

/**
 * Get all travel packages from all agencies
 * @returns Array of all travel packages
 */
export function getAllPackages(): TravelPackage[] {
  return [...novatoursPackages, ...tezTourPackages];
}

/**
 * Get all travel packages for a specific hotel
 * @param hotelId Hotel ID
 * @returns Array of packages for the hotel
 */
export function getAllPackagesByHotel(hotelId: string): TravelPackage[] {
  return getAllPackages().filter(pkg => pkg.hotelId === hotelId);
}

/**
 * Get all travel packages from a specific departure city
 * @param departureCity Departure city ID
 * @returns Array of packages from the departure city
 */
export function getAllPackagesByDepartureCity(departureCity: string): TravelPackage[] {
  return getAllPackages().filter(pkg => pkg.departureCity === departureCity);
}

/**
 * Mock API function to fetch all packages
 * @returns Promise resolving to all packages array
 */
export async function fetchAllPackages(): Promise<TravelPackage[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return getAllPackages();
}
