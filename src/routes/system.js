const express = require("express");
const { body, validationResult } = require("express-validator");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/error");
const { query } = require("../config/database");

const router = express.Router();

// GET /api/v1/system/config
router.get(
  "/config",
  asyncHandler(async (req, res) => {
    const [configs] = await query(
      "SELECT config_key, config_value FROM sys_config WHERE is_public = 1",
    );

    const configMap = {};
    configs.forEach((c) => {
      try {
        configMap[c.config_key] = JSON.parse(c.config_value);
      } catch {
        configMap[c.config_key] = c.config_value;
      }
    });

    res.json({ code: 0, data: configMap });
  }),
);

// GET /api/v1/system/config/all（管理员专属）
router.get(
  "/config/all",
  authMiddleware,
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const [configs] = await query(
      "SELECT config_key, config_value, category, description, is_public, updated_by, updated_at, created_at FROM sys_config ORDER BY category, config_key",
    );

    res.json({
      code: 0,
      data: {
        configs,
        categories: [...new Set(configs.map((c) => c.category))],
      },
    });
  }),
);

// POST /api/v1/system/config
router.post(
  "/config",
  authMiddleware,
  adminMiddleware,
  [
    body("config_key")
      .notEmpty()
      .withMessage("请填写配置键")
      .matches(/^[a-zA-Z][a-zA-Z0-9_.-]*$/)
      .withMessage("配置键格式不正确，必须以字母开头，仅允许字母、数字、下划线、点号、连字符")
      .isLength({ max: 100 })
      .withMessage("配置键长度不能超过 100 个字符"),
    body("config_value").notEmpty().withMessage("请填写配置值"),
    body("category")
      .notEmpty()
      .withMessage("请填写分类")
      .matches(/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5\s-]*$/)
      .withMessage("分类格式不正确"),
    body("description").optional({ nullable: true }).isString(),
    body("is_public")
      .optional()
      .custom((v) => [0, 1].includes(Number(v)))
      .withMessage("公开状态必须为 0 或 1"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array()[0].msg });
    }

    const {
      config_key,
      config_value,
      category,
      description = null,
      is_public = 0,
    } = req.body;

    try {
      const [result] = await query(
        "INSERT INTO sys_config (config_key, config_value, category, description, is_public, updated_by) VALUES (?, ?, ?, ?, ?, ?)",
        [
          config_key,
          config_value,
          category,
          description,
          is_public,
          req.user.userId,
        ],
      );

      res.status(201).json({
        code: 0,
        message: "配置已创建",
        data: { id: result.insertId },
      });
    } catch (err) {
      // 处理唯一键冲突
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          code: 409,
          message: `配置键 "${config_key}" 已存在，请使用其他名称`,
        });
      }
      throw err;
    }
  }),
);

// GET /api/v1/system/config/categories/list（公开接口，必须放在 /:key 之前）
router.get(
  "/config/categories/list",
  asyncHandler(async (req, res) => {
    const [categories] = await query(
      "SELECT DISTINCT category FROM sys_config ORDER BY category",
    );

    res.json({
      code: 0,
      data: { categories: categories.map((c) => c.category) },
    });
  }),
);

// GET /api/v1/system/config/:key
router.get(
  "/config/:key",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const [configs] = await query(
      "SELECT config_key, config_value, category, description, is_public, updated_by, updated_at, created_at FROM sys_config WHERE config_key = ?",
      [req.params.key],
    );

    if (configs.length === 0) {
      return res.status(404).json({ code: 404, message: "配置不存在" });
    }

    res.json({ code: 0, data: configs[0] });
  }),
);

// PUT /api/v1/system/config/:key
router.put(
  "/config/:key",
  authMiddleware,
  adminMiddleware,
  [
    body("config_value").optional().notEmpty().withMessage("配置值不能为空"),
    body("description").optional({ nullable: true }).isString(),
    body("is_public")
      .optional()
      .custom((v) => [0, 1].includes(Number(v)))
      .withMessage("公开状态必须为 0 或 1"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array()[0].msg });
    }

    const { config_value, description, is_public } = req.body;

    // 安全白名单：只允许更新这些字段（防止 SQL 注入风险）
    const ALLOWED_FIELDS = ["config_value", "description", "is_public"];
    const updates = [];
    const values = [];

    if (config_value !== undefined && config_value !== null && String(config_value).trim() !== "") {
      updates.push("config_value = ?");
      values.push(config_value);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (is_public !== undefined) {
      updates.push("is_public = ?");
      values.push(is_public);
    }
    updates.push("updated_by = ?");
    values.push(req.user.userId);

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ code: 400, message: "没有需要更新的字段" });
    }

    values.push(req.params.key);

    // 安全说明：updates 中的字段名来自 ALLOWED_FLAGS 白名单，非用户输入
    const [result] = await query(
      `UPDATE sys_config SET ${updates.join(", ")} WHERE config_key = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: "配置不存在" });
    }

    res.json({ code: 0, message: "配置已更新" });
  }),
);

// DELETE /api/v1/system/config/:key
router.delete(
  "/config/:key",
  authMiddleware,
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const [result] = await query(
      "DELETE FROM sys_config WHERE config_key = ?",
      [req.params.key],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: "配置不存在" });
    }

    res.json({ code: 0, message: "配置已删除" });
  }),
);

module.exports = router;
