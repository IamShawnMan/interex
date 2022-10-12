const router = require("express").Router();
const orderControllers = require("./orderControllers");
router.route("/").get(orderControllers.getAllOrders);

module.exports = router;
