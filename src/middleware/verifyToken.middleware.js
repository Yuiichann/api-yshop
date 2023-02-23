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
        return responseHandler.unauthorize(res, { err: err.name });
      }

      const { iat, exp, ...userInfo } = decoded;
      req.user = userInfo;

      next();
    });
  } catch (error) {
    responseHandler.unauthorize(res, { err: 'Invalid Tokens' });
  }
};

const verifyTokenAdmin = async (req, res, next) => {
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

      const { iat, exp, id, role } = decoded;

      if (role !== 'admin') {
        return responseHandler.unauthorize(res, {
          err: 'User does not have access to this resource!',
        });
      }
      req.user = { id, role };

      next();
    });
  } catch (error) {
    responseHandler.unauthorize(res, { err: 'Invalid Tokens' });
  }
};

export { verifyToken, verifyTokenAdmin };
