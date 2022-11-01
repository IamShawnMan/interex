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

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const queryBuilder = new QueryBuilder(req.query);
  queryBuilder
    .filter()
    .paginate()
    .limitFields()
    .search(["recipientPhoneNumber", "recipient"])
    .sort();

  queryBuilder.queryOptions.include = [
    { model: UserModel, as: "storeOwner", attributes: ["storeName"]},
    { model: RegionModel, as: "region", attributes: ["name"] },
    { model: DistrictModel, as: "district", attributes: ["name"] },
  ]
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
  let existedPackage = await PackageModel.findOne({
    where: { storeOwnerId: { [Op.eq]: req.user.id } },
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
      note: order.note,
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
    message: "yangi orderlar qo`shildi",
    errrors: null,
    data: null,
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const orderById = await OrderModel.findByPk(id, {
    include: [
      {model: DistrictModel,as: "district",attributes: ["name"],},
      {model: RegionModel, as: "region", attributes: ["name"] },
      {model: OrderItemModel,as: "items"}
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
    const dprice=orderById.deliveryPrice
     orderbyid = await orderById.update({
      orderStatus: changeOrderStatus,
    });
    if(orderById.orderStatus === statusOrder.STATUS_ACCEPTED){
      orderById.update({deliveryPrice: dprice || 50000})
    }else{
      orderById.update({deliveryPrice: null})
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

  req.query.storeOwnerId = userId
  const queryBuilder = new QueryBuilder(req.query);
  queryBuilder
    .filter()
    .paginate()
    .limitFields()
    .search(["recipientPhoneNumber", "recipient"])
    .sort();

    queryBuilder.queryOptions.include =  [
      { model: DistrictModel, as: "district", attributes: ["name"] },
      { model: RegionModel, as: "region", attributes: ["name"] },
    ]
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

exports.getAllOrderStatus =(req, res, next) => {
  const allOrderStatus = Object.values(statusOrder);
  res.json({
    status: "success",
    message: "All order status",
    data: {
      allOrderStatus,
    },
  });
};
exports.changeDevPrice = catchAsync(async(req,res,next)=>{
  const {id} = req.params
  const {deliveryPrice} = req.body

  const existedOrder = await OrderModel.findByPk(id)
  if(!existedOrder){
    return next(new AppError("Bunday order mavjud emas", 404))
  }
  existedOrder.update({deliveryPrice: deliveryPrice||50000})
  console.log(existedOrder.deliveryPrice,"waefmasdfasdklfmaslkmdfas" );
  res.json({
    status: "success",
    message: "buyurtma yetkazish to`lovi qo`shildi",
    error: "null",
    data: {
      ...existedOrder
    }
  })
})