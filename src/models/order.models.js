import { Schema, model } from 'mongoose';
import modelOptions from './model.options.js';

const orderItemsSchema = new Schema(
  {
    figure: {
      type: Schema.Types.ObjectId,
      ref: 'Figure',
    },
    quantities: {
      type: Number,
      required: true,
      default: 1,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { ...modelOptions, timestamps: false }
);

const orderSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [orderItemsSchema],
    payment_method: {
      type: String,
      required: 'true',
      enum: ['cash'],
    },
    total_purchase: {
      type: Number,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    address: {
      province: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      ward: {
        type: String,
        required: true,
      },
      detail: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivery', 'finish', 'failed'],
      default: 'pending',
    },
  },
  modelOptions
);

const orderModel = model('Order', orderSchema);

export default orderModel;
