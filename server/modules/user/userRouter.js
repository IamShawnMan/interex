const express = require("express")
const userController = require("./userController")
const {loginValidator, numberValidator} = require("./userValidator")

const router = express.Router()

router
        .get("/", userController.getUsers)
        .post("/", loginValidator, numberValidator,
         userController.createUsers)
router.get("/roles", userController.getUserRole)
router   
    .route("/:id")
        .get(loginValidator, numberValidator, userController.getById)
        .patch(userController.updateUsers)

module.exports = router