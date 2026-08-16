import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./auth.service.js', () => ({
  loginAdmin: vi.fn(),
  refreshSession: vi.fn(),
}));

import { login, refresh } from './auth.controller.js';
import { loginAdmin, refreshSession } from './auth.service.js';
import { makeRes } from '../../test/helpers.js';

const session = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  loggedInUser: { _id: 'a1', name: 'Admin', email: 'admin@test.com', role: 'admin' },
};

describe('auth.controller login', () => {
  beforeEach(() => {
    loginAdmin.mockReset();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('responds 200 with tokens and cookies on success', async () => {
    loginAdmin.mockResolvedValue(session);
    const req = { body: { email: 'admin@test.com', password: 'secret' } };
    const res = makeRes();

    await login(req, res);

    expect(loginAdmin).toHaveBeenCalledWith({ email: 'admin@test.com', password: 'secret' });
    expect(res._status).toBe(200);
    expect(res._body.success).toBe(true);
    expect(res._body.accessToken).toBe('access-token');
    expect(res._cookies.map((c) => c.name)).toEqual(['accessToken', 'refreshToken']);
  });

  it('responds 400 when email or password is missing', async () => {
    const req = { body: { email: 'admin@test.com' } };
    const res = makeRes();

    await login(req, res);

    expect(loginAdmin).not.toHaveBeenCalled();
    expect(res._status).toBe(400);
    expect(res._body.message).toBe('Email and password are required');
  });

  it('responds 400 when credentials are invalid', async () => {
    loginAdmin.mockRejectedValue(new Error('Invalid email or password'));
    const req = { body: { email: 'x@test.com', password: 'wrong' } };
    const res = makeRes();

    await login(req, res);

    expect(res._status).toBe(400);
    expect(res._body.success).toBe(false);
    expect(res._body.message).toBe('Invalid email or password');
  });
});

describe('auth.controller refresh', () => {
  beforeEach(() => {
    refreshSession.mockReset();
  });

  it('responds 200 with a new access token on success', async () => {
    refreshSession.mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });
    const req = { cookies: { refreshToken: 'valid-refresh' } };
    const res = makeRes();

    await refresh(req, res);

    expect(res._status).toBe(200);
    expect(res._body).toEqual({ success: true, accessToken: 'new-access' });
    expect(res._cookies.map((c) => c.name)).toEqual(['accessToken', 'refreshToken']);
  });

  it('responds 401 when the refresh session fails', async () => {
    refreshSession.mockRejectedValue(Object.assign(new Error('Refresh token revoked or reused.'), { status: 401 }));
    const req = { cookies: { refreshToken: 'stale' } };
    const res = makeRes();

    await refresh(req, res);

    expect(res._status).toBe(401);
    expect(res._body.message).toBe('Refresh token revoked or reused.');
  });
});
