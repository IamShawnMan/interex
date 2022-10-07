const express = require("express")
const userController = require("./userController")
const {isCourier} = require("./userMiddleware")
const {loginValidator} = require("./userValidator")

const router = express.Router()

router
        .get("/", userController.getUsers)
        .post("/", isCourier, loginValidator,
         userController.createUsers)
router.get("/roles", userController.getUserRole)
router   
    .route("/:id")
        .get(userController.getById)
        .patch(userController.updateUsers)

module.exports = router