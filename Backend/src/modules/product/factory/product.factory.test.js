import { describe, it, expect } from 'vitest';
import { Product } from '../product.model.js';
import { createProduct, applyUpdates } from './product.factory.js';

const base = { name: 'Civic', series: 'JDM', year: '1998', price: '150', category: 'imports' };

describe('product.factory createProduct', () => {
  it('throws when required fields are missing', () => {
    expect(() => createProduct({ ...base, name: undefined })).toThrow(
      'Name, series, year, price, and category are required.'
    );
  });

  it('throws for an invalid category', () => {
    expect(() => createProduct({ ...base, category: 'suv' })).toThrow(/Invalid category/);
  });

  it('throws for an invalid badge', () => {
    expect(() => createProduct({ ...base, badge: 'Old' })).toThrow(/Invalid badge/);
  });

  it('creates a Product with defaults', () => {
    const product = createProduct(base);

    expect(product).toBeInstanceOf(Product);
    expect(product.name).toBe('Civic');
    expect(product.category).toBe('imports');
    expect(product.badge).toBe('');
    expect(product.image).toBe('');
    expect(product.specs).toMatchObject({ scale: '', material: '', tampo: '', limited: '' });
  });
});

describe('product.factory applyUpdates', () => {
  it('updates provided fields only', () => {
    const product = createProduct(base);

    applyUpdates(product, { price: '200', badge: 'New' });

    expect(product.price).toBe('200');
    expect(product.badge).toBe('New');
    expect(product.name).toBe('Civic');
  });

  it('throws for an invalid category update', () => {
    const product = createProduct(base);

    expect(() => applyUpdates(product, { category: 'suv' })).toThrow(/Invalid category/);
  });

  it('throws for an invalid badge update', () => {
    const product = createProduct(base);

    expect(() => applyUpdates(product, { badge: 'Old' })).toThrow(/Invalid badge/);
  });

  it('updates specs subfields only when provided', () => {
    const product = createProduct(base);

    applyUpdates(product, { specs: { scale: '1:64' } });

    expect(product.specs.scale).toBe('1:64');
    expect(product.specs.material).toBe('');
  });
});
