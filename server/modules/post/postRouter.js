const express = require("express");
const router = express.Router();
const postController = require("./postController");

module.exports = router
	.get("/", postController.getAllPosts)
	.get("/:id", postController.getPostById)
	.get("/regions/:id", postController.getPostByRegionId)
	.get("/:id/orders", postController.getOrdersInPost)
	.post("/new", postController.createPostForAllOrders)
	.put("/new/customized", postController.createPostForCustomOrders)
	.put("/:id/send", postController.sendPost);