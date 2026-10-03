require("dotenv").config();

// 强制要求敏感密钥必须在环境变量中配置，防止使用默认值导致安全漏洞
if (!process.env.JWT_SECRET) {
  throw new Error("Missing required environment variable: JWT_SECRET");
}
if (!process.env.ENCRYPTION_KEY) {
  throw new Error("Missing required environment variable: ENCRYPTION_KEY");
}

module.exports = {
  port: parseInt(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "solopilot_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY,
  },
  rateLimit: {
    login: { windowMs: 15 * 60 * 1000, max: 5 },
    register: { windowMs: 60 * 60 * 1000, max: 5 },
    analysis: { windowMs: 10 * 60 * 1000, max: 3 },
    default: { windowMs: 60 * 1000, max: 60 },
  },
};
