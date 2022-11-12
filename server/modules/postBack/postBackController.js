const PostBack = require("./postBack");
const { Op } = require("sequelize");
const catchAsync = require("../../core/utils/catchAsync");
const AppError = require("../../core/utils/AppError");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const Order = require("../order/Order");
const Region = require("../region/Region");
const userRoles = require("../../core/constants/userRole");
const postStatuses = require("../../core/constants/postStatus");
const orderStatuses = require("../../core/constants/orderStatus");
const District = require("../district/District");

exports.rejectedOrdersBeforeSend = catchAsync(async (req, res, next) => {
	const { regionId } = req.user;
	const queryBuilder = new QueryBuilder(req.query);
	let allRejectedOrders = [];
	let ordersArrInPost = [];
	req.query.orderStatus = orderStatuses.STATUS_REJECTED;

	queryBuilder.queryOptions.include = [
		{ model: Region, as: "region", attributes: ["name"] },
		{ model: District, as: "district", attributes: ["name"] },
	];

	queryBuilder
		.filter()
		.paginate()
		.limitFields()
		.search(["recipientPhoneNumber", "recipient"])
		.sort();

	const region = await Region.findOne({
		attributes: ["id", "name"],
		where: {
			id: {
				[Op.eq]: regionId,
			},
		},
	});

	if (region.name === "Samarqand viloyati") {
		queryBuilder.queryOptions.where = {
			...queryBuilder.queryOptions.where,
			regionId: {
				[Op.eq]: regionId,
			},
			districtId: {
				[Op.notIn]: [101, 106],
			},
		};
		allRejectedOrders = await Order.findAndCountAll(queryBuilder.queryOptions);
		allRejectedOrders = queryBuilder.createPagination(allRejectedOrders);
		ordersArrInPost = allRejectedOrders.content.map((order) => {
			return order.dataValues.id;
		});
	} else if (region.name === "Navoiy viloyati") {
		queryBuilder.queryOptions.where = {
			...queryBuilder.queryOptions.where,
			[Op.or]: {
				regionId: {
					[Op.eq]: regionId,
				},
				districtId: {
					[Op.in]: [101, 106],
				},
			},
		};
		allRejectedOrders = await Order.findAndCountAll(queryBuilder.queryOptions);
		allRejectedOrders = queryBuilder.createPagination(allRejectedOrders);
		ordersArrInPost = allRejectedOrders.content.map((order) => {
			return order.dataValues.id;
		});
	} else {
		req.query.regionId = regionId;
		queryBuilder.filter();
		allRejectedOrders = await Order.findAndCountAll(queryBuilder.queryOptions);
		allRejectedOrders = queryBuilder.createPagination(allRejectedOrders);
		ordersArrInPost = allRejectedOrders.content.map((order) => {
			return order.dataValues.id;
		});
	}

	res.json({
		status: "success",
		message: "Orders ready to sent",
		error: null,
		data: {
			...allRejectedOrders,
			ordersArrInPost,
		},
	});
});

exports.createPostForAllRejectedOrders = catchAsync(async (req, res, next) => {
	const { regionId, ordersArr } = req.body;

	let newRejectedPost = await PostBack.findOne({
		where: {
			regionId: {
				[Op.eq]: regionId,
			},
			postStatus: {
				[Op.eq]: postStatuses.POST_REJECTED_NEW,
			},
		},
	});

	if (!newRejectedPost) {
		newRejectedPost = await PostBack.create({
			regionId: regionId,
		});
	}

	await Order.update(
		{
			postId: newRejectedPost.id,
			orderStatus: orderStatuses.STATUS_REJECTED_DELIVERING,
		},
		{
			where: {
				id: {
					[Op.in]: ordersArr,
				},
			},
		}
	);
	const rejectedOrderArrSum = await Order.sum("totalPrice", {
		where: {
			id: {
				[Op.in]: ordersArr,
			},
		},
	});

	newRejectedPost.postTotalPrice += rejectedOrderArrSum;
	await newRejectedPost.save();

	res.json({
		status: "success",
		message: "Pochta yaratildi",
		error: null,
		data: newRejectedPost.id,
	});
});

exports.sendRejectedPost = catchAsync(async (req, res, next) => {
	const { userRole } = req.user;
	const { id } = req.params;
	const { postStatus, note } = req.body;
	const getRejectedPostById = await PostBack.findByPk(id);

	if (!getRejectedPostById) {
		return next(new AppError("This post not found", 404));
	}
	if (
		userRole === userRoles.ADMIN &&
		postStatus === postStatuses.POST_REJECTED_DELIVERING
	) {
		await getRejectedPostById.update({
			postStatus: postStatus,
			note: note,
		});
	}

	res.json({
		status: "success",
		message: "Rejected Pochta jo'natildi",
		error: null,
		data: {
			note,
		},
	});
});

exports.getTodaysRejectedPost = catchAsync(async (req, res, next) => {
	const { regionId } = req.user;

	const queryBuilder = new QueryBuilder(req.query);

	queryBuilder
		.filter()
		.limitFields()
		.paginate()
		.search(["recipientPhoneNumber", "recipient"])
		.sort();

	queryBuilder.queryOptions.include = [
		{ model: District, as: "district", attributes: ["name"] },
		{ model: Region, as: "region", attributes: ["name"] },
	];
	const rejectedPostOnTheWay = await PostBack.findAll({
		where: {
			regionId: {
				[Op.eq]: regionId,
			},
			postStatus: {
				[Op.eq]: postStatuses.POST_REJECTED_DELIVERING,
			},
		},
	});

	let rejectedOrdersOnTheWay = await Order.findAndCountAll(
		queryBuilder.queryOptions
	);
	rejectedOrdersOnTheWay = queryBuilder.createPagination(
		rejectedOrdersOnTheWay
	);

	const orderArr = rejectedOrdersOnTheWay.content.map((order) => {
		return order.id;
	});

	queryBuilder.queryOptions.where = {
		...queryBuilder.queryOptions.where,
		postId: {
			[Op.eq]: rejectedPostOnTheWay?.id,
		},
	};
	res.json({
		status: "success",
		message: "Yo'ldagi pochta",
		error: null,
		data: { rejectedOrdersOnTheWay, orderArr, rejectedPostOnTheWay },
	});
});
