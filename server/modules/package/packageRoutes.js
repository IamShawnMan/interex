const packageControllers = require("./packageControllers")
const roleMiddleware = require("../../core/middlewares/roleMiddleware")
const router = require("express").Router()

router
    .route("/myorders")
    .get(roleMiddleware(["STORE_OWNER"]), packageControllers.getMyOrders)

    router
    .route("/")
    .get(roleMiddleware(["SUPER_ADMIN", "ADMIN"]), packageControllers.getAllPackages)

router
    .route("/:id/orders")
    .get(roleMiddleware(["SUPER_ADMIN", "ADMIN"]),packageControllers.getOrdersByPackage)


module.exports = router;