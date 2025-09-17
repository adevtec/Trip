/**
 * Mock data index file
 * Exports remaining mock data from the mock directory
 */

// Common data (only remaining files)
export * from './common/countries';
export * from './common/regions';
export * from './common/hotels';
export * from './common/continents';

// Mock functions for compatibility with existing components

import { TravelPackage } from '@/types/destinations';

/**
 * Get all travel packages (placeholder - returns empty array since provider packages removed)
 * @returns Empty array
 */
export function getAllPackages(): TravelPackage[] {
  return [];
}

/**
 * Get all travel packages for a specific hotel
 * @param hotelId Hotel ID
 * @returns Empty array
 */
export function getAllPackagesByHotel(hotelId: string): TravelPackage[] {
  return [];
}

/**
 * Get all travel packages from a specific departure city
 * @param departureCity Departure city ID
 * @returns Empty array
 */
export function getAllPackagesByDepartureCity(departureCity: string): TravelPackage[] {
  return [];
}

/**
 * Mock API function to fetch all packages
 * @returns Promise resolving to empty array
 */
export async function fetchAllPackages(): Promise<TravelPackage[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return [];
}
