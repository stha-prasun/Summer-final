import { describe, it, expect } from 'vitest';
import { User } from '../user.model.js';
import { createUser, applyUserUpdates } from './user.factory.js';

describe('user.factory createUser', () => {
  it('throws when required fields are missing', () => {
    expect(() => createUser({ email: 'a@b.com', password: 'x', phone: '123' })).toThrow(
      'Name, email, password, and phone are required.'
    );
  });

  it('throws for an invalid role', () => {
    expect(() =>
      createUser({ name: 'A', email: 'a@b.com', password: 'x', phone: '123', role: 'admin' })
    ).toThrow(/Invalid role/);
  });

  it('creates a User with defaults', () => {
    const user = createUser({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'secret',
      phone: '123456',
    });

    expect(user).toBeInstanceOf(User);
    expect(user.name).toBe('Alice');
    expect(user.email).toBe('alice@example.com');
    expect(user.role).toBe('user');
    expect(user.address).toMatchObject({ street: '', city: '', state: '', zip: '', country: '' });
  });

  it('preserves provided address fields and defaults the rest', () => {
    const user = createUser({
      name: 'A',
      email: 'a@b.com',
      password: 'x',
      phone: '123',
      address: { street: '1 Main St', city: 'NYC' },
    });

    expect(user.address.street).toBe('1 Main St');
    expect(user.address.city).toBe('NYC');
    expect(user.address.zip).toBe('');
  });
});

describe('user.factory applyUserUpdates', () => {
  it('updates only provided top-level fields', () => {
    const user = createUser({ name: 'A', email: 'a@b.com', password: 'x', phone: '123' });

    applyUserUpdates(user, { phone: '999' });

    expect(user.phone).toBe('999');
    expect(user.name).toBe('A');
  });

  it('updates address subfields only when provided', () => {
    const user = createUser({ name: 'A', email: 'a@b.com', password: 'x', phone: '123' });

    applyUserUpdates(user, { address: { city: 'NYC', zip: '10001' } });

    expect(user.address.city).toBe('NYC');
    expect(user.address.zip).toBe('10001');
    expect(user.address.street).toBe('');
  });

  it('ignores undefined values', () => {
    const user = createUser({ name: 'A', email: 'a@b.com', password: 'x', phone: '123' });

    applyUserUpdates(user, { name: undefined, phone: '555' });

    expect(user.name).toBe('A');
    expect(user.phone).toBe('555');
  });
});
