const Debt = require("./debtModule");
const { Op } = require("sequelize");
const catchAsync = require("../../core/utils/catchAsync");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const AppError = require("../../core/utils/AppError");
const User = require("../user/User");
const userRoles = require("../../core/constants/userRole");

exports.getAllDebts = catchAsync(async (req, res, next) => {
  const query = req.query;
  const queryBuilder = new QueryBuilder(req, query);
  const { userRole } = req.user;

  let allCourierDebts = await Debt.findAndCountAll({
    include: [
      {
        model: User,
        as: "user",
        where: {
          userRole: userRoles.COURIER,
        },
        attributes: [
          "firstName",
          "lastName",
          "userRole",
          "createdAt",
          "updatedAt",
        ],
      },
    ],
  });

  let allStoresDebt = await Debt.findAndCountAll({
    include: [
      {
        model: User,
        as: "user",
        where: {
          userRole: userRoles.STORE_OWNER,
        },
        attributes: [
          "firstName",
          "lastName",
          "userRole",
          "createdAt",
          "updatedAt",
        ],
      },
    ],
  });

  if (userRole === userRoles.ADMIN || userRole === userRoles.SUPER_ADMIN) {
    res.json({
      status: "success",
      message: "All debts",
      error: null,
      data: {
        couriersDebt: { ...allCourierDebts },
        storesDebt: { ...allStoresDebt },
      },
    });
  }

  if (userRole === userRoles.COURIER) {
    res.json({
      status: "success",
      message: "Couriers' debts",
      error: null,
      data: {
        ...allCourierDebts,
      },
    });
  }

  if (userRole === userRoles.STORE_OWNER) {
    res.json({
      status: "success",
      message: "Store owners' debts",
      error: null,
      data: {
        ...allStoresDebt,
      },
    });
  }
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

exports.getDebtByUserId = catchAsync(async (req, res, next) => {
  const query = req.query;
  const queryBuilder = new QueryBuilder(req, query);
  const { id } = req.params;

  let debtByUserId = await Debt.findAndCountAll({
    where: {
      userId: {
        [Op.eq]: id,
      },
    },
  });

  debtByUserId = queryBuilder.createPagination(debtByUserId);

  res.json({
    status: "success",
    message: "Debt by user Id",
    error: null,
    data: {
      ...debtByUserId,
    },
  });
});

// exports.getCouriersDebt = catchAsync(async (req, res, next) => {
//   const { userRole, userId } = req.user;

//   if (userRole === "STORE_OWNER") {
//     return next(
//       new AppError("Only ADMINS and COURIERS can access this route", 403)
//     );
//   }
//   const courierDebts = await Debt.findAndCountAll({
//     include: [
//       {
//         model: User,
//         as: "user",
//         where: {
//           userRole: "COURIER",
//         },
//         attributes: [
//           "firstName",
//           "lastName",
//           "userRole",
//           "createdAt",
//           "updatedAt",
//         ],
//       },
//     ],
//   });

//   res.json({
//     status: "success",
//     message: "Couriers debt",
//     error: null,
//     data: {
//       ...courierDebts,
//     },
//   });
// });

// exports.getStoresDebt = catchAsync(async (req, res, next) => {
//   const { userRole } = req.user;

//   if (userRole === "COURIER") {
//     return next(new AppError("Only ADMINS and STORE OWNERS can access", 403));
//   }
//   const storesDebt = await Debt.findAndCountAll({
//     include: [
//       {
//         model: User,
//         as: "user",
//         where: {
//           userRole: "STORE_OWNER",
//         },
//         attributes: [
//           "firstName",
//           "lastName",
//           "userRole",
//           "createdAt",
//           "updatedAt",
//         ],
//       },
//     ],
//   });

//   res.json({
//     status: "success",
//     message: "Store's debts",
//     error: null,
//     data: {
//       ...storesDebt,
//     },
//   });
// });
