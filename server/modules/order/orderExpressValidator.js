const { body, check, } = require("express-validator");

exports.creatingOrderValidator = [

  check("*.recipient").not()
    .notEmpty()
    .withMessage("Buyurtma egasi bo`sh bo`lmasligi kerak"),
  check("*.regionId").not()
    .notEmpty()
    .withMessage("Viloyatlar ID si bo`sh bo`lmasligi kerak"),
  check("*.districtId").not()
    .notEmpty()
    .withMessage("Tumanlar Id topilmadi"),
  check("items.*.productName").not() 
    .notEmpty()
    .withMessage("Tovar nomi bo`sh bo`lmasligi kerak"),
  check("items.*.quantity").not()
    .notEmpty()
    .withMessage("Tovar miqdori bo`sh bo`lmasligi kerak"),
  check("items.*.price").not()
    .notEmpty()
    .withMessage("Tovar miqdori bo`sh bo`lmasligi kerak"),
];
