import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('./redis.js', () => ({
  default: { set: vi.fn(), get: vi.fn(), ping: vi.fn().mockResolvedValue('PONG') },
}));

vi.mock('./logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { rateLimitMiddleware } from './rateLimiter.js';

const req = { ip: '127.0.0.1' };

const makeRes = () => {
  const res = {
    _status: 200,
    _headers: {},
    _body: null,
    status(code) {
      this._status = code;
      return this;
    },
    json(body) {
      this._body = body;
      return this;
    },
    setHeader(name, value) {
      this._headers[name] = value;
    },
  };
  return res;
};

describe('rateLimitMiddleware', () => {
  beforeEach(() => {
    process.env.RATE_LIMIT_ENABLED = 'true';
  });

  afterEach(() => {
    delete process.env.RATE_LIMIT_ENABLED;
  });

  it('calls next and sets headers when the request is under the limit', async () => {
    const limiter = {
      points: 10,
      consume: vi.fn().mockResolvedValue({ remainingPoints: 9 }),
    };
    const middleware = rateLimitMiddleware(limiter, 'too many');
    const res = makeRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(limiter.consume).toHaveBeenCalledWith('127.0.0.1');
    expect(next).toHaveBeenCalledTimes(1);
    expect(res._headers['X-RateLimit-Limit']).toBe(10);
    expect(res._headers['X-RateLimit-Remaining']).toBe(9);
  });

  it('responds 429 with Retry-After when the limit is exceeded', async () => {
    const limiter = {
      points: 10,
      consume: vi.fn().mockRejectedValue({ msBeforeNext: 9000, remainingPoints: 0 }),
    };
    const middleware = rateLimitMiddleware(limiter, 'too many');
    const res = makeRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res._status).toBe(429);
    expect(res._body).toEqual({ success: false, error: 'too many' });
    expect(res._headers['Retry-After']).toBe('9');
    expect(res._headers['X-RateLimit-Limit']).toBe(10);
    expect(next).not.toHaveBeenCalled();
  });

  it('fails open when the store errors', async () => {
    const limiter = {
      points: 10,
      consume: vi.fn().mockRejectedValue(new Error('redis down')),
    };
    const middleware = rateLimitMiddleware(limiter, 'too many');
    const res = makeRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res._status).toBe(200);
  });

  it('skips enforcement when RATE_LIMIT_ENABLED is false', async () => {
    process.env.RATE_LIMIT_ENABLED = 'false';
    const limiter = { points: 10, consume: vi.fn() };
    const middleware = rateLimitMiddleware(limiter, 'too many');
    const res = makeRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(limiter.consume).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
