import mongoose from 'mongoose';
import modelOptions from './model.options.js';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
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
    roll: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
  },
  modelOptions
);

const userModel = mongoose.model('User', userSchema);

export default userModel;
