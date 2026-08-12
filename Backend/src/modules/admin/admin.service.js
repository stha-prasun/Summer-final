import { Product } from '../product/product.model.js';
import { Order } from '../../modules/order/order.model.js';
import { User } from '../../modules/user/user.model.js';

const CATEGORY_COLORS = {
  muscle: '#e8291c',
  imports: '#1a9fd8',
  exotics: '#f2b705',
  originals: '#10b981',
};

export const getDashboardStats = async () => {
  const [totalProducts, totalOrders, totalUsers, products, orders] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments(),
    Product.find().lean(),
    Order.find().sort({ createdAt: -1 }).populate('items.product').lean(),
  ]);

  // Products by category
  const productsByCategory = {};
  products.forEach((p) => {
    productsByCategory[p.category] = (productsByCategory[p.category] || 0) + 1;
  });

  const categoryBreakdown = Object.entries(productsByCategory).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: CATEGORY_COLORS[name] || '#6b7280',
  }));

  // Revenue & status
  const paidOrders = orders.filter((o) => o.status === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const statusCounts = { paid: 0, pending: 0, failed: 0, cancelled: 0 };
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  // Monthly sales (last 12 months)
  const now = new Date();
  const monthlySales = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const label = d.toLocaleString('en-US', { month: 'short' });

    const monthOrders = paidOrders.filter((o) => {
      const created = new Date(o.createdAt);
      return created >= monthStart && created <= monthEnd;
    });

    const units = monthOrders.reduce((sum, o) => {
      return sum + o.items.reduce((s, item) => s + item.quantity, 0);
    }, 0);

    const revenue = monthOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    monthlySales.push({ month: label, units, revenue });
  }

  // Recent orders (last 5)
  const recentOrders = orders.slice(0, 5).map((o) => ({
    id: o._id,
    model: o.items?.[0]?.product?.name || 'Unknown',
    category: o.items?.[0]?.product?.category || '',
    date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: `Rs. ${o.totalAmount}`,
    status: o.status === 'paid' ? 'Delivered' : o.status.charAt(0).toUpperCase() + o.status.slice(1),
  }));

  return {
    totalProducts,
    totalOrders: paidOrders.length,
    totalRevenue,
    totalUsers,
    categoryBreakdown,
    statusCounts,
    monthlySales,
    recentOrders,
    topSellingProducts: products.slice(0, 5).map((p) => ({
      name: p.name,
      category: p.category,
      gradient: p.gradient || 'linear-gradient(135deg,#374151,#9ca3af)',
    })),
  };
};
