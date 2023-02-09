import mongoose from 'mongoose';
import modelOptions from './model.options.js';

const userSchema = new mongoose.Schema(
  {
    username: {
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
  },
  modelOptions
);

const userModel = mongoose.model('User', userSchema);

export default userModel;
