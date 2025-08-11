import { NovitApiClientOptions, NovitEncryptionConfig, NovitCacheConfig } from '../types/api';

/**
 * NovIT Configuration Manager
 * Based on api-integration/lib/config.ts but moved to services
 */
class NovitConfig {
  private static instance: NovitConfig;
  private config: {
    api: {
      baseUrl: string;
      localUrl: string;
      liveUrl: string;
      apiKey: string;
      timeout: number;
      debug: boolean;
    };
    encryption: NovitEncryptionConfig;
    cache: NovitCacheConfig;
  };

  private constructor() {
    this.config = {
      api: {
        baseUrl: process.env.NOVIT_DEBUG === 'true' 
          ? 'http://127.0.0.1/v1/' 
          : 'https://api3.novit.ee/v1/',
        localUrl: 'http://127.0.0.1/v1/',
        liveUrl: 'https://api3.novit.ee/v1/',
        apiKey: process.env.NOVIT_API_KEY || '',
        timeout: 30000,
        debug: process.env.NOVIT_DEBUG === 'true'
      },
      encryption: {
        method: 'AES-256-CBC',
        secretKey: process.env.NOVIT_API_ENCRYPTION_KEY || 'This is my secret key',
        secretIv: process.env.NOVIT_API_ENCRYPTION_IV || 'This is my secret iv',
        hashAlgo: 'sha256'
      },
      cache: {
        defaultTtl: 60 * 60, // 1 tund
        maxSize: 100,
        enabled: true
      }
    };
  }

  public static getInstance(): NovitConfig {
    if (!NovitConfig.instance) {
      NovitConfig.instance = new NovitConfig();
    }
    return NovitConfig.instance;
  }

  public getApiConfig() {
    return { ...this.config.api };
  }

  public getEncryptionConfig(): NovitEncryptionConfig {
    return { ...this.config.encryption };
  }

  public getCacheConfig(): NovitCacheConfig {
    return { ...this.config.cache };
  }

  public updateApiKey(apiKey: string): void {
    this.config.api.apiKey = apiKey;
  }

  public setDebugMode(debug: boolean): void {
    this.config.api.debug = debug;
    this.config.api.baseUrl = debug ? this.config.api.localUrl : this.config.api.liveUrl;
  }

  public getBaseUrl(): string {
    return this.config.api.baseUrl;
  }

  public getApiKey(): string {
    return this.config.api.apiKey;
  }

  public getTimeout(): number {
    return this.config.api.timeout;
  }

  public isDebugMode(): boolean {
    return this.config.api.debug;
  }
}

export default NovitConfig;
