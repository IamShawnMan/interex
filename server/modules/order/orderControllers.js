const OrderModel = require("./Order");
const catchAsync = require("../../core/utils/catchAsync");
const OrderItemModel = require("../orderitem/OrderItem");
const { validationResult } = require("express-validator");
const AppError = require("../../core/utils/appError");
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
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors);
    let err = new AppError("Validatsiya xatosi", 400);
    err.isOperational = false;
    err.errors = validationErrors.errors;
    return next(err);
  }
  const {
    recipient,
    note,
    orderStatus,
    deliveryPrice,
    totalPrice,
    regionId,
    name,
    quantity,
    price,
  } = req.body;
  const orderObj = {
    recipient,
    note,
    orderStatus,
    deliveryPrice,
    totalPrice,
    regionId,
  };
  const orderitemObj = {
    name,
    quantity,
    price,
    totalPrice: quantity * price,
  };
  const newOrder = await OrderModel.create(orderObj);
  const orderItems = await OrderItemModel.create({
    regionId: newOrder.id,
    ...orderitemObj,
  });
  res.status(201).json({
    status: "success",
    message: "Yangi buyurtma tasdiqlandi",
    error: null,
    data: {
      newOrder,
      orderItems,
    },
  });
});
