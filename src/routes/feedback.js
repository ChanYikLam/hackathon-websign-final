const express = require("express");
const { body, validationResult } = require("express-validator");
const { authMiddleware } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/error");
const { query } = require("../config/database");

const router = express.Router();

// POST /api/v1/feedback
router.post(
  "/",
  authMiddleware,
  [body("rating").isInt({ min: 1, max: 5 }).withMessage("评分必须为 1-5 之间的整数")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array()[0].msg });
    }

    const { rating, comment, direction_preference } = req.body;
    const userId = req.user.userId;

    const [count] = await query(
      "SELECT COUNT(*) as feedback_count FROM user_feedback WHERE user_id = ?",
      [userId],
    );

    if (count[0].feedback_count >= 5) {
      return res
        .status(400)
        .json({ code: 400, message: "最多只能提交 5 条反馈" });
    }

    const [result] = await query(
      "INSERT INTO user_feedback (user_id, rating, comment, direction_preference) VALUES (?, ?, ?, ?)",
      [userId, rating, comment || null, direction_preference || null],
    );

    res.status(201).json({
      code: 0,
      message: "反馈已提交",
      data: { feedbackId: result.insertId },
    });
  }),
);

// GET /api/v1/feedback
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const [feedbacks] = await query(
      "SELECT id, rating, comment, direction_preference, created_at FROM user_feedback WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.userId],
    );

    res.json({ code: 0, data: { feedbacks } });
  }),
);

module.exports = router;
