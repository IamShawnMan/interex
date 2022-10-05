const { compare } = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../user/User")
const AppError = require("../../core/utils/appError")
const catchAsync = require("../../core/utils/catchAsync")
const {Op} = require("sequelize")

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

exports.register = catchAsync(async (req, res, next) => {
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
    const existedUser = await findByUsername(req.body.username)
    if(existedUser) {
        return next(new AppError("Bunday username ga ega foydaluvchi mavjud"))
    }
    const newUser = await User.create(req.body)
    const payload = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        passportNumber: newUser.passportNumber,
        username: newUser.username,
        password: newUser.password,
        userRole: newUser.userRole
    }
    const token = await generateToken(payload, process.env.JWT_SECRET, {
        algorithm: "HS512",
        expiresIn: "30d"
    })
    res.status(201).json({
        status: "success",
        message: "Registartsiya muvaffaqiyatli yakunlandi",
        error: null,
        data: {
            user: {
                ...payload
            },
            jwt: token
        }
    })
})

exports.login = catchAsync(async (req, res, next) => {
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