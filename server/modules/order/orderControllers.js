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
const RegionModel = require("../region/Region")
const districtModel = require("../district/District");
const User = require("../user/User");
const Package = require("../package/Package");

exports.getAllOrders = catchAsync(async (req, res, next) => {
	const queryBuilder = new QueryBuilder(req.query);
	queryBuilder
		.filter()
		.paginate()
		.limitFields()
		.search(["recipientPhoneNumber", "recipient"])
		.sort();

	let allOrders = await OrderModel.findAndCountAll({
		include: [
			{model: RegionModel, as: "region", attributes: ["name", "id"] }, 
			{model: districtModel, as: "district", attributes: ["name", "id"]},
			{model: Package, as: "package", attributes: ["store_owner_id"]}
		],
		...queryBuilder.queryOptions,
	});
	allOrders = queryBuilder.createPagination(allOrders);

	res.json({
		status: "success",
		message: "Barcha buyurtmalar",
		error: null,
		data: {
			allOrders,
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
	let existedPackage = await PackageModel.findOne({
		where: { storeOwnerId: { [Op.eq]: req.user.id } },
	});
	
	if (!existedPackage) {
		existedPackage = await PackageModel.create({ storeOwnerId: req.user.id });
	}
	
	const orders = req.body.orders;
	orders?.forEach(async (order) => {
		const newOrder = await OrderModel.create({
			recipient: order.recipient,
			regionId: order.regionId,
			note: order.note,
			recipientPhoneNumber: order.recipientPhoneNumber,
			districtId: order.districtId,
			packageId: existedPackage.id,
		});
		newOrder.totalPrice = 0;
		order?.items?.forEach(async (item) => {
			const newItem = await OrderItemModel.create({
				orderId: newOrder.id,
				orderItemTotalPrice: item.quantity * item.price,
				...item,
			});
			
			newOrder.totalPrice += +newItem.orderItemTotalPrice;
		});
		setTimeout(async () => {
			await newOrder.save();
		}, 1000);
	});


	res.status(201).json({
		status: "success",
		message: "yangi orderlar qo`shildi",
		errrors: null,
		data: null,
	});
});

exports.getOrderById = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	const orderById = await OrderModel.findByPk(id, {
		include: {
			model: OrderItemModel,
			as: "items",
			attributes: ["productName", "quantity", "price"],
		},
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
	const { orderStatus, deliveryPrice } = req.body;
	const orderById = await OrderModel.findByPk(id);
	const orderStatusVariables = Object.values(statusOrder).slice(1, 3);
	if (userRole === "ADMIN") {
		const deliverySum = deliveryPrice || 45000;
		const changeOrderStatus = orderStatusVariables.find(
			(e) => e === orderStatus
		);

		await orderById.update({
			orderStatus: changeOrderStatus,
			deliveryPrice: deliverySum,
		});
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

exports.editOrder = catchAsync(async(req,res,next)=>{
	const {id} = req.params
	const editOrderbyId = await OrderModel.findOne({where: {id: {[Op.eq]: id}},attributes: {exclude: ["createdAt", "updatedAt", "orderStatus", "deliveryPrice", "totalPrice", "packageId"]}})
	if(!editOrderbyId){
		return next(new AppError("bunday buyurtma topilmadi", 404))
	}
	res.json({
		data: editOrderbyId
	})
})

exports.updateOrder = catchAsync(async (req, res, next) => {
	const { id } = req.params;
	
	const { recipient, recipientPhoneNumber, regionId, districtId, items, note } =
		req.body;
	
	const orderById = await OrderModel.findByPk(id);

	await OrderItemModel.destroy({
		where: { orderId: { [Op.eq]: orderById.id } },
	});

	await orderById.update({
		recipient,
		recipientPhoneNumber,
		regionId,
		districtId,
		note
	});
	orderById.totalPrice = 0;
	items?.forEach(async (item) => {
		const newItem = await OrderItemModel.create({
			productName: item.productName,
			quantity: item.quantity,
			price: item.price,
			orderItemTotalPrice: +item.quantity * +item.price,
			orderId: orderById.id,
		});
		orderById.totalPrice += newItem.orderItemTotalPrice;
	});
	setTimeout(async () => {
		await orderById.save();
	}, 1000);
	res.status(203).json({
		status: "success",
		message: "buyurtma taxrirlandi",
		error: null,
		data: null,
	});
});

exports.getAllDeliveryPrice = (req, res, next) => {
	const allPrice = Object.values(priceDelivery);

	res.json(allPrice);
};

exports.getOrdersbyRegion = catchAsync(async(req,res,next)=>{
	const {id} = req.params

	const allOrdersbyRegion = OrderModel.findAndCountAll({where: {regionId: {[Op.eq]: id}}})

	res.send(allOrdersbyRegion)
})

exports.getAllOrderStatus = catchAsync(async(req, res, next) => {
	const allOrderStatus = Object.values(statusOrder)
	res.json({
		status: "success",
		message: "All order status",
		data: {
			allOrderStatus
		}
	})
})

