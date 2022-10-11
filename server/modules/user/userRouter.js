const express = require("express")
const userController = require("./userController")
const {loginValidator, userValidator} = require("./userValidator")

const router = express.Router()

router
        .get("/", userController.getUsers)
        .post("/", loginValidator, userValidator,
         userController.createUsers)
router.get("/roles", userController.getUserRole)
router   
    .route("/:id")
        .get(loginValidator, userValidator, userController.getById)
        .patch(userController.updateUsers)

module.exports = router