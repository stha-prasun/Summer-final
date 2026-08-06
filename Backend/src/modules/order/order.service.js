import { Order } from './order.model.js';
import { CACHE_KEYS, ORDER_CACHE_TTL } from './constants.js';
import { getFromCache, setToCache } from './helper/cache.js';

export const getAllOrders = async (userId, category) => {
  const categoryKey = category && category !== 'all' ? category : 'all';
  const key = CACHE_KEYS.USER_ORDERS(userId, categoryKey);

  
  const cached = await getFromCache(key);
  if (cached) return cached;

 
  const filter = { user: userId };
  if (category && category !== 'all') {
    filter.category = category;
  }

  
  const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

  
  await setToCache(key, orders, ORDER_CACHE_TTL);

  return orders;
};

export const getOrderById = async (id, userId) => {
  const key = CACHE_KEYS.BY_ID(id);
  const cached = await getFromCache(key);

  
  if (cached) {
    if (cached.user.toString() !== userId.toString()) {
      throw new Error('Unauthorized access to this order');
    }
    return cached;
  }

  
  const orderItem = await Order.findOne({ _id: id, user: userId }).lean();

  
  if (orderItem) {
    await setToCache(key, orderItem, ORDER_CACHE_TTL);
  }

  return orderItem;
};