type CacheEntry = {
    data: any;
    expiry: number;
};

const globalForCache = globalThis as unknown as {
    apiCache: Map<string, CacheEntry> | undefined;
};

const cache = globalForCache.apiCache ?? new Map<string, CacheEntry>();
if (process.env.NODE_ENV !== 'production') {
    globalForCache.apiCache = cache;
}

export function getCache<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
        cache.delete(key);
        return null;
    }
    return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
    cache.set(key, {
        data,
        expiry: Date.now() + ttlMs,
    });
}

export function invalidateCache(key: string): void {
    cache.delete(key);
}

export function invalidateCachePattern(pattern: string | RegExp): void {
    for (const key of cache.keys()) {
        const matches = typeof pattern === 'string' ? key.startsWith(pattern) : pattern.test(key);
        if (matches) {
            cache.delete(key);
        }
    }
}

export function invalidateAllCache(): void {
    cache.clear();
}
