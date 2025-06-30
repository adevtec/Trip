import { TravelProvider, SearchParams, SearchResult, TravelOffer, ProviderConfig } from '../../base/types';
// Import NovIT specific implementation
import NovitApiClient from './lib/http-client';
import NovitEncryption from './lib/encryption';
import NovitCache from './lib/cache';

/**
 * NovIT (NovaTours) Provider
 * Uses the existing api-integration code from wp-content analysis
 */
export class NovITProvider extends TravelProvider {
  private apiClient: NovitApiClient;
  private encryption: NovitEncryption;
  private cache: NovitCache;

  constructor(config: ProviderConfig) {
    super('novit', config);
    
    // Initialize NovIT components
    this.apiClient = NovitApiClient.getInstance({
      apiKey: config.apiKey || process.env.NOVIT_API_KEY || '',
      timeout: config.timeout || 15000,
      debug: process.env.NOVIT_DEBUG === 'true'
    });
    this.encryption = new NovitEncryption();
    this.cache = NovitCache.getInstance();
    
    console.log('✅ NovIT Provider initialized with services lib');
  }

  /**
   * Search for travel offers from NovIT using api-integration
   */
  async search(params: SearchParams): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      console.log('🔍 NovIT search with params:', params);
      
      // Check cache first
      const cacheKey = `search_${JSON.stringify(params)}`;
      const cached = this.cache.get(cacheKey) as any;
      if (cached?.offers) {
        console.log('📦 Returning cached NovIT results');
        return {
          provider: 'novit',
          offers: cached.offers || [],
          totalCount: cached.totalCount || 0,
          searchTime: Date.now() - startTime,
          success: true
        };
      }

      // Use api-integration's search functionality
      // For development: use mock data until real API key is available
      const mockCountries = [
        { id: 1, name: 'Türgi', code: 'TR', popular: true },
        { id: 2, name: 'Egiptus', code: 'EG', popular: true },
        { id: 3, name: 'Kreeka', code: 'GR', popular: false },
        { id: 4, name: 'Hispaania', code: 'ES', popular: true },
        { id: 5, name: 'Itaalia', code: 'IT', popular: false }
      ];
      
      console.log('📦 Using mock countries data for development');
      
      // Convert mock countries to our TravelOffer format
      const offers = this.convertToTravelOffers(mockCountries, params);
      
      // Cache results
      const result = {
        offers,
        totalCount: offers.length,
        searchTime: Date.now() - startTime
      };
      this.cache.set(cacheKey, result, 300); // 5 minutes cache

      return {
        provider: 'novit',
        ...result,
        success: true
      };
      
    } catch (error) {
      console.error('❌ NovIT search error:', error);
      
      return {
        provider: 'novit',
        offers: [],
        totalCount: 0,
        searchTime: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get specific offer details from NovIT
   */
  async getOffer(offerId: string): Promise<TravelOffer | null> {
    try {
      console.log('🔍 Getting NovIT offer:', offerId);
      
      // Check cache first
      const cached = this.cache.get(`offer_${offerId}`) as TravelOffer;
      if (cached?.id) {
        return cached;
      }

      // For now, return mock offer until we have real offer API
      const mockOffer = this.createMockOffer(offerId);
      
      // Cache the offer
      this.cache.set(`offer_${offerId}`, mockOffer, 600); // 10 minutes cache
      
      return mockOffer;
      
    } catch (error) {
      console.error(`❌ NovIT get offer error for ${offerId}:`, error);
      return null;
    }
  }

  /**
   * Check if NovIT API is available using api-integration
   */
  async healthCheck(): Promise<boolean> {
    try {
      const isValid = await this.apiClient.validateApiKey();
      
      console.log(`🏥 NovIT health check: ${isValid ? 'HEALTHY' : 'UNHEALTHY'}`);
      return isValid;
      
    } catch (error) {
      console.error('❌ NovIT health check failed:', error);
      return false;
    }
  }

  /**
   * Convert countries data to TravelOffer format
   * This is a temporary conversion until we have real search API
   */
  private convertToTravelOffers(countries: any[], params: SearchParams): TravelOffer[] {
    return countries.slice(0, 5).map((country: any, index: number) => ({
      id: `novit_${country.id || index}`,
      provider: 'novit',
      
      destination: country.name || 'Unknown',
      resort: `${country.name} Beach Resort`,
      
      hotel: {
        name: `${country.name} Paradise Hotel`,
        rating: 4 + Math.random(),
        description: `Beautiful resort in ${country.name}`,
        images: []
      },
      
      departureDate: params.departureDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      returnDate: params.returnDate || new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
      nights: params.nights || 7,
      
      price: {
        total: 600 + Math.random() * 800,
        currency: 'EUR',
        perPerson: 300 + Math.random() * 400,
        breakdown: {
          base: 500 + Math.random() * 600,
          taxes: 50 + Math.random() * 100,
          fees: 50 + Math.random() * 100
        }
      },
      
      departure: {
        city: params.departureCities[0] || 'Tallinn',
        airport: 'TLL',
        time: '10:00'
      },
      
      room: {
        type: 'Standard Room',
        occupancy: {
          adults: params.adults,
          children: params.children || 0
        }
      },
      
      mealPlan: 'Half Board',
      
      cancellation: {
        allowed: true,
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        penalty: 150
      },
      
      availability: {
        spaces: 3 + Math.floor(Math.random() * 8),
        lastUpdated: new Date()
      },
      
      providerData: {
        countryData: country,
        source: 'novit-api-integration'
      }
    }));
  }

  /**
   * Create mock offer for getOffer method
   */
  private createMockOffer(offerId: string): TravelOffer {
    return {
      id: offerId,
      provider: 'novit',
      destination: 'Türgi',
      resort: 'Antalya',
      hotel: {
        name: 'Paradise Resort & Spa',
        rating: 4.5,
        description: 'Luxury beachfront resort',
        images: []
      },
      departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      returnDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
      nights: 7,
      price: {
        total: 850,
        currency: 'EUR',
        perPerson: 425,
        breakdown: {
          base: 700,
          taxes: 100,
          fees: 50
        }
      },
      departure: {
        city: 'Tallinn',
        airport: 'TLL',
        time: '14:30'
      },
      room: {
        type: 'Superior Double',
        occupancy: {
          adults: 2,
          children: 0
        }
      },
      mealPlan: 'All Inclusive',
      cancellation: {
        allowed: true,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        penalty: 200
      },
      availability: {
        spaces: 4,
        lastUpdated: new Date()
      },
      providerData: {
        offerId,
        source: 'novit-api-integration'
      }
    };
  }
}
