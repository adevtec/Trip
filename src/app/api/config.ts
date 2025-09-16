import { ProviderConfig } from "./base/types";
import { TravelAggregator } from "./base/aggregator";
import { JoinUpProvider } from "./providers/joinup/provider";

/**
 * Provider configurations
 * Add new providers here as they become available
 */
const providerConfigs: Record<string, ProviderConfig> = {
  joinup: {
    name: "JoinUp Travel",
    enabled: true, // Currently the only active provider
    apiKey: process.env.JOINUP_DEV_OAUTH_TOKEN,
    baseUrl: process.env.JOINUP_API_BASE_URL || "https://online.joinupbaltic.eu/export/default.php?samo_action=api",
    timeout: 15000,
    retries: 3,
    priority: 1,
  }
};

/**
 * Create and configure the travel aggregator
 */
export function createTravelAggregator(): TravelAggregator {
  const aggregator = new TravelAggregator();

  // Register JoinUp provider (currently the only active provider)
  if (providerConfigs.joinup.enabled) {
    const joinupProvider = new JoinUpProvider(providerConfigs.joinup);
    aggregator.registerProvider(joinupProvider);
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
