import mongoose from 'mongoose';
import modelOptions from './model.options.js';

const figureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    scale: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    in_stock: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    collections: {
      type: Array,
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    // 4 thằng này có thể không có
    size: {
      type: String,
    },
    series: {
      type: String,
    },
    publisher: {
      type: String,
    },
    character: {
      type: String,
    },
  },
  { ...modelOptions, timestamps: false }
);

export default mongoose.model('Figure', figureSchema);
