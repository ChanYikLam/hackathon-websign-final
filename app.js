const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");
const config = require("./src/config");
const { createPool } = require("./src/config/database");
const routes = require("./src/routes");
const {
  notFoundMiddleware,
  errorMiddleware,
} = require("./src/middleware/error");

const app = express();

// 注意：已移除 helmet，避免 CSP 限制 test.html 的内联脚本
// 生产环境建议重新启用 helmet 并配置正确的 CSP
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : process.env.NODE_ENV === "production"
        ? (console.warn(
            "⚠️  CORS_ORIGIN not set in production, defaulting to deny all",
          ),
          false)
        : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging (dev mode: colored, production: combined format)
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// General rate limiter (excludes analysis polling endpoints)
app.use(
  "/api",
  rateLimit({
    windowMs: config.rateLimit.default.windowMs,
    max: config.rateLimit.default.max,
    message: {
      code: 429,
      message: "请求过于频繁，请稍后再试",
    },
    skip: (req) => {
      // 轮询状态接口不纳入限流，避免 AI 分析期间频繁轮询被拦截
      return req.path.includes("/analysis/status");
    },
  }),
);

// Static files - 禁用缓存，确保测试页面加载最新版本
app.use(
  express.static(path.join(__dirname, "public"), {
    etag: false,
    lastModified: false,
    maxAge: 0,
    setHeaders: (res) => {
      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    },
  }),
);

// Serve test page - 用 express.static 统一处理，避免重复逻辑
// 直接删除这两个路由，让 express.static 托管即可

// Routes
app.use("/api/v1", routes);

// Error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Start server
const server = (async () => {
  try {
    await createPool();
    return app.listen(config.port, () => {
      console.log(
        `\n🚀 SoloPilot Server running at http://localhost:${config.port}`,
      );
      console.log(`📡 API Base URL: http://localhost:${config.port}/api/v1\n`);
    });
  } catch (error) {
    console.error(
      "\n⚠️  Database connection failed, starting in degraded mode",
    );
    return app.listen(config.port, () => {
      console.log(
        `\n🚀 SoloPilot Server running in degraded mode at http://localhost:${config.port}\n`,
      );
    });
  }
})();

// Graceful shutdown
const { closePool } = require("./src/config/database");
async function gracefulShutdown(signal) {
  console.log(`\n${signal} received, shutting down gracefully...`);
  const srv = await server;
  srv.close(async () => {
    console.log("HTTP server closed");
    await closePool();
    console.log("Database pool closed");
    process.exit(0);
  });
  // 10 秒后强制退出
  setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

module.exports = app;
