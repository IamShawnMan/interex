const { body} = require("express-validator");

const creatingOrderValidator = [
  body("orders.*.recipient")
    .notEmpty()
    .withMessage("Buyurtma egasi bo`sh bo`lmasligi kerak"),
  body("orders.*.regionId")
    .notEmpty()
    .withMessage("Viloyatlar ID si bo`sh bo`lmasligi kerak"),
  body("orders.*.districtId")
    .notEmpty()
    .withMessage("Tumanlar Id topilmadi"),
  body("orders.*.orderItems.*.productName")
    .notEmpty()
    .withMessage("Tovar nomi bo`sh bo`lmasligi kerak"),
  body("orders.*.orderItems.*.quantity")
    .notEmpty()
    .withMessage("Tovar miqdori bo`sh bo`lmasligi kerak"),
  body("orders.*.orderItems.*.price")
    .notEmpty()
    .withMessage("Tovar miqdori bo`sh bo`lmasligi kerak"),
];

module.exports = creatingOrderValidator