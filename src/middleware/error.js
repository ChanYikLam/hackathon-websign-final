const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

function notFoundMiddleware(req, res, next) {
  res.status(404).json({
    code: 404,
    message: `接口 ${req.method} ${req.originalUrl} 不存在`,
  });
}

function errorMiddleware(err, req, res, next) {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      code: 400,
      message: err.message,
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      code: 401,
      message: "未授权访问",
    });
  }

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({
      code: 400,
      message: "记录已存在，无需重复创建",
    });
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({
      code: 400,
      message: "关联数据不存在，请检查用户状态",
    });
  }

  res.status(err.status || 500).json({
    code: err.code || 500,
    message:
      process.env.NODE_ENV === "production"
        ? "服务器内部错误"
        : err.message || "服务器内部错误",
  });
}

module.exports = {
  asyncHandler,
  notFoundMiddleware,
  errorMiddleware,
};
