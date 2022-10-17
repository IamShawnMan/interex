const { body, check, } = require("express-validator");

exports.creatingOrderValidator = [

  body("*.recipient")
    .notEmpty()
    .withMessage("Buyurtma egasi bo`sh bo`lmasligi kerak"),
  body("*.regionId")
    .notEmpty()
    .withMessage("Viloyatlar ID si bo`sh bo`lmasligi kerak"),
  body("*.districtId")
    .notEmpty()
    .withMessage("Tumanlar Id topilmadi"),
  body("*.orderItems.*.productName")
    .notEmpty()
    .withMessage("Tovar nomi bo`sh bo`lmasligi kerak"),
  body("*.orderItems.*.quantity")
    .notEmpty()
    .withMessage("Tovar miqdori bo`sh bo`lmasligi kerak"),
  body("*.orderItems.*.price")
    .notEmpty()
    .withMessage("Tovar miqdori bo`sh bo`lmasligi kerak"),
];
