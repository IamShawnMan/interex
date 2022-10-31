import * as yup from "yup";

export const storeOwnerSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("FirstName bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("LastName bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Username bo'sh bo'lishi mumkin emas")
    .min(5, "Username 5 ta belgidan kop bolishi kerak")
    .max(20, "Username 20 ta belgidan kam bolishi kerak"),
  password: yup
    .string()
    .trim()
    .required("Parol bo'sh bo'lishi mumkin emas")
    .min(6, "Parol 6 ta belgidan kop bolishi kerak")
    .max(20, "Parol 20 ta belgidan kam bolishi kerak"),
  storeName: yup.string().trim().required("Do'kon nomini kiriting"),

});
export const adminSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("FirstName bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("LastName bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Username bo'sh bo'lishi mumkin emas")
    .min(5, "Username 5 ta belgidan kop bolishi kerak")
    .max(20, "Username 20 ta belgidan kam bolishi kerak"),
  password: yup
    .string()
    .trim()
    .required("Parol bo'sh bo'lishi mumkin emas")
    .min(6, "Parol 6 ta belgidan kop bolishi kerak")
    .max(20, "Parol 20 ta belgidan kam bolishi kerak"),

});
export const courierSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("FirstName bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("LastName bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Username bo'sh bo'lishi mumkin emas")
    .min(5, "Username 5 ta belgidan kop bolishi kerak")
    .max(20, "Username 20 ta belgidan kam bolishi kerak"),
  password: yup
    .string()
    .trim()
    .required("Parol bo'sh bo'lishi mumkin emas")
    .min(6, "Parol 6 ta belgidan kop bolishi kerak")
    .max(20, "Parol 20 ta belgidan kam bolishi kerak"),
  regionId: yup.string().trim().required("Region bo'sh bo'lishi mumkin emas"),
});
export const storeOwnerSchemaUpdate = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("FirstName bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("LastName bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Username bo'sh bo'lishi mumkin emas")
    .min(5, "Username 5 ta belgidan kop bolishi kerak")
    .max(20, "Username 20 ta belgidan kam bolishi kerak"),
  storeName: yup.string().trim().required("Do'kon nomini kiriting"),

});
export const adminSchemaUpdate = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("FirstName bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("LastName bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Username bo'sh bo'lishi mumkin emas")
    .min(5, "Username 5 ta belgidan kop bolishi kerak")
    .max(20, "Username 20 ta belgidan kam bolishi kerak"),

});
export const courierSchemaUpdate = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required("FirstName bo'sh bo'lishi mumkin emas"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Telefon raqami bo'sh bo'lishi mumkin emas"),
  passportNumber: yup
    .string()
    .trim()
    .required("Pasport raqami bo'sh bo'lishi mumkin emas"),
  lastName: yup.string().trim().required("LastName bo'sh bo'lishi mumkin emas"),
  username: yup
    .string()
    .trim()
    .required("Username bo'sh bo'lishi mumkin emas")
    .min(5, "Username 5 ta belgidan kop bolishi kerak")
    .max(20, "Username 20 ta belgidan kam bolishi kerak"),
  regionId: yup.string().trim().required("Region bo'sh bo'lishi mumkin emas"),
});


export const defaultSchema = yup.object().shape({
  userRole: yup
    .string()
    .trim()
    .required("user mansabi bo'sh bo'lishi mumkin emas"),})