const packageControllers = require("./packageControllers")
const roleMiddleware = require("../../core/middlewares/roleMiddleware")
const router = require("express").Router()

router
    .route("/myorders")
    .get(roleMiddleware(["STORE_OWNER"]), packageControllers.getMyOrders)

router
    .route("/:id")
    .get(roleMiddleware(["SUPER_ADMIN", "ADMIN"]),packageControllers.getByidPackage)

router
    .route("/")
    .get(roleMiddleware(["SUPER_ADMIN", "ADMIN"]), packageControllers.getAllPackage)

module.exports = router;