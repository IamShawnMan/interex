const Region = require("./Region");
const { Op } = require("sequelize");
const catchAsync = require("../../core/utils/catchAsync");
const AppError = require("../../core/utils/appError");
const District = require("../district/District");

exports.getAllRegions = catchAsync(async (req, res, next) => {
	const allRegions = await Region.findAll();

	res.json({
		status: "success",
		message: "Barcha Viloyatlar",
		error: null,
		data: {
			allRegions,
		},
	});
});

exports.getRegionById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const regionById = await Region.findByPk(id);
	if (!regionById) {
		return next(new AppError("Bunday region mavjud emas", 404));
	}
	res.json({
		status: "success",
		message: "Tanlangan viloyat",
		error: null,
		data: {
			regionById,
		},
	});
});

exports.getDistrictByRegionId = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const getDistrictByRegion = await District.findAll({
		where: {
			regionId: {
				[Op.eq]: id,
			},
		},
	});

	if (!getDistrictByRegion) {
		return next(new AppError("Bunday viloyat mavjud emas", 404));
	}

	res.json({
		status: "success",
		message: "Districts by region ID",
		error: null,
		data: {
			getDistrictByRegion,
		},
	});
});
