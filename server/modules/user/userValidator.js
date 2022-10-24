const { body } = require("express-validator");
const AppError = require("../../core/utils/AppError");
const User = require("./User");
const {Op} = require("sequelize")
exports.createValidator = [
	body("firstName")
		.notEmpty()
		.withMessage("Ism bo'sh bo'lishi mumkin emas"),
	body("lastName")
		.notEmpty()
		.withMessage("Familiya bo'sh bo'lishi mumkin emas"),
	body("username")
		.notEmpty()
		.withMessage("Username bo'sh bo'lishi mumkin emas")
		.isLength({ min: 5 })
		.withMessage("Usename 5 ta belgidan kam bo'lmasligi kerak")
		.trim()
		.isLowercase()
		.withMessage("Username faqat kichkina harflardan iborat bo'lishi kerak")
		.custom(async(value,{req}) => {
			const existedUser = await User.findOne({where: {username:{[Op.eq]: value}}}) 
			if(existedUser) 
			throw new Error("Ushbu Login tizimda mavjud, iltimos boshqa Login o'ylab toping")
		}),
	body("password")
		.notEmpty()
		.withMessage("Parol bo'sh bo'lishi mumkin emas")
		.isLength({ min: 6 })
		.withMessage("Parol 6 ta belgidan kam bo'lmasligi kerak"),
	body("passportNumber")
		.notEmpty()
		.withMessage("Pasport raqami bo'sh bo'lishi mumkin emas")
		.matches(/^[A-Z]{2}[0-9]{7}$/)
		.withMessage("Passport raqami xato kiritildi"),
	body("phoneNumber")
		.notEmpty()
		.withMessage("Telefon raqam bo'sh bo'lishi mumkin emas")
		.matches(/^[+]998[0-9]{9}$/)
		.withMessage("Telefon raqam xato kiritildi"),
	body("regionId")
		.custom(async(value, {req}) => {
			if(req.body.userRole === "COURIER") {
				if(value === undefined || value === "Viloyatlar") {
					throw new Error("Viloyat tanlanmadi")
				}
			} 
		})
];

exports.updateValidator = [
	body("firstName")
		.notEmpty()
		.withMessage("Ism bo'sh bo'lishi mumkin emas"),
	body("lastName")
		.notEmpty()
		.withMessage("Familiya bo'sh bo'lishi mumkin emas"),
	body("username")
		.notEmpty()
		.withMessage("Username bo'sh bo'lishi mumkin emas")
		.isLength({ min: 5 })
		.withMessage("Usename 5 ta belgidan kam bo'lmasligi kerak")
		.trim()
		.isLowercase()
		.withMessage("Username faqat kichkina harflardan iborat bo'lishi kerak")
		.custom(async(value) => {
			const existedUser = await User.findOne({where: {username:{[Op.eq]: value}}}) 
			if(existedUser) 
			throw new Error("Ushbu Login tizimda mavjud, iltimos boshqa Login o'ylab toping")
		}),
	body("passportNumber")
		.notEmpty()
		.withMessage("Pasport raqami bo'sh bo'lishi mumkin emas")
		.matches(/^[A-Z]{2}[0-9]{7}$/)
		.withMessage("Passport raqami xato kiritildi"),
	body("phoneNumber")
		.notEmpty()
		.withMessage("Telefon raqam bo'sh bo'lishi mumkin emas")
		.matches(/^[+]998[0-9]{9}$/)
		.withMessage("Telefon raqam xato kiritildi"),
	body("regionId")
		.custom(async(value, {req}) => {
			if(req.body.userRole === "COURIER") {
				if(value === undefined || value === "Viloyatlar") {
					throw new Error("Viloyat tanlanmadi")
				}
			} 
		})
];

exports.passwordChangeValidator = [
	body("username")
		.notEmpty()
		.withMessage("Username bo'sh bo'lishi mumkin emas")
		.isLength({ min: 5 })
		.withMessage("Usename 5 ta belgidan kam bo'lmasligi kerak")
		.trim()
		.isLowercase()
		.withMessage("Username faqat kichkina harflardan iborat bo'lishi kerak"),
	body("password")
		.notEmpty()
		.withMessage("Parol bo'sh bo'lishi mumkin emas")
		.isLength({ min: 6 })
		.withMessage("Parol 6 ta belgidan kam bo'lmasligi kerak"),
]

