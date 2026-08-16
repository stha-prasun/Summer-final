import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./user.service.js', () => ({
  signup: vi.fn(),
  login: vi.fn(),
  refreshSession: vi.fn(),
  googleLogin: vi.fn(),
  updateProfile: vi.fn(),
}));

import {
  register,
  loginUser,
  refreshUserSession,
  googleAuth,
  updateProfileInfo,
} from './user.controller.js';
import {
  signup,
  login,
  refreshSession,
  googleLogin,
  updateProfile,
} from './user.service.js';
import { makeRes } from '../../test/helpers.js';

const validBody = {
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secret',
  phone: '123456',
  address: { street: '1 Main St', city: 'NYC', state: 'NY', zip: '10001', country: 'US' },
};

describe('user.controller register', () => {
  beforeEach(() => {
    signup.mockReset();
  });

  it('responds 201 on success', async () => {
    signup.mockResolvedValue({ _id: 'u1', name: 'Alice', email: 'alice@example.com' });
    const res = makeRes();

    await register({ body: validBody }, res);

    expect(signup).toHaveBeenCalledWith(validBody);
    expect(res._status).toBe(201);
    expect(res._body.success).toBe(true);
  });

  it('responds 400 when required fields are missing', async () => {
    const res = makeRes();

    await register({ body: { email: 'a@b.com' } }, res);

    expect(signup).not.toHaveBeenCalled();
    expect(res._status).toBe(400);
    expect(res._body.message).toBe('All fields are required');
  });

  it('responds 400 when the service throws', async () => {
    signup.mockRejectedValue(new Error('Email already in use'));
    const res = makeRes();

    await register({ body: validBody }, res);

    expect(res._status).toBe(400);
    expect(res._body.message).toBe('Email already in use');
  });
});

describe('user.controller login', () => {
  beforeEach(() => {
    login.mockReset();
  });

  it('responds 200 with cookies on success', async () => {
    login.mockResolvedValue({
      accessToken: 'at',
      refreshToken: 'rt',
      loggedInUser: { name: 'Alice' },
    });
    const req = { body: { email: 'alice@example.com', password: 'secret' } };
    const res = makeRes();

    await loginUser(req, res);

    expect(login).toHaveBeenCalledWith({ email: 'alice@example.com', password: 'secret' });
    expect(res._status).toBe(200);
    expect(res._body.success).toBe(true);
    expect(res._cookies.map((c) => c.name)).toEqual(['accessToken', 'refreshToken']);
  });

  it('responds 400 when fields are empty', async () => {
    const res = makeRes();

    await loginUser({ body: {} }, res);

    expect(login).not.toHaveBeenCalled();
    expect(res._status).toBe(400);
    expect(res._body.message).toBe('Fields cannot be left empty');
  });

  it('responds 400 on invalid credentials', async () => {
    login.mockRejectedValue(new Error('Invalid email or password'));
    const res = makeRes();

    await loginUser({ body: { email: 'x@x.com', password: 'nope' } }, res);

    expect(res._status).toBe(400);
    expect(res._body.success).toBe(false);
  });
});

describe('user.controller refresh', () => {
  beforeEach(() => {
    refreshSession.mockReset();
  });

  it('responds 200 with a new access token', async () => {
    refreshSession.mockResolvedValue({ accessToken: 'new-at', refreshToken: 'new-rt' });
    const res = makeRes();

    await refreshUserSession({ cookies: { refreshToken: 'rt' } }, res);

    expect(res._status).toBe(200);
    expect(res._body.accessToken).toBe('new-at');
  });

  it('responds with the service status on failure', async () => {
    refreshSession.mockRejectedValue(Object.assign(new Error('Refresh token missing.'), { status: 401 }));
    const res = makeRes();

    await refreshUserSession({ cookies: {} }, res);

    expect(res._status).toBe(401);
    expect(res._body.message).toBe('Refresh token missing.');
  });
});

describe('user.controller googleAuth', () => {
  beforeEach(() => {
    googleLogin.mockReset();
  });

  it('responds 400 when the credential is missing', async () => {
    const res = makeRes();

    await googleAuth({ body: {} }, res);

    expect(googleLogin).not.toHaveBeenCalled();
    expect(res._status).toBe(400);
    expect(res._body.message).toBe('Google credential is required');
  });

  it('responds 200 on success', async () => {
    googleLogin.mockResolvedValue({
      accessToken: 'at',
      refreshToken: 'rt',
      loggedInUser: { name: 'Bob' },
      needsOnboarding: true,
    });
    const res = makeRes();

    await googleAuth({ body: { credential: 'id-token' } }, res);

    expect(googleLogin).toHaveBeenCalledWith({ credential: 'id-token' });
    expect(res._status).toBe(200);
    expect(res._body.success).toBe(true);
    expect(res._body.needsOnboarding).toBe(true);
  });

  it('responds 400 when Google verification fails', async () => {
    googleLogin.mockRejectedValue(new Error('Invalid Google token'));
    const res = makeRes();

    await googleAuth({ body: { credential: 'bad' } }, res);

    expect(res._status).toBe(400);
    expect(res._body.success).toBe(false);
  });
});

describe('user.controller updateProfile', () => {
  beforeEach(() => {
    updateProfile.mockReset();
  });

  it('responds 200 on success', async () => {
    updateProfile.mockResolvedValue({ _id: 'u1', phone: '999' });
    const req = { userId: 'u1', body: { phone: '999', address: {} } };
    const res = makeRes();

    await updateProfileInfo(req, res);

    expect(updateProfile).toHaveBeenCalledWith({ userId: 'u1', phone: '999', address: {} });
    expect(res._status).toBe(200);
    expect(res._body.success).toBe(true);
  });

  it('responds 400 when the service throws', async () => {
    updateProfile.mockRejectedValue(new Error('User not found'));
    const req = { userId: 'missing', body: { phone: '999' } };
    const res = makeRes();

    await updateProfileInfo(req, res);

    expect(res._status).toBe(400);
    expect(res._body.message).toBe('User not found');
  });
});
