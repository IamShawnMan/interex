const packageControllers = require("./packageControllers")
const router = require("express").Router()
router
    .route("/")
    .get(packageControllers.getAllPackage)

router
    .route("/:id")
    .get(packageControllers.getByidPackage)

module.exports = router;