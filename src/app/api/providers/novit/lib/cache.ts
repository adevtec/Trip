import NovitConfig from './config';

// Cache item struktuur
interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * NovIT Cache utility
 * TypeScript equivalent of PHP Cache class from WordPress plugin
 * Migrated from api-integration/lib/cache.ts
 */
export class NovitCache {
  private static instance: NovitCache;
  private cache: Map<string, CacheItem>;
  private config: any;

  private constructor() {
    this.cache = new Map();
    this.config = NovitConfig.getInstance().getCacheConfig();
  }

  public static getInstance(): NovitCache {
    if (!NovitCache.instance) {
      NovitCache.instance = new NovitCache();
    }
    return NovitCache.instance;
  }

  /**
   * Salvesta andmed cache'i
   */
  public set<T>(key: string, data: T, ttl?: number): void {
    if (!this.config.enabled) {
      return;
    }

    const fullKey = `novit_tours:${key}`;
    const cacheTtl = ttl || this.config.defaultTtl;
    
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: cacheTtl * 1000 // Konverdi sekunditest millisekunditeks
    };

    // Kontrolli cache suurust
    if (this.cache.size >= this.config.maxSize) {
      this.cleanup();
    }

    this.cache.set(fullKey, item);
  }

  /**
   * Hangi andmed cache'ist
   */
  public get<T>(key: string): T | null {
    if (!this.config.enabled) {
      return null;
    }

    const fullKey = `novit_tours:${key}`;
    const item = this.cache.get(fullKey);
    
    if (!item) {
      return null;
    }

    // Kontrolli TTL
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(fullKey);
      return null;
    }

    return item.data;
  }

  /**
   * Kontrolli kas võti eksisteerib cache's
   */
  public has(key: string): boolean {
    if (!this.config.enabled) {
      return false;
    }

    const fullKey = `novit_tours:${key}`;
    const item = this.cache.get(fullKey);
    
    if (!item) {
      return false;
    }

    // Kontrolli TTL
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(fullKey);
      return false;
    }

    return true;
  }

  /**
   * Kustuta võti cache'ist
   */
  public delete(key: string): boolean {
    const fullKey = `novit_tours:${key}`;
    return this.cache.delete(fullKey);
  }

  /**
   * Kustuta aegunud cache'i elemendid
   */
  public cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Tühjenda kogu cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Hangi cache statistika
   */
  public getStats(): { size: number; maxSize: number; enabled: boolean } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      enabled: this.config.enabled
    };
  }

  /**
   * Hangi kõik cache võtmed
   */
  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Loo cache võti API päringu jaoks
   */
  public createCacheKey(endpoint: string, params: Record<string, any> = {}): string {
    const normalizedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);
    
    const paramString = JSON.stringify(normalizedParams);
    return `${endpoint}:${Buffer.from(paramString).toString('base64')}`;
  }

  /**
   * Cache meetod API päringute jaoks
   */
  public async remember<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    // Kontrolli cache'i
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Kui cache's pole, hangi andmed
    const data = await fetcher();
    
    // Salvesta cache'i
    this.set(key, data, ttl);
    
    return data;
  }
}

export default NovitCache;
