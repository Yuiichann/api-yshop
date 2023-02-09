import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../configs/config.js';
import responseHandler from '../handlers/response.handler.js';
import userModel from '../models/user.model.js';
import generateTokens from '../utils/generateTokens.util.js';

const saltRounds = 10;

class authController {
  static async signUp(req, res) {
    try {
      const { username, password, displayName } = req.body;

      const checkUserExists = await userModel.findOne({ username });

      if (checkUserExists) {
        return responseHandler.badrequest(res, {
          msg: 'Username already exists!',
        });
      }

      const hashPassword = bcrypt.hashSync(password, saltRounds);

      const newUser = new userModel({
        username,
        password: hashPassword,
        displayName,
      });

      await newUser.save();

      responseHandler.ok(res, newUser);
    } catch (error) {
      responseHandler.error(res, error);
    }
  }

  static async signIn(req, res) {
    try {
      const { username, password } = req.body;

      const currentUser = await userModel.findOne({ username });

      if (!currentUser) {
        return responseHandler.notfound(res);
      }

      const checkPassword = await bcrypt.compare(
        password,
        currentUser.password
      );

      if (!checkPassword) {
        return responseHandler.badrequest(res, { msg: 'Wrong Password!' });
      }

      const tokens = generateTokens({
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
      });

      res.cookie('rftk', tokens.refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      responseHandler.ok(res, {
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      responseHandler.error(res, error);
    }
  }

  static async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.rftk;

      if (!refreshToken) {
        return responseHandler.unauthorize(res, { err: 'User not Login!' });
      }

      jwt.verify(
        refreshToken,
        config.jwt.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) {
            return responseHandler.unauthorize(res, { err });
          }

          const foundUser = await userModel.findById(decoded.id);

          if (!foundUser) {
            return responseHandler.unauthorize(res, { err: 'Unauthorized' });
          }

          const tokens = generateTokens({
            id: foundUser.id,
            username: foundUser.username,
            displayName: foundUser.displayName,
          });

          res.cookie('rftk', tokens.refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          responseHandler.ok(res, { accessToken: tokens.accessToken });
        }
      );
    } catch (error) {
      responseHandler.error(res, error);
    }
  }

  static async signOut(req, res) {
    try {
      const cookies = req.cookies;

      if (!cookies?.rftk) {
        return res.sendStatus(204);
      }

      res.clearCookie('rftk', { httpOnly: true });

      responseHandler.ok(res, { msg: 'Sign Out Successfully!' });
    } catch (error) {
      responseHandler.error(res, error);
    }
  }
}

export default authController;
