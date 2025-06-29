import { useApi, useMutation } from './useApi';

// Customer types
interface CustomerCountriesResponse {
  success: boolean;
  countries: string[];
  message?: string;
}

interface UpdateCustomerCountriesPayload {
  countries: string[];
}

/**
 * Hook kliendi andmete haldamiseks NovIT API kaudu  
 * Moved and adapted from api-integration/hooks/useCustomers.ts
 */
export function useCustomerCountries() {
  const {
    data,
    loading,
    error,
    refetch,
    isSuccess,
    isError
  } = useApi<CustomerCountriesResponse>(
    async () => {
      // This would call NovIT customer API when available
      // For now, return mock data
      return {
        success: true,
        countries: ['EE', 'LV', 'LT', 'FI'],
        message: 'Mock customer countries data'
      };
    },
    { immediate: false } // Don't load immediately
  );

  return {
    countries: data?.countries || [],
    success: data?.success || false,
    message: data?.message,
    loading,
    error,
    refetch,
    isSuccess,
    isError
  };
}

/**
 * Hook kliendi riikide seadistuste uuendamiseks
 */
export function useUpdateCustomerCountries() {
  const updateMutation = useMutation<CustomerCountriesResponse, UpdateCustomerCountriesPayload>(
    async (payload) => {
      // This would update customer countries via NovIT API
      // For now, return mock success
      return {
        success: true,
        countries: payload.countries,
        message: 'Countries updated successfully (mock)'
      };
    }
  );

  return {
    updateCountries: updateMutation.mutate,
    loading: updateMutation.loading,
    error: updateMutation.error,
    isSuccess: updateMutation.isSuccess,
    isError: updateMutation.isError,
    reset: updateMutation.reset
  };
}

/**
 * Hook kliendi eelistuste jaoks
 */
export function useCustomerPreferences() {
  const { mutate, loading, error, data } = useMutation(
    async (preferences: any) => {
      // This would save customer preferences via NovIT API
      // For now, return mock success
      return {
        success: true,
        preferences,
        message: 'Preferences saved successfully (mock)'
      };
    }
  );

  return {
    savePreferences: mutate,
    loading,
    error,
    lastSaved: data,
    isSuccess: !loading && !error && data !== null
  };
}

/**
 * Hook API võtme valideerimise jaoks
 */
export function useApiValidation() {
  const {
    data,
    loading,
    error,
    execute: checkApiKey,
    isSuccess,
    isError
  } = useApi<{ valid: boolean; message?: string }>(
    async () => {
      const response = await fetch('/api/travel/health');
      if (!response.ok) {
        throw new Error('Failed to check API health');
      }
      const result = await response.json();
      return {
        valid: result.success && result.status === 'operational',
        message: result.status
      };
    },
    { immediate: false }
  );

  return {
    isValidKey: data?.valid || false,
    message: data?.message,
    loading,
    error,
    checkApiKey,
    isSuccess,
    isError
  };
}
