/**
 * Mock data index file
 * Exports remaining mock data from the mock directory
 */

// Common data (only remaining files)
export * from './common/continents';

// Mock functions for compatibility with existing components

import { TravelPackage, Hotel } from '@/types/destinations';

/**
 * Get all travel packages (placeholder - returns empty array since provider packages removed)
 * @returns Empty array
 */
export function getAllPackages(): TravelPackage[] {
  return [];
}

/**
 * Get all travel packages for a specific hotel
 * @returns Empty array
 */
export function getAllPackagesByHotel(_hotelId: string): TravelPackage[] {
  // Provider package data was removed from the mock dataset. Return an
  // empty array as a placeholder. Calling code should handle empty results.
  return [];
}

/**
 * Get all travel packages from a specific departure city
 * @returns Empty array
 */
export function getAllPackagesByDepartureCity(_departureCityId: string): TravelPackage[] {
  // Placeholder - return empty array
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

// Placeholder functions for removed mock data
export function getMealPlanById(_id: string): { id: string; name: string; code: string; description: string } | null {
  return null;
}

/**
 * Get hotel by ID
 * Placeholder implementation: returns null because concrete hotel data
 * has been removed from the lightweight mock dataset. Components should
 * handle null gracefully (redirects or user-friendly messages).
 */
export function getHotelById(_id: string): Hotel | null {
  return null;
}

export function getAreaById(_id: string) {
  return null;
}

export function getAreasByRegion(_regionId: string) {
  return [];
}

/**
 * Get hotels for an area
 * Placeholder - returns empty array
 */
export function getHotelsByArea(_areaId: string) {
  return [];
}
