const express = require("express");
const router = express.Router();
const debtController = require("./debtController");
const roleMiddleware = require("../../core/middlewares/roleMiddleware");
const userRoles = require("../../core/constants/userRole");

module.exports = router
  .get(
    "/",
    roleMiddleware([
      userRoles.ADMIN,
      userRoles.SUPER_ADMIN,
      userRoles.COURIER,
      userRoles.STORE_OWNER,
    ]),
    debtController.getAllDebts
  )
  .post(
    "/new",
    roleMiddleware([userRoles.ADMIN, userRoles.SUPER_ADMIN]),
    debtController.createDebt
  )
  .get(
    "/user/:id",
    roleMiddleware([userRoles.ADMIN, userRoles.SUPER_ADMIN]),
    debtController.getDebtByUserId
  );
