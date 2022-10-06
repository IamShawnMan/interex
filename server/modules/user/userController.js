const User = require("./User");
const catchAsync = require("../../core/utils/catchAsync");
const AppError = require("../../core/utils/appError");
const userENUM = require("../../core/utils/userENUM")

exports.getUsers = catchAsync(async (req, res, next) => {
    const allUsers = await User.findAndCountAll()
    if(!allUsers) {
        return next(new AppError("Users list is empty", 404))
    }
    res.json({
        status: "success",
        message: "All users",
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
        return next(new AppError(`Users with this ${id} is not defined`))
    }
    res.json({
        status: "success",
        message: "User found by id",
        error: null,
        data: {
            userById
        }
    })
})

exports.createUsers = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body)
    if(!newUser) {
        return next(new AppError("New user not found", 404))
    }
    res.json({
        status: "success",
        message: "New user created",
        error: null,
        data: null
    })
})
exports.updateUsers = catchAsync(async (req, res, next) => {
    const {id} = req.params
    const userById = await User.findByPk(id)
    if(!userById) {
        return next(new AppError(`Users with this ${id} is not defined`))
    }
    const updateUser = await userById.update(req.body)
    res.json({
        status: "success",
        message: "User updated",
        error: null, 
        data: {
            updateUser
        }
    })
})

exports.deleteUsers = catchAsync(async (req, res, next) => {
    const {id} = req.params
    const userById = await User.findByPk(id)
    if(!userById) {
        return next(new AppError(`Users with this ${id} is not defined`))
    }
    await userById.destroy()
    res.status(204).json({
        status: "success",
        message: "User deleted",
        error: null,
        data: null
    })
})
exports.getUserRole = catchAsync(async (req, res, next) => {
    const userRole = Object.values(userENUM)
    res.status(200).json({
        status: "success",
        message: "All user roles",
        error: null,
        data: {
            userRole
        }
    })
})