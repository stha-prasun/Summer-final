import {Order} from './order.model.js';
import { CACHE_KEYS } from './constants.js';
import { getFromCache, setToCache, clearProductCache } from './helpers/cache.js';

export const getAllOrders = async (req, res) => {
      const key = orders && orders !== 'all' ? CACHE_KEYS.ORDERS(orders) : CACHE_KEYS.ALL;
        const cached = await getFromCache(key);
        if (cached) return cached;
     
      const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
      await setToCache(key, orders);
      return orders;
}
export const getOrderById = async (id) => {
  const key = CACHE_KEYS.BY_ID(id);
  const cached = await getFromCache(key);
  if (cached) return cached;

  const orderItem = await Order.findById(id).lean();
  if (orderItem) await setToCache(key, orderItem);
  return orderItem;
};