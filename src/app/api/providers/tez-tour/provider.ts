import { TravelProvider, SearchParams, SearchResult, TravelOffer, ProviderConfig } from '../../base/types';
import { 
  TezTourConfig, 
  TezTourApiResponse, 
  TezTourCountry, 
  TezTourRegion, 
  TezTourCity, 
  TezTourHotel, 
  TezTourSearchParams, 
  TezTourSearchResult,
  TezTourOffer 
} from './types';
import { 
  TEZ_TOUR_API_ENDPOINTS, 
  DEFAULT_TEZ_TOUR_CONFIG, 
  TEZ_TOUR_REQUEST_HEADERS,
  TEZ_TOUR_PARSER_CONFIG,
  TEZ_TOUR_ERROR_CODES 
} from './config';

/**
 * TEZ Tour Travel Provider
 * Based on analysis of eksootikareisid-old PHP implementation
 */
export class TezTourProvider extends TravelProvider {
  private tezConfig: TezTourConfig;
  private endpoints: any;

  constructor(config: ProviderConfig) {
    super('tez-tour', config);
    
    this.tezConfig = {
      ...DEFAULT_TEZ_TOUR_CONFIG,
      username: process.env.TEZ_TOUR_USERNAME || '',
      password: process.env.TEZ_TOUR_PASSWORD || '',
    };
    
    this.endpoints = TEZ_TOUR_API_ENDPOINTS[this.tezConfig.apiVersion];
    
    if (!this.tezConfig.username || !this.tezConfig.password) {
      console.warn('⚠️ TEZ Tour API credentials not configured');
    }
  }

  /**
   * Search for travel offers from TEZ Tour
   */
  async search(params: SearchParams): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      console.log('🔍 TEZ Tour search started:', params);
      
      // Convert our standard params to TEZ Tour format
      const tezParams = this.convertSearchParams(params);
      
      // Make API request
      const response = await this.makeRequest(this.endpoints.search, tezParams);
      
      if (!response.success) {
        throw new Error(response.error || 'TEZ Tour search failed');
      }
      
      // Parse response to our standard format
      const offers = this.parseSearchResults(response.data);
      
      console.log(`✅ TEZ Tour search completed: ${offers.length} offers found`);
      
      return {
        provider: 'tez-tour',
        offers,
        totalCount: offers.length,
        searchTime: Date.now() - startTime,
        success: true
      };
      
    } catch (error) {
      console.error('❌ TEZ Tour search error:', error);
      
      return {
        provider: 'tez-tour',
        offers: [],
        totalCount: 0,
        searchTime: Date.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get available countries from TEZ Tour
   */
  async getCountries(): Promise<TezTourCountry[]> {
    try {
      const response = await this.makeRequest(this.endpoints.countries, {
        locale: this.tezConfig.locale
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to get countries');
      }
      
      return this.parseCountries(response.data);
      
    } catch (error) {
      console.error('❌ TEZ Tour getCountries error:', error);
      return [];
    }
  }

  /**
   * Get available regions for a country
   */
  async getRegions(countryId: string): Promise<TezTourRegion[]> {
    try {
      const response = await this.makeRequest(this.endpoints.regions, {
        countryId,
        locale: this.tezConfig.locale
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to get regions');
      }
      
      return this.parseRegions(response.data, countryId);
      
    } catch (error) {
      console.error('❌ TEZ Tour getRegions error:', error);
      return [];
    }
  }

  /**
   * Get available cities for a region
   */
  async getCities(regionId: string): Promise<TezTourCity[]> {
    try {
      const response = await this.makeRequest(this.endpoints.cities, {
        regionId,
        locale: this.tezConfig.locale
      });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to get cities');
      }
      
      return this.parseCities(response.data, regionId);
      
    } catch (error) {
      console.error('❌ TEZ Tour getCities error:', error);
      return [];
    }
  }

  /**
   * Get available hotels
   */
  async getHotels(countryId?: string, regionId?: string, cityId?: string): Promise<TezTourHotel[]> {
    try {
      const params: any = {
        locale: this.tezConfig.locale
      };
      
      if (countryId) params.countryId = countryId;
      if (regionId) params.regionId = regionId;
      if (cityId) params.cityId = cityId;
      
      const response = await this.makeRequest(this.endpoints.hotels, params);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to get hotels');
      }
      
      return this.parseHotels(response.data);
      
    } catch (error) {
      console.error('❌ TEZ Tour getHotels error:', error);
      return [];
    }
  }

  /**
   * Get specific offer by ID
   */
  async getOffer(offerId: string): Promise<TravelOffer | null> {
    try {
      // TEZ Tour doesn't have a direct offer endpoint, so we'll need to search
      // This is a placeholder implementation
      console.log(`🔍 Getting TEZ Tour offer: ${offerId}`);
      
      // In a real implementation, you might need to parse the offer ID
      // to extract search parameters and re-search for the specific offer
      
      return null;
      
    } catch (error) {
      console.error('❌ TEZ Tour getOffer error:', error);
      return null;
    }
  }

  /**
   * Health check for TEZ Tour API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest(this.endpoints.countries, { locale: 'en' });
      return response.success;
    } catch (error) {
      console.error('❌ TEZ Tour health check failed:', error);
      return false;
    }
  }

  /**
   * Make authenticated request to TEZ Tour API
   */
  private async makeRequest(endpoint: string, params: any = {}): Promise<TezTourApiResponse<any>> {
    try {
      // Add locale parameter
      const urlParams = new URLSearchParams({
        locale: this.tezConfig.locale,
        ...params
      });
      
      const url = `${endpoint}?${urlParams}`;
      
      const requestOptions: RequestInit = {
        method: 'GET',
        headers: TEZ_TOUR_REQUEST_HEADERS,
      };
      
      // Add HTTP Digest Authentication if configured
      if (this.tezConfig.authentication && this.tezConfig.username && this.tezConfig.password) {
        const auth = Buffer.from(`${this.tezConfig.username}:${this.tezConfig.password}`).toString('base64');
        requestOptions.headers = {
          ...requestOptions.headers,
          'Authorization': `Basic ${auth}`,
        };
      }
      
      console.log(`📡 TEZ Tour API request: ${url}`);
      
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const xmlText = await response.text();
      
      // Check for common error patterns
      if (xmlText.includes('<error>')) {
        const errorMatch = xmlText.match(/<error>(.*?)<\/error>/);
        const errorMessage = errorMatch ? errorMatch[1] : 'Unknown TEZ Tour API error';
        
        if (errorMessage.includes('Disabled')) {
          throw new Error(`IP address blocked: ${errorMessage}`);
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse XML response
      const parsedData = await this.parseXmlResponse(xmlText);
      
      return {
        success: true,
        data: parsedData
      };
      
    } catch (error) {
      console.error('❌ TEZ Tour API request failed:', error);
      
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
      // Simple XML parsing - in production, use a proper XML parser like xml2js
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parsing errors
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
    // Simple XML to JSON conversion
    // In production, use a proper library like xml2js
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
   * Convert standard search params to TEZ Tour format
   */
  private convertSearchParams(params: SearchParams): TezTourSearchParams {
    const tezParams: TezTourSearchParams = {};
    
    // Map destination to country/region/city
    if (params.destination) {
      // This would need a mapping table or lookup
      // For now, we'll use the destination as countryId
      tezParams.countryId = params.destination;
    }
    
    // Map dates
    if (params.departureDate) {
      tezParams.checkIn = params.departureDate.toISOString().split('T')[0];
    }
    
    if (params.returnDate) {
      tezParams.checkOut = params.returnDate.toISOString().split('T')[0];
    }
    
    // Map guests
    tezParams.adults = params.adults || 2;
    tezParams.children = params.children || 0;
    
    if (params.childrenAges) {
      tezParams.childrenAges = params.childrenAges;
    }
    
    return tezParams;
  }

  /**
   * Parse countries from TEZ Tour response
   */
  private parseCountries(data: any): TezTourCountry[] {
    const countries: TezTourCountry[] = [];
    
    try {
      // Parse XML structure - this depends on actual TEZ Tour response format
      // This is a placeholder implementation
      if (data.item) {
        const items = Array.isArray(data.item) ? data.item : [data.item];
        
        items.forEach((item: any) => {
          countries.push({
            id: item['@attributes']?.id || item.id,
            name: item.name || item['#text']
          });
        });
      }
    } catch (error) {
      console.error('❌ Error parsing countries:', error);
    }
    
    return countries;
  }

  /**
   * Parse regions from TEZ Tour response
   */
  private parseRegions(data: any, countryId: string): TezTourRegion[] {
    const regions: TezTourRegion[] = [];
    
    try {
      if (data.item) {
        const items = Array.isArray(data.item) ? data.item : [data.item];
        
        items.forEach((item: any) => {
          regions.push({
            id: item['@attributes']?.id || item.id,
            name: item.name || item['#text'],
            countryId
          });
        });
      }
    } catch (error) {
      console.error('❌ Error parsing regions:', error);
    }
    
    return regions;
  }

  /**
   * Parse cities from TEZ Tour response
   */
  private parseCities(data: any, regionId: string): TezTourCity[] {
    const cities: TezTourCity[] = [];
    
    try {
      if (data.item) {
        const items = Array.isArray(data.item) ? data.item : [data.item];
        
        items.forEach((item: any) => {
          cities.push({
            id: item['@attributes']?.id || item.id,
            name: item.name || item['#text'],
            regionId
          });
        });
      }
    } catch (error) {
      console.error('❌ Error parsing cities:', error);
    }
    
    return cities;
  }

  /**
   * Parse hotels from TEZ Tour response
   */
  private parseHotels(data: any): TezTourHotel[] {
    const hotels: TezTourHotel[] = [];
    
    try {
      if (data.item) {
        const items = Array.isArray(data.item) ? data.item : [data.item];
        
        items.forEach((item: any) => {
          hotels.push({
            id: item['@attributes']?.id || item.id,
            name: item.name || item['#text'],
            countryId: item.countryId || '',
            regionId: item.regionId || '',
            cityId: item.cityId || '',
            rating: item.rating || '3',
            description: item.description,
            images: item.images ? [item.images] : [],
            attributes: item.attributes || [],
            minPrice: item.minPrice ? parseFloat(item.minPrice) : undefined
          });
        });
      }
    } catch (error) {
      console.error('❌ Error parsing hotels:', error);
    }
    
    return hotels;
  }

  /**
   * Parse search results from TEZ Tour response
   */
  private parseSearchResults(data: any): TravelOffer[] {
    const offers: TravelOffer[] = [];
    
    try {
      if (data.item) {
        const items = Array.isArray(data.item) ? data.item : [data.item];
        
        items.forEach((item: any) => {
          const offer: TravelOffer = {
            id: item['@attributes']?.id || item.id || Math.random().toString(36),
            provider: 'tez-tour',
            destination: item.destination || '',
            resort: item.resort || item.cityName || '',
            hotel: {
              name: item.hotelName || 'Unknown Hotel',
              rating: item.hotelRating || 3,
              description: item.description || '',
              images: item.images || []
            },
            departureDate: item.checkIn ? new Date(item.checkIn) : new Date(),
            returnDate: item.checkOut ? new Date(item.checkOut) : new Date(),
            nights: item.nights || 7,
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
            mealPlan: item.pansion || 'BB',
            cancellation: {
              allowed: item.cancellationAllowed !== false,
              deadline: item.cancellationDeadline ? new Date(item.cancellationDeadline) : undefined,
              penalty: item.cancellationPenalty ? parseFloat(item.cancellationPenalty) : undefined
            },
            availability: {
              spaces: item.availableSpaces || 1,
              lastUpdated: new Date()
            },
            providerData: {
              tezTourId: item.id,
              originalResponse: item
            }
          };
          
          offers.push(offer);
        });
      }
    } catch (error) {
      console.error('❌ Error parsing search results:', error);
    }
    
    return offers;
  }

  /**
   * Get provider health status
   */
  async getHealthStatus(): Promise<{ healthy: boolean; message: string }> {
    try {
      const response = await this.makeRequest(this.endpoints.countries, { locale: 'en' });
      
      if (response.success) {
        return {
          healthy: true,
          message: 'TEZ Tour API is responding'
        };
      } else {
        return {
          healthy: false,
          message: response.error || 'TEZ Tour API is not responding'
        };
      }
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
