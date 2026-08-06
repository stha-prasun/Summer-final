export const CACHE_KEYS = {
  USER_ORDERS: (userId) => `orders:${userId}`,
  BY_ID: (userId, id) => `orders:${userId}:${id}`,
};

export const ORDER_CACHE_TTL = 300;
