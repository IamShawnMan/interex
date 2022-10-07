const User = require("./User");
const catchAsync = require("../../core/utils/catchAsync");
const AppError = require("../../core/utils/appError");
const userENUM = require("../../core/utils/userENUM")
const { validationResult } = require("express-validator")

exports.getUsers = catchAsync(async (req, res, next) => {
    const allUsers = await User.findAndCountAll()
    if(!allUsers) {
        return next(new AppError("Foydalanuvchilar mavjud emas", 404))
    }
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
    const userById = await User.findByPk(id)
    if(!userById) {
        return next(new AppError(`Ushbu foydalanuvchi mavjud`))
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
    if(req.body.userRole===userENUM.SUPER_ADMIN) {
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
    const userById = await User.findByPk(id)
    if(!userById) {
        return next(new AppError(`Bunday foydalanuvchi topilmadi`, 404))
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
    const roles = Object.values(userENUM).slice(1)
    res.status(200).json({
        status: "success",
        message: "Barcha foydalanuvchi rollari",
        error: null,
        data: {
            roles
        }
    })
})