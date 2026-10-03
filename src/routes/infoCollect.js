const express = require("express");
const { body, validationResult } = require("express-validator");
const { authMiddleware } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/error");
const { query, transaction } = require("../config/database");

const router = express.Router();

const STEP_FIELDS = {
  1: "city",
  2: "gender",
  3: "intensity",
  4: "skill",
  5: "direction",
  6: "purpose",
  7: "schedule",
};

// 可选跳过的步骤（第2步：性别）
const SKIPPABLE_STEPS = [2];

// 保存单步的统一处理函数（POST 和 PUT 共享）
function handleSaveStep(req, res) {
  const { step, value, skill_other } = req.body;
  const field = STEP_FIELDS[step];
  const userId = req.user.userId;

  // 将空值转换为 NULL 以便数据库正确存储
  const normalizedValue =
    value === undefined || value === null || String(value).trim() === ""
      ? null
      : String(value).trim();

  return query(
    "INSERT INTO info_collect_answers (user_id, step, field, value) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()",
    [userId, step, field, normalizedValue],
  )
    .then(() => {
      if (skill_other !== undefined) {
        return query(
          "UPDATE user_profiles SET skill_other = ? WHERE user_id = ?",
          [skill_other, userId],
        );
      }
    })
    .then(() => {
      const nextStep = step < 7 ? step + 1 : null;

      return {
        code: 0,
        message: `第 ${step} 步已保存`,
        data: {
          step,
          saved: true,
          next_step: nextStep,
          is_last_step: step >= 7,
        },
      };
    });
}

// POST /api/v1/info-collect/step（原有）
router.post(
  "/step",
  authMiddleware,
  [
    body("step")
      .isInt({ min: 1, max: 7 })
      .withMessage("步骤必须为 1-7 之间的整数"),
    body("value").custom((value, { req }) => {
      if (SKIPPABLE_STEPS.includes(req.body.step)) return true;
      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      ) {
        throw new Error("此步骤需要填写内容");
      }
      return true;
    }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array()[0].msg });
    }
    const result = await handleSaveStep(req, res);
    res.json(result);
  }),
);

// PUT /api/v1/info-collect/step（前端使用的 HTTP 方法）
router.put(
  "/step",
  authMiddleware,
  [
    body("step")
      .isInt({ min: 1, max: 7 })
      .withMessage("步骤必须为 1-7 之间的整数"),
    body("value").custom((value, { req }) => {
      if (SKIPPABLE_STEPS.includes(req.body.step)) return true;
      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      ) {
        throw new Error("此步骤需要填写内容");
      }
      return true;
    }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array()[0].msg });
    }
    const result = await handleSaveStep(req, res);
    res.json(result);
  }),
);

// GET /api/v1/info-collect/progress
router.get(
  "/progress",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const [answers] = await query(
      "SELECT step, field, value FROM info_collect_answers WHERE user_id = ? ORDER BY step",
      [userId],
    );

    const progress = {};
    for (let i = 1; i <= 7; i++) {
      progress[i] = false;
    }
    answers.forEach((a) => {
      progress[a.step] = true;
    });

    const completedCount = answers.length;
    const isComplete = completedCount === 7;

    await query("UPDATE users SET is_info_completed = ? WHERE id = ?", [
      isComplete ? 1 : 0,
      userId,
    ]);

    res.json({
      code: 0,
      data: {
        isComplete,
        completedSteps: completedCount,
        totalSteps: 7,
        answers: answers.map((a) => ({
          step: a.step,
          field: a.field,
          value: a.value,
        })),
      },
    });
  }),
);

// POST /api/v1/info-collect/complete
router.post(
  "/complete",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const [answers] = await query(
      "SELECT step, field, value FROM info_collect_answers WHERE user_id = ? ORDER BY step",
      [userId],
    );

    if (answers.length < 7) {
      return res.status(400).json({
        code: 2001,
        message: "请完成所有步骤后再提交",
      });
    }

    const profileData = {};
    answers.forEach((a) => {
      // 将空字符串转换为 null，以便数据库中存储为 NULL
      profileData[a.field] = a.value === "" ? null : a.value;
    });

    await transaction(async (conn) => {
      const [existing] = await conn.query(
        "SELECT id FROM user_profiles WHERE user_id = ?",
        [userId],
      );

      // 白名单：只允许已知的合法字段名拼入 SQL，防止 SQL 注入
      const ALLOWED_PROFILE_FIELDS = [
        "city",
        "gender",
        "intensity",
        "skill",
        "direction",
        "purpose",
        "schedule",
      ];
      const safeProfileData = {};
      for (const [k, v] of Object.entries(profileData)) {
        if (ALLOWED_PROFILE_FIELDS.includes(k)) {
          safeProfileData[k] = v;
        }
      }

      if (existing.length > 0) {
        const setClauses = Object.keys(safeProfileData)
          .map((k) => `${k} = ?`)
          .join(", ");
        const values = [...Object.values(safeProfileData), userId];
        await conn.query(
          `UPDATE user_profiles SET ${setClauses} WHERE user_id = ?`,
          values,
        );
      } else {
        const fields = ["user_id", ...Object.keys(safeProfileData)];
        const placeholders = [
          "?",
          ...Object.keys(safeProfileData).map(() => "?"),
        ].join(", ");
        const values = [userId, ...Object.values(safeProfileData)];
        await conn.query(
          `INSERT INTO user_profiles (${fields.join(", ")}) VALUES (${placeholders})`,
          values,
        );
      }

      await conn.query("UPDATE users SET is_info_completed = 1 WHERE id = ?", [
        userId,
      ]);
    });

    res.json({ code: 0, message: "信息采集已完成" });
  }),
);

// GET /api/v1/info-collect
// 保留向后兼容：重定向到 /progress（两者功能重复，/progress 提供更完整的数据）
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    // 直接复用 /progress 的逻辑，避免代码重复
    const userId = req.user.userId;

    const [answers] = await query(
      "SELECT step, field, value FROM info_collect_answers WHERE user_id = ? ORDER BY step",
      [userId],
    );

    const progress = {};
    for (let i = 1; i <= 7; i++) {
      progress[i] = false;
    }
    answers.forEach((a) => {
      progress[a.step] = true;
    });

    const completedCount = answers.length;
    const isComplete = completedCount === 7;

    res.json({
      code: 0,
      data: {
        answers,
        isComplete,
        completedSteps: completedCount,
        totalSteps: 7,
      },
    });
  }),
);

module.exports = router;
