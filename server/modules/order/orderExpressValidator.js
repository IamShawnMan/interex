const { body } = require("express-validator");

exports.creatingOrderValidator = [
  body("recipient")
    .notEmpty()
    .withMessage("Buyurtma egasi bo`sh bo`lmasligi kerak"),
  body("orderStatus")
    .notEmpty()
    .withMessage("Order xolati bo`sh bo`lmasligi kerak"),
  body("deliveryPrice")
    .notEmpty()
    .withMessage("Xizmat xaqqi bo`sh bo`lmasligi kerak"),
  body("totalPrice")
    .notEmpty()
    .withMessage("Buyurtma xisobi bo`sh bo`lmasligi kerak"),
  body("regionId")
    .notEmpty()
    .withMessage("Viloyatlar ID si bo`sh bo`lmasligi kerak"),
];
