const User = require("./User");
const catchAsync = require("../../core/utils/catchAsync");
const AppError = require("../../core/utils/appError");
const userRole = require("../../core/constants/userRole")
const { validationResult } = require("express-validator");
const QueryBuilder = require("../../core/utils/QueryBuilder");
const { Op } = require("sequelize");

const findById = async(id, next) => {
    const byId = await User.findByPk(id, {attributes: {exclude: ["password"]}})
    if(byId) {
        return byId
    }
    return null
}

exports.getUsers = catchAsync(async (req, res, next) => {
    const queryBuilder = new QueryBuilder(req.query);
    queryBuilder.paginate().limitFields();
    let allUsers = await User.findAndCountAll({...queryBuilder.queryOptions, 
        where:{
            userRole: {
                [Op.ne]: "SUPER_ADMIN"
            }
        },
        attributes: {exclude: ["password"]},
    })
    if(!allUsers) {
        return next(new AppError("Foydalanuvchilar mavjud emas", 404))
    }
    allUsers = queryBuilder.createPagination(allUsers);
    res.json({
        status: "success",
        message: "Barcha foydalanuvchilar",
        error: null,
        data: {
            allUsers
        }
    })
})

exports.getById = catchAsync(async (req, res, next) => {
    const {id} = req.params
    const userById = await findById(id)
    if(!userById) {
        return next(new AppError(`Bunday foydalanuvchi topilmadi`))
    }
    res.json({
        status: "success",
        message: `Foydalanuvchi ${userById.firstName}`,
        error: null,
        data: {
            userById
        }
    })
})

exports.createUsers = catchAsync(async (req, res, next) => {
    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        const err = new AppError("Validatsiya xatosi", 400)
        err.isOperational = false;
        err.errors = validationErrors.errors
        return next(err)
    }
    if(req.body.userRole===userRole.SUPER_ADMIN) {
        return next(new AppError("Faqat bitta Super admin ro'yxatdan o'tishi mumkin"))
    }
    const newUser = await User.create(req.body)
    res.json({
        status: "success",
        message: "Yangi foydalanuvchi yaratildi",
        error: null,
        data: null
    })
})
exports.updateUsers = catchAsync(async (req, res, next) => {
    const {id} = req.params
    const userById = await findById(id)
    if(!userById) {
        return next(new AppError(`Bunday foydalanuvchi topilmadi`))
    }
    const updateUser = await userById.update(req.body)
    res.json({
        status: "success",
        message: "Foydalanuvchi ma'lumotlari yangilandi",
        error: null, 
        data: {
            updateUser
        }
    })
})

exports.getUserRole = catchAsync(async (req, res, next) => {
    const roles = Object.values(userRole).slice(1)
    res.status(200).json({
        status: "success",
        message: "Barcha foydalanuvchi rollari",
        error: null,
        data: {
            roles
        }
    })
})

exports.updateStatus = catchAsync(async (req, res, next) => {
        const {id, status} = req.params
        const userById = await findById(id)
        if(!userById) {
            return next(new AppError(`Bunday foydalanuvchi topilmadi`))
        }
        const updateUserStatus = await userById.update({status})
        res.status(203).json({
            status: "success",
            message: "Foydalanuvchi statusi o'zgardi",
            error: null,
            data: updateUserStatus
        })
    }
)
exports.updatePassword = catchAsync(async (req, res, next) => {
    const {userRole} = req.user
    const {id} = req.params
    const userById = await User.findByPk(id)
    if(!userById) {
        return next(new AppError(`Bunday foydalanuvchi topilmadi`))
    }
    if(userRole !== "SUPER_ADMIN") {
        const updateUserPassword = await userById.update({password: req.body.password})
        res.status(203).json({
            status: "success",
            message: "Foydalanuvchi paroli o'zgartirildi",
            error: null,
            data: {
                updateUserPassword: updateUserPassword.password
            }
        })
    }
    else {
        return next(new AppError("Siz foydalanuvchi parolini o'zgartira olmaysiz"))
    }
})