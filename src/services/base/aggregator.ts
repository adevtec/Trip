import { TravelProvider, SearchParams, SearchResult, TravelOffer } from './types';

/**
 * Travel Aggregator Service
 * Combines results from multiple providers (NovIT, JoinUp, TEZ, etc.)
 */
export class TravelAggregator {
  private providers: Map<string, TravelProvider> = new Map();
  private defaultTimeout = 10000; // 10 seconds

  /**
   * Register a travel provider
   */
  registerProvider(provider: TravelProvider): void {
    this.providers.set(provider.getName(), provider);
    console.log(`✅ Registered provider: ${provider.getName()}`);
  }

  /**
   * Remove a provider
   */
  unregisterProvider(providerName: string): void {
    this.providers.delete(providerName);
    console.log(`❌ Unregistered provider: ${providerName}`);
  }

  /**
   * Get list of registered providers
   */
  getProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Search across all enabled providers
   */
  async search(params: SearchParams): Promise<SearchResult[]> {
    const enabledProviders = Array.from(this.providers.values())
      .filter(provider => provider.getConfig().enabled);

    if (enabledProviders.length === 0) {
      throw new Error('No enabled providers available');
    }

    console.log(`🔍 Searching across ${enabledProviders.length} providers...`);

    // Execute searches in parallel
    const searchPromises = enabledProviders.map(async (provider) => {
      try {
        const startTime = Date.now();
        const result = await this.executeWithTimeout(
          provider.search(params),
          provider.getConfig().timeout || this.defaultTimeout
        );
        const searchTime = Date.now() - startTime;
        
        return {
          ...result,
          searchTime,
          success: true
        };
      } catch (error) {
        console.error(`❌ Error searching ${provider.getName()}:`, error);
        return {
          provider: provider.getName(),
          offers: [],
          totalCount: 0,
          searchTime: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    const results = await Promise.all(searchPromises);
    
    // Log results summary
    const successCount = results.filter(r => r.success).length;
    const totalOffers = results.reduce((sum, r) => sum + r.totalCount, 0);
    
    console.log(`📊 Search completed: ${successCount}/${results.length} providers, ${totalOffers} total offers`);
    
    return results;
  }

  /**
   * Get combined and sorted offers from all providers
   */
  async getCombinedOffers(params: SearchParams, sortBy: 'price' | 'rating' | 'provider' = 'price'): Promise<TravelOffer[]> {
    const results = await this.search(params);
    
    // Combine all offers
    const allOffers: TravelOffer[] = results
      .filter(result => result.success)
      .flatMap(result => result.offers);

    // Sort offers
    return this.sortOffers(allOffers, sortBy);
  }

  /**
   * Get specific offer from any provider
   */
  async getOffer(providerName: string, offerId: string): Promise<TravelOffer | null> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    return provider.getOffer(offerId);
  }

  /**
   * Check health of all providers
   */
  async healthCheck(): Promise<Record<string, boolean>> {
    const healthPromises = Array.from(this.providers.entries()).map(async ([name, provider]) => {
      try {
        const isHealthy = await this.executeWithTimeout(
          provider.healthCheck(),
          5000 // 5 second timeout for health checks
        );
        return [name, isHealthy];
      } catch (error) {
        console.error(`❌ Health check failed for ${name}:`, error);
        return [name, false];
      }
    });

    const healthResults = await Promise.all(healthPromises);
    return Object.fromEntries(healthResults);
  }

  /**
   * Execute promise with timeout
   */
  private async executeWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeoutPromise = new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  /**
   * Sort offers by different criteria
   */
  private sortOffers(offers: TravelOffer[], sortBy: 'price' | 'rating' | 'provider'): TravelOffer[] {
    return offers.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price.total - b.price.total;
        case 'rating':
          return b.hotel.rating - a.hotel.rating;
        case 'provider':
          return a.provider.localeCompare(b.provider);
        default:
          return 0;
      }
    });
  }

  /**
   * Get statistics about current providers
   */
  getStats(): Record<string, any> {
    const providers = Array.from(this.providers.values());
    
    return {
      totalProviders: providers.length,
      enabledProviders: providers.filter(p => p.getConfig().enabled).length,
      providerNames: providers.map(p => p.getName()),
      lastUpdated: new Date().toISOString()
    };
  }
}
