const express = require("express");
const router = express.Router();
const postController = require("./postController");

module.exports = router
	.get("/", postController.getAllPosts)
	.get("/:id", postController.getPostById)
	.get("/regions/:id", postController.getPostByRegionId)
	.get("/:id/orders", postController.getOrdersInPost)
	.get("/:regionId/regionorders", postController.ordersBeforeSend)
	.get("/new/regions", postController.existRegions)
	.get("/status/new", postController.newPosts)
	.get("/new/coming", postController.getTodaysPost)
	.put("/new/recieve", postController.recievePost)
	.post("/new", postController.createPostForAllOrders)
	.put("/new/customized", postController.createPostForCustomOrders)
	.put("/:id/send", postController.sendPost);
