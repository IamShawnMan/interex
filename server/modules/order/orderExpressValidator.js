const { body } = require("express-validator");

exports.creatingOrderValidator = [
  body("recipient")
    .notEmpty()
    .withMessage("Buyurtma egasi bo`sh bo`lmasligi kerak"),
  body("regionId")
    .notEmpty()
    .withMessage("Viloyatlar ID si bo`sh bo`lmasligi kerak"),
  body("name").notEmpty().withMessage("Tovar nomi bo`sh bo`lmasligi kerak"),
];
