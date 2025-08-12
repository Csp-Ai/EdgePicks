'use client';
import useSWR from 'swr';
import { apiGet } from '@/lib/api';

export function useApi<T>(key: string | null) {
  return useSWR<T>(key, (k) => apiGet<T>(k), {
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    errorRetryCount: 2,
  });
}
