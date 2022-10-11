const express = require("express")
const userController = require("./userController")
const {loginValidator} = require("./userValidator")

const router = express.Router()

router
        .get("/", userController.getUsers)
        .post("/", loginValidator,
         userController.createUsers)
router.get("/roles", userController.getUserRole)
router   
    .route("/:id")
        .get(loginValidator, userController.getById)
        .patch(userController.updateUsers)

module.exports = router