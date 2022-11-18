const {Op} = require('sequelize')
const PackageBackModel = require("./PackageBack")
const catchAsync = require("../../core/utils/catchAsync")
const QueryBuilder = require("../../core/utils/QueryBuilder")
const OrderModel = require("../order/Order")
const statusOrder = require("../../core/constants/orderStatus")
const statusPackages = require("../../core/constants/packageStatus")
const Region = require("../region/Region")
const District = require("../district/District")
exports.getAllPackageBack  = catchAsync(async (req,res,next)=>{
    const {id} = req.user    

    const queryBuilder = new QueryBuilder(req.query)

    queryBuilder.limitFields().paginate().search(["id"]).sort().
    
    if(req.query.new === "new")
    queryBuilder.queryOptions.where = {...queryBuilder.queryOptions.where, 
        storeOwnerId: {[Op.eq]: id}, packageStatus: {[Op.eq]: statusPackages.STATUS_REJ_NEW}}    
    queryBuilder.queryOptions.where = {...queryBuilder.queryOptions.where,
        storeOwnerId: {[Op.eq]: id}
    }
    
        let allPackage = await PackageBackModel.findAndCountAll(queryBuilder.queryOptions)
        allPackage = queryBuilder.createPagination(allPackage)
    res.status(200).json({
        status: "succes",
        message: "barcha qaytgan buyurtmalar ro`yhati",
        error: null,
        data: {...allPackage}
    })
})

exports.getOrdersbyPackageBack = catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const userId = req.user.id
    let orderIdArr = [] 
    const queryBuilder = new QueryBuilder(req.query)

    queryBuilder.queryOptions.where = {
        ...queryBuilder.queryOptions.where, 
        packageBackId: {[Op.eq]: id}, 
        storeOwnerId: {[Op.eq]: userId}
    }

    queryBuilder.queryOptions.include = [
        {model: Region, as: "region", attributes: ["name"] },
        {model: District, as: "district", attributes: ["name"]}
    ]

    const allOrderbyPackageBack = await OrderModel.findAndCountAll(queryBuilder.queryOptions)

    allOrderbyPackageBack.rows?.map(order=>{
        orderIdArr.push(order.id)
    })
    res.status(200).json({
        status: "success",
        message: "qaytgan paketlar ichidagi buyurtmalar",
        errors: null,
        data: {...allOrderbyPackageBack,
                orderIdArr
        }
    })
})


exports.receiveOrdersinPackageBack = catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const userId = req.user.id
    const orderIdArray = req.body.orderIdArr

    const packageBackbyId = await PackageBackModel.findByPk(id)
    

    await OrderModel.update({orderStatus: statusOrder.STATUS_REJECTED_NOT_EXIST}, {where: {
        [Op.and]: [
            {packageBackId: {[Op.eq]: id}},
            {storeOwnerId: {[Op.eq]: userId}},
            {id: {[Op.notIn]: orderIdArray }},
            {orderStatus: {[Op.eq]: statusOrder.STATUS_REJECTED_DELIVERED}}
        ]
    }} )
    await OrderModel.update({orderStatus: statusOrder.STATUS_REJECTED_ACCEPTED}, {where: {
        [Op.and]: [
            {id: {[Op.in]: orderIdArray }},
            {storeOwnerId: {[Op.eq]: userId}},
            {packageBackId: {[Op.eq]: id}},
            {orderStatus: {[Op.eq]: statusOrder.STATUS_REJECTED_DELIVERED}}
        ]
    }} )

    const countOrdersInPackage = await OrderModel.count({where: {[Op.and]: [
        {packageBackId: {[Op.eq]: packageBackbyId.id}},
        {orderStatus: {[Op.eq]: statusOrder.STATUS_REJECTED_DELIVERED}}
    ]}})

    if(countOrdersInPackage === 0){
        packageBackbyId.packageStatus = statusPackages.STATUS_REJ_OLD
        packageBackbyId.save()
    }


    res.status(203).json({
        status: "success0",
        message: "Qaytgan paketlar qabul qilindi",
        errors: null,
        data: null
    })
})