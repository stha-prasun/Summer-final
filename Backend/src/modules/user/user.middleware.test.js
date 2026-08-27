import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticate } from './user.middleware.js';
import { makeRes } from '../../test/helpers.js';

const SECRET = process.env.JWT_SECRET_KEY;
const userID = '507f1f77bcf86cd799439012';
const validToken = jwt.sign({ userID }, SECRET, { expiresIn: '1h' });

describe('user.middleware authenticate', () => {
  it('sets req.userId and calls next for a valid bearer token', () => {
    const req = { headers: { authorization: `Bearer ${validToken}` }, cookies: {} };
    const res = makeRes();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(req.userId).toBe(userID);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res._status).toBe(200);
  });

  it('falls back to the access cookie when no bearer header is present', () => {
    const req = { headers: {}, cookies: { accessToken: validToken } };
    const res = makeRes();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(req.userId).toBe(userID);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('responds 401 when no token is present', () => {
    const req = { headers: {}, cookies: {} };
    const res = makeRes();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res._status).toBe(401);
    expect(res._body).toEqual({ success: false, error: 'Authentication required.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('responds 401 for an invalid token', () => {
    const req = { headers: { authorization: 'Bearer not-a-real-token' }, cookies: {} };
    const res = makeRes();
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res._status).toBe(401);
    expect(res._body).toEqual({ success: false, error: 'Invalid or expired token.' });
    expect(next).not.toHaveBeenCalled();
  });
});
