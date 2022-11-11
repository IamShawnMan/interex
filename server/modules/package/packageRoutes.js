const packageControllers = require("./packageControllers")
const roleMiddleware = require("../../core/middlewares/roleMiddleware")
const router = require("express").Router()

router
    .route("/")
    .get(roleMiddleware(["SUPER_ADMIN", "ADMIN"]), packageControllers.getAllPackages)
router
    .route("/daily")
    .get(roleMiddleware(["SUPER_ADMIN", "ADMIN"]), packageControllers.getDailyPackages)
router
    .route("/:id/orders")
    .get(roleMiddleware(["SUPER_ADMIN", "ADMIN"]), packageControllers.getOrdersByPackage)


module.exports = router;