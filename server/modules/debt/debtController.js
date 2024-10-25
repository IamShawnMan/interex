const Debt = require("./debtModule");
const { Op } = require("sequelize");
const catchAsync = require("../../core/utils/catchAsync");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const AppError = require("../../core/utils/AppError");
const User = require("../user/User");

exports.getAllDebts = catchAsync(async (req, res, next) => {
  const query = req.query;
  const queryBuilder = new QueryBuilder(req, query);
  let allDebts = await Debt.findAndCountAll(queryBuilder.queryOptions);
  allDebts = queryBuilder.createPagination(allDebts);
  res.json({
    status: "success",
    message: "Barcha qarzlar",
    error: null,
    data: {
      ...allDebts,
    },
  });
});

exports.createDebt = catchAsync(async (req, res, next) => {
  const { userId, debt } = req.body;

  let newDebt = await Debt.create({
    debt: debt,
    userId: userId,
  });

  res.json({
    status: "success",
    message: "Debt created",
    error: null,
    data: newDebt,
  });
});

// exports.getAllDebts = catchAsync(async (req, res, next) => {
//   const { userRole } = req.user;
//   const query = req.query;
//   const queryBuilder = new QueryBuilder(req, query);

//   // if (userRole !== "ADMIN" || userRole !== "SUPER_ADMIN") {
//   //   return next(new AppError("Only ADMIN and SUPER_ADMIN can access", 403));
//   // }

//   let allDebts = await Debt.findAll();
//   allDebts = queryBuilder.createPagination(allDebts);
// });

exports.getCouriersDebt = catchAsync(async (req, res, next) => {
  const { userRole } = req.user;

  if (userRole === "STORE_OWNER") {
    return next(
      new AppError("Only ADMINS and COURIERS can access this route", 403)
    );
  }
  const courierDebts = await Debt.findAll({
    include: [
      {
        model: User,
        as: "user",
        where: {
          role: "COURIER",
        },
      },
    ],
  });

  res.json({
    status: "success",
    message: "Couriers debt",
    error: null,
    data: {
      ...courierDebts,
    },
  });
});
