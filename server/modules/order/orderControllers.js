const OrderModel = require("./Order");
const { Op } = require("sequelize");
const catchAsync = require("../../core/utils/catchAsync");
const OrderItemModel = require("../orderitem/OrderItem");
const { validationResult } = require("express-validator");
const AppError = require("../../core/utils/appError");
const OrderItem = require("../orderitem/OrderItem");
const QueryBuilder = require("../../core/utils/QueryBuilder")
exports.getAllOrders = catchAsync(async (req, res, next) => {

  const queryBuilder = new QueryBuilder(req.query)
  queryBuilder.paginate().limitFields()

  let allOrders = await OrderModel.findAndCountAll({...queryBuilder.queryOptions});
  allOrders = queryBuilder.createPagination(allOrders)
  res.json({
    status: "success",
    message: "Barcha buyurtmalar",
    error: null,
    data: {
      allOrders,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const orders = req.body;
  
  orders.forEach(async order => {
    const newOrder = await OrderModel.create({
      recipient: order.recipient,
      regionId: order.regionId,
    });

    order.items.forEach(async (item, index) => {
      let sum = Number();

      const newItem = await OrderItemModel.create({
        orderId: newOrder.id,
        orderItemTotalPrice: item.quantity * item.price,
        ...item,
      });
    });
    //
  });

  res.send("order");
  //
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;



  const orderById = await OrderModel.findByPk(id, {
    include: { model: OrderItemModel, as: "item" },
  });

  if(!orderById){
    return next(new AppError("bunday ID order topilmadi", 404))
  }

  res.send(orderById);
});
