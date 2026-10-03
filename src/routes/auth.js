const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { authMiddleware } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/error");
const { generateToken } = require("../utils/auth");
const { encryptIfPlain, decryptIfEncrypted } = require("../utils/crypto");
const { query } = require("../config/database");

const router = express.Router();
const rateLimit = require("express-rate-limit");
const config = require("../config");

const loginLimiter = rateLimit({
  windowMs: config.rateLimit.login.windowMs,
  max: config.rateLimit.login.max,
  message: {
    code: 429,
    message: "登录尝试次数过多，请稍后重试",
  },
});

const registerLimiter = rateLimit({
  windowMs: config.rateLimit.register.windowMs,
  max: config.rateLimit.register.max,
  message: {
    code: 429,
    message: "注册尝试次数过多，请稍后重试",
  },
});

// POST /api/v1/auth/register
router.post(
  "/register",
  registerLimiter,
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("用户名长度为 3-50 个字符"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("密码至少需要 6 个字符"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array()[0].msg });
    }

    const { username, password, nickname } = req.body;

    const [existing] = await query(
      "SELECT id FROM users WHERE LOWER(username) = LOWER(?)",
      [username],
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ code: 400, message: "用户名已被使用" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await query(
      "INSERT INTO users (username, password_hash, nickname) VALUES (?, ?, ?)",
      [username, passwordHash, nickname || null],
    );

    const userId = result.insertId;

    const token = generateToken({ userId, username, role: "user" });

    res.status(201).json({
      code: 0,
      message: "注册成功",
      data: {
        token,
        token_expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: { id: userId, username, nickname: nickname || null, avatar: null, is_info_completed: false, is_mbti_completed: false, created_at: new Date().toISOString() }
      },
    });
  }),
);

// POST /api/v1/auth/login
router.post(
  "/login",
  loginLimiter,
  [
    body("username").notEmpty().withMessage("请填写用户名"),
    body("password").notEmpty().withMessage("请填写密码"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array()[0].msg });
    }

    const { username, password } = req.body;

    const [users] = await query(
      "SELECT id, username, password_hash, status, failed_login_count, locked_until FROM users WHERE LOWER(username) = LOWER(?)",
      [username],
    );

    if (users.length === 0) {
      return res
        .status(401)
        .json({ code: 1004, message: "用户名或密码不正确" });
    }

    const user = users[0];

    if (user.status === 0) {
      return res
        .status(403)
        .json({ code: 1004, message: "账号已被禁用，请联系客服" });
    }

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(429).json({
        code: 429,
        message: `账号已锁定，请在 ${user.locked_until} 后重试`,
      });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      const newFailCount = user.failed_login_count + 1;
      let lockedUntil = null;

      if (newFailCount >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await query(
        "UPDATE users SET failed_login_count = ?, locked_until = ? WHERE id = ?",
        [newFailCount, lockedUntil, user.id],
      );

      return res
        .status(401)
        .json({ code: 1004, message: "用户名或密码不正确" });
    }

    await query(
      "UPDATE users SET failed_login_count = 0, locked_until = NULL, last_login_at = NOW() WHERE id = ?",
      [user.id],
    );

    const token = generateToken({ userId: user.id, username: user.username, role: user.role || "user" });

    // 获取用户完整资料
    const [userProfile] = await query(
      "SELECT id, username, nickname, avatar, status, is_info_completed, is_mbti_completed, is_analysis_done, created_at FROM users WHERE id = ?",
      [user.id]
    );

    res.json({
      code: 0,
      message: "登录成功",
      data: {
        token,
        token_expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: userProfile[0] || { id: user.id, username: user.username, nickname: null, avatar: null, is_info_completed: false, is_mbti_completed: false, created_at: new Date().toISOString() }
      },
    });
  }),
);

// POST /api/v1/auth/refresh-token
router.post(
  "/refresh-token",
  [body("token").notEmpty().withMessage("请提供有效的 Token")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array()[0].msg });
    }

    const { token } = req.body;
    const { verifyToken } = require("../utils/auth");

    let decoded;
    try {
      // ignoreExpiration: true 允许过期的 token 也能刷新
      decoded = verifyToken(token, { ignoreExpiration: true });
    } catch (error) {
      return res.status(401).json({
        code: 1003,
        message: "无效的 Token",
      });
    }

    const newToken = generateToken({
      userId: decoded.userId,
      username: decoded.username,
    });

    res.json({
      code: 0,
      message: "Token 已刷新",
      data: { token: newToken, token_expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
    });
  }),
);

// POST /api/v1/auth/refresh（前端使用的路径，复用 refresh-token 逻辑）
router.post(
  "/refresh",
  [body("token").optional().notEmpty().withMessage("请提供有效的 Token")],
  asyncHandler(async (req, res) => {
    // 如果 body 中没有 token，从 header 取
    const tokenFromBody = req.body.token;
    const tokenFromHeader = req.headers.authorization?.replace('Bearer ', '');
    const token = tokenFromBody || tokenFromHeader;

    if (!token) {
      return res.status(401).json({ code: 1003, message: "无效的 Token" });
    }

    const { verifyToken } = require("../utils/auth");
    let decoded;
    try {
      decoded = verifyToken(token, { ignoreExpiration: true });
    } catch (error) {
      return res.status(401).json({ code: 1003, message: "无效的 Token" });
    }

    const newToken = generateToken({
      userId: decoded.userId,
      username: decoded.username,
    });

    res.json({
      code: 0,
      message: "Token 已刷新",
      data: { token: newToken, token_expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
    });
  }),
);

// GET /api/v1/auth/profile
router.get(
  "/profile",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const [users] = await query(
      "SELECT id, username, nickname, avatar, status, is_info_completed, is_mbti_completed, is_analysis_done, created_at FROM users WHERE id = ?",
      [req.user.userId],
    );

    if (users.length === 0) {
      return res.status(404).json({ code: 1004, message: "用户不存在" });
    }

    const u = users[0];
    res.json({
      code: 0,
      data: {
        id: u.id,
        username: u.username,
        nickname: u.nickname,
        avatar: u.avatar,
        status: u.status,
        is_info_completed: !!u.is_info_completed,
        is_mbti_completed: !!u.is_mbti_completed,
        is_analysis_done: !!u.is_analysis_done,
        current_step: "info-collect",
        info_collect_step: 0,
        mbti_current_question: 0,
        created_at: u.created_at,
        last_login_at: new Date().toISOString(),
      },
    });
  }),
);

// PUT /api/v1/auth/profile
router.put(
  "/profile",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { nickname, avatar } = req.body;
    const updates = [];
    const values = [];

    if (nickname !== undefined) {
      updates.push("nickname = ?");
      values.push(nickname);
    }
    if (avatar !== undefined) {
      updates.push("avatar = ?");
      values.push(avatar);
    }

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ code: 400, message: "没有需要更新的字段" });
    }

    values.push(req.user.userId);
    await query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values);

    res.json({ code: 0, message: "资料已更新" });
  }),
);

// POST /api/v1/auth/avatar
router.post(
  "/avatar",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { avatarUrl } = req.body;
    if (!avatarUrl) {
      return res
        .status(400)
        .json({ code: 400, message: "请提供头像地址" });
    }

    await query("UPDATE users SET avatar = ? WHERE id = ?", [
      avatarUrl,
      req.user.userId,
    ]);

    res.json({
      code: 0,
      message: "头像已更新",
      data: { avatar: avatarUrl },
    });
  }),
);

// PUT /api/v1/user/info（前端期望的路径，通过 /user 别名挂载）
// PUT /api/v1/auth/profile 的扩展：支持一次性更新信息采集字段
router.put(
  "/info",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { city, gender, intensity, skill, direction, purpose, schedule, skill_other } = req.body;

    // 更新用户资料
    const updates = [];
    const values = [];

    if (city !== undefined) { updates.push("city = ?"); values.push(city); }
    if (gender !== undefined) { updates.push("gender = ?"); values.push(gender); }
    if (intensity !== undefined) { updates.push("intensity = ?"); values.push(intensity); }
    if (skill !== undefined) { updates.push("skill = ?"); values.push(skill); }
    if (direction !== undefined) { updates.push("direction = ?"); values.push(direction); }
    if (purpose !== undefined) { updates.push("purpose = ?"); values.push(purpose); }
    if (schedule !== undefined) { updates.push("schedule = ?"); values.push(schedule); }
    if (skill_other !== undefined) { updates.push("skill_other = ?"); values.push(skill_other); }

    if (updates.length === 0) {
      return res.status(400).json({ code: 400, message: "没有需要更新的字段" });
    }

    values.push(req.user.userId);
    await query(`UPDATE user_profiles SET ${updates.join(", ")} WHERE user_id = ?`, values);

    await query("UPDATE users SET is_info_completed = 1 WHERE id = ?", [req.user.userId]);

    res.json({ code: 0, data: { is_info_completed: true } });
  }),
);

// PUT /api/v1/user/avatar（前端期望的路径和方法）
router.put(
  "/avatar",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { avatarUrl, avatar } = req.body;
    const finalAvatar = avatarUrl || avatar;

    if (!finalAvatar) {
      return res.status(400).json({ code: 400, message: "请提供头像地址" });
    }

    await query("UPDATE users SET avatar = ? WHERE id = ?", [
      finalAvatar,
      req.user.userId,
    ]);

    res.json({
      code: 0,
      data: { avatar: finalAvatar },
    });
  }),
);

module.exports = router;
