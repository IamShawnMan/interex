const { body } = require("express-validator");

exports.orderItemValidator = [
  body("name").notEmpty().withMessage("Tovar nomi bo`sh bo`lmasligi kerak"),
  body("quantity").notEmpty().withMessage("Tovar soni bo`sh bo`lmasligi kerak"),
  body("price").notEmpty().withMessage("Tovar summasi bo`sh bo`lmasligi kerak"),
  body("orderId")
    .notEmpty()
    .withMessage("Buyurtma Id si bo`sh bo`lmasligi kerak"),
];
