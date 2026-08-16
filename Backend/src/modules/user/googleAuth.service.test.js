import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('google-auth-library', () => {
  const instances = [];
  class OAuth2Client {
    constructor() {
      this.verifyIdToken = vi.fn();
      instances.push(this);
    }
  }
  return { OAuth2Client, __instances: instances };
});

import { verifyGoogleIdToken } from './googleAuth.service.js';
import { __instances } from 'google-auth-library';

const mockOAuthClient = () => __instances[0];

describe('googleAuth.service verifyGoogleIdToken', () => {
  beforeEach(() => {
    mockOAuthClient().verifyIdToken.mockReset();
  });

  it('maps the Google payload into the app profile', async () => {
    mockOAuthClient().verifyIdToken.mockResolvedValue({
      getPayload: () => ({
        sub: 'google-123',
        email: 'bob@example.com',
        name: 'Bob',
        picture: 'https://img/bob.png',
        email_verified: true,
      }),
    });

    const profile = await verifyGoogleIdToken('id-token');

    expect(mockOAuthClient().verifyIdToken).toHaveBeenCalledWith(
      expect.objectContaining({ idToken: 'id-token' })
    );
    expect(profile).toEqual({
      googleId: 'google-123',
      email: 'bob@example.com',
      name: 'Bob',
      avatar: 'https://img/bob.png',
      emailVerified: true,
    });
  });

  it('throws when the payload has no email', async () => {
    mockOAuthClient().verifyIdToken.mockResolvedValue({
      getPayload: () => ({ sub: 'google-123' }),
    });

    await expect(verifyGoogleIdToken('id-token')).rejects.toThrow('Invalid Google token');
  });

  it('throws when the payload is missing entirely', async () => {
    mockOAuthClient().verifyIdToken.mockResolvedValue({ getPayload: () => null });

    await expect(verifyGoogleIdToken('id-token')).rejects.toThrow('Invalid Google token');
  });

  it('propagates verification errors', async () => {
    mockOAuthClient().verifyIdToken.mockRejectedValue(new Error('invalid_token'));

    await expect(verifyGoogleIdToken('bad-token')).rejects.toThrow('invalid_token');
  });
});
