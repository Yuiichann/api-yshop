import config from './config.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: config.cloudinary.CLOUDINARY_NAME,
  api_key: config.cloudinary.CLOUDINARY_KEY,
  api_secret: config.cloudinary.CLOUDINARY_SECRET,
  secure: true,
});

export default cloudinary;
