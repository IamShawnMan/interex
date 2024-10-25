const express = require("express");
const router = express.Router();
const debtController = require("./debtController");
const roleMiddleware = require("../../core/middlewares/roleMiddleware");

module.exports = router
  .get(
    "/",
    roleMiddleware(["SUPER_ADMIN", "ADMIN"]),
    debtController.getAllDebts
  )
  .post(
    "/new",
    roleMiddleware(["ADMIN", "SUPER_ADMIN"]),
    debtController.createDebt
  )
  .get(
    "/alldebts",
    roleMiddleware(["ADMIN", "SUPER_ADMIN"]),
    debtController.getAllDebts
  )
  .get(
    "/couriersdebt",
    roleMiddleware(["ADMIN", "SUPER_ADMIN", "COURIER"]),
    debtController.getCouriersDebt
  );
