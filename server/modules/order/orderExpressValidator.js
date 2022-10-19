const { body} = require("express-validator");


exports.creatingOrderValidator = [
  body("orders.*.recipient")
    .trim()
    .notEmpty()
    .withMessage("Buyurtma egasi bo`sh bo`lmasligi kerak"),
  body("orders.*.regionId")
    .notEmpty()
    .withMessage("ID si bo`sh bo`lmasligi kerak"),
  body("orders.*.districtId")
    .notEmpty()
    .withMessage("Tumanlar Id topilmadi"),
    body("orders.*.recipientPhoneNumber")
    .notEmpty()
    .withMessage("telefon raqam bo`sh bo`lmasligi kerak")
    .matches(/^[+]998[0-9]{9}$/)
    .withMessage("telefon raqam noto`gri kiritilgan"), 
  body("orders.*.orderItems.*.productName")
    .trim()
    .notEmpty()
    .withMessage("Tovar nomi bo`sh bo`lmasligi kerak"),
  body("orders.*.orderItems.*.quantity")
    .notEmpty()
    .withMessage("Tovar miqdori bo`sh bo`lmasligi kerak"),
  body("orders.*.orderItems.*.price")
    .notEmpty()
    .withMessage("Tovar miqdori bo`sh bo`lmasligi kerak"),
];

exports.updatedOrderValidator = [
  body("recipient")
    .trim()
    .notEmpty()
    .withMessage("Buyurtma egasi bo`sh bo`lmasligi kerak"),
  body("regionId")
    .notEmpty()
    .withMessage("ID si bo`sh bo`lmasligi kerak"),
  body("districtId")
    .notEmpty()
    .withMessage("Tumanlar Id topilmadi"),
    body("recipientPhoneNumber")
    .notEmpty()
    .withMessage("telefon raqam bo`sh bo`lmasligi kerak")
    .matches(/^[+]998[0-9]{9}$/).withMessage("telefon raqam noto`gri kiritilgan"), 
  body("orderItems.*.productName")
    .trim()
    .notEmpty()
    .withMessage("Tovar nomi bo`sh bo`lmasligi kerak"),
  body("orderItems.*.quantity")
    .notEmpty()
    .withMessage("Tovar miqdori bo`sh bo`lmasligi kerak"),
  body("orderItems.*.price")
    .notEmpty()
    .withMessage("Tovar miqdori bo`sh bo`lmasligi kerak"),
];