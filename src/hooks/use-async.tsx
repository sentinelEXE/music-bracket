// src/hooks/useAsync.tsx
import { useState, useCallback } from 'react';
import Placeholder from '../components/layout/Placeholder';

interface UseAsyncProps<T> {
  fetchFunction: (...args: any[]) => Promise<T>;
  params: any[];
  onSuccess?: (data: T) => void;
  onFailure?: (error: any) => void;
  loaded?: boolean;
}

interface UseAsyncReturn<T> {
  execute: () => void;
  PlaceholderComponent: React.FC<{ children: React.ReactNode }>;
}

export function useAsync<T>({ fetchFunction, params, onSuccess, onFailure, loaded }: UseAsyncProps<T>): UseAsyncReturn<T> {
  const [loading, setLoading] = useState<boolean>(!loaded);
  const [error, setError] = useState<any>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const execute = useCallback(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFunction(...params);
        if (!hasFetched) {
          onSuccess?.(result);
          setHasFetched(true);
        }
      } catch (err) {
        setError(err);
        onFailure?.(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, params, onSuccess, onFailure]);

  const PlaceholderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Placeholder loading={loading} error={error}>
      {children}
    </Placeholder>
  );

  return { execute, PlaceholderComponent };
}
