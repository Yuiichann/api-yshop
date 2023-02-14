import { categoryList, scaleList } from '../constants/figures.constants.js';
import responseHandler from '../handlers/response.handler.js';
import figureModel from '../models/figure.models.js';

const LIMIT_ITEM = 30;

class figureController {
  async getFigures(req, res) {
    try {
      // lấy tất cả các query page, search, sort, category, scale nếu có
      let page = req.query.page || 1;
      let search = req.query.search || ''; // mặc định: ''
      let sort = req.query.sort || 'title'; // mặc định: sort title acs
      let category = req.query.category || 'all'; // mặc định: all
      let scale = req.query.scale || 'all'; // mặc định: all

      // hỗ trợ query mongoose where-in
      if (category === 'all') {
        category = [...categoryList];
      } else {
        category = req.query.category.split(',');
      }

      // hỗ trợ query mongoose where-in
      if (scale === 'all') {
        scale = [...scaleList];
      } else {
        scale = req.query.scale.split(',');
      }

      // kiểm tra sort
      if (req.query.sort) {
        sort = req.query.sort.split(',');
      } else {
        sort = [sort];
      }

      let sortBy = {};

      if (sort[1]) {
        if (sort[1] !== 'asc' && sort[1] !== 'desc') {
          return responseHandler.badrequest(res, {
            err: "Query Sort contains only 2 values: 'asc' or 'desc'",
          });
        }

        sortBy[sort[0]] = sort[1];
      } else {
        sortBy[sort[0]] = 'asc';
      }

      // đểm tổng số items
      const totalItems = await figureModel.countDocuments({
        title: { $regex: search, $options: 'i' },
        category: { $in: category },
        scale: { $in: scale },
      });

      // tính tổng số trang
      const totalPage = Math.ceil(totalItems / LIMIT_ITEM);

      // get data
      const figures = await figureModel
        .find({
          title: { $regex: search, $options: 'i' },
        })
        .select('-collections -description')
        .where('scale')
        .in(scale)
        .where('category')
        .in(category)
        .sort(sortBy)
        .skip((page - 1) * LIMIT_ITEM)
        .limit(LIMIT_ITEM)
        .exec();

      responseHandler.ok(res, { totalItems, totalPage, figures });
    } catch (error) {
      responseHandler.error(res, error);
    }
  }

  async getDetail(req, res) {
    try {
      const { slug } = req.params;

      const figure = await figureModel.findOne({ slug });

      if (!figure) {
        return responseHandler.notfound(res);
      }

      responseHandler.ok(res, figure);
    } catch (error) {
      responseHandler.error(res, error);
    }
  }
}

export default new figureController();
