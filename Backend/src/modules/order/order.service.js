import { Order } from './order.model.js';
import { CACHE_KEYS, ORDER_CACHE_TTL } from './constants.js';
import { getFromCache, setToCache, clearCacheByPattern } from '../../config/cache.js';

const formatTime = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));

const shapeOrder = (order) => ({
  id: order._id,
  time: order.createdAt ? formatTime(order.createdAt) : '',
  status: order.status,
  totalAmount: order.totalAmount,
  payment: order.payment ?? {},
  items: (order.items || []).map((item) => {
    const product = item.product || {};
    return {
      name: product.name || 'Unknown',
      series: product.series || '',
      year: product.year || '',
      price: item.price,
      category: product.category || '',
      description: product.description || '',
      finish: product.specs?.material || '',
      image: product.image || '',
      qty: item.quantity,
    };
  }),
});

export const getAllOrders = async (userId) => {
  const key = CACHE_KEYS.USER_ORDERS(userId);

  const cached = await getFromCache(key);
  if (cached) return cached;

  const orders = await Order.find({ user: userId, status: 'paid' })
    .populate('items.product')
    .sort({ createdAt: -1 })
    .lean();

  const shaped = orders.map(shapeOrder);
  await setToCache(key, shaped, ORDER_CACHE_TTL);

  return shaped;
};

export const getOrderById = async (id, userId) => {
  const key = CACHE_KEYS.BY_ID(userId, id);
  const cached = await getFromCache(key);
  if (cached) return cached;

  const order = await Order.findOne({ _id: id, user: userId, status: 'paid' })
    .populate('items.product')
    .lean();

  if (!order) return null;

  const shaped = shapeOrder(order);
  await setToCache(key, shaped, ORDER_CACHE_TTL);

  return shaped;
};

export const clearUserOrdersCache = async (userId) => {
  await clearCacheByPattern(`orders:${userId}*`);
};
