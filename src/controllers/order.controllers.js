import responseHandler from '../handlers/response.handler.js';
import figureModel from '../models/figure.models.js';
import orderModel from '../models/order.models.js';

const LIMIT_ITEM = 12;

class orderController {
  // @route POST /api/v1/orders/create
  // @desc create new purchase
  // @access Private
  async createOrder(req, res) {
    try {
      // lấy các value trong body
      let { address, phone_number, products } = req.body;

      // lấy thông tin user
      const user = req.user;

      // đơn hàng chỉ tối đa 10 sản phẩm, số lượng không giới hạn
      if (products.length > 10) {
        return responseHandler.badrequest(res, {
          err: 'Đơn hàng phải có ít hơn hoặc bằng 10 sản phẩm',
        });
      }

      // lấy dữ liệu figure theo id carts
      const figures = await figureModel
        .find()
        .select('in_stock title price id')
        .where('_id')
        .in(products.map((item) => item.figure_id));

      // mảng chưa các figure_id đã out-of-stock
      let products_out_stock = [];

      // kiểm tra sản phẩm in_stock
      for (let product of products) {
        let current = figures.find((item) => item.id === product.figure_id);

        current = current._doc;

        // nếu in_stock bằng 0 thì lỗi luôn
        if (current.in_stock === 0) {
          return responseHandler.unprocessableEntity(res, {
            err: `${current.title} is out-of-stock`,
          });
        }

        if (current && current['in_stock'] < product.quantity) {
          products_out_stock.push(product.figure_id);
        }
      }

      // nếu arr có item thì có sản phẩm hết hàng ==> return eror
      if (products_out_stock.length > 0) {
        return responseHandler.unprocessableEntity(res, {
          err: {
            msg: 'out-of-stock',
            products: products_out_stock,
          },
        });
      }

      // mọi thứ ok ==> xử lý dữ liệu và lưu vào db thôi
      let total_purchase = 0; // tổng tiền đơn hàng

      // update figure
      for (let product of products) {
        const quantity_purchase = parseInt(product.quantity);

        let current = figures.find((item) => item.id === product.figure_id);
        current = current._doc;

        const total = parseInt(current.price) * parseInt(product.quantity);

        product.total = total;
        total_purchase += total;

        await figureModel.findByIdAndUpdate(product.figure_id, {
          $inc: {
            in_stock: -quantity_purchase, // giảm số lượng in_stock
            sold: quantity_purchase, // tăng số lượng được mua
          },
        });

        // đổi key của obj
        product.figure = product.figure_id;
        delete product.figure_id;
      }

      const newOrder = new orderModel({
        uid: user.id,
        products,
        address,
        phone_number,
        payment_method: 'cash', // hiện tại mặc định phương thức thanh toán là tiền mặt
        total_purchase,
      });

      await newOrder.save();

      responseHandler.created(res, newOrder);
    } catch (error) {
      responseHandler.error(res, error);
    }
  }

  // @route GET /api/v1/orders/by-admin
  // @desc Get list purchase
  // @access Private(admin)
  async getOrdersByAdmin(req, res) {
    try {
      // let status = req.query.status;
      // let page = req.query.page || 1;

      const orders = await orderModel
        .find()
        .populate('uid', 'id username email')
        .populate('products.figure', '-collections -description')
        .exec();

      responseHandler.ok(res, orders);
    } catch (error) {
      responseHandler.error(res, error);
    }
  }

  // @route GET /api/v1/orders/by-admin/:orderId
  // @desc Get Detail Order by admin
  // @access Private(admin)
  async getOrderDetailByAdmin(req, res) {
    try {
      const { orderId } = req.params;

      const order = await orderModel
        .findOne({ _id: orderId })
        .populate('uid', 'id username email')
        .populate('products.figure', '-collections -description')
        .exec();

      if (!order) {
        return responseHandler.notfound(res, {
          err: 'Không tìm thấy đơn hàng!!!',
        });
      }

      responseHandler.ok(res, order);
    } catch (error) {
      responseHandler.error(res, error);
    }
  }

  // @route GET /api/v1/orders/of-user
  // @desc Get list purchases of User
  // @access Private
  async getOrdersOfUser(req, res) {
    try {
      const user = req.user;
      const orders = await orderModel
        .find({ uid: user.id })
        .populate('uid', 'id username email')
        .populate('products.figure', '-collections -description')
        .exec();

      responseHandler.ok(res, orders);
    } catch (error) {
      responseHandler.error(res, error);
    }
  }

  // @route GET /api/v1/orders/of-user/:orderId
  // @desc Get Detail Order by User
  // @access Private
  async getOrderDetailByUser(req, res) {
    try {
      const { orderId } = req.params;
      const user = req.user;

      const order = await orderModel
        .findOne({ _id: orderId, uid: user.id })
        .populate('uid', 'id username email')
        .populate('products.figure', '-collections -description')
        .exec();

      if (!order) {
        return responseHandler.notfound(res, {
          err: 'Không tìm thấy đơn hàng!',
        });
      }

      responseHandler.ok(res, order);
    } catch (error) {
      responseHandler.error(res, error);
    }
  }

  // @route PUT /api/v1/orders/update-status/:orderId
  // @desc update status of order
  // @access Private(admin)
  async updateStatus(req, res) {
    try {
      const { orderId } = req.params;
    } catch (error) {
      responseHandler.error(res, error);
    }
  }
}

export default new orderController();
