const express = require("express");
const { body, validationResult } = require("express-validator");
const axios = require("axios");
const { authMiddleware } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/error");
const { query } = require("../config/database");
const aiConfig = require("../config/ai");

const router = express.Router();

// ===================== 工具函数 =====================

/**
 * 调用 DeepSeek API 进行通用对话（非流式）
 */
async function callAI(messages, options = {}) {
  const startTime = Date.now();
  
  const response = await axios.post(
    `${aiConfig.baseUrl}/chat/completions`,
    {
      model: aiConfig.model,
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2048,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiConfig.apiKey}`,
      },
      timeout: aiConfig.timeout || 60000,
    },
  );

  const durationMs = Date.now() - startTime;
  const content = response.data.choices[0].message.content.trim();
  const usage = response.data.usage || {};

  return {
    content,
    durationMs,
    tokenInput: usage.prompt_tokens || 0,
    tokenOutput: usage.completion_tokens || 0,
  };
}

// 构建系统提示词（创业导师角色）
function getSystemPrompt() {
  return [
    {
      role: "system",
      content: `你是 SoloPilot 的 AI 助手，一位经验丰富的创业导师和商业顾问。
你的专长领域包括：
- 一人公司/个体户的创业策略
- 知识付费、内容创作、独立开发等方向
- 合规经营、税务基础建议
- 时间管理和效率优化

回答要求：
1. 使用中文回复
2. 回答简洁实用，不超过 300 字（除非用户明确需要详细分析）
3. 给出可操作的建议，不要空话套话
4. 如果涉及法律或税务问题，提醒用户咨询专业人士
5. 保持友好但专业的语气`,
    },
  ];
}

// ===================== API 接口 =====================

// POST /api/v1/chat/send — 发送消息并获取 AI 回复
router.post(
  "/send",
  authMiddleware,
  [body("message").trim().notEmpty().withMessage("消息内容不能为空").isLength({ max: 2000 }).withMessage("消息不能超过 2000 字")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: errors.array()[0].msg });
    }

    const userId = req.user.userId;
    const userMessage = req.body.message;
    const sessionId = req.body.session_id || generateSessionId();

    // 1. 保存用户消息到数据库
    await query(
      "INSERT INTO ai_chat_records (user_id, session_id, role, content) VALUES (?, ?, 1, ?)",
      [userId, sessionId, userMessage],
    );

    // 2. 获取历史对话（最近 10 条作为上下文）
    const [history] = await query(
      "SELECT role, content FROM ai_chat_records WHERE user_id = ? AND session_id = ? ORDER BY created_at DESC LIMIT 10",
      [userId, sessionId],
    );
    
    // 反转回正序
    const reversedHistory = [...history].reverse();

    // 构建 AI 消息列表
    const messages = getSystemPrompt();
    for (const msg of reversedHistory) {
      messages.push({
        role: msg.role === 1 ? "user" : "assistant",
        content: msg.content,
      });
    }

    // 3. 调用 AI
    let aiReply;
    try {
      aiReply = await callAI(messages);
    } catch (err) {
      console.error("[Chat] AI call error:", err.message);
      
      // 保存错误记录
      await query(
        "INSERT INTO ai_chat_records (user_id, session_id, role, content) VALUES (?, ?, 2, ?)",
        [userId, sessionId, "抱歉，我暂时无法回答这个问题，请稍后重试。如果问题持续，请联系客服。"],
      );
      
      return res.status(502).json({
        code: 5002,
        message: "AI 服务暂时不可用",
        data: {
          reply: "抱歉，我暂时无法回答这个问题，请稍后重试。",
          session_id: sessionId,
        },
      });
    }

    // 4. 保存 AI 回复到数据库
    await query(
      "INSERT INTO ai_chat_records (user_id, session_id, role, content, model_name, token_input, token_output, response_ms) VALUES (?, ?, 2, ?, ?, ?, ?, ?)",
      [userId, sessionId, aiReply.content, aiConfig.model, aiReply.tokenInput, aiReply.tokenOutput, aiReply.durationMs],
    );

    res.json({
      code: 0,
      data: {
        reply: aiReply.content,
        session_id: sessionId,
        model: aiConfig.model,
        tokens_used: aiReply.tokenInput + aiReply.tokenOutput,
        duration_ms: aiReply.durationMs,
      },
    });
  }),
);

// GET /api/v1/chat/history — 查询对话历史
router.get(
  "/history",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, session_id } = req.query;
    const safeLimit = Math.min(parseInt(limit) || 20, 100);
    const offset = (parseInt(page) - 1) * safeLimit;

    let whereClause = "WHERE user_id = ?";
    const values = [req.user.userId];

    if (session_id) {
      whereClause += " AND session_id = ?";
      values.push(session_id);
    }

    const [records] = await query(
      `SELECT id, session_id, role, content, model_name, token_input, token_output, response_ms, created_at FROM ai_chat_records ${whereClause} ORDER BY created_at ASC LIMIT ? OFFSET ?`,
      [...values, safeLimit, offset],
    );

    const [countResult] = await query(
      `SELECT COUNT(*) as total FROM ai_chat_records ${whereClause}`,
      values,
    );

    // 获取所有会话 ID 列表
    const [sessions] = await query(
      "SELECT DISTINCT session_id, MIN(created_at) as first_msg_at, MAX(created_at) as last_msg_at FROM ai_chat_records WHERE user_id = ? GROUP BY session_id ORDER BY last_msg_at DESC",
      [req.user.userId],
    );

    res.json({
      code: 0,
      data: {
        records,
        sessions: sessions.map(s => ({
          session_id: s.session_id,
          first_msg_at: s.first_msg_at,
          last_msg_at: s.last_msg_at,
          preview: null, // 可选：预览第一条消息
        })),
        pagination: {
          page: parseInt(page),
          limit: safeLimit,
          total: countResult[0].total,
        },
      },
    });
  }),
);

// GET /api/v1/chat/sessions — 获取会话列表（用于侧边栏显示）
router.get(
  "/sessions",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const [sessions] = await query(
      `SELECT 
        session_id, 
        COUNT(*) as msg_count,
        MIN(created_at) as first_msg_at,
        MAX(created_at) as last_msg_at,
        (SELECT content FROM ai_chat_records r2 WHERE r2.user_id = ai_chat_records.user_id AND r2.session_id = ai_chat_records.session_id AND r2.role = 1 ORDER BY r2.created_at ASC LIMIT 1) as first_user_msg
       FROM ai_chat_records 
       WHERE user_id = ?
       GROUP BY session_id 
       ORDER BY last_msg_at DESC`,
      [req.user.userId],
    );

    res.json({ code: 0, data: { sessions } });
  }),
);

// DELETE /api/v1/chat/clear — 清空指定会话或全部历史
router.delete(
  "/clear",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { session_id } = req.query;

    if (session_id) {
      await query("DELETE FROM ai_chat_records WHERE user_id = ? AND session_id = ?", [req.user.userId, session_id]);
    } else {
      await query("DELETE FROM ai_chat_records WHERE user_id = ?", [req.user.userId]);
    }

    res.json({ code: 0, message: session_id ? "会话已清空" : "全部对话已清空" });
  }),
);

// GET /api/v1/chat/stats — 获取用户的对话统计
router.get(
  "/stats",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const [stats] = await query(
      `SELECT 
        COUNT(*) as total_messages,
        SUM(CASE WHEN role = 1 THEN 1 ELSE 0 END) as user_messages,
        SUM(CASE WHEN role = 2 THEN 1 ELSE 0 END) as ai_messages,
        SUM(token_input + COALESCE(token_output, 0)) as total_tokens,
        AVG(response_ms) as avg_response_ms,
        COUNT(DISTINCT session_id) as session_count,
        MAX(created_at) as last_message_at
       FROM ai_chat_records 
       WHERE user_id = ?`,
      [req.user.userId],
    );

    res.json({ code: 0, data: stats[0] || {} });
  }),
);

// ===================== 辅助函数 =====================

function generateSessionId() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return "sess_" + Date.now().toString(36) + "_" + result;
}

module.exports = router;
