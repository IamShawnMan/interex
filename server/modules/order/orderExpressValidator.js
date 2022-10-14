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
  body("*.items.*.productName")
    .notEmpty()
    .withMessage("Tovar nomi bo`sh bo`lmasligi kerak"),
  body("*.items.*.quantity")
    .notEmpty()
    .withMessage("Tovar miqdori bo`sh bo`lmasligi kerak"),
  body("*.items.*.price")
    .notEmpty()
    .withMessage("Tovar miqdori bo`sh bo`lmasligi kerak"),
];
