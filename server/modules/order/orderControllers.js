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
const statusPackage = require('../../core/constants/packageStatus')

exports.getAllOrders = catchAsync(async (req, res, next) => {

	orders = {orders: [{
		recipient: "Anvar",
		note: "fjksdfjdskf",
		recipientPhoneNumber: +998939950106,
		regionId: 1,
		districtId: 2,
		orderItems: [{
			product: "Choynak",
			quantity: 1,
			price: 15000
		}]
	},
	{
		recipient: "Anvar",
		note: "fjksdfjdskf",
		recipientPhoneNumber: +998939950106,
		regionId: 1,
		districtId: 2,
		totalPrice: 0,
		orderItems: [{
			product: "Choynak",
			quantity: 1,
			price: 15000,
			orderItemTotalPrice: quantity * price
		},
		{
			product: "Piyola",
			quantity: 1,
			price: 15000,
			orderItemTotalPrice: quantity * price
		}]
	},
]} 
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
  const {userRole} = req.user

  let existedPackage = await PackageModel.findOne({
    where: {[Op.and]: [
		{storeOwnerId: { [Op.eq]: req.user.id }},
		{packageStatus: {[Op.eq]: statusPackage.STATUS_NEW}}
	]},
	order: [["createdAt", "DESC"]]
  });
  
  if(existedPackage){
   const isNewOrders = await OrderModel.count({
    where: {
      [Op.and]:[
      {packageId: {[Op.eq]: existedPackage.id}},
      {orderStatus: statusOrder.STATUS_NEW}
    ]
    }})
    if(isNewOrders === 0){
	existedPackage.packageStatus = statusPackage.STATUS_OLD
	await existedPackage.save()
    existedPackage = await PackageModel.create({ storeOwnerId: req.user.id })
  }
  }
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
        price: item.price,
        orderItemTotalPrice: item.quantity * item.price,
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
		orderbyid = await orderById.update({
			orderStatus: changeOrderStatus,
		});
		if (orderById.orderStatus === statusOrder.STATUS_ACCEPTED) {
			await orderById.update({ deliveryPrice: dprice || 50000 });
		} else {
			await orderById.update({ deliveryPrice: null });
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
			price: item.price,
			orderItemTotalPrice: +item.quantity * +item.price,
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
	const {userRole} = req.user
	let allOrderStatus = Object.values(statusOrder);
	if(userRole === "COURIER") {
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
	const {regionId} = req.user
	req.query.regionId = regionId
	const postOrderStatuses = Object.values(statusOrder).slice(4, 9)
	console.log(req.query);
	const queryBuilder = new QueryBuilder(req.query)
	queryBuilder
		.filter()
		.limitFields()
		.paginate()
		.search(["recipientPhoneNumber", "recipient"])
		.sort()

	queryBuilder.queryOptions.include = [
		{ model: DistrictModel, as: "district", attributes: ["name"] },
		{ model: RegionModel, as: "region", attributes: ["name"] },
	]

	queryBuilder.queryOptions.where = {
		orderStatus: {
			[Op.in] : postOrderStatuses
		},
		...queryBuilder.queryOptions.where
	}
	console.log(queryBuilder.queryOptions);
	let deliveredOrders = await OrderModel.findAndCountAll(queryBuilder.queryOptions)
	deliveredOrders = queryBuilder.createPagination(deliveredOrders)
	res.json({
		status: "success",
		message: "Yetkazib berilgan buyurtmalar",
		error: null, 
		data: {
			...deliveredOrders
		}
	})
})

exports.changeStatusDeliveredOrders = catchAsync(async (req, res, next) => {
	const {regionId, userRole} = req.user
	const {id} = req.params
	const {orderStatus, note} = req.body
	const postOrdersById = await OrderModel.findByPk(id, {
		where: {
			regionId: {
				[Op.eq]: regionId
			} 
		}
	})
	const postOrderStatuses = Object.values(statusOrder).slice(6, 9)
	const postOrderStatusChange = postOrderStatuses.find(e => e === orderStatus)
	if(postOrdersById.dataValues.orderStatus === "DELIVERED" 
	|| postOrdersById.dataValues.orderStatus === "PENDING") {
		await postOrdersById.update({
			orderStatus: postOrderStatusChange, note: `${postOrdersById.dataValues.note} ${userRole}: ${note}`
		})
	}

	res.status(203).json({
		status: "success",
		message: "Post orderining statusi o'zgardi",
		error: null,
		data: {
			note
		}
	})
})

exports.getDailyOrders = catchAsync(async (req, res, next) => {
	const {regionId} = req.user
	req.query.regionId = regionId
	const queryBuilder = new QueryBuilder(req.query)
	queryBuilder
		.filter()
		.limitFields()
		.paginate()
		.search(["recipientPhoneNumber", "recipient"])
		.sort()
	
	queryBuilder.queryOptions.include = [
		{ model: DistrictModel, as: "district", attributes: ["name"] },
		{ model: RegionModel, as: "region", attributes: ["name"] },
	]
	queryBuilder.queryOptions.where = {
		[Op.or]: [
			{orderStatus: statusOrder.STATUS_DELIVERED},
			{orderStatus: statusOrder.STATUS_PENDING}
		],
		...queryBuilder.queryOptions.where
	}
	let ordersOneDay = await OrderModel.findAndCountAll(queryBuilder.queryOptions)
	ordersOneDay = queryBuilder.createPagination(ordersOneDay)

	res.json({
		status: "success",
		message: "Bir kunlik yetkazilishi kerak bo'lgan buyurtmalar",
		error: null,
		data: {
			...ordersOneDay
		}
	})
})
