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
