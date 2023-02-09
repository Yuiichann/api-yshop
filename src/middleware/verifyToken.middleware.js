import jwt from 'jsonwebtoken';
import responseHandler from '../handlers/response.handler.js';
import config from '../configs/config.js';

const verifyToken = async (req, res, next) => {
  try {
    const authHeaders = req.headers['authorization'];

    const token = authHeaders && authHeaders.split(' ')[1];

    if (!token) {
      return responseHandler.unauthorize(res, { err: 'Invalid Token!' });
    }

    jwt.verify(token, config.jwt.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return responseHandler.unauthorize(res, { err });
      }

      req.user = decoded;

      next();
    });
  } catch (error) {
    responseHandler.unauthorize(res, { err: 'Invalid Tokens' });
  }
};

export default verifyToken;
