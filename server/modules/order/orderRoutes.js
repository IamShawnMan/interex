const router = require("express").Router();
const roleMiddleware = require("../../core/middlewares/roleMiddleware");
const orderControllers = require("./orderControllers");
const orderValidator = require("./orderExpressValidator");

router
    .route("/")
    .get(roleMiddleware(["ADMIN", "SUPER_ADMIN"]),orderControllers.getAllOrders)
    .post(roleMiddleware(["STORE_OWNER"]), orderValidator.creatingOrderValidator, orderControllers.createOrder
);
    router
        .route("/ ")
        .get(roleMiddleware(["ADMIN"]), orderControllers.adminOrderStatus)
router
    .route("/:id")
    .get(orderControllers.getOrderById)
    .put(orderValidator.updatedOrderValidator, orderControllers.updateOrder)
    .patch(roleMiddleware(["ADMIN", "COURER"]), orderControllers.changeOrderStatus );

module.exports = router;
