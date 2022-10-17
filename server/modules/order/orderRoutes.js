const router = require("express").Router();
const roleMiddleware = require("../../core/middlewares/roleMiddleware");
const orderControllers = require("./orderControllers");
const orderValidator = require("./orderExpressValidator");

router
    .route("/")
    .get(roleMiddleware(["ADMIN", "SUPER_ADMIN"]),orderControllers.getAllOrders)
    .post(roleMiddleware(["STORE_OWNER"]), orderValidator, orderControllers.createOrder
);
    // router
    //     .route("/orderstatus")
    //     .get(roleMiddleware(["ADMIN"]), orderControllers.getAdminOrderStatus)
router
    .route("/:id")
    .get(orderControllers.getOrderById)
    .patch(roleMiddleware(["ADMIN", "COURER"]), orderControllers.changeOrderStatus )
    ;

module.exports = router;
