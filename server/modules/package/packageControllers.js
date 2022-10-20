const catchAsync = require("../../core/utils/catchAsync");
const { Op } = require("sequelize");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const PackageModel = require("./Package");
const OrderModel = require("../order/Order");
const AppError = require("../../core/utils/appError");
const User = require("../user/User");

exports.getAllPackages = catchAsync(async (req, res, next) => {
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder.paginate().limitFields();

	let allPackages = await PackageModel.findAndCountAll({
		...queryBuilder.queryOptions,
		include: {
			model: User,
			as: "storeOwner",
			attributes: ["firstName", "lastName"],
		},
	});
	allPackages = queryBuilder.createPagination(allPackages);

	res.status(200).json({
		status: "success",
		message: "Barcha packagelarni ro`yhati",
		errors: null,
		data: {
			allPackages,
		},
	});
});

exports.getOrdersByPackage = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const ordersbyPackage = await OrderModel.findAll({
		where: { packageId: { [Op.eq]: id } },
	});

	res.status(200).json({
		status: "success",
		message: "id bo`yicha package ma`lumotlari",
		errors: null,
		data: {
			ordersbyPackage,
		},
	});

	if (!byIdPackage) {
		return next(new AppError("Bunday package tizimda yo`q", 403));
	}
	res.status(200).json({
		status: "success",
		message: "id bo`yicha package ma`lumotlari",
		errors: null,
		data: {
			byIdPackage,
		},
	});
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
	const { id } = req.user;
	const myOrdersByPackage = await PackageModel.findAll({
		where: {
			storeOwnerId: {
				[Op.eq]: id,
			},
		},
		include: { model: OrderModel, as: "orders" },
	});
	res.json(myOrdersByPackage);
});
