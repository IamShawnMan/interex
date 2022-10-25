const router = require("express").Router();
const roleMiddleware = require("../../core/middlewares/roleMiddleware");
const orderControllers = require("./orderControllers");
const orderValidator = require("./orderExpressValidator");

router
	.route("/")
	.get(roleMiddleware(["ADMIN", "SUPER_ADMIN"]), orderControllers.getAllOrders)
	.post(
		roleMiddleware(["STORE_OWNER"]),
		orderValidator.creatingOrderValidator,
		orderControllers.createOrder
	);
router
	.route("/")
	.get(roleMiddleware(["ADMIN"]), orderControllers.adminOrderStatus);
router
	.route("/status")
	.get(orderControllers.getAllOrderStatus)
router
	.route("/:id")
	.get(orderControllers.getOrderById)
	.put(roleMiddleware(["STORE_OWNER"]),
		orderValidator.updatedOrderValidator, orderControllers.updateOrder)
	.patch(
		roleMiddleware(["ADMIN", "COURER"]),
		orderControllers.changeOrderStatus
	);
router
	.route("/:id/edit")
	.get(orderControllers.editOrder)


router.route("/devprice").get(orderControllers.getAllDeliveryPrice);
router.route("/region/:id").get(orderControllers.getOrdersbyRegion)

module.exports = router;
