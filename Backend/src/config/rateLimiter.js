import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from './redis.js';
import logger from './logger.js';

const createLimiter = (options) =>
  new RateLimiterRedis({
    storeClient: redis,
    ...options,
  });

const authLimiter = createLimiter({
  keyPrefix: 'rl:auth',
  points: 10,
  duration: 900,
  blockDuration: 900,
});

const contactLimiter = createLimiter({
  keyPrefix: 'rl:contact',
  points: 5,
  duration: 3600,
  blockDuration: 3600,
});

const generalLimiter = createLimiter({
  keyPrefix: 'rl:general',
  points: 300,
  duration: 60,
  blockDuration: 60,
});

const rateLimitMiddleware = (limiter, message) => async (req, res, next) => {
  const key = req.ip || req.connection.remoteAddress;

  try {
    const rateLimitRes = await limiter.consume(key);
    res.setHeader('X-RateLimit-Limit', limiter.points);
    res.setHeader('X-RateLimit-Remaining', rateLimitRes.remainingPoints);
    next();
  } catch (rateLimitError) {
    if (rateLimitError instanceof Error) {
      logger.error('Rate limiter error', { error: rateLimitError.message });
      return next();
    }

    const retryAfter = Math.ceil(rateLimitError.msBeforeNext / 1000) || 1;
    res.setHeader('X-RateLimit-Limit', limiter.points);
    res.setHeader('X-RateLimit-Remaining', rateLimitError.remainingPoints ?? 0);
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({ success: false, error: message });
  }
};

export const authRateLimit = rateLimitMiddleware(
  authLimiter,
  'Too many authentication attempts. Please try again later.'
);

export const contactRateLimit = rateLimitMiddleware(
  contactLimiter,
  'Too many contact form submissions. Please try again later.'
);

export const generalRateLimit = rateLimitMiddleware(
  generalLimiter,
  'Too many requests. Please try again later.'
);
