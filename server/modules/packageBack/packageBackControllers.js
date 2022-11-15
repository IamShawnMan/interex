const PackageBackModel = require("./PackageBack")
const catchAsync = require("../../core/utils/catchAsync")
const OrderModel = require("../order/Order")
const statusOrder = require("../../core/constants/orderStatus")
const statusPackages = require("../../core/constants/packageStatus")
exports.getAllRejectedDelivered = catchAsync(async (req,res,next)=>{
    const allRejectedDelivered = await OrderModel.findAndCountAll({
        where: {orderStatus: {[Op.eq]: statusOrder.STATUS_REJECTED_DELIVERING }}
    })
    res.status(200).json({
        status: "succes",
        message: "barcha qaytgan buyurtmalar ro`yhati",
        error: null,
        data: allRejectedDelivered
    })
})

exports.updateRejDevOrdersinStoreOwner = catchAsync(async(req,res,next)=>{
    let storeOwnerArr = []

    let existedPackageBack = await PackageBackModel.findOne({
        where: {[Op.and]: [ 
            {storeOwnerId: {[Op.eq]: id}},
            {packageStatus: {[Op.eq]: statusPackages.STATUS_REJ_NEW}},
        ]
     },order: [["createdAt", "DESC"]]
    })
    if(!existedPackageBack){
        existedPackageBack = await PackageBackModel.create({storeOwnerId: id})
    }
    
    await OrderModel.update(
        {packageBackId: existedPackageBack.id},
        {where: {[Op.and]: [
        {storeOwnerId: {[Op.eq]: id}},
        {orderStatus: {[Op.eq]: statusOrder.STATUS_REJECTED_DELIVERED}}
    ]}})

    res.status(204).json({
        status: "succes",
        message: "qaytarilgan buyurtmalar do`konlar bo`yicha olish",
        errors: null,
        data: null
    })

})