import { Product } from '../product.model.js';

const VALID_CATEGORIES = ['muscle', 'imports', 'exotics', 'originals'];
const VALID_BADGES = ['Limited', 'New'];

export const createProduct = (data) => {
  const { name, series, year, price, category, badge } = data;

  if (!name || !series || !year || !price || !category) {
    throw new Error('Name, series, year, price, and category are required.');
  }

  if (!VALID_CATEGORIES.includes(category)) {
    throw new Error(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (badge && !VALID_BADGES.includes(badge)) {
    throw new Error(`Invalid badge. Must be one of: ${VALID_BADGES.join(', ')}`);
  }

  return new Product({
    name,
    series,
    year,
    price,
    category,
    badge: badge || '',
    gradient: data.gradient || '',
    accent: data.accent || '',
    border: data.border || '',
    image: data.image || '',
    cloudinaryId: data.cloudinaryId || '',
    description: data.description || '',
    specs: {
      scale: data.specs?.scale || '',
      material: data.specs?.material || '',
      tampo: data.specs?.tampo || '',
      limited: data.specs?.limited || '',
    },
  });
};

export const applyUpdates = (product, data) => {
  const fields = ['name', 'series', 'year', 'price', 'category', 'badge', 'gradient', 'accent', 'border', 'image', 'cloudinaryId', 'description'];

  for (const field of fields) {
    if (data[field] !== undefined) {
      if (field === 'category' && data[field] && !VALID_CATEGORIES.includes(data[field])) {
        throw new Error(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
      }
      if (field === 'badge' && data[field] && !VALID_BADGES.includes(data[field])) {
        throw new Error(`Invalid badge. Must be one of: ${VALID_BADGES.join(', ')}`);
      }
      product[field] = data[field];
    }
  }

  if (data.specs) {
    const specFields = ['scale', 'material', 'tampo', 'limited'];
    for (const field of specFields) {
      if (data.specs[field] !== undefined) {
        product.specs[field] = data.specs[field];
      }
    }
  }
};
