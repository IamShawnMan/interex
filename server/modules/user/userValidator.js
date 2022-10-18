const { body } = require("express-validator");

exports.createValidator = [
	body("firstName")
		.notEmpty()
		.withMessage("Ism bo'sh bo'lishi mumkin emas"),
	body("lastName")
		.notEmpty()
		.withMessage("Familiya bo'sh bo'lishi mumkin emas"),
	body("phoneNumber")
		.notEmpty()
		.withMessage("Telefon raqam bo'sh bo'lishi mumkin emas")
		.matches(/^[+]998[0-9]{9}$/)
		.withMessage("Telefon raqam xato kiritildi"),
	body("passportNumber")
		.notEmpty()
		.withMessage("Pasport raqami bo'sh bo'lishi mumkin emas")
		.matches(/^[A-Z]{2}[0-9]{7}$/)
		.withMessage("Passport raqami xato kiritildi"),
	body("username")
		.notEmpty()
		.withMessage("Username bo'sh bo'lishi mumkin emas")
		.isLength({ min: 5 })
		.withMessage("Usename 5 ta belgidan kam bo'lmasligi kerak")
		.trim()
		.isLowercase()
		.withMessage("Username faqat kichkina harflardan iborat bo'lishi kerak"),
	body("password")
		.notEmpty()
		.withMessage("Parol bo'sh bo'lishi mumkin emas")
		.isLength({ min: 6 })
		.withMessage("Parol 6 ta belgidan kam bo'lmasligi kerak"),
];

exports.updateValidator = [
	body("firstName")
		.notEmpty()
		.withMessage("Ism bo'sh bo'lishi mumkin emas"),
	body("lastName")
		.notEmpty()
		.withMessage("Familiya bo'sh bo'lishi mumkin emas"),
	body("phoneNumber")
		.notEmpty()
		.withMessage("Telefon raqam bo'sh bo'lishi mumkin emas")
		.matches(/^[+]998[0-9]{9}$/)
		.withMessage("Telefon raqam xato kiritildi"),
	body("passportNumber")
		.notEmpty()
		.withMessage("Pasport raqami bo'sh bo'lishi mumkin emas")
		.matches(/^[A-Z]{2}[0-9]{7}$/)
		.withMessage("Passport raqami xato kiritildi"),
	body("username")
		.notEmpty()
		.withMessage("Username bo'sh bo'lishi mumkin emas")
		.isLength({ min: 5 })
		.withMessage("Usename 5 ta belgidan kam bo'lmasligi kerak")
		.trim()
		.isLowercase()
		.withMessage("Username faqat kichkina harflardan iborat bo'lishi kerak"),
];

exports.passwordChangeValidator = [
	body("username")
		.notEmpty()
		.withMessage("Username bo'sh bo'lishi mumkin emas")
		.isLength({ min: 5 })
		.withMessage("Usename 5 ta belgidan kam bo'lmasligi kerak")
		.trim()
		.isLowercase()
		.withMessage("Username faqat kichkina harflardan iborat bo'lishi kerak"),
	body("password")
		.notEmpty()
		.withMessage("Parol bo'sh bo'lishi mumkin emas")
		.isLength({ min: 6 })
		.withMessage("Parol 6 ta belgidan kam bo'lmasligi kerak"),
]
