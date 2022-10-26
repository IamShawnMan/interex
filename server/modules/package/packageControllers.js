const catchAsync = require("../../core/utils/catchAsync");
const { Op } = require("sequelize");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const PackageModel = require("./Package");
const OrderModel = require("../order/Order");
const AppError = require("../../core/utils/appError");
const User = require("../user/User");
const DistrictModel = require("../district/District")
const RegionModel = require("../region/Region")


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
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder.paginate().limitFields().sort().filter().search(["recipient", "recipientPhoneNumber"]);
	let ordersbyPackage = await OrderModel.findAndCountAll({
		...queryBuilder.queryOptions,
		include: [
			{model: DistrictModel, as: "district", attributes: ["name"]},
			{model: RegionModel, as: "region", attributes: ["name"]}
		],
		where: { packageId: { [Op.eq]: id } },
	});
	ordersbyPackage = queryBuilder.createPagination(ordersbyPackage)
	res.status(200).json({
		status: "success",
		message: "id bo`yicha package ma`lumotlari",
		errors: null,
		data: {
			ordersbyPackage,
		},
	});
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
	const { id } = req.user;
	const queryBuilder = new QueryBuilder(req.query)

	queryBuilder.paginate().filter().limitFields().search(["recipient", "recipientPhoneNumber"]).sort()
	const myPackage = await PackageModel.findOne({
		where: {storeOwnerId: {[Op.eq]: id}}
	});
	if(!myPackage){
		return next(new AppError("Package mavjud emas", 404))
	}

	let myOrders = await OrderModel.findAndCountAll({
		...queryBuilder.queryOptions, 
		include: [
			{model: RegionModel, as: "region", attributes: ["name"] }, 
			{model: DistrictModel, as: "district", attributes: ["name"]}
		], 
	where: {packageId: {[Op.eq]: myPackage.id}}})
	
	myOrders = queryBuilder.createPagination(myOrders)
	res.json({
		status: "success",
		message: "Magazinga tegishli bo`lgan buyurtmalar",
		errors: null,
		data: {myOrders}
	});
});
