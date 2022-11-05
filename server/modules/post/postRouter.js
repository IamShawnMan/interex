const express = require("express");
const router = express.Router();
const postController = require("./postController");

module.exports = router
  .get("/", postController.getAllPosts)
  .get("/:id", postController.getPostById)
  .get("/regions/:id", postController.getPostByRegionId)
  .get("/:postId/orders", postController.getOrdersInPost)
  .get("/:regionId/regionorder", postController.ordersBeforeSend)
  .get("/new/regions", postController.existRegions)
  .get("/status/new", postController.newPosts)
  .get("/new/coming", postController.getTodaysPost)
  .post("/new", postController.createPostForAllOrders)
  .put("/new/customized", postController.createPostForCustomOrders)
  .put("/:id/send", postController.sendPost);
