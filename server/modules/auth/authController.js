const { compare } = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../user/User")
const AppError = require("../../core/utils/appError")
const catchAsync = require("../../core/utils/catchAsync")
const {Op} = require("sequelize")
const { validationResult } = require("express-validator")

const generateToken = (payload, jwtSecret, options) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, jwtSecret, options, (err, token) => {
            if(err) {
                reject(err)
            } else {
                resolve(token)
            }
        })
    })
}

const findByUsername = (username) => {
    const user = User.findOne({
        where: {username: {[Op.eq]: username}}
    })
    if(user) {
        return user
    }
    return null
}

exports.login = catchAsync(async (req, res, next) => {
    const superAdmin = {
        firstName: "Bekzod",
        lastName: "Ismatov",
        phoneNumber: "+998906479794",
        passportNumber: "AB4332323",
        username: "myusername",
        password: "19981998",
        userRole: "SUPER_ADMIN"
    }
    const admin = await User.findAll()
    if(admin.length === 0) {
        await User.create({...superAdmin})
    }
    const validationErrors = validationResult(req)
    if(!validationErrors.isEmpty()) {
        const err = new AppError("Validatsiya xatosi", 400)
        err.isOperational = false;
        err.errors = validationErrors.errors
        return next(err)
    }
    const {username, password} = req.body
    const candidate = await findByUsername(username)
    if(!candidate) {
        return next(new AppError("Login yoki parol xato", 400))
    }
    const passwordIsMatch = await compare(password, candidate.password)
    if(!passwordIsMatch) {
        return next(new AppError("Login yoki parol xato", 400))
    }
    const payload = {
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        phoneNumber: candidate.phoneNumber,
        passportNumber: candidate.passportNumber,
        userRole: candidate.userRole
    }
    const token = await generateToken(payload, process.env.JWT_SECRET, {
        algorithm: "HS512",
        expiresIn: "30d"
    })
    res.json({
        status: "success",
        message: "Tizimga muvaffaqiyatli kirildi",
        error: null,
        data: {
                user: {
                    ...payload
                },
                jwt: token
        }
    })
})