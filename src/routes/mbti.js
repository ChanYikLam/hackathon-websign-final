const express = require("express");
const { body, validationResult } = require("express-validator");
const { authMiddleware } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/error");
const { query, transaction } = require("../config/database");

const router = express.Router();

// ============================================
// 新增接口：对齐前端 api.ts 的调用
// ============================================

// GET /api/v1/mbti/questions（前端需要获取题目列表）
router.get(
  "/questions",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { part } = req.query;

    // 从数据库获取题目（如果有的话），否则返回空数组让前端用内置数据
    let whereSql = "";
    const params = [];
    if (part === "1" || part === "2") {
      whereSql = " WHERE part = ?";
      params.push(Number(part));
    }

    // 查询数据库中的题目（如果有 mbti_questions 表）
    try {
      const [questions] = await query(
        `SELECT id, part, question, option_a as optionA, option_b as optionB, dimension FROM mbti_questions${whereSql} ORDER BY id`,
        params
      );

      res.json({
        code: 0,
        data: {
          total: questions.length,
          part1_count: 26,
          part2_count: 67,
          questions: questions.map(q => ({
            id: q.id,
            part: q.part,
            question: q.question,
            option_a: q.optionA,
            option_b: q.optionB,
            dimension: q.dimension,
          })),
        },
      });
    } catch (err) {
      // 表不存在时返回空，前端会用内置的 MBTI_QUESTIONS 数据
      res.json({
        code: 0,
        data: { total: 93, part1_count: 26, part2_count: 67, questions: [] },
      });
    }
  }),
);

// GET /api/v1/mbti/progress（前端需要获取答题进度）
router.get(
  "/progress",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    try {
      const [answers] = await query(
        "SELECT question_id, answer FROM mbti_answers WHERE user_id = ?",
        [userId]
      );
      const answersMap = {};
      answers.forEach(a => { answersMap[a.question_id] = a.answer; });

      res.json({
        code: 0,
        data: {
          total: 93,
          answered_count: answers.length,
          current_question: answers.length > 0 ? Math.max(...answers.map(a => a.question_id)) + 1 : 1,
          is_completed: answers.length >= 93,
          answers: answersMap,
        },
      });
    } catch (err) {
      res.json({ code: 0, data: { total: 93, answered_count: 0, current_question: 1, is_completed: false, answers: {} } });
    }
  }),
);

// PUT /api/v1/mbti/answer（前端逐题保存答案）
router.put(
  "/answer",
  authMiddleware,
  [
    body("question_id").isInt({ min: 1, max: 93 }).withMessage("题目编号无效"),
    body("answer").isIn(["A", "B"]).withMessage("答案必须为 A 或 B"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: errors.array()[0].msg });
    }

    const { question_id, answer } = req.body;
    const userId = req.user.userId;

    await query(
      "INSERT INTO mbti_answers (user_id, question_id, answer) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE answer = ?, updated_at = NOW()",
      [userId, question_id, answer, answer]
    );

    const [countResult] = await query(
      "SELECT COUNT(*) as count FROM mbti_answers WHERE user_id = ?",
      [userId]
    );
    const answeredCount = countResult[0].count;

    res.json({
      code: 0,
      data: {
        question_id,
        saved: true,
        answered_count: answeredCount,
        remaining: 93 - answeredCount,
      },
    });
  }),
);

// POST /api/v1/mbti/submit（原有）
router.post(
  "/submit",
  authMiddleware,
  [body("answers").isArray().withMessage("答案必须为数组格式")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array()[0].msg });
    }

    const { answers } = req.body;
    const userId = req.user.userId;

    if (answers.length !== 93) {
      return res
        .status(400)
        .json({ code: 400, message: "请回答全部 93 道题目" });
    }

    const scores = {};
    const dimensions = [
      { key: "EI", questions: [] },
      { key: "SN", questions: [] },
      { key: "TF", questions: [] },
      { key: "JP", questions: [] },
    ];

    for (let i = 1; i <= 26; i++) {
      const dimIndex = (i - 1) % 4;
      dimensions[dimIndex].questions.push(i);
    }
    for (let i = 27; i <= 93; i++) {
      const dimIndex = (i - 1) % 4;
      dimensions[dimIndex].questions.push(i);
    }

    // 维度映射：每对维度的 A 选项对应左字母，B 选项对应右字母
    // e.g. EI 维度：A→E, B→I；SN 维度：A→S, B→N
    const DIM_MAP = {
      EI: { A: "E", B: "I" },
      SN: { A: "S", B: "N" },
      TF: { A: "T", B: "F" },
      JP: { A: "J", B: "P" },
    };

    dimensions.forEach((dim) => {
      const dimKey = dim.key;
      dim.questions.forEach((qNum) => {
        const answer = answers[qNum - 1];
        if (answer) {
          const selectedOption = answer.option_key;
          const mappedLetter = DIM_MAP[dimKey][selectedOption];
          if (mappedLetter) {
            scores[mappedLetter] = (scores[mappedLetter] || 0) + 1;
          }
        }
      });
    });

    let mbtiType = "";
    mbtiType += (scores.E || 0) >= (scores.I || 0) ? "E" : "I";
    mbtiType += (scores.S || 0) >= (scores.N || 0) ? "S" : "N";
    mbtiType += (scores.T || 0) >= (scores.F || 0) ? "T" : "F";
    mbtiType += (scores.J || 0) >= (scores.P || 0) ? "J" : "P";

    await transaction(async (conn) => {
      const [existing] = await conn.query(
        "SELECT id FROM user_profiles WHERE user_id = ?",
        [userId],
      );

      if (existing.length > 0) {
        await conn.query(
          "UPDATE user_profiles SET mbti_type = ?, mbti_scores = ?, mbti_completed_at = NOW(), version = version + 1 WHERE user_id = ?",
          [mbtiType, JSON.stringify(scores), userId],
        );
      } else {
        await conn.query(
          "INSERT INTO user_profiles (user_id, mbti_type, mbti_scores, mbti_completed_at) VALUES (?, ?, ?, NOW())",
          [userId, mbtiType, JSON.stringify(scores)],
        );
      }

      await conn.query("UPDATE users SET is_mbti_completed = 1 WHERE id = ?", [
        userId,
      ]);
    });

    res.json({
      code: 0,
      message: "MBTI 测评已提交",
      data: { mbtiType, scores },
    });
  }),
);

// POST /api/v1/mbti/progress
router.post(
  "/progress",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { answeredCount, totalQuestions } = req.body;
    res.json({
      code: 0,
      message: "进度已保存",
      data: { answeredCount, totalQuestions },
    });
  }),
);

// GET /api/v1/mbti/result
router.get(
  "/result",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const [profiles] = await query(
      "SELECT mbti_type, mbti_scores, mbti_description, mbti_strengths, mbti_blind_spots, mbti_suitable_dirs, mbti_completed_at FROM user_profiles WHERE user_id = ?",
      [req.user.userId],
    );

    if (profiles.length === 0 || !profiles[0].mbti_type) {
      return res
        .status(404)
        .json({ code: 404, message: "未找到 MBTI 测评结果" });
    }

    const result = profiles[0];
    result.mbti_scores =
      typeof result.mbti_scores === "string"
        ? JSON.parse(result.mbti_scores)
        : result.mbti_scores;
    result.mbti_strengths =
      typeof result.mbti_strengths === "string"
        ? JSON.parse(result.mbti_strengths)
        : result.mbti_strengths;
    result.mbti_blind_spots =
      typeof result.mbti_blind_spots === "string"
        ? JSON.parse(result.mbti_blind_spots)
        : result.mbti_blind_spots;
    result.mbti_suitable_dirs =
      typeof result.mbti_suitable_dirs === "string"
        ? JSON.parse(result.mbti_suitable_dirs)
        : result.mbti_suitable_dirs;

    res.json({ code: 0, data: result });
  }),
);

// POST /api/v1/mbti/reset
router.post(
  "/reset",
  authMiddleware,
  asyncHandler(async (req, res) => {
    await query(
      "UPDATE user_profiles SET mbti_type = NULL, mbti_scores = NULL, mbti_description = NULL, mbti_strengths = NULL, mbti_blind_spots = NULL, mbti_suitable_dirs = NULL, mbti_completed_at = NULL WHERE user_id = ?",
      [req.user.userId],
    );
    await query("UPDATE users SET is_mbti_completed = 0 WHERE id = ?", [
      req.user.userId,
    ]);

    res.json({ code: 0, message: "MBTI 结果已重置" });
  }),
);

// POST /api/v1/mbti/skip
router.post(
  "/skip",
  authMiddleware,
  [
    body("mbti_type")
      .isLength({ min: 4, max: 4 })
      .withMessage("MBTI 类型必须为 4 个字母"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array()[0].msg });
    }

    const { mbti_type } = req.body;
    const userId = req.user.userId;
    const upperMbti = mbti_type.toUpperCase().trim();

    const VALID_TYPES = [
      "ISTJ",
      "ISFJ",
      "INFJ",
      "INTJ",
      "ISTP",
      "ISFP",
      "INFP",
      "INTP",
      "ESTJ",
      "ESFJ",
      "ENFJ",
      "ENTJ",
      "ESTP",
      "ESFP",
      "ENFP",
      "ENTP",
    ];

    if (!VALID_TYPES.includes(upperMbti)) {
      return res.status(400).json({ code: 400, message: "无效的 MBTI 类型" });
    }

    await transaction(async (conn) => {
      const [existing] = await conn.query(
        "SELECT id FROM user_profiles WHERE user_id = ?",
        [userId],
      );

      if (existing.length > 0) {
        await conn.query(
          "UPDATE user_profiles SET mbti_type = ?, mbti_scores = ?, mbti_completed_at = NOW(), version = version + 1 WHERE user_id = ?",
          [
            upperMbti,
            JSON.stringify({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }),
            userId,
          ],
        );
      } else {
        await conn.query(
          "INSERT INTO user_profiles (user_id, mbti_type, mbti_scores, mbti_completed_at) VALUES (?, ?, ?, NOW())",
          [
            userId,
            upperMbti,
            JSON.stringify({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }),
          ],
        );
      }

      await conn.query("UPDATE users SET is_mbti_completed = 1 WHERE id = ?", [
        userId,
      ]);
    });

    res.json({
      code: 0,
      message: "MBTI 类型已设置成功",
      data: { mbti_type: upperMbti },
    });
  }),
);

module.exports = router;
