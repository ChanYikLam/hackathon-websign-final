const jwt = require("jsonwebtoken");
const config = require("../config");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      code: 1001,
      message: "Missing authorization header",
    });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      code: 1001,
      message: "Invalid authorization format. Use: Bearer {token}",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        code: 1002,
        message: "Token expired",
      });
    }
    return res.status(401).json({
      code: 1003,
      message: "Invalid token",
    });
  }
}

/**
 * 管理员角色校验中间件
 * 必须在 authMiddleware 之后使用
 * 依赖 JWT payload 中的 role 字段，role === 'admin' 才允许通过
 */
function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      code: 403,
      message: "Forbidden: admin access required",
    });
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware };
