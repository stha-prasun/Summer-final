import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./redis.js', () => ({
  default: { get: vi.fn(), setex: vi.fn(), keys: vi.fn(), del: vi.fn() },
}));

import redis from './redis.js';
import { getFromCache, setToCache, clearCacheByPattern } from './cache.js';

describe('cache getFromCache', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    redis.get.mockReset();
    redis.setex.mockReset();
    redis.keys.mockReset();
    redis.del.mockReset();
  });

  it('returns parsed data on a cache hit', async () => {
    redis.get.mockResolvedValue(JSON.stringify({ a: 1 }));

    await expect(getFromCache('key')).resolves.toEqual({ a: 1 });
    expect(redis.get).toHaveBeenCalledWith('key');
  });

  it('returns null on a cache miss', async () => {
    redis.get.mockResolvedValue(null);

    await expect(getFromCache('key')).resolves.toBeNull();
  });

  it('returns null when redis throws', async () => {
    redis.get.mockRejectedValue(new Error('redis down'));

    await expect(getFromCache('key')).resolves.toBeNull();
  });
});

describe('cache setToCache', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    redis.get.mockReset();
    redis.setex.mockReset();
    redis.keys.mockReset();
    redis.del.mockReset();
  });

  it('stores JSON data with the default TTL', async () => {
    await setToCache('key', { a: 1 });

    expect(redis.setex).toHaveBeenCalledWith('key', 300, JSON.stringify({ a: 1 }));
  });

  it('stores data with a custom TTL', async () => {
    await setToCache('key', 'value', 60);

    expect(redis.setex).toHaveBeenCalledWith('key', 60, JSON.stringify('value'));
  });

  it('does not throw when redis fails', async () => {
    redis.setex.mockRejectedValue(new Error('redis down'));

    await expect(setToCache('key', { a: 1 })).resolves.toBeUndefined();
  });
});

describe('cache clearCacheByPattern', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    redis.get.mockReset();
    redis.setex.mockReset();
    redis.keys.mockReset();
    redis.del.mockReset();
  });

  it('deletes matching keys', async () => {
    redis.keys.mockResolvedValue(['products:1', 'products:2']);

    await clearCacheByPattern('products:*');

    expect(redis.keys).toHaveBeenCalledWith('products:*');
    expect(redis.del).toHaveBeenCalledWith('products:1', 'products:2');
  });

  it('skips deletion when no keys match', async () => {
    redis.keys.mockResolvedValue([]);

    await clearCacheByPattern('products:*');

    expect(redis.del).not.toHaveBeenCalled();
  });

  it('does not throw when redis fails', async () => {
    redis.keys.mockRejectedValue(new Error('redis down'));

    await expect(clearCacheByPattern('products:*')).resolves.toBeUndefined();
  });
});
