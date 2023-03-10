import { config } from 'dotenv';

config();

const NODE_ENV = process.env.NODE_ENV;

const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;

export default {
  server: {
    PORT,
    NODE_ENV,
  },
  db: {
    MONGODB_URL,
  },
  jwt: { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET },
  cloudinary: { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET },
};
