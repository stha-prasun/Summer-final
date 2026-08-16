import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from './auth.token.js';

const SECRET = process.env.JWT_SECRET_KEY;
const adminID = '507f1f77bcf86cd799439011';

describe('auth.token', () => {
  it('generates an access token carrying the adminID payload', () => {
    const token = generateAccessToken(adminID);
    expect(jwt.decode(token).adminID).toBe(adminID);
  });

  it('generates a refresh token carrying the adminID payload', () => {
    const token = generateRefreshToken(adminID);
    expect(jwt.decode(token).adminID).toBe(adminID);
  });

  it('verifyAccessToken returns the adminID for a valid token', () => {
    const token = generateAccessToken(adminID);
    expect(verifyAccessToken(token).adminID).toBe(adminID);
  });

  it('verifyRefreshToken returns the adminID for a valid token', () => {
    const token = generateRefreshToken(adminID);
    expect(verifyRefreshToken(token).adminID).toBe(adminID);
  });

  it('throws for an expired token', () => {
    const expired = jwt.sign({ adminID }, SECRET, { expiresIn: '-1s' });
    expect(() => verifyAccessToken(expired)).toThrow();
  });

  it('throws for a token signed with the wrong secret', () => {
    const forged = jwt.sign({ adminID }, 'wrong-secret', { expiresIn: '1h' });
    expect(() => verifyAccessToken(forged)).toThrow();
  });

  it('throws for a malformed token', () => {
    expect(() => verifyAccessToken('not-a-jwt')).toThrow();
  });
});
