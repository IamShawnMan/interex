const express = require("express");
const router = express.Router();
const postBackController = require("./postBackController");

module.exports = router
  .get("/rejected/orders", postBackController.rejectedOrdersBeforeSend)
  .get("/rejected/coming", postBackController.getTodaysRejectedPost)
  .get("/rejected/count", postBackController.countRejectedOrders)
  .post("/new/rejected", postBackController.createPostForAllRejectedOrders)
  .put("/:id/send/rejected", postBackController.sendRejectedPost)
  .get("/rejectedposts", postBackController.getAllRejectedPosts)
  .get("/rejectedposts/:id", postBackController.getAllRejectedOrdersInPost)
  .put("/new/receiverejectedpost", postBackController.receiveRejectedOrders)
