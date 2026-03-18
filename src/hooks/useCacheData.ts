import { useEffect, useState } from "react";

interface CacheOptions {
  cacheTime?: number; // Cache time in milliseconds (default: 10 minutes)
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
}

const DEFAULT_CACHE_TIME = 10 * 60 * 1000; // 10 minutes
const CACHE_KEY_PREFIX = "cache:";

/**
 * useCacheData hook for client-side data caching with revalidation
 * Caches fetched data in memory and localStorage
 * Supports stale-while-revalidate pattern
 */
export function useCacheData<T>(
  fetchFn: () => Promise<T>,
  key: string,
  options: CacheOptions = {},
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  revalidate: () => void;
} {
  const {
    cacheTime = DEFAULT_CACHE_TIME,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoryCache = new Map<string, { data: T; timestamp: number }>();

  const getCacheKey = () => `${CACHE_KEY_PREFIX}${key}`;

  const getFromCache = (): T | null => {
    // Check memory cache first
    if (memoryCache.has(key)) {
      const cached = memoryCache.get(key);
      if (cached && Date.now() - cached.timestamp < cacheTime) {
        return cached.data;
      }
      memoryCache.delete(key);
    }

    // Check localStorage
    try {
      const stored = sessionStorage.getItem(getCacheKey());
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < cacheTime) {
          // Restore to memory cache
          memoryCache.set(key, {
            data: parsed.data,
            timestamp: parsed.timestamp,
          });
          return parsed.data;
        }
        sessionStorage.removeItem(getCacheKey());
      }
    } catch (e) {
      // Ignore storage errors
    }
    return null;
  };

  const setCache = (value: T) => {
    const cached = { data: value, timestamp: Date.now() };
    memoryCache.set(key, cached);

    // Also store in sessionStorage for cross-tab consistency
    try {
      sessionStorage.setItem(getCacheKey(), JSON.stringify(cached));
    } catch (e) {
      // Ignore storage errors
    }
  };

  const revalidate = async () => {
    setLoading(true);
    try {
      const freshData = await fetchFn();
      setCache(freshData);
      setData(freshData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Check cache first
      const cached = getFromCache();
      if (cached) {
        setData(cached);
        setLoading(false);
        return;
      }

      // Fetch fresh data
      await revalidate();
    };

    loadData();

    // Revalidate on focus
    if (revalidateOnFocus) {
      const handleFocus = () => {
        const cached = getFromCache();
        if (!cached) {
          revalidate();
        }
      };
      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }

    // Revalidate on reconnect
    if (revalidateOnReconnect) {
      const handleOnline = () => {
        revalidate();
      };
      window.addEventListener("online", handleOnline);
      return () => window.removeEventListener("online", handleOnline);
    }
  }, [key]);

  return { data, loading, error, revalidate };
}
