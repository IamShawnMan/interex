const AppError = require("../../core/utils/appError")

exports.isCourier = async(req,res,next)=>{
    const {userRole} = req.body
    if(userRole !== "COURIER"){
        req.body.regionId = null
    }else{
        if(!req.body.regionId){
            return next(new AppError("Viloyat tanlanmadi", 400))
        }
    }
    next()
}


