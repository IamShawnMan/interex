const {body} = require("express-validator")

exports.noteValidator = [
    body("phone")
    .notEmpty()
    .withMessage("Telefon raqam bo'sh bo'lishi mumkin emas")
    .matches(/^[+]998[0-9]{9}$/)
    .withMessage("Telefon raqam xato kiritildi"),
    body("avtoNumber")
    .notEmpty()
    .withMessage("Moshin raqami bo`sh bo`lmasligi kerak")
    .matches(/^[0-9]{2}[A-Z]{1}[0-9]{3}[A-Z]{2}$/)
    .withMessage("Moshin raqami xato kiritildi")
]

