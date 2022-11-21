const {Op} = require('sequelize')
const PackageBackModel = require("./PackageBack")
const catchAsync = require("../../core/utils/catchAsync")
const QueryBuilder = require("../../core/utils/QueryBuilder")
const OrderModel = require("../order/Order")
const statusOrder = require("../../core/constants/orderStatus")
const statusOrderUz = require("../../core/constants/orderStatusUz")
const statusPackages = require("../../core/constants/packageStatus")
const statusPackagesUz = require("../../core/constants/packageStatusUz")
const Region = require("../region/Region")
const District = require("../district/District")

exports.getAllPackageBack  = catchAsync(async (req,res,next)=>{
    const {id} = req.user    

    const queryBuilder = new QueryBuilder(req.query)

    queryBuilder.limitFields().paginate().search(["id"]).sort()
    
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

    const packageBackbyId = await PackageBackModel.findByPk(id)
    const packageBackStatus = packageBackbyId.packageStatus
    const queryBuilder = new QueryBuilder(req.query)

    queryBuilder.limitFields().search(["id"])
    queryBuilder.queryOptions.where = {
        ...queryBuilder.queryOptions.where, 
        packageBackId: {[Op.eq]: id}, 
        storeOwnerId: {[Op.eq]: userId}
    }

    queryBuilder.queryOptions.include = [
        {model: Region, as: "region", attributes: ["name"] },
        {model: District, as: "district", attributes: ["name"]}
    ]
    const allOrderbyPackageBack = await OrderModel.findAll(queryBuilder.queryOptions)
    allOrderbyPackageBack.rows?.map(order=>{
        orderIdArr.push(order.id)
    })
    console.log(orderIdArr);
    res.status(200).json({
        status: "success",
        message: "qaytgan paketlar ichidagi buyurtmalar",
        errors: null,
        data: {allOrderbyPackageBack,
                orderIdArr,
                packageBackStatus
            }
    })
})

exports.receiveOrdersinPackageBack = catchAsync(async(req,res,next)=>{
    const {id} = req.params
    const userId = req.user.id
    const orderIdArray = req.body.orderIdArr
    const packageBackbyId = await PackageBackModel.findByPk(id)
    await OrderModel.update({orderStatus: statusOrder.STATUS_REJECTED_NOT_EXIST, orderStatusUz: statusOrderUz.STATUS_OTKAZ_OLMADI}, {where: {
        [Op.and]: [
            {packageBackId: {[Op.eq]: id}},
            {storeOwnerId: {[Op.eq]: userId}},
            {id: {[Op.notIn]: orderIdArray }},
            {orderStatus: {[Op.eq]: statusOrder.STATUS_REJECTED_DELIVERED}} 
        ]
    }})
    await OrderModel.update({orderStatus: statusOrder.STATUS_REJECTED_ACCEPTED, orderStatusUz: statusOrderUz.STATUS_OTKAZ_OLDI}, {where: {
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
        packageBackbyId.packageStatusUz = statusPackagesUz.STATUS_OTKAZ_ESKI
        await packageBackbyId.save()
    }


    res.status(203).json({
        status: "success0",
        message: "Qaytgan paketlar qabul qilindi",
        errors: null,
        data: null
    })
})