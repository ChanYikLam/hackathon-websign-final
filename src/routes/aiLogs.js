const express = require("express");
const { body, validationResult } = require("express-validator");
const { authMiddleware } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/error");
const { query } = require("../config/database");

const router = express.Router();

// POST /api/v1/ai-logs/logs
router.post(
  "/logs",
  authMiddleware,
  [
    body("log_type").isInt({ min: 1, max: 4 }).withMessage("无效的日志类型"),
    body("model_name")
      .optional()
      .isString()
      .withMessage("模型名称必须为字符串"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array()[0].msg });
    }

    const {
      log_type,
      model_name,
      api_endpoint,
      request_body,
      response_code,
      token_used,
      duration_ms,
      error_message,
    } = req.body;

    const [result] = await query(
      "INSERT INTO ai_logs (user_id, log_type, model_name, api_endpoint, request_body, response_code, token_used, duration_ms, error_message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.user.userId,
        log_type,
        model_name,
        api_endpoint,
        request_body ? JSON.stringify(request_body) : null,
        response_code,
        token_used || 0,
        duration_ms,
        error_message,
      ],
    );

    res.status(201).json({
      code: 0,
      message: "日志已记录",
      data: { logId: result.insertId },
    });
  }),
);

// GET /api/v1/ai-logs/logs/statistics (必须放在 :id 之前)
router.get(
  "/logs/statistics",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { start_date, end_date } = req.query;
    let dateCondition = "";
    const values = [req.user.userId];

    if (start_date) {
      dateCondition += " AND created_at >= ?";
      values.push(start_date);
    }

    if (end_date) {
      dateCondition += " AND created_at <= ?";
      values.push(end_date);
    }

    const [stats] = await query(
      `SELECT 
      COUNT(*) as total_requests,
      SUM(CASE WHEN log_type = 1 THEN 1 ELSE 0 END) as normal_calls,
      SUM(CASE WHEN log_type = 2 THEN 1 ELSE 0 END) as errors,
      SUM(CASE WHEN log_type = 3 THEN 1 ELSE 0 END) as rate_limited,
      SUM(CASE WHEN log_type = 4 THEN 1 ELSE 0 END) as timeouts,
      SUM(token_used) as total_tokens,
      AVG(duration_ms) as avg_duration_ms,
      COUNT(DISTINCT model_name) as models_used
     FROM ai_logs 
     WHERE user_id = ? ${dateCondition}`,
      values,
    );

    const [modelStats] = await query(
      `SELECT 
      model_name,
      COUNT(*) as call_count,
      SUM(token_used) as total_tokens,
      AVG(duration_ms) as avg_duration
     FROM ai_logs 
     WHERE user_id = ? ${dateCondition} AND model_name IS NOT NULL
     GROUP BY model_name
     ORDER BY call_count DESC`,
      values,
    );

    const [errorStats] = await query(
      `SELECT 
      error_message,
      COUNT(*) as occurrence_count,
      MAX(created_at) as last_occurred
     FROM ai_logs 
     WHERE user_id = ? ${dateCondition} AND log_type = 2
     GROUP BY error_message
     ORDER BY occurrence_count DESC
     LIMIT 10`,
      values,
    );

    res.json({
      code: 0,
      data: {
        overview: stats[0],
        model_usage: modelStats,
        top_errors: errorStats,
      },
    });
  }),
);

// GET /api/v1/ai-logs/logs/daily-usage (必须放在 :id 之前)
router.get(
  "/logs/daily-usage",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { days = 7 } = req.query;

    const [dailyUsage] = await query(
      `SELECT 
      DATE(created_at) as date,
      COUNT(*) as request_count,
      SUM(token_used) as total_tokens,
      AVG(duration_ms) as avg_duration
     FROM ai_logs 
     WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY DATE(created_at)
     ORDER BY date DESC`,
      [req.user.userId, parseInt(days)],
    );

    res.json({
      code: 0,
      data: { daily_usage: dailyUsage },
    });
  }),
);

// GET /api/v1/ai-logs/logs/:id (参数路由必须放在最后)
router.get(
  "/logs/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const [logs] = await query(
      "SELECT * FROM ai_logs WHERE id = ? AND user_id = ?",
      [id, req.user.userId],
    );

    if (logs.length === 0) {
      return res.status(404).json({
        code: 404,
        message: "日志不存在",
      });
    }

    if (logs[0].request_body) {
      try {
        logs[0].request_body = JSON.parse(logs[0].request_body);
      } catch {
        // Keep original if not valid JSON
      }
    }

    res.json({
      code: 0,
      data: logs[0],
    });
  }),
);

// GET /api/v1/ai-logs/logs
router.get(
  "/logs",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, log_type, model_name } = req.query;
    const safeLimit = Math.min(parseInt(limit) || 10, 100);
    const offset = (parseInt(page) - 1) * safeLimit;

    let whereClause = "WHERE user_id = ?";
    const values = [req.user.userId];

    if (log_type) {
      whereClause += " AND log_type = ?";
      values.push(parseInt(log_type));
    }

    if (model_name) {
      whereClause += " AND model_name = ?";
      values.push(model_name);
    }

    const [logs] = await query(
      `SELECT id, log_type, model_name, api_endpoint, response_code, token_used, duration_ms, created_at FROM ai_logs ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...values, safeLimit, offset],
    );

    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM ai_logs ${whereClause}`,
      values,
    );

    res.json({
      code: 0,
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: safeLimit,
          total: countResult[0].total,
        },
      },
    });
  }),
);

module.exports = router;
