import responseHandler from '../handlers/response.handler.js';
import userModel from '../models/user.models.js';

class userController {
  // @route [GET] /api/v1/user/info
  // @desc Get Info Current User
  // @access Private
  async getInfoUser(req, res) {
    try {
      const userId = req.user.id;

      const user = await userModel
        .findById(userId)
        .select('-createdAt -updatedAt -password');

      if (!user) {
        return responseHandler.notfound(res);
      }

      responseHandler.ok(res, user);
    } catch (error) {
      responseHandler(res, error);
    }
  }
}

export default new userController();
