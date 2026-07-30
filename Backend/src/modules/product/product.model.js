import mongoose from 'mongoose';

const specsSchema = new mongoose.Schema({
  scale: { type: String, default: '' },
  material: { type: String, default: '' },
  tampo: { type: String, default: '' },
  limited: { type: String, default: '' },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  series: { type: String, required: true, trim: true },
  year: { type: String, required: true, trim: true },
  price: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['muscle', 'imports', 'exotics', 'originals'],
  },
  badge: { type: String, default: '' },
  gradient: { type: String, default: '' },
  accent: { type: String, default: '' },
  border: { type: String, default: '' },
  image: { type: String, default: '' },
  cloudinaryId: { type: String, default: '' },
  description: { type: String, default: '' },
  specs: { type: specsSchema, default: () => ({}) },
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
