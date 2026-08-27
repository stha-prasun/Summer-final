import * as adminService from './admin.service.js';

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    return res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard stats.',
    });
  }
};

export const adminGetAllOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const result = await adminService.adminGetAllOrders({ status, search, page: Number(page), limit: Number(limit) });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('Admin get all orders error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders.',
    });
  }
};

export const adminGetOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await adminService.adminGetOrderById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Admin get order error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch order.',
    });
  }
};

export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    const order = await adminService.adminUpdateOrderStatus(id, status);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Admin update order status error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order status.',
    });
  }
};
