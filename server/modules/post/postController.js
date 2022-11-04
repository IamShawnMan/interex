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
	const { id } = require(req.body);

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

exports.createPostForAllOrders = catchAsync(async (req, res, next) => {
	const { regionId } = req.body;

	const specialDistrictOrders = await Order.findAll({
		where: {
			[Op.and]: [
				{
					orderStatus: {
						[Op.eq]: orderStatuses.STATUS_ACCEPTED,
					},
				},
				{
					districtId: {
						[Op.in]: [36, 39],
					},
				},
			],
		},
	});

	let specialPost = await Post.findOne({
		where: {
			postStatus: {
				[Op.eq]: postStatuses.POST_NEW,
			},
			regionId: {
				[Op.eq]: 1,
			},
		},
	});

	if (specialDistrictOrders) {
		if (!specialPost) {
			specialPost = await Post.create({
				regionId: 1,
			});
		}

		await Order.update(
			{
				postId: specialPost.id,
				orderStatus: orderStatuses.STATUS_DELIVERING,
			},
			{
				where: {
					districtId: {
						[Op.in]: [39, 36],
					},
					orderStatus: {
						[Op.eq]: orderStatuses.STATUS_ACCEPTED,
					},
				},
			}
		);
	}

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
				orderStatus: {
					[Op.eq]: orderStatuses.STATUS_ACCEPTED,
				},
				regionId: {
					[Op.eq]: regionId,
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

exports.getOrdersInPost = catchAsync(async (req, res, next) => {
	const {id} = req.params
	req.query.postId = id
	req.query.orderStatus = orderStatuses.STATUS_DELIVERING
	const queryBuilder = new QueryBuilder(req.query);
	const currentPostStatus = await Post.findByPk(id, {attributes:["postStatus"]})

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
			currentPostStatus
		},
	});
});

exports.createPostForCustomOrders = catchAsync(async (req, res, next) => {
	const { postId, ordersArr } = req.body;

	const ordersNotInPost = await Order.update(
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
