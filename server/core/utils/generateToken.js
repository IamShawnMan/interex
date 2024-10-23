const jwt = require("jsonwebtoken");

const generateToken = (payload, jwtSecret, options) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, options, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = generateToken;
