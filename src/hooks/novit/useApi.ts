import { useState, useEffect, useCallback } from 'react';

// Üldine API state
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// API hook options
interface UseApiOptions {
  immediate?: boolean; // Kas käivitada kohe
  cacheKey?: string;   // Cache võti
  refetchOnMount?: boolean;
}

/**
 * Üldine API hook NovIT integratsiooni jaoks
 * Integrated with unified travel API system
 */
export function useApi<T = any>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const {
    immediate = true,
    refetchOnMount = true
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: immediate,
    error: null
  });

  // Execute function
  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({
        data: result,
        loading: false,
        error: null
      });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({
        data: null,
        loading: false,
        error: errorMessage
      });
      throw error;
    }
  }, [apiCall]);

  // Refetch function
  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  // Reset function
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  // Effect for immediate execution
  useEffect(() => {
    if (immediate && refetchOnMount) {
      execute();
    }
  }, [execute, immediate, refetchOnMount]);

  return {
    ...state,
    execute,
    refetch,
    reset,
    isSuccess: !state.loading && !state.error && state.data !== null,
    isError: !state.loading && state.error !== null,
    isIdle: !state.loading && state.error === null && state.data === null
  };
}

/**
 * Mutation hook POST, PUT, DELETE requestide jaoks
 */
export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [state, setState] = useState<ApiState<TData>>({
    data: null,
    loading: false,
    error: null
  });

  const mutate = useCallback(async (variables: TVariables) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await mutationFn(variables);
      setState({
        data: result,
        loading: false,
        error: null
      });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({
        data: null,
        loading: false,
        error: errorMessage
      });
      throw error;
    }
  }, [mutationFn]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
    isSuccess: !state.loading && !state.error && state.data !== null,
    isError: !state.loading && state.error !== null,
    isIdle: !state.loading && state.error === null && state.data === null
  };
}
