import responseHandler from '../handlers/response.handler.js';
import userModel from '../models/user.models.js';
import cloudinary from '../configs/cloudinary.configs.js';
import bcrypt from 'bcrypt';

const saltRounds = 10;

class userController {
  // @route [GET] /api/v1/users/info
  // @desc Get Info Current User
  // @access Private
  async getInfoUser(req, res) {
    try {
      const userId = req.user.id;

      const user = await userModel
        .findById(userId)
        .select('-createdAt -updatedAt -password -role');

      if (!user) {
        return responseHandler.notfound(res, {
          err: 'Người dùng không hợp lệ!!!',
        });
      }

      responseHandler.ok(res, user);
    } catch (error) {
      responseHandler(res, error);
    }
  }

  // @route [PUT] /api/v1/users/set-avatar
  // @desc set avatar user
  // @access Private
  async setAvatar(req, res) {
    try {
      const user = req.user;
      const avatarImage = req.file;

      const uploadAvatar = await cloudinary.uploader.upload(avatarImage.path, {
        folder: `api-yshop/avatar/${user.id}`,
      });

      await userModel.findByIdAndUpdate(user.id, {
        avatar: uploadAvatar.secure_url,
      });

      responseHandler.ok(res, { msg: 'Set avatar successfully!' });
    } catch (error) {
      responseHandler(res, error);
    }
  }

  // @route [PUT] /api/v1/users/update-password
  // @desc check and update password
  // @access PRIVATE
  async updatePassword(req, res) {
    try {
      const user = req.user;
      const { password, newPassword, confirm_newPassword } = req.body;

      if (newPassword !== confirm_newPassword) {
        return responseHandler.badrequest(res, {
          err: 'Mật khẩu không trùng khớp!!!',
        });
      }

      const currentUser = await userModel.findById(user.id);

      if (!currentUser) {
        return responseHandler.notfound(res, { err: 'Không tìm thấy user!!!' });
      }

      const checkPasswordCorrect = bcrypt.compareSync(
        password,
        currentUser.password
      );

      if (!checkPasswordCorrect) {
        return responseHandler.badrequest(res, {
          err: 'Mật khẩu user không hợp lệ!!!',
        });
      }

      const hashPwd = bcrypt.hashSync(newPassword, saltRounds);

      currentUser.password = hashPwd;

      await currentUser.save();

      responseHandler.ok(res, { message: 'Thay đổi mật khẩu thành công!' });
    } catch (error) {
      responseHandler.error(res, error);
    }
  }
}

export default new userController();
