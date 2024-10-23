const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError("Registratsiyadan o'tilmagan", 401));
  }
  const token = authHeader.slice(7); // This assumes "Bearer <token>"

  try {
    // Specify the algorithm explicitly during verification
    const user = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS512"],
    });
    req.user = user;
    next();
  } catch (error) {
    // Handle errors from jwt.verify
    return next(new AppError("Registratsiyadan o'tilmagan", 401));
  }
};

module.exports = authMiddleware;
