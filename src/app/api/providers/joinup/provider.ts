import { TravelProvider, SearchParams, SearchResult, TravelOffer, ProviderConfig } from '../../base/types';
import {
  JoinUpConfig,
  JoinUpApiResponse,
  JoinUpCountry,
  JoinUpRegion,
  JoinUpMeal,
  JoinUpStar,
  JoinUpSearchParams,
  JoinUpOffer,
  JOINUP_DEPARTURE_CITIES,
  JOINUP_COUNTRY_CORRESPONDENCE
} from './types';
import {
  JOINUP_API_ENDPOINTS,
  DEFAULT_JOINUP_CONFIG,
  JOINUP_REQUEST_HEADERS,
  JOINUP_PARSER_CONFIG,
  JOINUP_ERROR_CODES,
  JOINUP_API_BASE_URL
} from './config';

// Import our new client-side API functions
import { fetchCities, fetchDestinations } from './api';

/**
 * JoinUp Baltic Travel Provider
 * Based on analysis of eksootikareisid-old PHP implementation
 */
export class JoinUpProvider extends TravelProvider {
  private joinUpConfig: JoinUpConfig;

  constructor(config: ProviderConfig) {
    super('joinup', config);
    
    this.joinUpConfig = {
      ...DEFAULT_JOINUP_CONFIG,
      oauthToken: process.env.JOINUP_OAUTH_TOKEN || DEFAULT_JOINUP_CONFIG.oauthToken,
    };
    
    if (!this.joinUpConfig.oauthToken) {
      console.warn('⚠️ JoinUp OAuth token not configured');
    }
  }

  /**
   * Search for travel offers from JoinUp Baltic
   * Now uses our new client-side API with caching
   */
  async search(params: SearchParams): Promise<SearchResult> {
    const startTime = Date.now();

    try {
      console.log('🔍 JoinUp search started:', params);

      // Skip if no departure cities
      if (!params.departureCities || params.departureCities.length === 0) {
        console.log('⚠️ JoinUp search skipped: no departure cities');
        return {
          provider: 'joinup',
          offers: [],
          totalCount: 0,
          searchTime: Date.now() - startTime,
          success: true
        };
      }

      // Get cities and find city ID
      const citiesResult = await fetchCities();
      const cities = citiesResult.success ? (citiesResult.cities || []) : [];
      const cityName = params.departureCities[0]; // Use first city
      const city = cities.find(c =>
        c.name.toLowerCase() === cityName.toLowerCase() ||
        c.nameAlt.toLowerCase() === cityName.toLowerCase()
      );

      if (!city) {
        console.log(`⚠️ JoinUp search skipped: city "${cityName}" not found`);
        return {
          provider: 'joinup',
          offers: [],
          totalCount: 0,
          searchTime: Date.now() - startTime,
          success: true
        };
      }

      // Get destinations if specified
      let destinationId = null;
      if (params.destination) {
        const destinationsResult = await fetchDestinations(city.id);
        const destinations = destinationsResult.success ? (destinationsResult.destinations || []) : [];
        const destination = destinations.find(d =>
          d.name.toLowerCase() === params.destination?.toLowerCase() ||
          d.nameAlt.toLowerCase() === params.destination?.toLowerCase()
        );

        if (destination) {
          destinationId = destination.id;
        } else {
          console.log(`⚠️ JoinUp destination "${params.destination}" not found for ${cityName}`);
          return {
            provider: 'joinup',
            offers: [],
            totalCount: 0,
            searchTime: Date.now() - startTime,
            success: true
          };
        }
      } else {
        // If no destination specified, skip search
        console.log('⚠️ JoinUp search skipped: no destination specified');
        return {
          provider: 'joinup',
          offers: [],
          totalCount: 0,
          searchTime: Date.now() - startTime,
          success: true
        };
      }

      // Convert search parameters to JoinUp format
      const joinUpSearchParams = {
        cityId: city.id,
        destinationId: destinationId,
        adults: params.adults || 2,
        children: params.children || 0,
        checkin: params.departureDate ? params.departureDate.toISOString().split('T')[0] : undefined,
        nights: params.nights || 7
      };

      // TODO: Implement search functionality in providers/api.ts
      // const offers = await searchJoinUpOffers(joinUpSearchParams);
      const offers: any[] = [];

      // Convert to our standard format
      const standardOffers = offers.map(offer => this.convertOfferToStandard(offer));

      console.log(`✅ JoinUp search completed: ${standardOffers.length} offers found`);

      return {
        provider: 'joinup',
        offers: standardOffers,
        totalCount: standardOffers.length,
        searchTime: Date.now() - startTime,
        success: true
      };

    } catch (error) {
      console.error('❌ JoinUp search error:', error);

      return {
        provider: 'joinup',
        offers: [],
        totalCount: 0,
        searchTime: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get specific offer by ID
   */
  async getOffer(offerId: string): Promise<TravelOffer | null> {
    try {
      console.log(`🔍 Getting JoinUp offer: ${offerId}`);
      return null;
    } catch (error) {
      console.error('❌ JoinUp getOffer error:', error);
      return null;
    }
  }

  /**
   * Health check for JoinUp API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest('countries', { TOWNFROMINC: '2552' });
      return response.success;
    } catch (error) {
      console.error('❌ JoinUp health check failed:', error);
      return false;
    }
  }

  /**
   * Get available countries from JoinUp
   */
  async getCountries(fromCity: string): Promise<JoinUpCountry[]> {
    try {
      const response = await this.makeRequest('countries', {
        TOWNFROMINC: fromCity
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to get countries');
      }
      
      return this.parseCountries(response.items?.item || []);
      
    } catch (error) {
      console.error('❌ JoinUp getCountries error:', error);
      return [];
    }
  }

  /**
   * Make authenticated request to JoinUp API
   */
  private async makeRequest(action: string, params: any = {}): Promise<JoinUpApiResponse<any>> {
    try {
      const endpoint = JOINUP_API_ENDPOINTS[action as keyof typeof JOINUP_API_ENDPOINTS];
      
      if (!endpoint) {
        throw new Error(`Unknown JoinUp action: ${action}`);
      }
      
      // Prepare request parameters
      const requestParams = new URLSearchParams({
        version: this.joinUpConfig.apiVersion,
        type: 'xml',
        oauth_token: this.joinUpConfig.oauthToken,
        action: endpoint,
        ...params
      });
      
      const url = `${this.joinUpConfig.baseUrl}&${requestParams}`;
      
      console.log(`📡 JoinUp API request: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: JOINUP_REQUEST_HEADERS,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const xmlText = await response.text();
      
      // Check for common error patterns
      if (xmlText.includes('<Error>')) {
        const errorMatch = xmlText.match(/<Error>(.*?)<\/Error>/);
        const errorMessage = errorMatch ? errorMatch[1] : 'Unknown JoinUp API error';
        
        if (errorMessage.includes('blacklisted address')) {
          throw new Error(`IP address blocked: ${errorMessage}`);
        }
        
        if (errorMessage.includes('apiKey provided, but invalid')) {
          throw new Error('Invalid OAuth token');
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse XML response
      const parsedData = await this.parseXmlResponse(xmlText);
      
      return {
        success: true,
        items: parsedData.Response || parsedData
      };
      
    } catch (error) {
      console.error('❌ JoinUp API request failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Parse XML response to JavaScript object
   */
  private async parseXmlResponse(xmlText: string): Promise<any> {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('XML parsing error: ' + parseError.textContent);
      }
      
      return this.xmlToJson(xmlDoc);
      
    } catch (error) {
      console.error('❌ XML parsing error:', error);
      throw new Error('Failed to parse XML response');
    }
  }

  /**
   * Convert XML DOM to JSON-like object
   */
  private xmlToJson(xml: any): any {
    const obj: any = {};
    
    if (xml.nodeType === 1) { // Element node
      if (xml.attributes.length > 0) {
        obj['@attributes'] = {};
        for (let i = 0; i < xml.attributes.length; i++) {
          const attribute = xml.attributes.item(i);
          obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) { // Text node
      return xml.nodeValue;
    }
    
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        
        if (typeof obj[nodeName] === 'undefined') {
          obj[nodeName] = this.xmlToJson(item);
        } else {
          if (typeof obj[nodeName].push === 'undefined') {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this.xmlToJson(item));
        }
      }
    }
    
    return obj;
  }

  /**
   * Convert standard search params to JoinUp format
   */
  private convertSearchParams(params: SearchParams): JoinUpSearchParams {
    const joinUpParams: JoinUpSearchParams = {};
    
    // Map departure cities
    if (params.departureCities && params.departureCities.length > 0) {
      const firstCity = params.departureCities[0];
      const correspondenceEntry = Object.entries(JOINUP_DEPARTURE_CITIES)
        .find(([key, value]) => key === firstCity || value === firstCity);
      
      if (correspondenceEntry) {
        joinUpParams.TOWNFROMINC = correspondenceEntry[1];
      } else {
        joinUpParams.TOWNFROMINC = firstCity;
      }
    }
    
    // Map destination to country
    if (params.destination) {
      const correspondenceEntry = Object.entries(JOINUP_COUNTRY_CORRESPONDENCE)
        .find(([key, value]) => key === params.destination || value === params.destination);
      
      if (correspondenceEntry) {
        joinUpParams.STATEINC = correspondenceEntry[1];
      } else {
        joinUpParams.STATEINC = params.destination;
      }
    }
    
    // Map dates
    if (params.departureDate) {
      joinUpParams.startDate = params.departureDate.toISOString().split('T')[0];
    }
    
    if (params.returnDate) {
      joinUpParams.endDate = params.returnDate.toISOString().split('T')[0];
    }
    
    // Map guests
    joinUpParams.adults = params.adults || 2;
    joinUpParams.children = params.children || 0;
    
    return joinUpParams;
  }

  /**
   * Parse countries from JoinUp response
   */
  private parseCountries(items: any[]): JoinUpCountry[] {
    const countries: JoinUpCountry[] = [];
    
    try {
      items.forEach((item: any) => {
        countries.push({
          id: item.id || item['@attributes']?.id,
          name: item.name || item['#text']
        });
      });
    } catch (error) {
      console.error('❌ Error parsing countries:', error);
    }
    
    return countries;
  }

  /**
   * Parse search results from JoinUp response
   */
  private parseSearchResults(items: any[]): TravelOffer[] {
    const offers: TravelOffer[] = [];
    
    try {
      items.forEach((item: any) => {
        const offer: TravelOffer = {
          id: item.id || item['@attributes']?.id || Math.random().toString(36),
          provider: 'joinup',
          destination: item.country || item.destination || '',
          resort: item.region || item.resort || '',
          hotel: {
            name: item.hotel || item.hotelName || 'Unknown Hotel',
            rating: parseInt(item.stars || item.hotelRating || '3'),
            description: item.description || '',
            images: item.images || []
          },
          departureDate: item.departureDate ? new Date(item.departureDate) : new Date(),
          returnDate: item.returnDate ? new Date(item.returnDate) : new Date(),
          nights: item.duration || item.nights || 7,
          price: {
            total: item.price ? parseFloat(item.price) : 0,
            currency: item.currency || 'EUR',
            perPerson: item.pricePerPerson ? parseFloat(item.pricePerPerson) : undefined
          },
          departure: {
            city: item.departureCity || '',
            airport: item.departureAirport || undefined,
            time: item.departureTime || undefined
          },
          room: {
            type: item.roomType || 'Standard',
            occupancy: {
              adults: item.adults || 2,
              children: item.children || 0
            }
          },
          mealPlan: item.meal || item.mealPlan || 'BB',
          cancellation: {
            allowed: item.cancellationAllowed !== false,
            deadline: item.cancellationDeadline ? new Date(item.cancellationDeadline) : undefined,
            penalty: item.cancellationPenalty ? parseFloat(item.cancellationPenalty) : undefined
          },
          availability: {
            spaces: item.availability || item.availableSpaces || 1,
            lastUpdated: new Date()
          },
          providerData: {
            joinUpId: item.id,
            originalResponse: item
          }
        };
        
        offers.push(offer);
      });
    } catch (error) {
      console.error('❌ Error parsing search results:', error);
    }
    
    return offers;
  }

  /**
   * Convert JoinUp offer to our standard TravelOffer format
   */
  private convertOfferToStandard(joinUpOffer: any): TravelOffer {
    return {
      id: joinUpOffer.id || `joinup_${Math.random().toString(36).substr(2, 9)}`,
      provider: 'joinup',
      destination: joinUpOffer.destination || 'Unknown',
      resort: joinUpOffer.resort || 'Unknown',
      hotel: {
        name: joinUpOffer.hotel?.name || 'Unknown Hotel',
        rating: joinUpOffer.hotel?.rating || 3,
        description: '',
        images: joinUpOffer.hotel?.images || []
      },
      departureDate: joinUpOffer.departureDate ? new Date(joinUpOffer.departureDate) : new Date(),
      returnDate: joinUpOffer.returnDate ? new Date(joinUpOffer.returnDate) : new Date(),
      nights: joinUpOffer.nights || 7,
      price: {
        total: joinUpOffer.price?.total || 0,
        currency: joinUpOffer.price?.currency || 'EUR',
        perPerson: joinUpOffer.price?.perPerson || undefined
      },
      departure: {
        city: joinUpOffer.departure?.city || 'Unknown',
        airport: undefined,
        time: undefined
      },
      room: {
        type: joinUpOffer.room?.type || 'Standard',
        occupancy: {
          adults: joinUpOffer.room?.capacity || 2,
          children: 0
        }
      },
      mealPlan: joinUpOffer.mealPlan || 'BB',
      cancellation: {
        allowed: true,
        deadline: undefined,
        penalty: undefined
      },
      availability: {
        spaces: 1,
        lastUpdated: new Date()
      },
      providerData: {
        provider: 'joinup',
        included: [],
        extras: [],
        tags: ['joinup'],
        metadata: joinUpOffer.joinup || {}
      }
    };
  }
}
