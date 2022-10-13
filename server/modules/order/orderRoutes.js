const router = require("express").Router();
const orderControllers = require("./orderControllers");
const orderValidator = require("./orderExpressValidator");
router.route("/").get(orderControllers.getAllOrders).post(
  // orderValidator.creatingOrderValidator,
  orderControllers.createOrder
);
router.route("/:id").get(orderControllers.getOrderById);

module.exports = router;
