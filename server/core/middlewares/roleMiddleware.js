const AppError = require("../utils/appError");

const roleMiddleware = (req, res, next) => {
	const userAccess = (role, reqMethod) => {
		if (reqMethod === "GET" && role !== "SUPER_ADMIN" && role !== "ADMIN") {
			return next(new AppError("Only ADMIN and SUPER_ADMIN can access", 403));
		}
		if (
			(reqMethod === "POST" || reqMethod === "PUT") &&
			role !== "SUPER_ADMIN"
		) {
			return next(new AppError("only SUPER_ADMIN can access", 403));
		}
	};
	userAccess(req.user.userRole, req.method);
	next();
};

module.exports = roleMiddleware;
