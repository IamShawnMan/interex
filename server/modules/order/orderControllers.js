const OrderModel = require("./Order");
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
    order.items.forEach(async item => {
      const newItems = await OrderItemModel.create({
        orderId: newOrder.id,
        orderItemTotalPrice: item.quantity * item.price,
        ...item,
      });
    });
    await newOrder.save();
  });
  // await OrderModel.bulkCreate(orders);
  res.send("order");
  // const validationErrors = validationResult(req);
  // if (!validationErrors.isEmpty()) {
  //   console.log(validationErrors);
  //   let err = new AppError("Validatsiya xatosi", 400);
  //   err.isOperational = false;
  //   err.errors = validationErrors.errors;
  //   return next(err);
  // }
  // const { recipient, note, orderStatus, regionId, name, quantity, price } =
  //   req.body;
  // const orderObj = {
  //   recipient,
  //   note,
  //   orderStatus,
  //   deliveryPrice,
  //   regionId,
  // };
  // const orderitemObj = {
  //   name,
  //   quantity,
  //   price,
  //   orderItemTotalPrice: quantity * price,
  // };
  // let newOrder = await OrderModel.create(orderObj);
  // const orderItems = await OrderItemModel.create({
  //   orderId: newOrder.id,
  //   ...orderitemObj,
  // });
  // newOrder.totalPrice = orderItems.orderItemTotalPrice;
  // newOrder = await newOrder.save();
  // res.status(201).json({
  //   status: "success",
  //   message: "Yangi buyurtma tasdiqlandi",
  //   error: null,
  //   data: {
  //     newOrder,
  //     orderItems,
  //   },
  // });
});
