const express = require("express")
const userController = require("./userController")
const {isCourier} = require("../../core/middlewares/userMiddleware")
const {loginValidator} = require("./userValidator")
const statusMiddleware = require("../../core/middlewares/statusMiddleware")

const router = express.Router()

router
        .get("/", statusMiddleware, userController.getUsers)
        .post("/", isCourier, loginValidator,
         userController.createUsers)
router.get("/roles", userController.getUserRole)
router   
    .route("/:id")
        .get(loginValidator, userController.getById)
        .put(userController.updateUsers)  
router.put("/:id/:status", userController.updateStatus)   

module.exports = router