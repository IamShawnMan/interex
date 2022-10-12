const OrderModel = require("./Order");
const catchAsync = require("../../core/utils/catchAsync");
const OrderItemModel = require("../orderitem/OrderItem");
exports.getAllOrders = catchAsync(async (req, res, next) => {
  const allOrders = await OrderModel.findAll();
  const allOrderItems = await OrderItemModel.findAll();
  res.json({
    allOrders: allOrders,
    allOrderItems: allOrderItems,
  });
});
