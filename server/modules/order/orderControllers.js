const OrderModel = require("./Order");
const { Op } = require("sequelize");
const catchAsync = require("../../core/utils/catchAsync");
const OrderItemModel = require("../orderitem/OrderItem");
const { validationResult } = require("express-validator");
const AppError = require("../../core/utils/appError");
const OrderItem = require("../orderitem/OrderItem");
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const allOrders = await OrderModel.findAndCountAll();
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
  console.log(id);

  const orderById = await OrderModel.findByPk(id, {
    include: { model: OrderItemModel, as: "item" },
  });
  res.send(orderById);
});
