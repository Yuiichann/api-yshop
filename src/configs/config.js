import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export default {
  server: {
    PORT,
  },
  db: {
    MONGODB_URL,
  },
  jwt: { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET },
};
