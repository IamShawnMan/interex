const packageBackControllers = require("./packageBackControllers")
const roleMiddleware = require("../../core/middlewares/roleMiddleware")
const router = require("express").Router()

router
    .route("/")
    .get(roleMiddleware(["ADMIN"]), packageBackControllers.getAllRejectedDelivered)
router
    .route("/daily")
    .get(roleMiddleware(["STORE_OWNER"]), packageBackControllers.updateRejDevOrdersinStoreOwner)

module.exports = router;