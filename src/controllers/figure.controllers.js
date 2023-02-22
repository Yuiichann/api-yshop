import { categoryList, scaleList } from '../constants/figures.constants.js';
import responseHandler from '../handlers/response.handler.js';
import figureModel from '../models/figure.models.js';

const LIMIT_ITEM = 24; // limit item in one page

class figureController {
  // @route GET /api/v1/figures
  // @desc GET list figures
  // @access Public
  // @query page, search, category, scale, range_price
  async getFigures(req, res) {
    try {
      // lấy tất cả các query page, search, sort, category, scale nếu có
      let page = req.query.page || 1;
      let search = req.query.search || ''; // mặc định: ''
      let sort = req.query.sort || 'title'; // mặc định: sort title acs
      let category = req.query.category || 'all'; // mặc định: all
      let scale = req.query.scale || 'all'; // mặc định: all
      let range_price = req.query.range_price || '';

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

      // xử lý khoảng giá
      if (range_price !== '') {
        const arr = range_price.split(','); // tách query ra thành mảng [start, end]

        const minPrice = Number(arr[0]); // convert sang number giá trị start
        const maxPrice = Number(arr[1]); // convert sang number giá trị end

        if (isNaN(minPrice) || isNaN(maxPrice)) {
          return responseHandler.badrequest(res, {
            err: "Query 'range_price' is invalid!",
          });
        }

        range_price = [minPrice, maxPrice]; // item 1 là giá trị nhỏ nhất, còn kia là giá trị lớn nhất
      } else {
        range_price = [0, 999999999]; // item 1 là giá trị nhỏ nhất, còn kia là giá trị lớn nhất
      }

      // đểm tổng số items
      const totalItems = await figureModel.countDocuments({
        title: { $regex: search, $options: 'i' },
        category: { $in: category },
        scale: { $in: scale },
        price: { $gte: range_price[0], $lte: range_price[1] },
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
        .where('price')
        .gte(range_price[0])
        .lte(range_price[1])
        .skip((page - 1) * LIMIT_ITEM)
        .limit(LIMIT_ITEM)
        .exec();

      if (figures.length === 0) {
        return responseHandler.notfound(res);
      }

      responseHandler.ok(res, { totalItems, totalPage, figures });
    } catch (error) {
      responseHandler.error(res, error);
    }
  }

  // @route GET /api/v1/figures/details/:slug
  // @desc Get detail figure by slug
  // @access Public
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

  // @route GET /api/v1/home-page
  // @desc get data home page
  // @access PUBLIC
  async getHomePage(req, res) {
    try {
      const popularFigures = await figureModel
        .find({})
        .select('-collections -description -size -character -publisher')
        .sort('-sold')
        .limit(15)
        .exec();

      const promotionFigures = await figureModel
        .find({})
        .select('-collections -description -size -character -publisher')
        .sort('-discount')
        .limit(15)
        .exec();

      const data = {
        popular: {
          title: 'Phổ biến',
          type: 'slider',
          items: popularFigures,
        },
        promotion: {
          title: 'Khuyễn mãi',
          type: 'slider',
          items: promotionFigures,
        },
      };

      responseHandler.ok(res, data);
    } catch (error) {
      responseHandler.error(res, error);
    }
  }
}

export default new figureController();
