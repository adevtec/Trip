import NovitConfig from './config';
import NovitCache from './cache';
import NovitEncryption from './encryption';
import { 
  NovitApiResponse, 
  NovitHealthResponse, 
  NovitStatResponse, 
  NovitCountriesResponse, 
  NovitCustomerCountriesResponse,
  NovitSearchParams,
  NovitSearchResponse,
  NovitApiError,
  NovitApiClientOptions
} from '../types/api';

// HTTP meetodid
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Request options
interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

/**
 * NovIT API Client
 * TypeScript equivalent of PHP HttpClient class from WordPress plugin
 * Migrated from api-integration/lib/http-client.ts
 */
export class NovitApiClient {
  private static instance: NovitApiClient;
  private config: NovitConfig;
  public cache: NovitCache;
  private encryption: NovitEncryption;
  private apiKey: string;

  constructor(options?: NovitApiClientOptions) {
    this.config = NovitConfig.getInstance();
    this.cache = NovitCache.getInstance();
    this.encryption = new NovitEncryption();
    
    // Kasuta parameetrit või config'i API võtit
    this.apiKey = options?.apiKey || this.config.getApiConfig().apiKey;
    
    if (options?.apiKey) {
      this.config.updateApiKey(options.apiKey);
    }
  }

  /**
   * Singleton instance (analoogne PHP getInstance meetodile)
   */
  public static getInstance(options?: NovitApiClientOptions): NovitApiClient {
    if (!NovitApiClient.instance) {
      NovitApiClient.instance = new NovitApiClient(options);
    }
    return NovitApiClient.instance;
  }

  /**
   * GET request
   */
  public async get<T = any>(
    endpoint: string, 
    params?: Record<string, any>
  ): Promise<NovitApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    return this.request<T>({ method: 'GET' }, url);
  }

  /**
   * POST request
   */
  public async post<T = any>(
    endpoint: string, 
    data?: any
  ): Promise<NovitApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>({ 
      method: 'POST', 
      body: data 
    }, url);
  }

  /**
   * PUT request
   */
  public async put<T = any>(
    endpoint: string, 
    data?: any
  ): Promise<NovitApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>({ 
      method: 'PUT', 
      body: data 
    }, url);
  }

  /**
   * DELETE request
   */
  public async delete<T = any>(
    endpoint: string
  ): Promise<NovitApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    return this.request<T>({ method: 'DELETE' }, url);
  }

  /**
   * API võtme valideerimine (analoogne PHP validateApiKey meetodile)
   */
  public async validateApiKey(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const response = await this.get<NovitHealthResponse>('health');
      return response.status < 300;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  /**
   * Viimase uuenduse kontroll (analoogne PHP checkLastUpdate meetodile)
   */
  public async checkLastUpdate(): Promise<boolean> {
    return this.cache.remember('stat_new', async () => {
      try {
        const response = await this.get<NovitStatResponse>('stat');
        const stat = response.data?.realdate || new Date().toISOString();
        
        // Simuleerime WordPress get_option/update_option funktsionaalsust
        const lastStat = this.cache.get<string>('novit_stat');
        let forceClearCache = false;
        
        if (!lastStat) {
          forceClearCache = true;
        } else {
          const statDate = new Date(stat);
          const lastStatDate = new Date(lastStat);
          const diffInMinutes = Math.abs(statDate.getTime() - lastStatDate.getTime()) / (1000 * 60);
          
          if (diffInMinutes > 0) {
            forceClearCache = true;
          }
        }
        
        if (forceClearCache) {
          this.cache.clear();
        }
        
        this.cache.set('novit_stat', stat, 60 * 60 * 24); // 24h
        return true;
      } catch (error) {
        console.error('Check last update failed:', error);
        return false;
      }
    }, 60); // Cache'i 1 minutiks
  }

  /**
   * Riikide hankimine
   */
  public async getCountries(): Promise<NovitCountriesResponse | null> {
    try {
      const response = await this.get<NovitCountriesResponse>('destinations/countries');
      return response.data || null;
    } catch (error) {
      console.error('Get countries failed:', error);
      return null;
    }
  }

  /**
   * Kliendi riikide seadistamine
   */
  public async setCustomerCountries(countries: string[]): Promise<NovitCustomerCountriesResponse | null> {
    try {
      const response = await this.post<NovitCustomerCountriesResponse>('customers/countries', {
        countries
      });
      return response.data || null;
    } catch (error) {
      console.error('Set customer countries failed:', error);
      return null;
    }
  }

  /**
   * Kliendi riikide hankimine
   */
  public async getCustomerCountries(): Promise<NovitCustomerCountriesResponse | null> {
    try {
      const response = await this.get<NovitCustomerCountriesResponse>('customers/countries');
      return response.data || null;
    } catch (error) {
      console.error('Get customer countries failed:', error);
      return null;
    }
  }

  /**
   * Pakkumiste otsing
   */
  public async searchOffers(params: NovitSearchParams): Promise<NovitSearchResponse | null> {
    try {
      const response = await this.get<NovitSearchResponse>('search', params);
      return response.data || null;
    } catch (error) {
      console.error('Search offers failed:', error);
      return null;
    }
  }

  /**
   * API võtme uuendamine
   */
  public updateApiKey(apiKey: string): NovitApiClient {
    this.apiKey = apiKey;
    this.config.updateApiKey(apiKey);
    return this;
  }

  /**
   * API võtme hankimine
   */
  public getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Keskne request meetod (analoogne PHP curlRequest meetodile)
   */
  private async request<T>(
    options: RequestOptions, 
    url: string
  ): Promise<NovitApiResponse<T>> {
    const headers: Record<string, string> = {
      'Api-Key': this.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    };

    const requestConfig: RequestInit = {
      method: options.method,
      headers,
      signal: AbortSignal.timeout(options.timeout || this.config.getTimeout())
    };

    if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
      requestConfig.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, requestConfig);
      
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let data: T | undefined;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : undefined;
      } catch (parseError) {
        console.warn('Failed to parse response as JSON:', parseError);
      }

      const apiResponse: NovitApiResponse<T> = {
        data,
        status: response.status,
        headers: responseHeaders
      };

      if (!response.ok) {
        const error: NovitApiError = {
          code: response.status.toString(),
          message: response.statusText,
          details: data
        };
        apiResponse.error = error.message;
      }

      return apiResponse;
    } catch (error) {
      console.error('Request failed:', error);
      
      const apiError: NovitApiError = {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Unknown network error',
        details: error
      };

      return {
        status: 0,
        headers: {},
        error: apiError.message
      };
    }
  }

  /**
   * URL-i ehitamine parameetritega
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const baseUrl = this.config.getBaseUrl();
    let url = baseUrl + endpoint.replace(/^\//, '');

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += '?' + searchParams.toString();
    }

    return url;
  }

  /**
   * Cache võtme loomine API päringu jaoks
   */
  public createCacheKey(endpoint: string, params?: Record<string, any>): string {
    return this.cache.createCacheKey(endpoint, params);
  }

  /**
   * Cache'iga API päring
   */
  public async cachedRequest<T>(
    endpoint: string,
    params?: Record<string, any>,
    ttl?: number
  ): Promise<T | null> {
    const cacheKey = this.createCacheKey(endpoint, params);
    
    return this.cache.remember(cacheKey, async () => {
      const response = await this.get<T>(endpoint, params);
      if (response.status >= 200 && response.status < 300) {
        return response.data || null;
      }
      throw new Error(`API request failed: ${response.error || response.status}`);
    }, ttl);
  }
}

export default NovitApiClient;
