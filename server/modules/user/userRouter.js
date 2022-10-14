const express = require("express");
const { body } = require("express-validator");
const roleMiddleware = require("../../core/middlewares/roleMiddleware");
const userController = require("./userController");
const { loginValidator } = require("./userValidator");

const router = express.Router();

router
	.get("/", roleMiddleware(["SUPER_ADMIN", "ADMIN"]), userController.getUsers)
	.post("/", roleMiddleware("SUPER_ADMIN"), loginValidator, userController.createUsers);
router.get("/roles", userController.getUserRole);
router
	.route("/:id")
	.get(roleMiddleware(["SUPER_ADMIN", "ADMIN"]), userController.getById)
	.put(loginValidator, userController.updateUsers);
router.put("/:id/status", roleMiddleware("SUPER_ADMIN"), userController.updateStatus)
router.put("/:id/password", roleMiddleware(["ADMIN", "COURIER", "STORE_OWNER"]),
        body("password")
        .notEmpty()
		.withMessage("Parol bo'sh bo'lishi mumkin emas")
		.isLength({ min: 6 })
		.withMessage("Parol 6 ta belgidan kam bo'lmasligi kerak") , 
        userController.updatePassword)

module.exports = router;
