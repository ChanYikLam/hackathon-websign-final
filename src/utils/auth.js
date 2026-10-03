const jwt = require("jsonwebtoken");
const config = require("../config");

function generateToken(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

function verifyToken(token, options = {}) {
  return jwt.verify(token, config.jwt.secret, options);
}

module.exports = {
  generateToken,
  verifyToken,
};
