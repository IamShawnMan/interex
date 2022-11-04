const Post = require("./Post");
const { Op, where } = require("sequelize");
const catchAsync = require("../../core/utils/catchAsync");
const AppError = require("../../core/utils/AppError");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const Order = require("../order/Order");
const Region = require("../region/Region");
const userRoles = require("../../core/constants/userRole");
const postStatuses = require("../../core/constants/postStatus");
const orderStatuses = require("../../core/constants/orderStatus");
const District = require("../district/District");

exports.getAllPosts = catchAsync(async (req, res, next) => {
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder.limitFields().filter().paginate().search(["note"]);

	let allPosts = await Post.findAndCountAll({
		include: {
			model: Region,
			as: "region",
			attributes: ["name"],
		},
		...queryBuilder.queryOptions,
	});
	allPosts = queryBuilder.createPagination(allPosts);

	res.json({
		status: "success",
		message: "All Posts",
		error: null,
		data: {
			...allPosts,
		},
	});
});

exports.getPostById = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const postById = await Post.findByPk(id);

	if (!postById) {
		return next(new AppError("Bunday Id li Pochta mavjud emas", 404));
	}

	res.json({
		status: "success",
		message: "Post by ID",
		error: null,
		data: {
			postById,
		},
	});
});

exports.getPostByRegionId = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const postByRegion = await Post.findAll({
		where: {
			regionId: {
				[Op.eq]: id,
			},
		},
	});

	if (!postByRegion) {
		return next(new AppError("Bunday pochta mavjud emas", 404));
	}

	res.json({
		status: "success",
		message: "Post by Courier Id",
		error: null,
		data: {
			postByRegion,
		},
	});
});

exports.existRegions = catchAsync(async (req, res, next) => {
	const regionsArr = [];

	const ordersInRegions = await Order.findAll({
		where: {
			orderStatus: {
				[Op.eq]: orderStatuses.STATUS_ACCEPTED,
			},
		},
	});

	ordersInRegions.map((order) => {
		const id = order.dataValues.regionId;
		if (!regionsArr.includes(id)) {
			regionsArr.push(id);
		}
	});

	const regionsWeHave = await Region.findAll({
		where: {
			id: {
				[Op.in]: regionsArr,
			},
		},
	});

	return res.json({
		status: "success",
		message: "regions array",
		error: null,
		data: regionsWeHave,
	});
});

exports.ordersBeforeSend = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	let allOrders = [];
	let ordersArr = [];
	const region = await Region.findOne({
		attributes: ["id", "name"],
		where: {
			id: {
				[Op.eq]: id,
			},
		},
	});
	if (region.name === "Samarqand viloyati") {
		allOrders = await Order.findAll({
			include: [
				{ model: Region, as: "region", attributes: ["name"] },
				{ model: District, as: "district", attributes: ["name"] },
			],
			where: {
				regionId: {
					[Op.eq]: id,
				},
				districtId: {
					[Op.notIn]: [36, 39],
				},
			},
		});
		ordersArr = allOrders.map((order) => {
			return order.id;
		});
	} else if (region.name === "Navoiy viloyati") {
		allOrders = await Order.findAll({
			include: [
				{ model: Region, as: "region", attributes: ["name"] },
				{ model: District, as: "district", attributes: ["name"] },
			],
			where: {
				[Op.or]: {
					regionId: {
						[Op.eq]: id,
					},
					districtId: {
						[Op.in]: [36, 39],
					},
				},
			},
		});
		ordersArr = allOrders.map((order) => {
			return order.id;
		});
	} else {
		allOrders = await Order.findAll({
			include: [
				{ model: Region, as: "region", attributes: ["name"] },
				{ model: District, as: "district", attributes: ["name"] },
			],
			where: {
				regionId: {
					[Op.eq]: id,
				},
			},
		});
		ordersArr = allOrders.map((order) => {
			return order.id;
		});
	}

	res.json({
		status: "success",
		message: "Orders ready to sent",
		error: null,
		data: {
			allOrders,
			ordersArr,
		},
	});
});

exports.createPostForAllOrders = catchAsync(async (req, res, next) => {
	const { regionId, ordersArr } = req.body;

	let newPost = await Post.findOne({
		where: {
			regionId: {
				[Op.eq]: regionId,
			},
			postStatus: {
				[Op.eq]: postStatuses.POST_NEW,
			},
		},
	});

	if (!newPost) {
		newPost = await Post.create({
			regionId: regionId,
		});
	}

	await Order.update(
		{
			postId: newPost.id,
			orderStatus: orderStatuses.STATUS_DELIVERING,
		},
		{
			where: {
				id: {
					[Op.in]: ordersArr,
				},
			},
		}
	);

	res.json({
		status: "success",
		message: "Post created",
		error: null,
		data: newPost.id,
	});
});

exports.createPostForCustomOrders = catchAsync(async (req, res, next) => {
	const { postId, ordersArr } = req.body;

	const ordersNotInPost = await Order.update(
		{
			postId: null,
			orderStatus: orderStatuses.STATUS_ACCEPTED,
		},
		{
			where: {
				orderStatus: {
					[Op.eq]: orderStatuses.STATUS_DELIVERING,
				},
				id: {
					[Op.notIn]: ordersArr,
				},
				postId: {
					[Op.eq]: postId,
				},
			},
		}
	);

	res.json({
		status: "success",
		message: "Customized Post created",
		error: null,
		data: ordersNotInPost,
	});
});

exports.getOrdersInPost = catchAsync(async (req, res, next) => {
	const {id} = req.params
	req.query.postId = id
	req.query.orderStatus = orderStatuses.STATUS_DELIVERING
	const queryBuilder = new QueryBuilder(req.query);
	const { id } = req.params;
	const currentPostStatus = await Post.findByPk(id, {
		attributes: ["postStatus"],
	});

	queryBuilder
		.filter()
		.paginate()
		.limitFields()
		.search(["recipientPhoneNumber", "recipient"])
		.sort();
	
	queryBuilder.queryOptions.include = [
		{ model: District, as: "district", attributes: ["name"] },
		{ model: Region, as: "region", attributes: ["name"] },
	]

	let ordersInPost = await Order.findAndCountAll(queryBuilder.queryOptions);

	ordersInPost = queryBuilder.createPagination(ordersInPost);

	const ordersArrInPost = ordersInPost.content.map((o) => {
		return o.dataValues.id;
	});
	console.log(ordersInPost);
	res.json({
		status: "success",
		message: "Orders in Post",
		error: null,
		data: {
			...ordersInPost,
			ordersArrInPost,
			currentPostStatus,
		},
	});
});

exports.newPosts = catchAsync(async (req, res, next) => {
	const notSentPosts = await Post.findAll({
		where: {
			postStatus: {
				[Op.eq]: postStatuses.POST_NEW,
			},
		},
	});

	res.json({
		status: "success",
		message: "Not sent posts",
		error: null,
		data: notSentPosts,
	});
});

exports.sendPost = catchAsync(async (req, res, next) => {
	const { userRole } = req.user;
	const { id } = req.params;
	const { postStatus } = req.body;
	const { note } = req.body;
	const getPostById = await Post.findByPk(id);

	if (!getPostById) {
		return next(new AppError("This post not found", 404));
	}
	if (
		userRole === userRoles.ADMIN &&
		postStatus === postStatuses.POST_DELIVERING
	) {
		await getPostById.update({
			postStatus: postStatus,
			note: note,
		});
	}

	res.json({
		status: "success",
		message: "Post sent",
		error: null,
		data: {
			note,
		},
	});
});

exports.getTodaysPost = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const postOnTheWay = await Post.findAll({
		where: {
			regionId: {
				[Op.eq]: id,
			},
			postStatus: {
				[Op.eq]: postStatuses.POST_DELIVERING,
			},
		},
	});

	res.json({
		status: "success",
		message: "Yo'ldagi pochta",
		error: null,
		data: postOnTheWay,
	});
	res.send("Recieve Post");
});

exports.recieve;
