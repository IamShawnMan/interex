const { body} = require("express-validator");

exports.creatingOrderValidator = [
  body("orders.*.recipient")
    .trim()
    .notEmpty()
    .withMessage("Buyurtma egasi bo'sh bo'lishi mumkin emas"),
  body("orders.*.regionId")
    .custom(async(value, {req}) => {
      if(req.body.userRole === "COURIER") {
        if(value === undefined || value === "") {
          throw new Error("Viloyat tanlanmadi")
        }
      } 
    }),
  body("orders.*.districtId")
    .custom(async(value, {req}) => {
      if(req.body.userRole === "COURIER") {
        if(value === undefined || value === "") {
          throw new Error("Tuman tanlanmadi")
        }
      } 
    }),
  body("orders.*.recipientPhoneNumber")
    .notEmpty()
    .withMessage("Telefon raqam bo'sh bo'lishi mumkin emas")
    .matches(/^[+]998[0-9]{9}$/)
    .withMessage("Telefon raqam xato kiritildi"), 
  body("orders.*.orderItems.*.productName")
    .trim()
    .notEmpty()
    .withMessage("Tovar nomi bo'sh bo'lishi mumkin emas"),
  body("orders.*.orderItems.*.quantity")
    .notEmpty()
    .withMessage("Tovar miqdori bo'sh bo'lishi mumkin emas"),
  body("orders.*.orderItems.*.price")
    .notEmpty()
    .withMessage("Tovar miqdori bo'sh bo'lishi mumkin emas"),
];

exports.updatedOrderValidator = [
  body("recipient")
    .trim()
    .notEmpty()
    .withMessage("Buyurtma egasi bo'sh bo'lishi mumkin emas"),
  body("orders.*.regionId")
    .custom(async(value, {req}) => {
      if(req.body.userRole === "COURIER") {
        if(value === undefined || value === "") {
          throw new Error("Viloyat tanlanmadi")
        }
      } 
    }),
  body("orders.*.districtId")
    .custom(async(value, {req}) => {
      if(req.body.userRole === "COURIER") {
        if(value === undefined || value === "") {
          throw new Error("Tuman tanlanmadi")
        }
      } 
    }),
  body("recipientPhoneNumber")
    .notEmpty()
    .withMessage("telefon raqam bo'sh bo'lishi mumkin emas")
    .matches(/^[+]998[0-9]{9}$/)
    .withMessage("telefon raqam xato kiritildi"), 
  body("orderItems.*.productName")
    .trim()
    .notEmpty()
    .withMessage("Tovar nomi bo'sh bo'lishi mumkin emas"),
  body("orderItems.*.quantity")
    .notEmpty()
    .withMessage("Tovar miqdori bo'sh bo'lishi mumkin emas"),
  body("orderItems.*.price")
    .notEmpty()
    .withMessage("Tovar miqdori bo'sh bo'lishi mumkin emas"),
];