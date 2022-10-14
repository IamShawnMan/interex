const router = require("express").Router();
const roleMiddleware = require("../../core/middlewares/roleMiddleware");
const orderControllers = require("./orderControllers");
const orderValidator = require("./orderExpressValidator");

router
    .route("/")
    .get(orderControllers.getAllOrders)
    .post(
      roleMiddleware(["STORE_OWNER"]),
  // orderValidator.creatingOrderValidator,
  orderControllers.createOrder
);
router.route("/:id").get(orderControllers.getOrderById);

module.exports = router;
