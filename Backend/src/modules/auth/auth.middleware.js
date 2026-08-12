import { verifyAccessToken } from './auth.token.js';
import { Admin } from '../admin/admin.model.js';

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.adminId = decoded.adminID;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.adminId).select('role').lean();

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required.' });
    }

    next();
  } catch {
    return res.status(403).json({ success: false, error: 'Admin access required.' });
  }
};
