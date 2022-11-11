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

  queryBuilder.queryOptions.include = [
    { model: Region, as: "region", attributes: ["name"] }
  ]

  let allPosts = await Post.findAndCountAll(queryBuilder.queryOptions)
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
  const { regionId } = req.params;
  const queryBuilder = new QueryBuilder(req.query);
  let allOrders = [];
  let ordersArrInPost = [];
  req.query.orderStatus = orderStatuses.STATUS_ACCEPTED;

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
    allOrders = await Order.findAndCountAll(queryBuilder.queryOptions);
    allOrders = queryBuilder.createPagination(allOrders);
    ordersArrInPost = allOrders.content.map((order) => {
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
    allOrders = await Order.findAndCountAll(queryBuilder.queryOptions);
    allOrders = queryBuilder.createPagination(allOrders);
    ordersArrInPost = allOrders.content.map((order) => {
      return order.dataValues.id;
    });
  } else {
    req.query.regionId = regionId;
    queryBuilder.filter();
    allOrders = await Order.findAndCountAll(queryBuilder.queryOptions);
    allOrders = queryBuilder.createPagination(allOrders);
    ordersArrInPost = allOrders.content.map((order) => {
      return order.dataValues.id;
    });
  }

  res.json({
    status: "success",
    message: "Orders ready to sent",
    error: null,
    data: {
      ...allOrders,
      ordersArrInPost,
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
  const orderArrSum = await Order.sum("totalPrice", {where:{
    id: {
      [Op.in]: ordersArr
    }
  }})

  newPost.postTotalPrice += orderArrSum
  await newPost.save()

  res.json({
    status: "success",
    message: "Post created",
    error: null,
    data: newPost.id,
  });
});

exports.createPostForCustomOrders = catchAsync(async (req, res, next) => {
  const { postId, ordersArr } = req.body;

  const postByPk = await Post.findByPk(postId)
  
  const subtractingOrders = await Order.sum("totalPrice",
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
  })

  postByPk.postTotalPrice -= subtractingOrders
  await postByPk.save()

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
  const { id } = req.params;
  req.query.postId = id
  req.query.orderStatus = orderStatuses.STATUS_DELIVERING
  const queryBuilder = new QueryBuilder(req.query);
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
  ];

  let ordersInPost = await Order.findAndCountAll(queryBuilder.queryOptions);

  ordersInPost = queryBuilder.createPagination(ordersInPost);

  const ordersArrInPost = ordersInPost.content.map((o) => {
    return o.dataValues.id;
  });
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
  const { postStatus, note } = req.body;
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
  const { regionId } = req.user;

  const queryBuilder = new QueryBuilder(req.query);

  queryBuilder
    .filter()
    .limitFields()
    .paginate()
    .search(["recipientPhoneNumber", "recipient"])
    .sort();

  queryBuilder.queryOptions.include = [
    { model: Region, as: "region", attributes: ["name"] },
    { model: District, as: "district", attributes: ["name"] },
  ];

  const postOnTheWay = await Post.findOne({
    where: {
      regionId: {
        [Op.eq]: regionId,
      },
      postStatus: {
        [Op.eq]: postStatuses.POST_DELIVERING,
      },
    },
  });

  queryBuilder.queryOptions.where = {
    ...queryBuilder.queryOptions.where,
    postId: {
      [Op.eq]: postOnTheWay?.id,
    },
  };

  let ordersOnTheWay = await Order.findAndCountAll(queryBuilder.queryOptions);
  ordersOnTheWay = queryBuilder.createPagination(ordersOnTheWay);

  const orderArr = ordersOnTheWay.content.map((order) => {
    return order?.id;
  });

  res.json({
    status: "success",
    message: "Yo'ldagi pochta",
    error: null,
    data: { ordersOnTheWay, orderArr, postOnTheWay },
  });
});

exports.recievePost = catchAsync(async (req, res, next) => {
  const { postStatus, ordersArr, postId } = req.body;
  const postInfo = await Post.update(
    {
      postStatus: postStatus,
    },
    {
      where: {
        id: {
          [Op.eq]: postId,
        },
      },
    }
  );

  const ordersNotInArr = await Order.findAll({
    where: {
      id: {
        [Op.notIn]: ordersArr,
      },
      postId: {
        [Op.eq]: postId
      }
    },
  });

  if (ordersNotInArr) {
    await Order.update(
      {
        orderStatus: orderStatuses.STATUS_NOT_DELIVERED,
      },
      {
        where: {
          id: {
            [Op.notIn]: ordersArr,
          },
          postId: {
            [Op.eq]: postId
          }
        },
      }
    );
  }

  const updatedOrders = await Order.update(
    {
      orderStatus: orderStatuses.STATUS_DELIVERED,
    },
    {
      where: {
        id: {
          [Op.in]: ordersArr,
        },
        postId: {
          [Op.eq]: postId
        }
      },
    }
  );
  res.json({
    status: "sucess",
    message: "Orders and Post Updated",
    error: null,
    data: {
      postInfo,
      ordersNotInArr,
      updatedOrders,
    },
  });
});

exports.getDeliveredPosts = catchAsync(async (req, res, next) => {
  const deliveredPosts = await Post.findAndCountAll({
    where: {
      postStatus: {
        [Op.eq]: postStatuses.POST_DELIVERED,
      },
    },
  });
  res.json({
    status: "success",
    message: "Delivered posts",
    error: null,
    data: {
      deliveredPosts,
    },
  });
});





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
  const {  ordersArr } = req.body;
  const {regionId}=req.user
  let newRejectedPost = await Post.findOne({
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
    newRejectedPost = await Post.create({
      regionId: regionId,
      postStatus: postStatuses.POST_REJECTED_NEW
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