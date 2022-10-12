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
    let err = new AppError("Validatsiya xatosi", 400);
    err.isOperational = false;
    err.errors = validationErrors.errors;
    return next(err);
  }

  const newOrder = OrderModel.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Yangi buyurtma tasdiqlandi",
    error: null,
    data: {
      newOrder,
    },
  });
});
