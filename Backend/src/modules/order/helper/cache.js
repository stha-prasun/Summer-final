import redis from '../../../config/redis.js';
import { ORDER_CACHE_TTL } from '../constants.js';

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

export const setToCache = async (key, data, ttl = ORDER_CACHE_TTL) => {
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
    console.log(`[CACHE SET] ${key} (TTL: ${ttl}s)`);
  } catch (error) {
    console.log(`[CACHE ERROR] set ${key}: ${error.message}`);
  }
};

export const clearUserOrderCache = async (userId) => {
  try {
    const pattern = `orders:${userId}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[CACHE CLEAR] Cleared ${keys.length} keys for user ${userId}`);
    }
  } catch (error) {
    console.log(`[CACHE ERROR] clearUserOrderCache: ${error.message}`);
  }
};

export const clearAllOrderCache = async () => {
  try {
    const keys = await redis.keys('orders:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[CACHE CLEAR] Cleared all order keys (${keys.length} total)`);
    }
  } catch (error) {
    console.log(`[CACHE ERROR] clearAllOrderCache: ${error.message}`);
  }
};