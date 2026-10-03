const express = require("express");
const { body, validationResult } = require("express-validator");
const { authMiddleware } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/error");
const { query } = require("../config/database");

const router = express.Router();

// POST /api/v1/reviews
router.post(
  "/",
  authMiddleware,
  [
    body("cycle")
      .isIn(["weekly", "monthly", "quarterly"])
      .withMessage("无效的复盘周期"),
    body("period_label").notEmpty().withMessage("请填写周期标签"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array()[0].msg });
    }

    const {
      cycle,
      period_label,
      revenue,
      traffic,
      customers,
      efficiency,
      next_goal,
      notes,
    } = req.body;

    const [result] = await query(
      "INSERT INTO user_reviews (user_id, cycle, period_label, revenue, traffic, customers, efficiency, next_goal, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.user.userId,
        cycle,
        period_label,
        revenue,
        traffic,
        customers,
        efficiency,
        next_goal,
        notes,
      ],
    );

    res.status(201).json({
      code: 0,
      message: "复盘记录已创建",
      data: { reviewId: result.insertId },
    });
  }),
);

// GET /api/v1/reviews
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { cycle, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let whereClause = "WHERE user_id = ?";
    const values = [req.user.userId];

    if (cycle) {
      whereClause += " AND cycle = ?";
      values.push(cycle);
    }

    const [reviews] = await query(
      `SELECT id, cycle, period_label, revenue, traffic, customers, efficiency, next_goal, notes, created_at, updated_at FROM user_reviews ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...values, parseInt(limit), offset],
    );

    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM user_reviews ${whereClause}`,
      values,
    );

    res.json({
      code: 0,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
        },
      },
    });
  }),
);

// GET /api/v1/reviews/:id
router.get(
  "/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const [reviews] = await query(
      "SELECT id, cycle, period_label, revenue, traffic, customers, efficiency, next_goal, notes, created_at, updated_at FROM user_reviews WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.userId],
    );

    if (reviews.length === 0) {
      return res.status(404).json({ code: 404, message: "复盘记录不存在" });
    }

    res.json({ code: 0, data: reviews[0] });
  }),
);

// PUT /api/v1/reviews/:id
router.put(
  "/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const ALLOWED_FIELDS = [
      "cycle",
      "period_label",
      "revenue",
      "traffic",
      "customers",
      "efficiency",
      "next_goal",
      "notes",
    ];
    const updates = [];
    const values = [];

    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ code: 400, message: "没有需要更新的字段" });
    }

    values.push(req.params.id, req.user.userId);

    const [result] = await query(
      `UPDATE user_reviews SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: "复盘记录不存在" });
    }

    res.json({ code: 0, message: "复盘记录已更新" });
  }),
);

// DELETE /api/v1/reviews/:id
router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const [result] = await query(
      "DELETE FROM user_reviews WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: "复盘记录不存在" });
    }

    res.json({ code: 0, message: "复盘记录已删除" });
  }),
);

module.exports = router;
