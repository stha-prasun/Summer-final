import streamifier from 'streamifier';
import { Product } from './product.model.js';
import { createProduct, applyUpdates } from './factory/product.factory.js';
import cloudinary from '../../config/cloudinary.js';
import { CACHE_KEYS } from './constants.js';
import { getFromCache, setToCache, clearProductCache } from './helpers/cache.js';

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products', resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error.message);
  }
};

export const addProduct = async (data, file) => {
  if (file) {
    const { url, publicId } = await uploadToCloudinary(file.buffer);
    data.image = url;
    data.cloudinaryId = publicId;
  }
  const product = createProduct(data);
  await product.save();
  await clearProductCache();
  return product;
};

export const updateProduct = async (id, data, file) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');

  if (file) {
    await deleteFromCloudinary(product.cloudinaryId);
    const { url, publicId } = await uploadToCloudinary(file.buffer);
    data.image = url;
    data.cloudinaryId = publicId;
  }

  applyUpdates(product, data);
  await product.save();
  await clearProductCache();
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');

  await deleteFromCloudinary(product.cloudinaryId);
  await Product.findByIdAndDelete(id);
  await clearProductCache();
  return product;
};

export const getProductById = async (id) => {
  const key = CACHE_KEYS.BY_ID(id);
  const cached = await getFromCache(key);
  if (cached) return cached;

  const product = await Product.findById(id).lean();
  if (product) await setToCache(key, product);
  return product;
};

export const getAllProducts = async (category) => {
  const key = category && category !== 'all' ? CACHE_KEYS.CATEGORY(category) : CACHE_KEYS.ALL;
  const cached = await getFromCache(key);
  if (cached) return cached;

  const filter = category && category !== 'all' ? { category } : {};
  const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
  await setToCache(key, products);
  return products;
};
