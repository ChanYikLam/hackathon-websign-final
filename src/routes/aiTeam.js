const express = require("express");
const { body, validationResult } = require("express-validator");
const { authMiddleware } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/error");
const { query, transaction } = require("../config/database");

const router = express.Router();

// GET /api/v1/ai-team/questions（前端需要获取题目列表）
router.get(
  "/questions",
  authMiddleware,
  asyncHandler(async (req, res) => {
    try {
      const [questions] = await query(
        "SELECT id, question, option_a, option_b, tag_a, tag_b FROM ai_team_questions ORDER BY id"
      );
      res.json({
        code: 0,
        data: { total: questions.length || 10, questions },
      });
    } catch (err) {
      // 表不存在时返回空
      res.json({ code: 0, data: { total: 10, questions: [] } });
    }
  }),
);

// POST /api/v1/ai-team/submit（前端使用的路径）
router.post(
  "/submit",
  authMiddleware,
  [body("answers").isObject().withMessage("答案必须为对象格式")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: errors.array()[0].msg });
    }

    const { answers } = req.body;
    const userId = req.user.userId;

    // 保存答案到数据库
    for (const [questionNum, answer] of Object.entries(answers)) {
      await query(
        "INSERT INTO ai_team_answers (user_id, question_num, answer) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE answer = ?, updated_at = NOW()",
        [userId, Number(questionNum), answer, answer]
      );
    }

    res.json({ code: 0, message: "测评已完成", data: null });
  }),
);

// POST /api/v1/ai-team/assess（原有路径，保留兼容）
router.post(
  "/assess",
  authMiddleware,
  [body("answers").isObject().withMessage("答案必须为对象格式")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: errors.array()[0].msg });
    }

    const { answers } = req.body;
    const userId = req.user.userId;

    const answerCount = Object.keys(answers).length;
    if (answerCount !== 10) {
      return res
        .status(400)
        .json({ code: 400, message: "请回答全部 10 道题目" });
    }

    let aCount = 0,
      cFlag = false,
      dFlag = false;

    for (const [qNum, option] of Object.entries(answers)) {
      if (option === "A") aCount++;
      if (qNum === "8" && option === "A" && answers["5"] === "A") cFlag = true;
      if (qNum === "8" && option === "C" && answers["3"] === "C") dFlag = true;
    }

    let planType, planName, planDesc;

    if (cFlag) {
      planType = "C";
      planName = "Tech Entrepreneur";
      planDesc = "Technical founder with product focus";
    } else if (dFlag) {
      planType = "D";
      planName = "Operations Specialist";
      planDesc = "Efficiency-driven operator";
    } else if (aCount >= 6) {
      planType = "A";
      planName = "Content Creator";
      planDesc = "Creative content producer";
    } else if (aCount >= 4) {
      planType = "B";
      planName = "Marketing Expert";
      planDesc = "Growth and marketing focused";
    } else {
      planType = "F";
      planName = "Explorer";
      planDesc = "Multi-domain explorer";
    }

    const roleMap = {
      A: ["Copywriter", "Video Creator", "Designer"],
      B: ["Social Media Manager", "SEO Specialist", "Growth Hacker"],
      C: ["Full-stack Developer", "Product Manager", "DevOps Engineer"],
      D: ["Operations Manager", "Customer Success", "Project Coordinator"],
      E: ["Consultant", "Trainer", "Advisor"],
      F: ["Researcher", "Analyst", "Strategist"],
    };

    const recommendedRoles = roleMap[planType] || [];

    await transaction(async (conn) => {
      const [existing] = await conn.query(
        "SELECT id FROM ai_team_answers WHERE user_id = ?",
        [userId],
      );

      if (existing.length > 0) {
        await conn.query(
          "UPDATE ai_team_answers SET answers = ?, plan_type = ?, plan_name = ?, plan_description = ?, updated_at = NOW() WHERE user_id = ?",
          [JSON.stringify(answers), planType, planName, planDesc, userId],
        );
      } else {
        await conn.query(
          "INSERT INTO ai_team_answers (user_id, answers, plan_type, plan_name, plan_description) VALUES (?, ?, ?, ?, ?)",
          [userId, JSON.stringify(answers), planType, planName, planDesc],
        );
      }

      await conn.query(
        "UPDATE user_profiles SET ai_team_plan_type = ?, ai_team_plan_name = ?, ai_team_roles = ?, ai_team_completed_at = NOW() WHERE user_id = ?",
        [planType, planName, JSON.stringify(recommendedRoles), userId],
      );
    });

    res.json({
      code: 0,
      message: "测评已完成",
      data: { planType, planName, planDesc, recommendedRoles },
    });
  }),
);

// GET /api/v1/ai-team/result
router.get(
  "/result",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const [results] = await query(
      "SELECT ai_team_plan_type AS plan_type, ai_team_plan_name AS plan_name, ai_team_roles, ai_team_completed_at FROM user_profiles WHERE user_id = ?",
      [req.user.userId],
    );

    if (results.length === 0 || !results[0].plan_type) {
      return res
        .status(404)
        .json({ code: 404, message: "未找到 AI 团队测评结果" });
    }

    const result = results[0];
    result.ai_team_roles =
      typeof result.ai_team_roles === "string"
        ? JSON.parse(result.ai_team_roles)
        : result.ai_team_roles;

    res.json({ code: 0, data: result });
  }),
);

// GET /api/v1/ai-team/roles/:planType
router.get(
  "/roles/:planType",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { planType } = req.params;
    const validTypes = ["A", "B", "C", "D", "E", "F"];

    if (!validTypes.includes(planType.toUpperCase())) {
      return res
        .status(400)
        .json({ code: 400, message: "无效的方案类型，必须为 A/B/C/D/E/F 之一" });
    }

    const roleDetails = {
      A: [
        {
          role: "Copywriter",
          can_do: ["Blog posts", "Social media content"],
          cannot_do: ["Video editing", "Graphic design"],
        },
        {
          role: "Video Creator",
          can_do: ["Video production", "Editing"],
          cannot_do: ["Writing", "Marketing strategy"],
        },
      ],
      B: [
        {
          role: "Social Media Manager",
          can_do: ["Content scheduling", "Community management"],
          cannot_do: ["Technical development", "Data analysis"],
        },
      ],
      C: [
        {
          role: "Full-stack Developer",
          can_do: ["Web development", "API design"],
          cannot_do: ["Marketing", "Sales"],
        },
        {
          role: "Product Manager",
          can_do: ["Product planning", "User research"],
          cannot_do: ["Coding", "Design"],
        },
      ],
      D: [
        {
          role: "Operations Manager",
          can_do: ["Process optimization", "Resource management"],
          cannot_do: ["Product development", "Marketing"],
        },
      ],
      E: [
        {
          role: "Consultant",
          can_do: ["Strategy consulting", "Advisory"],
          cannot_do: ["Implementation", "Operations"],
        },
      ],
      F: [
        {
          role: "Researcher",
          can_do: ["Market research", "Data analysis"],
          cannot_do: ["Implementation", "Sales"],
        },
      ],
    };

    res.json({
      code: 0,
      data: {
        planType: planType.toUpperCase(),
        roles: roleDetails[planType.toUpperCase()] || [],
      },
    });
  }),
);

module.exports = router;
