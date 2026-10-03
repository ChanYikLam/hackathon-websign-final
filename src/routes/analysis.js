const express = require("express");
const { body, validationResult } = require("express-validator");
const { authMiddleware } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/error");
const { query, transaction } = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const { analyzeEntrepreneurProfile } = require("../utils/aiService");
const { generateMockResult } = require("../utils/mockAnalysis");

const router = express.Router();

// POST /api/v1/analysis/trigger
router.post(
  "/trigger",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const [users] = await query(
      "SELECT is_info_completed, is_mbti_completed FROM users WHERE id = ?",
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({ code: 404, message: "用户不存在" });
    }

    const user = users[0];
    if (!user.is_info_completed) {
      return res.status(400).json({ code: 2001, message: "请先完成信息采集" });
    }

    if (!user.is_mbti_completed) {
      return res
        .status(400)
        .json({ code: 2002, message: "请先完成 MBTI 测评" });
    }

    const taskId = uuidv4();

    await query(
      "INSERT INTO analysis_tasks (task_id, user_id, status, progress, started_at) VALUES (?, ?, ?, ?, NOW())",
      [taskId, userId, "queued", 0],
    );

    // Trigger async AI analysis
    (async () => {
      try {
        // 查询用户 profile 数据供 AI 分析使用
        const [profileRows] = await query(
          "SELECT up.city, up.skill, up.mbti_type, up.intensity, up.schedule AS work_schedule FROM user_profiles up WHERE up.user_id = ?",
          [userId],
        );
        const profile = profileRows.length > 0 ? profileRows[0] : {};

        await query(
          "UPDATE analysis_tasks SET status = ?, progress = ? WHERE task_id = ?",
          ["processing", 50, taskId],
        );

        // Use real AI analysis with mock fallback
        let result;
        try {
          result = await analyzeEntrepreneurProfile(profile);
          // 校验 AI 返回的 JSON 结构是否完整
          if (!result || !result.profile || !result.profile.tags || !result.directions || !result.summary) {
            console.warn("AI response structure incomplete, using mock fallback. Missing keys:", 
              !result?.profile ? 'profile' : '', 
              !result?.profile?.tags ? 'profile.tags' : '',
              !result?.directions ? 'directions' : '',
              !result?.summary ? 'summary' : ''
            );
            result = generateMockResult(profile);
          }
        } catch (aiError) {
          console.warn(
            "AI analysis failed, using mock data fallback:",
            aiError.message,
          );
          // Always use mock fallback - never let this fail the task
          result = generateMockResult(profile);
        }

        // If result is still missing, use mock as final safety net
        if (!result) {
          console.warn("No analysis result, using mock as final fallback");
          result = generateMockResult(profile);
        }

        await transaction(async (conn) => {
          await conn.query(
            "UPDATE analysis_tasks SET status = ?, progress = ?, completed_at = NOW() WHERE task_id = ?",
            ["completed", 100, taskId],
          );

          const [existing] = await conn.query(
            "SELECT id FROM analysis_results WHERE user_id = ?",
            [userId],
          );

          if (existing.length > 0) {
            await conn.query(
              `UPDATE analysis_results SET
                task_id = ?, profile_tags = ?, profile_desc = ?,
                directions = ?, user_type = ?, user_type_label = ?,
                user_type_desc = ?, user_type_strategy = ?,
                summary_profile = ?, summary_directions = ?, summary_strategy = ?,
                summary_city_advice = ?, summary_checklist = ?, summary_timeline = ?,
                generated_at = NOW()
              WHERE user_id = ?`,
              [
                taskId,
                JSON.stringify(result.profile.tags),
                result.profile.desc,
                JSON.stringify(result.directions),
                result.user_type,
                result.user_type_label,
                result.user_type_desc,
                result.user_type_strategy,
                result.summary.profile,
                result.summary.directions,
                result.summary.strategy,
                result.summary.city_advice,
                JSON.stringify(result.summary.checklist),
                result.summary.timeline,
                userId,
              ],
            );
          } else {
            await conn.query(
              `INSERT INTO analysis_results (user_id, task_id, profile_tags, profile_desc, directions, user_type, user_type_label, user_type_desc, user_type_strategy, summary_profile, summary_directions, summary_strategy, summary_city_advice, summary_checklist, summary_timeline)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                userId,
                taskId,
                JSON.stringify(result.profile.tags),
                result.profile.desc,
                JSON.stringify(result.directions),
                result.user_type,
                result.user_type_label,
                result.user_type_desc,
                result.user_type_strategy,
                result.summary.profile,
                result.summary.directions,
                result.summary.strategy,
                result.summary.city_advice,
                JSON.stringify(result.summary.checklist),
                result.summary.timeline,
              ],
            );
          }

          await conn.query(
            "UPDATE users SET is_analysis_done = 1 WHERE id = ?",
            [userId],
          );
        });
      } catch (error) {
        await query(
          "UPDATE analysis_tasks SET status = ?, error_detail = ? WHERE task_id = ?",
          ["failed", error.message, taskId],
        );
      }
    })();

    res.json({
      code: 0,
      message: "分析任务已创建",
      data: { task_id: taskId, estimatedTime: 60, status: "queued" },
    });
  }),
);

// GET /api/v1/analysis/status/:taskId
router.get(
  "/status/:taskId",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const [tasks] = await query(
      "SELECT task_id, status, progress, error_detail, estimated_time, started_at, completed_at FROM analysis_tasks WHERE task_id = ? AND user_id = ?",
      [taskId, req.user.userId],
    );

    if (tasks.length === 0) {
      return res.status(404).json({ code: 404, message: "任务不存在" });
    }

    const t = tasks[0];
    res.json({
      code: 0,
      data: {
        task_id: t.task_id,
        status: t.status,
        progress: t.progress || 100,
      },
    });
  }),
);

// GET /api/v1/analysis/status?task_id=xxx（前端使用的 query 参数格式）
router.get(
  "/status",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const taskId = req.query.task_id || req.query.taskId;

    if (!taskId) {
      // 没有传 taskId 时，查询用户最新的任务
      const [tasks] = await query(
        "SELECT task_id, status, progress, error_detail, started_at, completed_at FROM analysis_tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [req.user.userId],
      );

      if (tasks.length === 0) {
        return res.status(404).json({ code: 404, message: "任务不存在" });
      }

      const t = tasks[0];
      return res.json({
        code: 0,
        data: {
          task_id: t.task_id,
          status: t.status,
          progress: t.progress || 100,
        },
      });
    }

    const [tasks] = await query(
      "SELECT task_id, status, progress, error_detail, estimated_time, started_at, completed_at FROM analysis_tasks WHERE task_id = ? AND user_id = ?",
      [taskId, req.user.userId],
    );

    if (tasks.length === 0) {
      return res.status(404).json({ code: 404, message: "任务不存在" });
    }

    const t = tasks[0];
    res.json({
      code: 0,
      data: {
        task_id: t.task_id,
        status: t.status,
        progress: t.progress || 100,
      },
    });
  }),
);

// GET /api/v1/analysis/result
router.get(
  "/result",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const [results] = await query(
      "SELECT profile_tags, profile_desc, directions, user_type, user_type_label, user_type_desc, user_type_strategy, summary_profile, summary_directions, summary_strategy, summary_city_advice, summary_checklist, summary_timeline, generated_at FROM analysis_results WHERE user_id = ?",
      [req.user.userId],
    );

    if (results.length === 0) {
      return res.status(404).json({ code: 404, message: "未找到分析结果" });
    }

    const result = results[0];
    result.profile_tags =
      typeof result.profile_tags === "string"
        ? JSON.parse(result.profile_tags)
        : result.profile_tags;
    result.directions =
      typeof result.directions === "string"
        ? JSON.parse(result.directions)
        : result.directions;
    result.summary_checklist =
      typeof result.summary_checklist === "string"
        ? JSON.parse(result.summary_checklist)
        : result.summary_checklist;

    res.json({ code: 0, data: result });
  }),
);

module.exports = router;
