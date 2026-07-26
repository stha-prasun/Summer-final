export const CACHE_KEYS = {
  ALL: 'products:all',
  CATEGORY: (cat) => `products:category:${cat}`,
  BY_ID: (id) => `products:id:${id}`,
};

export const PRODUCT_CACHE_TTL = 300;
