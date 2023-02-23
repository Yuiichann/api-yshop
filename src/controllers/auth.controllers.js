import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../configs/config.js';
import responseHandler from '../handlers/response.handler.js';
import userModel from '../models/user.models.js';
import generateTokens from '../utils/generateTokens.utils.js';

// số vòng hash password
const saltRounds = 10;

class authController {
  // @route [POST] /api/v1/auth/signup
  // @desc POST data to Sign Up
  // @access Public
  async signUp(req, res) {
    try {
      const { username, password, email, displayName } = req.body;

      const checkExists = await userModel.findOne({
        $or: [{ email }, { username }],
      });

      if (checkExists) {
        return responseHandler.badrequest(res, {
          err: 'Username or email already exists!',
        });
      }

      const hashPassword = bcrypt.hashSync(password, saltRounds);

      const newUser = new userModel({
        username,
        password: hashPassword,
        displayName,
        email,
        phone_number: req.body.phone_number,
        address: req.body.address,
      });

      await newUser.save();

      const tokens = generateTokens({
        id: newUser.id,
        role: newUser.role,
      });

      res.cookie('rftk', tokens.refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      responseHandler.ok(res, { accessToken: tokens.accessToken });
    } catch (error) {
      responseHandler.error(res, error);
    }
  }

  // @route [POST] /api/v1/auth/signin
  // @desc POST data to Sign In
  // @access Public
  async signIn(req, res) {
    try {
      const cookies = req.cookies;

      if (cookies && cookies.rftk) {
        return responseHandler.badrequest(res, {
          err: 'Mày đã loggin rồi đấy!!',
        });
      }

      const { username, password } = req.body;

      const currentUser = await userModel.findOne({ username });

      if (!currentUser) {
        return responseHandler.notfound(res, {
          err: 'Username hoặc password không đúng!',
        });
      }

      const checkPassword = await bcrypt.compare(
        password,
        currentUser.password
      );

      if (!checkPassword) {
        return responseHandler.badrequest(res, {
          err: 'Username hoặc password không đúng!',
        });
      }

      const tokens = generateTokens({
        id: currentUser.id,
        role: currentUser.role,
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

  // @route [POST] /api/v1/auth/refreshToken
  // @desc Post to get new Access Token
  // @access Private
  async refreshToken(req, res) {
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
            res.clearCookie('rftk', { httpOnly: true }); // xóa refreshToken hết hạn
            return responseHandler.unauthorize(res, { err });
          }

          const foundUser = await userModel.findById(decoded.id);

          if (!foundUser) {
            return responseHandler.unauthorize(res, { err: 'Unauthorized' });
          }

          const tokens = generateTokens({
            id: foundUser.id,
            role: foundUser.role,
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

  // @route [DELETE] /api/v1/auth/signup
  // @desc DELETE token to Sign Out
  // @access Private
  async signOut(req, res) {
    try {
      const cookies = req.cookies;

      if (!cookies?.rftk) {
        return res.sendStatus(204);
      }

      res.clearCookie('rftk', { httpOnly: true });

      responseHandler.ok(res, { message: 'Đăng xuất thành công!!!' });
    } catch (error) {
      responseHandler.error(res, error);
    }
  }
}

export default new authController();
