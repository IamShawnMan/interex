const packageControllers = require("./packageControllers")
const roleMiddleware = require("../../core/middlewares/roleMiddleware")
const router = require("express").Router()

router
    .route("/")
    .get(roleMiddleware(["SUPER_ADMIN", "ADMIN", "STORE_OWNER"]), packageControllers.getAllPackages)
router
    .route("/:id/orders")
    .get(roleMiddleware(["SUPER_ADMIN", "ADMIN", "STORE_OWNER"]), packageControllers.getOrdersByPackage)

module.exports = router;