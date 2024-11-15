// src/hooks/useAsync.ts
import { useState, useEffect } from 'react';
import Placeholder from '../components/layout/Placeholder';

interface UseAsyncProps<T> {
  fetchFunction: (...args: any[]) => Promise<T>;
  params: any[];
  onSuccess: (data: T) => void;
  onFailure: (error: any) => void;
}

interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: any;
  PlaceholderComponent: React.FC<{ children: React.ReactNode }>;
}

export function useAsync<T>({ fetchFunction, params, onSuccess, onFailure }: UseAsyncProps<T>): UseAsyncReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFunction(...params);
        setData(result);
        onSuccess(result);
      } catch (err) {
        setError(err);
        onFailure(err);
      } finally {
        setLoading(false);
      }
    };

    if (!data) fetchData();
  }, [fetchFunction, params, data, loading, onSuccess, onFailure]);

  const PlaceholderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Placeholder loading={loading} error={error}>
      {children}
    </Placeholder>
  );

  return { data, loading, error, PlaceholderComponent };
}