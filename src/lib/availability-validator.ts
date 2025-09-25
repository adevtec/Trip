/**
 * Availability Validator - Hierarchical filtering system
 *
 * Business Logic:
 * - If no hotels available -> hide region
 * - If no regions available -> hide destination
 * - Show only bookable content to users
 */

import { searchOffers } from '@/app/api/providers/joinup/api';
import { TravelDestination, TravelRegion } from '@/types/destinations';

export interface AvailabilityCacheEntry {
  available: boolean;
  lastCheck: number;
  expiresAt: number;
  hotelCount?: number;
  minPrice?: number;
}

export interface AvailabilityCache {
  [key: string]: AvailabilityCacheEntry;
}

export class AvailabilityValidator {
  private cache: AvailabilityCache = {};
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_CACHE_ENTRIES = 500; // Prevent memory bloat
  private lastCleanup = Date.now();

  /**
   * Check if destination has available offers from any city
   */
  async isDestinationAvailable(destinationId: string, cityId: string): Promise<boolean> {
    const cacheKey = `dest-${cityId}-${destinationId}`;

    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return this.cache[cacheKey].available;
    }

    try {
      // Quick check: are there any available check-in dates?
      const hasCheckinDates = await this.hasAvailableCheckinDates(destinationId, cityId);

      if (!hasCheckinDates) {
        this.setCacheEntry(cacheKey, {
          available: false
        });
        return false;
      }

      // Deeper check: do any dates have actual offers?
      const hasOffers = await this.hasAvailableOffers(destinationId, cityId);
      const hotelCount = hasOffers ? await this.getHotelCount(destinationId, cityId) : 0;

      this.setCacheEntry(cacheKey, {
        available: hasOffers,
        hotelCount
      });

      return hasOffers;
    } catch (error) {
      console.warn(`Failed to check availability for destination ${destinationId}:`, error);
      // On error, show destination (conservative approach)
      return true;
    }
  }

  /**
   * Check if region has available hotels
   */
  async isRegionAvailable(destinationId: string, regionId: string, cityId: string): Promise<boolean> {
    const cacheKey = `region-${cityId}-${destinationId}-${regionId}`;

    if (this.isCacheValid(cacheKey)) {
      return this.cache[cacheKey].available;
    }

    try {
      const hasOffers = await this.checkRegionOffers(destinationId, regionId, cityId);
      const hotelCount = hasOffers ? await this.getRegionHotelCount(destinationId, regionId, cityId) : 0;

      this.setCacheEntry(cacheKey, {
        available: hasOffers,
        hotelCount
      });

      return hasOffers;
    } catch (error) {
      console.warn(`Failed to check region availability ${regionId}:`, error);
      return true;
    }
  }

  /**
   * Filter destinations - show only those with available offers
   */
  async filterAvailableDestinations(destinations: TravelDestination[], cityId: string): Promise<TravelDestination[]> {
    const availabilityChecks = await Promise.allSettled(
      destinations.map(dest => this.isDestinationAvailable(dest.id, cityId))
    );

    return destinations.filter((dest, index) => {
      const result = availabilityChecks[index];
      if (result.status === 'fulfilled') {
        return result.value;
      }
      // On error, show destination (conservative)
      return true;
    });
  }

  /**
   * Filter regions - show only those with available hotels
   */
  async filterAvailableRegions(regions: TravelRegion[], destinationId: string, cityId: string): Promise<TravelRegion[]> {
    const availabilityChecks = await Promise.allSettled(
      regions.map(region => this.isRegionAvailable(destinationId, region.id, cityId))
    );

    return regions.filter((region, index) => {
      const result = availabilityChecks[index];
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return true;
    });
  }

  /**
   * Private helper methods
   */
  private isCacheValid(cacheKey: string): boolean {
    this.cleanupExpired(); // Run cleanup on each check

    const cached = this.cache[cacheKey];
    if (!cached) return false;

    const now = Date.now();
    return now < cached.expiresAt;
  }

  private setCacheEntry(key: string, data: Omit<AvailabilityCacheEntry, 'lastCheck' | 'expiresAt'>): void {
    const now = Date.now();

    this.cache[key] = {
      ...data,
      lastCheck: now,
      expiresAt: now + this.CACHE_TTL
    };

    // Cleanup if cache is getting too large
    if (Object.keys(this.cache).length > this.MAX_CACHE_ENTRIES) {
      this.cleanupExpired();
    }
  }

  private cleanupExpired(): void {
    const now = Date.now();

    // Only cleanup every 5 minutes to avoid performance impact
    if (now - this.lastCleanup < 5 * 60 * 1000) return;

    let removedCount = 0;
    const beforeCount = Object.keys(this.cache).length;

    for (const [key, entry] of Object.entries(this.cache)) {
      if (now >= entry.expiresAt) {
        delete this.cache[key];
        removedCount++;
      }
    }

    this.lastCleanup = now;

    if (removedCount > 0) {
      console.log(`🧹 Cleaned up ${removedCount} expired cache entries (${beforeCount} → ${Object.keys(this.cache).length})`);
    }
  }

  private async hasAvailableCheckinDates(destinationId: string, cityId: string): Promise<boolean> {
    // TODO: Implement SearchTour_CHECKIN API call
    // For now, always return true
    return true;
  }

  private async hasAvailableOffers(destinationId: string, cityId: string): Promise<boolean> {
    try {
      // Test search with minimal parameters
      const testSearch = await searchOffers({
        cityId,
        destinationId,
        checkin: this.getNextWeekDate(),
        nights: 7,
        adults: 2,
        children: 0
      });

      return testSearch.success && testSearch.offers && testSearch.offers.length > 0;
    } catch (error) {
      console.warn(`Failed to check offers for ${destinationId}:`, error);
      return true; // Conservative: show destination on API error
    }
  }

  private async checkRegionOffers(destinationId: string, regionId: string, cityId: string): Promise<boolean> {
    try {
      // Test search filtered by region
      const testSearch = await searchOffers({
        cityId,
        destinationId,
        regionId, // Filter by specific region
        checkin: this.getNextWeekDate(),
        nights: 7,
        adults: 2,
        children: 0
      });

      return testSearch.success && testSearch.offers && testSearch.offers.length > 0;
    } catch (error) {
      console.warn(`Failed to check region offers ${regionId}:`, error);
      return true; // Conservative: show region on API error
    }
  }

  private async getHotelCount(destinationId: string, cityId: string): Promise<number> {
    try {
      const testSearch = await searchOffers({
        cityId,
        destinationId,
        checkin: this.getNextWeekDate(),
        nights: 7,
        adults: 2,
        children: 0
      });

      return testSearch.offers?.length || 0;
    } catch {
      return 0;
    }
  }

  private async getRegionHotelCount(destinationId: string, regionId: string, cityId: string): Promise<number> {
    try {
      const testSearch = await searchOffers({
        cityId,
        destinationId,
        regionId,
        checkin: this.getNextWeekDate(),
        nights: 7,
        adults: 2,
        children: 0
      });

      return testSearch.offers?.length || 0;
    } catch {
      return 0;
    }
  }

  private getNextWeekDate(): string {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  }

  /**
   * Clear cache manually
   */
  clearCache(): void {
    this.cache = {};
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    total: number;
    available: number;
    unavailable: number;
    expired: number;
    memoryUsage: string;
    oldestEntry: string;
    newestEntry: string;
  } {
    const now = Date.now();
    const entries = Object.values(this.cache);
    const expiredEntries = entries.filter(e => now >= e.expiresAt);

    // Calculate approximate memory usage
    const memoryBytes = JSON.stringify(this.cache).length * 2; // Rough estimate
    const memoryKB = (memoryBytes / 1024).toFixed(1);

    // Find oldest and newest entries
    const sortedByTime = entries.sort((a, b) => a.lastCheck - b.lastCheck);
    const oldest = sortedByTime[0];
    const newest = sortedByTime[sortedByTime.length - 1];

    return {
      total: entries.length,
      available: entries.filter(e => e.available && now < e.expiresAt).length,
      unavailable: entries.filter(e => !e.available && now < e.expiresAt).length,
      expired: expiredEntries.length,
      memoryUsage: `${memoryKB}KB`,
      oldestEntry: oldest ? new Date(oldest.lastCheck).toISOString() : 'none',
      newestEntry: newest ? new Date(newest.lastCheck).toISOString() : 'none'
    };
  }

  /**
   * Force cleanup of expired entries
   */
  forceCleanup(): { removed: number; remaining: number } {
    const beforeCount = Object.keys(this.cache).length;
    this.lastCleanup = 0; // Force cleanup
    this.cleanupExpired();
    const afterCount = Object.keys(this.cache).length;

    return {
      removed: beforeCount - afterCount,
      remaining: afterCount
    };
  }
}

// Global instance
export const availabilityValidator = new AvailabilityValidator();