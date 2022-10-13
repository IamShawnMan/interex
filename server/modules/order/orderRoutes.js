const router = require("express").Router();
const orderControllers = require("./orderControllers");
const orderValidator = require("./orderExpressValidator");
router.route("/").get(orderControllers.getAllOrders).post(
  // orderValidator.creatingOrderValidator,
  orderControllers.createOrder
);

module.exports = router;
