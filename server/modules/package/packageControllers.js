const catchAsync = require("../../core/utils/catchAsync");
const { Op } = require("sequelize");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const PackageModel = require("./Package");
const OrderModel = require("../order/Order");
const AppError = require("../../core/utils/AppError");
const UserModel = require("../user/User");
const DistrictModel = require("../district/District")
const RegionModel = require("../region/Region")
const statusPackages = require("../../core/constants/packageStatus")


exports.getAllPackages = catchAsync(async (req, res, next) => {
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder.filter().paginate().limitFields().sort();
	
	queryBuilder.queryOptions.include = {
		model: UserModel,
		as: "storeOwner",
		attributes: ["firstName", "lastName", "storeName"],
	}
	let allPackages = await PackageModel.findAndCountAll(queryBuilder.queryOptions);
	allPackages = queryBuilder.createPagination(allPackages);

	res.status(200).json({
		status: "success",
		message: "Barcha paketlar ro`yhati",
		errors: null,
		data: {
			...allPackages,
		},
	});
});

exports.getDailyPackages = catchAsync(async(req,res,next)=>{
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder.filter().paginate().limitFields().sort();
	
	queryBuilder.queryOptions.include = {
		model: UserModel,
		as: "storeOwner",
		attributes: ["firstName", "lastName", "storeName"],
	}
	queryBuilder.queryOptions.where = {
		...queryBuilder.queryOptions.where, 
		where: {packageStatus: {[Op.eq]: statusPackages.STATUS_NEW}}
	}

	let dailyPackages = await PackageModel.findAndCountAll(queryBuilder.queryOptions);
	dailyPackages = queryBuilder.createPagination(dailyPackages);

	res.status(200).json({
		status: "success",
		message: "Kunlik paketlarni ro`yhati",
		errors: null,
		data: {
			...dailyPackages,
		},
	});
})

exports.getOrdersByPackage = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	req.query.packageId = id
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder.paginate().limitFields().sort().filter().search(["recipient", "recipientPhoneNumber"]);
	queryBuilder.queryOptions.include = [
		{model: UserModel, as: "storeOwner", attributes: ["storeName"]},
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