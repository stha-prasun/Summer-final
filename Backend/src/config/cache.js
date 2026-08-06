import redis from './redis.js';

const DEFAULT_TTL = 300;

export const getFromCache = async (key) => {
  try {
    const data = await redis.get(key);
    if (data) {
      console.log(`[CACHE HIT] ${key}`);
      return JSON.parse(data);
    }
    console.log(`[CACHE MISS] ${key}`);
    return null;
  } catch (error) {
    console.log(`[CACHE ERROR] get ${key}: ${error.message}`);
    return null;
  }
};

export const setToCache = async (key, data, ttl = DEFAULT_TTL) => {
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
    console.log(`[CACHE SET] ${key} (TTL: ${ttl}s)`);
  } catch (error) {
    console.log(`[CACHE ERROR] set ${key}: ${error.message}`);
  }
};

export const clearCacheByPattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(
        `[CACHE CLEAR] Cleared ${keys.length} keys matching "${pattern}"`
      );
    }
  } catch (error) {
    console.log(`[CACHE ERROR] clear ${pattern}: ${error.message}`);
  }
};
