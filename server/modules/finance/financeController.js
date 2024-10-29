const Finance = require("./Finance");
const { Op, Sequelize } = require("sequelize");
const catchAsync = require("../../core/utils/catchAsync");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const AppError = require("../../core/utils/AppError");
const User = require("../user/User");
const userRoles = require("../../core/constants/userRole");
const Debt = require("../debt/debtModule");

exports.calculateAndGetAllDebts = catchAsync(async (req, res, next) => {
  const courierDebts = await Debt.findAll({
    include: {
      model: "User",
      as: "user",
      where: {
        role: userRoles.COURIER,
      },
    },
    attributes: [[Sequelize.fn("SUM", Sequelize.col("debt")), "totalDebt"]],
  });

  const storeDebts = await Debt.findAll({
    include: {
      model: User,
      as: "user",
      where: { role: userRoles.STORE_OWNER }, // Assuming userRoles.STORE is defined as 'store'
    },
    attributes: [[Sequelize.fn("SUM", Sequelize.col("debt")), "totalDebt"]],
  });

  const totalCourierDebt = parseInt(
    courierDebts[0].dataValues.totalDebt || 0,
    10
  );
  const totalStoreDebt = parseInt(storeDebts[0].dataValues.totalDebt || 0, 10);

  const debtDifference = totalCourierDebt - totalStoreDebt;

  res.json({
    status: "success",
    message: "calculated debts",
    error: null,
    data: {
      totalCourierDebt,
      totalStoreDebt,
      debtDifference,
    },
  });
});
