/**
 * Client-side cache utility with automatic expiration and cleanup
 * Uses localStorage for persistent caching across sessions
 */

export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
}

export interface CacheConfig {
  ttl?: number; // Time to live in seconds
  maxAge?: number; // Alternative to ttl
  prefix?: string; // Cache key prefix
}

class ClientCache {
  private prefix: string;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(prefix = 'eksootika_cache_') {
    this.prefix = prefix;
    this.startAutoCleanup();
  }

  /**
   * Set item in cache with TTL
   */
  set<T>(key: string, data: T, config: CacheConfig = {}): void {
    if (typeof window === 'undefined') return; // Server-side safety

    const ttl = config.ttl || config.maxAge || 3600; // Default 1 hour
    const now = Date.now();
    const expiresAt = now + (ttl * 1000);

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt,
      key
    };

    try {
      const cacheKey = this.getCacheKey(key);
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Failed to save to cache:', error);
      // If localStorage is full, try to clean up and retry
      this.cleanup();
      try {
        const cacheKey = this.getCacheKey(key);
        localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
      } catch (retryError) {
        console.error('Cache storage failed after cleanup:', retryError);
      }
    }
  }

  /**
   * Get item from cache (returns null if expired or not found)
   */
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null; // Server-side safety

    try {
      const cacheKey = this.getCacheKey(key);
      const item = localStorage.getItem(cacheKey);

      if (!item) return null;

      const cacheItem: CacheItem<T> = JSON.parse(item);
      const now = Date.now();

      // Check if expired
      if (now > cacheItem.expiresAt) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn('Failed to read from cache:', error);
      this.remove(key); // Remove corrupted item
      return null;
    }
  }

  /**
   * Check if item exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove item from cache
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      const cacheKey = this.getCacheKey(key);
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.warn('Failed to remove from cache:', error);
    }
  }

  /**
   * Get or set pattern: if not in cache, fetch and cache
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    config: CacheConfig = {}
  ): Promise<T> {
    // Check cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const data = await fetcher();

    // Cache it
    this.set(key, data, config);

    return data;
  }

  /**
   * Clear all cache items with our prefix
   */
  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith(this.prefix)
      );

      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Clean up expired items
   */
  cleanup(): void {
    if (typeof window === 'undefined') return;

    try {
      const now = Date.now();
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith(this.prefix)
      );

      keys.forEach(key => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const cacheItem: CacheItem = JSON.parse(item);
            if (now > cacheItem.expiresAt) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // Remove corrupted items
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    if (typeof window === 'undefined') return null;

    try {
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith(this.prefix)
      );

      let totalSize = 0;
      let expiredCount = 0;
      const now = Date.now();

      keys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += item.length;
          try {
            const cacheItem: CacheItem = JSON.parse(item);
            if (now > cacheItem.expiresAt) {
              expiredCount++;
            }
          } catch (error) {
            expiredCount++;
          }
        }
      });

      return {
        totalItems: keys.length,
        expiredItems: expiredCount,
        totalSize,
        prefix: this.prefix
      };
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
      return null;
    }
  }

  /**
   * Start automatic cleanup every 5 minutes
   */
  private startAutoCleanup(): void {
    if (typeof window === 'undefined') return;

    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Stop automatic cleanup
   */
  stopAutoCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  private getCacheKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

// Create singleton instance
export const cache = new ClientCache();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    cache.cleanup();
    cache.stopAutoCleanup();
  });
}

/**
 * Cache presets for different data types
 */
export const CachePresets = {
  // Static data - cities, countries (24 hours)
  STATIC: { ttl: 24 * 60 * 60 },

  // Semi-static data - destinations, regions (12 hours)
  SEMI_STATIC: { ttl: 12 * 60 * 60 },

  // Dynamic data - search results (15 minutes)
  DYNAMIC: { ttl: 15 * 60 },

  // Short-lived data - hotel details (1 hour)
  SHORT: { ttl: 60 * 60 },

  // Very short - real-time data (5 minutes)
  REALTIME: { ttl: 5 * 60 }
} as const;