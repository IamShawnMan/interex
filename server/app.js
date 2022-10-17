const express = require("express");
const errorController = require("./modules/error/errorController");
const AppError = require("./core/utils/appError");
const userRouter = require("./modules/user/userRouter");
const regionRouter = require("./modules/region/regionRouter");
const authRouter = require("./modules/auth/authRouter");
const cors = require("cors");

// ROUTES
const orderRoutes = require("./modules/order/orderRoutes");
const authMiddleware = require("./core/middlewares/authMiddleware");
const districtRouter = require("./modules/district/districtRouter");
const packageRoutes = require("./modules/package/packageRoutes")
require("./modules/user/User");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/users", authMiddleware, userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/regions", regionRouter);
app.use("/api/v1/orders", authMiddleware, order Routes);
app.use("/api/v1/package", authMiddleware, packageRoutes)
app.use("/api/v1/districts", districtRouter);
app.use(express.static(__dirname + "/build"));

app.get("*", (req, res) => {
	res.sendFile(__dirname + "/build/index.html");
});

app.all("*", (req, res, next) => {
	return next(new AppError(`${req.path} yo'li mavjud emas`, 404));
});

app.use(errorController);

module.exports = app;
