import redis from '../../../config/redis.js';
import { PRODUCT_CACHE_TTL } from '../constants.js';

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
    console.log(`[CACHE ERROR] ${key}: ${error.message}`);
    return null;
  }
};

export const setToCache = async (key, data) => {
  try {
    await redis.setex(key, PRODUCT_CACHE_TTL, JSON.stringify(data));
    console.log(`[CACHE SET] ${key}`);
  } catch (error) {
    console.log(`[CACHE ERROR] set ${key}: ${error.message}`);
  }
};

export const clearProductCache = async () => {
  try {
    const keys = await redis.keys('products:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[CACHE CLEAR] Cleared ${keys.length} keys: ${keys.join(', ')}`);
    }
  } catch (error) {
    console.log(`[CACHE ERROR] clear: ${error.message}`);
  }
};
