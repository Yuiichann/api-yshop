import jwt from 'jsonwebtoken';
import config from '../configs/config.js';

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, config.jwt.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d',
  });

  const refreshToken = jwt.sign(payload, config.jwt.REFRESH_TOKEN_SECRET, {
    expiresIn: '4d',
  });

  return { accessToken, refreshToken };
};

export default generateTokens;
