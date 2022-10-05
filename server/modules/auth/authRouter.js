const express = require("express")
const authController = require("./authController")
const {body} = require("express-validator")

const router = express.Router()

router
    .post("/login",
     body("username")
    .notEmpty()
    .withMessage("Username bo'sh bo'lishi mumkin emas")
    .isLength({min: 6})
    .withMessage("Usename 6 ta belgidan kam bo'lmasligi kerak"),
     body("password")
    .notEmpty()
    .withMessage("Parol bo'sh bo'lishi mumkin emas")
    .isLength({min: 8})
    .withMessage("Parol 8 ta belgidan kam bo'lmasligi kerak"),
    authController.login)

module.exports = router