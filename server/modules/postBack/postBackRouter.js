const express = require("express");
const router = express.Router();
const postBackController = require("./postBackController");

module.exports = router
	.get("/rejected/orders", postBackController.rejectedOrdersBeforeSend)
	.get("/rejected/coming", postBackController.getTodaysRejectedPost)
	.post("/new/rejected", postBackController.createPostForAllRejectedOrders)
	.put("/:id/send/rejected", postBackController.sendRejectedPost);
