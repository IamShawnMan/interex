const Post = require("./Post");
const { Op } = require("sequelize");
const catchAsync = require("../../core/utils/catchAsync");
const AppError = require("../../core/utils/AppError");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const Order = require("../order/Order");
const Region = require("../region/Region");
const userRoles = require("../../core/constants/userRole");
const postStatuses = require("../../core/constants/postStatus");
const orderStatuses = require("../../core/constants/orderStatus");

exports.getAllPosts = catchAsync(async (req, res, next) => {
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder.limitFields().filter().paginate().search(["note"]);

	let allPosts = await Post.findAndCountAll({
		...queryBuilder.queryOptions,
		include: {
			model: Region,
			as: "region",
			attributes: ["name"],
		},
	});
	allPosts = queryBuilder.createPagination(allPosts);

	res.json({
		status: "success",
		message: "All Posts",
		error: null,
		data: {
			allPosts,
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

exports.createPostForAllOrders = catchAsync(async (req, res, next) => {
	const { regionId } = req.body;

	const specialDistrictOrders = await Order.findAll({
		where: {
			[Op.and]: [
				{
					orderStatus: orderStatuses.STATUS_ACCEPTED,
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

	if (specialDistrictOrders.length >= 1) {
		console.log("There are special orders");
		if (!specialPost) {
			specialPost = await Post.create({
				regionId: 1,
			});

			await Order.update(
				{
					postId: specialPost.id,
					orderStatus: orderStatuses.STATUS_DELIVERING,
				},
				{
					where: {
						districtId: {
							[Op.in]: [36, 39],
						},
					},
				}
			);
		} else {
			console.log("There is a special POST");
			await Order.update(
				{
					postId: specialPost.id,
					orderStatus: orderStatuses.STATUS_DELIVERING,
				},
				{
					where: {
						districtId: {
							[Op.in]: [36, 39],
						},
					},
				}
			);
		}
	}

	let newPost = await Post.findOne({
		regionId: regionId,
		postStatus: postStatuses.POST_NEW,
	});

	if (newPost) {
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
	} else {
		newPost = await Post.create({
			regionId: regionId,
		});

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
	}

	res.json({
		status: "success",
		message: "Post created",
		error: null,
		data: null,
	});
});

exports.createPostForCustomOrders = catchAsync(async (req, res, next) => {
	const { regionId, ordersArr } = req.body;

	const newPost = await Post.create({
		regionId: regionId,
	});

	const ordersInPost = await Order.update(
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
					[Op.in]: ordersArr,
				},
			},
		}
	);

	res.json({
		status: "success",
		message: "Customized Post created",
		error: null,
		data: { ordersInPost },
	});
});

exports.postStatusUpdate = catchAsync(async (req, res, next) => {
	const { userRole } = req.user;
	const { id } = req.params;
	const { postStatus } = req.body;
	const getPostById = await Post.findByPk(id);

	if (!getPostById) {
		return next(new AppError("This post not found", 404));
	}
	if (
		userRole === userRoles.ADMIN &&
		postStatus === postAllStatuses.POST_DELIVERING
	) {
		await getPostById.update({ postStatus: postStatus });
	}
});
