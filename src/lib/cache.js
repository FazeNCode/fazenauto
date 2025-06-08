/**
 * Caching utility for FazeNAuto
 * Supports both in-memory and Redis caching
 */

// In-memory cache for development/fallback
const memoryCache = new Map();

// Cache configuration
const CACHE_CONFIG = {
  // Cache TTL in seconds
  TTL: {
    VEHICLES: 300, // 5 minutes
    VIN_DECODE: 3600, // 1 hour
    USER_SESSION: 1800, // 30 minutes
    VEHICLE_HISTORY: 7200, // 2 hours
    MARKETPLACE_DATA: 600, // 10 minutes
  },
  
  // Cache keys
  KEYS: {
    VEHICLES_LIST: 'vehicles:list',
    VEHICLE_DETAIL: 'vehicle:detail',
    VIN_DECODE: 'vin:decode',
    USER_SESSION: 'user:session',
    VEHICLE_HISTORY: 'vehicle:history',
    MARKETPLACE_SYNC: 'marketplace:sync',
  }
};

/**
 * Generate cache key with parameters
 */
function generateCacheKey(baseKey, params = {}) {
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
  
  return paramString ? `${baseKey}:${paramString}` : baseKey;
}

/**
 * In-memory cache implementation
 */
class MemoryCache {
  set(key, value, ttl = 300) {
    const expiry = Date.now() + (ttl * 1000);
    memoryCache.set(key, { value, expiry });
    
    // Auto-cleanup expired entries
    setTimeout(() => {
      const cached = memoryCache.get(key);
      if (cached && Date.now() > cached.expiry) {
        memoryCache.delete(key);
      }
    }, ttl * 1000);
    
    return true;
  }

  get(key) {
    const cached = memoryCache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      memoryCache.delete(key);
      return null;
    }
    
    return cached.value;
  }

  delete(key) {
    return memoryCache.delete(key);
  }

  clear() {
    memoryCache.clear();
    return true;
  }

  size() {
    return memoryCache.size;
  }
}

/**
 * Redis cache implementation (for production)
 */
class RedisCache {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  async connect() {
    if (this.connected) return this.client;
    
    try {
      // Only try Redis in production or if explicitly configured
      if (process.env.REDIS_URL && process.env.NODE_ENV === 'production') {
        const { createClient } = await import('redis');
        this.client = createClient({
          url: process.env.REDIS_URL
        });
        
        await this.client.connect();
        this.connected = true;
        console.log('✅ Redis cache connected');
        return this.client;
      }
    } catch (error) {
      console.warn('⚠️ Redis connection failed, falling back to memory cache:', error.message);
    }
    
    return null;
  }

  async set(key, value, ttl = 300) {
    try {
      await this.connect();
      if (this.client && this.connected) {
        await this.client.setEx(key, ttl, JSON.stringify(value));
        return true;
      }
    } catch (error) {
      console.warn('⚠️ Redis set failed:', error.message);
    }
    return false;
  }

  async get(key) {
    try {
      await this.connect();
      if (this.client && this.connected) {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      console.warn('⚠️ Redis get failed:', error.message);
    }
    return null;
  }

  async delete(key) {
    try {
      await this.connect();
      if (this.client && this.connected) {
        await this.client.del(key);
        return true;
      }
    } catch (error) {
      console.warn('⚠️ Redis delete failed:', error.message);
    }
    return false;
  }

  async clear() {
    try {
      await this.connect();
      if (this.client && this.connected) {
        await this.client.flushAll();
        return true;
      }
    } catch (error) {
      console.warn('⚠️ Redis clear failed:', error.message);
    }
    return false;
  }
}

// Initialize cache instances
const memCache = new MemoryCache();
const redisCache = new RedisCache();

/**
 * Unified cache interface
 */
export class Cache {
  static async set(key, value, ttl = 300) {
    // Try Redis first, fallback to memory
    const redisSuccess = await redisCache.set(key, value, ttl);
    if (!redisSuccess) {
      memCache.set(key, value, ttl);
    }
    return true;
  }

  static async get(key) {
    // Try Redis first, fallback to memory
    let value = await redisCache.get(key);
    if (value === null) {
      value = memCache.get(key);
    }
    return value;
  }

  static async delete(key) {
    await redisCache.delete(key);
    memCache.delete(key);
    return true;
  }

  static async clear() {
    await redisCache.clear();
    memCache.clear();
    return true;
  }

  static generateKey(baseKey, params = {}) {
    return generateCacheKey(baseKey, params);
  }

  static getConfig() {
    return CACHE_CONFIG;
  }

  static async getStats() {
    return {
      memoryCache: {
        size: memCache.size(),
        type: 'memory'
      },
      redisCache: {
        connected: redisCache.connected,
        type: 'redis'
      }
    };
  }
}

/**
 * Cache middleware for API routes
 */
export function withCache(handler, options = {}) {
  return async (request, context) => {
    const { searchParams } = new URL(request.url);
    const cacheKey = Cache.generateKey(
      options.keyPrefix || 'api',
      Object.fromEntries(searchParams.entries())
    );

    // Try to get from cache
    if (request.method === 'GET') {
      const cached = await Cache.get(cacheKey);
      if (cached) {
        console.log(`🎯 Cache hit: ${cacheKey}`);
        return new Response(JSON.stringify(cached), {
          headers: {
            'Content-Type': 'application/json',
            'X-Cache': 'HIT'
          }
        });
      }
    }

    // Execute handler
    const response = await handler(request, context);
    
    // Cache successful GET responses
    if (request.method === 'GET' && response.ok) {
      try {
        const data = await response.clone().json();
        await Cache.set(cacheKey, data, options.ttl || 300);
        console.log(`💾 Cached: ${cacheKey}`);
      } catch (error) {
        console.warn('⚠️ Failed to cache response:', error.message);
      }
    }

    return response;
  };
}

export default Cache;
export { CACHE_CONFIG };
