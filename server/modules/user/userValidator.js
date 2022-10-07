const {body} = require("express-validator")

exports.loginValidator = [
    body("firstName")
    .notEmpty()
    .withMessage("Ism bo'sh bo'lishi mumkin emas"),
    body("lastName")
    .notEmpty()
    .withMessage("Familiya bo'sh bo'lishi mumkin emas"),
    body("phoneNumber")
    .notEmpty()
    .withMessage("Telefon raqam bo'sh bo'lishi mumkin emas"),
    body("passportNumber")
    .notEmpty()
    .withMessage("Pasport raqami bo'sh bo'lishi mumkin emas"),
    body("username")
    .notEmpty()
    .withMessage("Username bo'sh bo'lishi mumkin emas")
    .isLength({min: 6})
    .withMessage("Usename 6 ta belgidan kam bo'lmasligi kerak")
    .trim()
    .isLowercase()
    .withMessage("Username faqat kichkina harflardan iborat bo'lishi kerak"),
    body("password")
    .notEmpty()
    .withMessage("Parol bo'sh bo'lishi mumkin emas")
    .isLength({min: 8})
    .withMessage("Parol 8 ta belgidan kam bo'lmasligi kerak"),
]