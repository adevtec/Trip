import { ProviderConfig } from "./base/types";
import { TravelAggregator } from "./base/aggregator";
import { NovITProvider } from "./providers/novit/provider";
import { JoinUpProvider } from "./providers/joinup/provider";
import { TezTourProvider } from "./providers/tez-tour/provider";

/**
 * Provider configurations
 * Add new providers here as they become available
 */
const providerConfigs: Record<string, ProviderConfig> = {
  novit: {
    name: "NovIT (NovaTours)",
    enabled: process.env.NOVIT_PROVIDER_ENABLED === "true" || false,
    apiKey: process.env.NOVIT_API_KEY,
    baseUrl: process.env.NOVIT_API_BASE_URL || "https://api.novit.ee",
    timeout: 15000,
    retries: 3,
    priority: 1,
  },

  joinup: {
    name: "JoinUp Travel",
    enabled: process.env.JOINUP_PROVIDER_ENABLED === "true" || false,
    apiKey: process.env.JOINUP_API_KEY,
    baseUrl: process.env.JOINUP_API_BASE_URL || "https://api.joinup.ee",
    timeout: 15000,
    retries: 3,
    priority: 2,
  },

  // TEZ Tour provider (from analyzed old system)
  tez: {
    name: "TEZ Tour",
    enabled: process.env.TEZ_TOUR_PROVIDER_ENABLED === "true" || false,
    timeout: 15000,
    retries: 3,
    priority: 3,
  },

  anex: {
    name: "ANEX Tour",
    enabled: false,
    timeout: 15000,
    retries: 3,
    priority: 4,
  },

  coral: {
    name: "Coral Travel",
    enabled: false,
    timeout: 15000,
    retries: 3,
    priority: 5,
  },
};

/**
 * Create and configure the travel aggregator
 */
export function createTravelAggregator(): TravelAggregator {
  const aggregator = new TravelAggregator();

  // Register NovIT provider
  if (providerConfigs.novit.enabled) {
    const novitProvider = new NovITProvider(providerConfigs.novit);
    aggregator.registerProvider(novitProvider);
  }

  // Register JoinUp provider
  if (providerConfigs.joinup.enabled) {
    const joinupProvider = new JoinUpProvider(providerConfigs.joinup);
    aggregator.registerProvider(joinupProvider);
  }

  // Register TEZ Tour provider
  if (providerConfigs.tez.enabled) {
    const tezProvider = new TezTourProvider(providerConfigs.tez);
    aggregator.registerProvider(tezProvider);
  }

  return aggregator;
}

/**
 * Get provider configuration
 */
export function getProviderConfig(providerName: string): ProviderConfig | null {
  return providerConfigs[providerName] || null;
}

/**
 * Get all provider configurations
 */
export function getAllProviderConfigs(): Record<string, ProviderConfig> {
  return providerConfigs;
}

/**
 * Update provider configuration
 */
export function updateProviderConfig(
  providerName: string,
  updates: Partial<ProviderConfig>
): void {
  if (providerConfigs[providerName]) {
    providerConfigs[providerName] = {
      ...providerConfigs[providerName],
      ...updates,
    };
  }
}

/**
 * Enable/disable provider
 */
export function toggleProvider(providerName: string, enabled: boolean): void {
  if (providerConfigs[providerName]) {
    providerConfigs[providerName].enabled = enabled;
  }
}

// Default aggregator instance (singleton)
let defaultAggregator: TravelAggregator | null = null;

/**
 * Get default aggregator instance
 */
export function getDefaultAggregator(): TravelAggregator {
  if (!defaultAggregator) {
    defaultAggregator = createTravelAggregator();
  }
  return defaultAggregator;
}

/**
 * Reset default aggregator (useful for testing)
 */
export function resetDefaultAggregator(): void {
  defaultAggregator = null;
}
