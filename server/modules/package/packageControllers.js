const catchAsync = require("../../core/utils/catchAsync");
const { Op } = require("sequelize");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const PackageModel = require("./Package");
const OrderModel = require("../order/Order");
const AppError = require("../../core/utils/AppError");
const User = require("../user/User");
const DistrictModel = require("../district/District")
const RegionModel = require("../region/Region")


exports.getAllPackages = catchAsync(async (req, res, next) => {
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder.filter().paginate().limitFields().sort();
	
	queryBuilder.queryOptions.include = {
		model: User,
		as: "storeOwner",
		attributes: ["firstName", "lastName"],
	}
	let allPackages = await PackageModel.findAndCountAll(queryBuilder.queryOptions);
	allPackages = queryBuilder.createPagination(allPackages);

	res.status(200).json({
		status: "success",
		message: "Barcha packagelarni ro`yhati",
		errors: null,
		data: {
			...allPackages,
		},
	});
});

exports.getOrdersByPackage = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	req.query.packageId = id
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder.paginate().limitFields().sort().filter().search(["recipient", "recipientPhoneNumber"]);
	queryBuilder.queryOptions.include = [
		{model: User, as: "storeOwner", attributes: ["storeName"]},
		{model: DistrictModel, as: "district", attributes: ["name"]},
		{model: RegionModel, as: "region", attributes: ["name"]}
	]
	let ordersbyPackage = await OrderModel.findAndCountAll(queryBuilder.queryOptions);
	ordersbyPackage = queryBuilder.createPagination(ordersbyPackage)
	res.status(200).json({
		status: "success",
		message: "id bo`yicha package ma`lumotlari",
		errors: null,
		data: {
			...ordersbyPackage,
		},
	});
});