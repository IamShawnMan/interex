const AppError = require("../utils/appError")
const userStatus = require("../../core/constants/userStatus")

module.exports = async(req, res, next) => {
    const {status} = req.user
    if(status === userStatus.BLOCKED)  {
        return next(new AppError("Foydalanuvchi bloklangan"))
    }
    next()
}