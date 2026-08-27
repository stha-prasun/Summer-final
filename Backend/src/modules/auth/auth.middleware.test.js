import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';

vi.mock('../admin/admin.model.js', () => ({
  Admin: { findById: vi.fn() },
}));

import { authenticate, isAdmin } from './auth.middleware.js';
import { Admin } from '../admin/admin.model.js';
import { makeRes } from '../../test/helpers.js';

const SECRET = process.env.JWT_SECRET_KEY;
const adminID = '507f1f77bcf86cd799439011';
const validToken = jwt.sign({ adminID }, SECRET, { expiresIn: '1h' });

describe('auth.middleware authenticate', () => {
  it('sets req.adminId and calls next for a valid bearer token', () => {
    const req = { headers: { authorization: `Bearer ${validToken}` }, cookies: {} };
    const res = makeRes();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(req.adminId).toBe(adminID);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('responds 401 when no token is present', () => {
    const req = { headers: {}, cookies: {} };
    const res = makeRes();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res._status).toBe(401);
    expect(res._body).toEqual({ success: false, error: 'Authentication required.' });
  });

  it('responds 401 for an invalid token', () => {
    const req = { headers: { authorization: 'Bearer bad.token' }, cookies: {} };
    const res = makeRes();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res._status).toBe(401);
    expect(res._body).toEqual({ success: false, error: 'Invalid or expired token.' });
  });
});

describe('auth.middleware isAdmin', () => {
  beforeEach(() => {
    Admin.findById.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockFindById = (admin) => {
    Admin.findById.mockReturnValue({
      select: () => ({ lean: () => Promise.resolve(admin) }),
    });
  };

  it('calls next for an admin role', async () => {
    mockFindById({ role: 'admin' });
    const req = { adminId: adminID };
    const res = makeRes();
    const next = vi.fn();

    await isAdmin(req, res, next);

    expect(Admin.findById).toHaveBeenCalledWith(adminID);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('responds 403 when the admin does not exist', async () => {
    mockFindById(null);
    const req = { adminId: adminID };
    const res = makeRes();
    const next = vi.fn();

    await isAdmin(req, res, next);

    expect(res._status).toBe(403);
    expect(res._body).toEqual({ success: false, error: 'Admin access required.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 403 when the admin has a non-admin role', async () => {
    mockFindById({ role: 'user' });
    const req = { adminId: adminID };
    const res = makeRes();
    const next = vi.fn();

    await isAdmin(req, res, next);

    expect(res._status).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 403 when the lookup fails', async () => {
    Admin.findById.mockReturnValue({
      select: () => ({ lean: () => Promise.reject(new Error('db down')) }),
    });
    const req = { adminId: adminID };
    const res = makeRes();
    const next = vi.fn();

    await isAdmin(req, res, next);

    expect(res._status).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });
});
