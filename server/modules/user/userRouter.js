const express = require("express");
const roleMiddleware = require("../../core/middlewares/roleMiddleware");
const userController = require("./userController");
// const { loginValidator, numberValidator } = require("./userValidator");

const router = express.Router();

router
	.get("/", roleMiddleware(["SUPER_ADMIN", "ADMIN"]), userController.getUsers)
	.post("/", roleMiddleware("SUPER_ADMIN"), userController.createUsers);
router.get("/roles", userController.getUserRole);
router
	.route("/:id")
	.get(roleMiddleware("SUPER_ADMIN", "ADMIN"), userController.getById)
	.patch(userController.updateUsers);

module.exports = router;
