const OrderModel = require("./Order");
const OrderItemModel = require("../orderitem/OrderItem");
const PackageModel = require("../package/Package");
const { Op } = require("sequelize");
const catchAsync = require("../../core/utils/catchAsync");
const { validationResult } = require("express-validator");
const AppError = require("../../core/utils/AppError");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const statusOrder = require("../../core/constants/orderStatus");
const priceDelivery = require("../../core/constants/deliveryPrice");
const RegionModel = require("../region/Region");
const DistrictModel = require("../district/District");
const UserModel = require("../user/User");
const statusPackage = require("../../core/constants/packageStatus");
const excelJS = require("exceljs");
const Region = require("../region/regions.json");

exports.getAllOrders = catchAsync(async (req, res, next) => {
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder
		.filter()
		.paginate()
		.limitFields()
		.search(["recipientPhoneNumber", "recipient"])
		.sort();

	queryBuilder.queryOptions.include = [
		{ model: UserModel, as: "storeOwner", attributes: ["storeName"] },
		{ model: RegionModel, as: "region", attributes: ["name"] },
		{ model: DistrictModel, as: "district", attributes: ["name"] },
	];
	let allOrders = await OrderModel.findAndCountAll({
		...queryBuilder.queryOptions,
	});
	allOrders = queryBuilder.createPagination(allOrders);

	res.json({
		status: "success",
		message: "Barcha buyurtmalar",
		error: null,
		data: {
			...allOrders,
		},
	});
});

exports.createOrder = catchAsync(async (req, res, next) => {
	const validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		let err = new AppError("Validatsiya xatosi", 403);
		err.isOperational = false;
		err.errors = validationErrors;
		return next(err);
	}
	const { userRole } = req.user;

  let existedPackage = await PackageModel.findOne({
    where: {[Op.and]: [
		{storeOwnerId: { [Op.eq]: req.user.id }},
		{packageStatus: {[Op.eq]: statusPackage.STATUS_NEW}}
	]},
	order: [["createdAt", "DESC"]]
  });
  
  if (!existedPackage) {
    existedPackage = await PackageModel.create({ storeOwnerId: req.user.id });
  }
  const storeOwnerId = req.user.id;
  const orders = req.body.orders;
  orders?.forEach(async (order) => {
	  const newOrder = await OrderModel.create({
		  recipient: order.recipient,
      regionId: order.regionId,
      note: `${userRole}: ${order.note}`,
      recipientPhoneNumber: order.recipientPhoneNumber,
      districtId: order.districtId,
      packageId: existedPackage.id,
      storeOwnerId,
    });
    let items = [];
    let sum = 0;
    order?.orderItems?.forEach((item) => {
      items.push({
		  productName: item.productName,
		  quantity: item.quantity,
		  orderItemTotalPrice: +item.price,
		  orderId: newOrder.id,
		});
    });
    items?.forEach((item) => {
		sum += item.orderItemTotalPrice;
    });
	
		await OrderItemModel.bulkCreate(items);
		newOrder.totalPrice = sum;
		newOrder.packageId = existedPackage.id;
		await newOrder.save();
		existedPackage.packageTotalPrice += newOrder.totalPrice;
		await existedPackage.save();
	});
	res.status(201).json({
		status: "success",
		message: "yangi buyurtmalar qo`shildi",
		errrors: null,
		data: null,
	});
});

exports.getOrderById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const orderById = await OrderModel.findByPk(id, {
		include: [
			{ model: DistrictModel, as: "district", attributes: ["name"] },
			{ model: RegionModel, as: "region", attributes: ["name"] },
			{ model: OrderItemModel, as: "items" },
		],
	});

	if (!orderById) {
		return next(new AppError("bunday ID order topilmadi", 404));
	}

	res.status(200).json({
		status: "success",
		message: `${orderById.recipient} mijozning buyurtmasi`,
		error: null,
		data: { orderById },
	});
});

exports.changeOrderStatus = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const { userRole } = req.user;
	const { orderStatus } = req.body;
	let orderById = await OrderModel.findByPk(id);
	const orderStatusVariables = Object.values(statusOrder).slice(1, 3);
	if (userRole === "ADMIN") {
		const changeOrderStatus = orderStatusVariables.find(
			(e) => e === orderStatus
		);
		const dprice = orderById.deliveryPrice;
		orderById = await orderById.update({
			orderStatus: changeOrderStatus,
		});
		if (orderById.orderStatus === statusOrder.STATUS_ACCEPTED) {
			await orderById.update({ deliveryPrice: dprice || 50000 });
		} else {
			await orderById.update({ deliveryPrice: null });
		}
		const existedPackage = await PackageModel.findByPk(orderById.packageId);

		const isNewOrders = await OrderModel.count({
			where: {
				[Op.and]: [
					{ packageId: { [Op.eq]: existedPackage.id } },
					{ orderStatus: { [Op.eq]: statusOrder.STATUS_REJECTED_DELIVERED } },
				],
			},
		});
		console.log(isNewOrders);
		if (isNewOrders === 0) {
			await existedPackage.update({ packageStatus: statusPackage.STATUS_OLD });
		}
	}
	res.status(203).json({
		status: "success",
		message: "order statusi o`zgardi",
		error: null,
		data: null,
	});
});

exports.adminOrderStatus = catchAsync(async (req, res, next) => {
	const orderStatusVariables = Object.values(statusOrder).slice(1, 3);
	res.json(orderStatusVariables);
});

exports.editOrder = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const editOrderbyId = await OrderModel.findOne({
		where: { id: { [Op.eq]: id } },
		attributes: {
			exclude: [
				"createdAt",
				"updatedAt",
				"orderStatus",
				"deliveryPrice",
				"totalPrice",
				"packageId",
			],
		},
	});

	if (!editOrderbyId) {
		return next(new AppError("bunday buyurtma topilmadi", 404));
	}

	res.json({
		data: editOrderbyId,
	});
});

exports.updateOrder = catchAsync(async (req, res, next) => {
	const userId = req.user.id;
	const { id } = req.params;

	const {
		recipient,
		recipientPhoneNumber,
		regionId,
		districtId,
		orderItems,
		note,
	} = req.body;

	const myPackage = await PackageModel.findOne({
		where: { storeOwnerId: { [Op.eq]: userId } },
	});

	const orderById = await OrderModel.findByPk(id);

	await OrderItemModel.destroy({
		where: { orderId: { [Op.eq]: orderById.id } },
	});
	myPackage.packageTotalPrice -= orderById.totalPrice;
	await myPackage.save();

	await orderById.update({
		recipient,
		recipientPhoneNumber,
		regionId,
		districtId,
		note,
	});
	let items = [];
	let sum = 0;
	orderItems?.forEach((item) => {
		items.push({
			productName: item.productName,
			quantity: item.quantity,
			orderItemTotalPrice: +item.price,
			orderId: orderById.id,
		});
	});
	items.forEach((item) => {
		sum += item.orderItemTotalPrice;
	});

	await OrderItemModel.bulkCreate(items);

	orderById.totalPrice = sum;
	await orderById.save();
	myPackage.packageTotalPrice += orderById.totalPrice;
	await myPackage.save();
	res.status(203).json({
		status: "success",
		message: "buyurtma taxrirlandi",
		error: null,
		data: null,
	});
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
	const userId = req.user.id;
	req.query.storeOwnerId = userId;
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder
		.filter()
		.paginate()
		.limitFields()
		.search(["recipientPhoneNumber", "recipient"])
		.sort();

	queryBuilder.queryOptions.include = [
		{ model: DistrictModel, as: "district", attributes: ["name"] },
		{ model: RegionModel, as: "region", attributes: ["name"] },
	];
	let myOrders = await OrderModel.findAndCountAll(queryBuilder.queryOptions);
	myOrders = queryBuilder.createPagination(myOrders);

	res.json({
		status: "success",
		message: `${req.user.firstName} - ${req.user.userRole} ning ro\`yhatdan o\`tkazgan barcha buyurtmalari`,
		error: null,
		data: { ...myOrders },
	});
});

exports.getAllDeliveryPrice = (req, res, next) => {
	const allPrice = Object.values(priceDelivery);
	res.json(allPrice);
};

exports.getAllOrderStatus = (req, res, next) => {
	const { userRole } = req.user;
	let allOrderStatus = Object.values(statusOrder);
	if (userRole === "COURIER") {
		allOrderStatus = Object.values(statusOrder).slice(4, 9);
	}
	res.json({
		status: "success",
		message: "All order status",
		data: {
			allOrderStatus,
		},
	});
};
exports.changeDevPrice = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const { deliveryPrice } = req.body;

	const existedOrder = await OrderModel.findByPk(id);
	if (!existedOrder) {
		return next(new AppError("Bunday order mavjud emas", 404));
	}
	existedOrder.update({ deliveryPrice: deliveryPrice || 50000 });
	res.json({
		status: "success",
		message: "buyurtma yetkazish to`lovi qo`shildi",
		error: "null",
		data: {
			...existedOrder,
		},
	});
});

exports.getDeliveredOrders = catchAsync(async (req, res, next) => {
	const { regionId } = req.user;
	const queryBuilder = new QueryBuilder(req.query);
	let allOrders = [];
	let ordersArrInPost = [];

	queryBuilder.queryOptions.include = [
		{ model: RegionModel, as: "region", attributes: ["name"] },
		{ model: DistrictModel, as: "district", attributes: ["name"] },
	];

	queryBuilder
		.filter()
		.paginate()
		.limitFields()
		.search(["recipientPhoneNumber", "recipient"])
		.sort();

	const region = await RegionModel.findOne({
		attributes: ["id", "name"],
		where: {
			id: {
				[Op.eq]: regionId,
			},
		},
	});

	if (region?.name === "Samarqand viloyati") {
		const orderStatuses = Object.values(statusOrder).slice(4, 9);
		queryBuilder.queryOptions.where = {
			regionId: {
				[Op.eq]: regionId,
			},
			districtId: {
				[Op.notIn]: [101, 106],
			},
			orderStatus: {
				[Op.in]: orderStatuses,
			},
			...queryBuilder.queryOptions.where,
		};
		deliveredOrders = await OrderModel.findAndCountAll(
			queryBuilder.queryOptions
		);
		deliveredOrders = queryBuilder.createPagination(deliveredOrders);
		deliveredOrdersArrInPost = deliveredOrders.content.map((order) => {
			return order.dataValues.id;
		});
	} else if (region?.name === "Navoiy viloyati") {
		const orderStatuses = Object.values(statusOrder).slice(4, 9);
		queryBuilder.queryOptions.where = {
			[Op.or]: {
				regionId: {
					[Op.eq]: regionId,
				},
				districtId: {
					[Op.in]: [101, 106],
				},
			},
			orderStatus: {
				[Op.in]: orderStatuses,
			},
			...queryBuilder.queryOptions.where,
		};
		deliveredOrders = await OrderModel.findAndCountAll(
			queryBuilder.queryOptions
		);
		deliveredOrders = queryBuilder.createPagination(deliveredOrders);
		ordersArrInPost = deliveredOrders.content.map((order) => {
			return order.dataValues.id;
		});
	} else {
		const orderStatuses = Object.values(statusOrder).slice(4, 9);
		queryBuilder.queryOptions.where = {
			regionId: {
				[Op.eq]: regionId,
			},
			orderStatus: {
				[Op.in]: orderStatuses,
			},
			...queryBuilder.queryOptions.where,
		};
		deliveredOrders = await OrderModel.findAndCountAll(
			queryBuilder.queryOptions
		);
		deliveredOrders = queryBuilder.createPagination(deliveredOrders);
		ordersArrInPost = deliveredOrders.content.map((order) => {
			return order.dataValues.id;
		});
	}

	res.json({
		status: "success",
		message: "Yetkazib berilgan buyurtmalar",
		error: null,
		data: {
			...deliveredOrders,
			ordersArrInPost,
		},
	});
});

exports.changeStatusDeliveredOrders = catchAsync(async (req, res, next) => {
	const { regionId, userRole } = req.user;
	const { id } = req.params;
	const { orderStatus, note } = req.body;
	const postOrdersById = await OrderModel.findByPk(id, {
		where: {
			regionId: {
				[Op.eq]: regionId,
			},
		},
	});
	const postOrderStatuses = Object.values(statusOrder).slice(6, 9);
	const postOrderStatusChange = postOrderStatuses.find(
		(e) => e === orderStatus
	);
	if (
		postOrdersById.dataValues.orderStatus === "DELIVERED" ||
		postOrdersById.dataValues.orderStatus === "PENDING"
	) {
		await postOrdersById.update({
			orderStatus: postOrderStatusChange,
			note: `${postOrdersById.dataValues.note} ${userRole}: ${note}`,
		});
	}

	res.status(203).json({
		status: "success",
		message: "Post orderining statusi o'zgardi",
		error: null,
		data: {
			note,
		},
	});
});

exports.getDailyOrders = catchAsync(async (req, res, next) => {
	const { regionId } = req.user;
	const queryBuilder = new QueryBuilder(req.query);
	let allOrders = [];
	let ordersArrInPost = [];

	queryBuilder.queryOptions.include = [
		{ model: RegionModel, as: "region", attributes: ["name"] },
		{ model: DistrictModel, as: "district", attributes: ["name"] },
	];

	queryBuilder
		.filter()
		.paginate()
		.limitFields()
		.search(["recipientPhoneNumber", "recipient"])
		.sort();

	const region = await RegionModel.findOne({
		attributes: ["id", "name"],
		where: {
			id: {
				[Op.eq]: regionId,
			},
		},
	});

	if (region.name === "Samarqand viloyati") {
		queryBuilder.queryOptions.where = {
			regionId: {
				[Op.eq]: regionId,
			},
			districtId: {
				[Op.notIn]: [101, 106],
			},
			orderStatus: {
				[Op.in]: [statusOrder.STATUS_PENDING, statusOrder.STATUS_DELIVERED],
			},
			...queryBuilder.queryOptions.where,
		};
		ordersOneDay = await OrderModel.findAndCountAll(queryBuilder.queryOptions);
		ordersOneDay = queryBuilder.createPagination(ordersOneDay);
		oneDayOrdersArrInPost = ordersOneDay.content.map((order) => {
			return order.dataValues.id;
		});
	} else if (region.name === "Navoiy viloyati") {
		queryBuilder.queryOptions.where = {
			[Op.or]: {
				regionId: {
					[Op.eq]: regionId,
				},
				districtId: {
					[Op.in]: [101, 106],
				},
			},
			orderStatus: {
				[Op.in]: [statusOrder.STATUS_PENDING, statusOrder.STATUS_DELIVERED],
			},
			...queryBuilder.queryOptions.where,
		};
		ordersOneDay = await OrderModel.findAndCountAll(queryBuilder.queryOptions);
		ordersOneDay = queryBuilder.createPagination(ordersOneDay);
		oneDayOrdersArrInPost = ordersOneDay.content.map((order) => {
			return order.dataValues.id;
		});
	} else {
		queryBuilder.queryOptions.where = {
			regionId: {
				[Op.eq]: regionId,
			},
			districtId: {
				[Op.notIn]: [101, 106],
			},
			orderStatus: {
				[Op.in]: [statusOrder.STATUS_PENDING, statusOrder.STATUS_DELIVERED],
			},
			...queryBuilder.queryOptions.where,
		};
		ordersOneDay = await OrderModel.findAndCountAll(queryBuilder.queryOptions);
		ordersOneDay = queryBuilder.createPagination(ordersOneDay);
		oneDayOrdersArrInPost = ordersOneDay.content.map((order) => {
			return order.dataValues.id;
		});
	}
	res.json({
		status: "success",
		message: "Kunlik yetkazib beriladigan buyurtmalar",
		error: null,
		data: {
			...ordersOneDay,
			ordersArrInPost,
		},
	});
});

exports.exportOrders = catchAsync(async (req, res, next) => {
	const workbook = new excelJS.Workbook();
	const worksheet = workbook.addWorksheet("orders");
	const path = "./files";
	worksheet.columns = [
		{ header: "No", key: "s_no", width: 20 },
		{ header: "Haridor", key: "recipient", width: 20 },
		{ header: "Telefon raqami", key: "recipientPhoneNumber", width: 20 },
		{ header: "Izoh", key: "note", width: 70 },
		{ header: "Holati", key: "orderStatus", width: 30 },
		{ header: "Yetkazish narxi", key: "deliveryPrice", width: 20 },
		{ header: "Umumiy narxi", key: "totalPrice", width: 20 },
		{ header: "Yaratilgan sana", key: "createdAt", width: 20 },
		{ header: "O'zgartirilgan sana", key: "updatedAt", width: 20 },
	];
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder.filter();
	let downloadOrders = await OrderModel.findAndCountAll(
		queryBuilder.queryOptions
	);

	const ordersArr = Object.values(downloadOrders.rows.map((e) => e.dataValues));
	let counter = 1;
	ordersArr.forEach((order) => {
		order.s_no = counter;
		worksheet.addRow(order);
		counter++;
	});
	worksheet.getRow(1).eachCell((cell) => {
		cell.font = { bold: true };
	});
	worksheet.eachRow((row) => {
		row.eachCell((cell) => {
			cell.alignment = {
				horizontal: "center",
			};
		});
	});
	res.setHeader(
		"Content-Type",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	);
	res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");
	const data = await workbook.xlsx.writeFile(`${path}/orders.xlsx`);
	return workbook.xlsx.write(res).then(() => {
		res.status(200).end();
	});
});
