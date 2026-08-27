import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from './user.token.js';

const SECRET = process.env.JWT_SECRET_KEY;
const userID = '507f1f77bcf86cd799439012';

describe('user.token', () => {
  it('generates an access token carrying the userID payload', () => {
    const token = generateAccessToken(userID);
    expect(jwt.decode(token).userID).toBe(userID);
  });

  it('generates a refresh token carrying the userID payload', () => {
    const token = generateRefreshToken(userID);
    expect(jwt.decode(token).userID).toBe(userID);
  });

  it('verifyAccessToken returns the userID for a valid token', () => {
    const token = generateAccessToken(userID);
    expect(verifyAccessToken(token).userID).toBe(userID);
  });

  it('verifyRefreshToken returns the userID for a valid token', () => {
    const token = generateRefreshToken(userID);
    expect(verifyRefreshToken(token).userID).toBe(userID);
  });

  it('throws for an expired token', () => {
    const expired = jwt.sign({ userID }, SECRET, { expiresIn: '-1s' });
    expect(() => verifyAccessToken(expired)).toThrow();
  });

  it('throws for a token signed with the wrong secret', () => {
    const forged = jwt.sign({ userID }, 'wrong-secret', { expiresIn: '1h' });
    expect(() => verifyAccessToken(forged)).toThrow();
  });

  it('throws for a malformed token', () => {
    expect(() => verifyAccessToken('not-a-jwt')).toThrow();
  });
});
