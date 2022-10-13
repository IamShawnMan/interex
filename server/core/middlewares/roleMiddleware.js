const AppError = require("../utils/appError");

const roleMiddleware = (roles) => {
	// console.log(typeof roles);
	let selectedRoles;
	return (req, res, next) => {
		if (typeof roles === "string") {
			selectedRoles = [roles];
			// console.log(selectedRoles);
		} else {
			selectedRoles = roles;
			// console.log(selectedRoles);
		}

		if (!selectedRoles.includes(req.user.userRole)) {
			console.log(selectedRoles);
			next(new AppError("Forbidden", 403));
		} else {
			next();
		}
	};
};

module.exports = roleMiddleware;
