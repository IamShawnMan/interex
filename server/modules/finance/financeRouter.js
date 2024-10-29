const express = require("express");
const router = express.Router();
const financeController = require("./financeController");
const roleMiddleware = require("../../core/middlewares/roleMiddleware");
const userRoles = require("../../core/constants/userRole");

module.exports = router.get(
  "/",
  roleMiddleware([userRoles.SUPER_ADMIN, userRoles.ADMIN]),
  financeController.calculateAndGetAllDebts
);
