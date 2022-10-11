const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const isSuperAdmin = async(req, res, next)=>{
    const authHeader = req.headers.authorization;
    const token = authHeader.slice(7);
    const user = jwt.verify(token, process.env.JWT_SECRET)
    if(user.userRole !== "SUPER_ADMIN"){
        return next(new AppError("Forbidden", 403))
    }
    next()
}

module.exports = isSuperAdmin