import responseHandler from '../handlers/response.handler.js';
import userModel from '../models/user.models.js';
import cloudinary from '../configs/cloudinary.configs.js';

class userController {
  // @route [GET] /api/v1/users/info
  // @desc Get Info Current User
  // @access Private
  async getInfoUser(req, res) {
    try {
      const userId = req.user.id;

      const user = await userModel
        .findById(userId)
        .select('-createdAt -updatedAt -password -roll');

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
}

export default new userController();
