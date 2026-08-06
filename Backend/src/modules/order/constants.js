// constants.js
export const CACHE_KEYS = {

  USER_ORDERS: (userId, category = 'all') => `orders:${userId}:${category}`,

  BY_ID: (id) => `order:${id}`,
};

export const ORDER_CACHE_TTL = 300;
