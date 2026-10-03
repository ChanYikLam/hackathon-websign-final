const axios = require("axios");
const aiConfig = require("../config/ai");

/**
 * 调用 DeepSeek AI API 生成创业分析
 * @param {Object} profile - 用户画像数据 { city, skill, mbti_type, intensity }
 * @returns {Promise<Object>} 分析结果
 */
async function analyzeEntrepreneurProfile(profile) {
  const { city, skill, mbti_type, intensity, work_schedule } = profile;

  const prompt = `你是一位专业的创业导师和商业分析师。请根据以下用户画像信息，为该用户生成详细的创业方案。

用户画像：
- 城市：${city || "未提供"}
- 核心技能：${skill || "未提供"}
- MBTI性格：${mbti_type || "未提供"}
- 工作强度偏好：${intensity || "未提供"}
- 工作时间安排：${work_schedule || "未提供"}

请严格按照以下 JSON 格式返回分析结果（只返回 JSON，不要有其他内容）：

{
  "profile": {
    "tags": ["标签1", "标签2", "标签3", "标签4"],
    "desc": "一段完整的个人画像描述，2-3句话"
  },
  "directions": [
    {
      "rank": 1,
      "name": "方向名称",
      "match_rate": 92,
      "reason": "匹配原因，2-3句话",
      "income_range": "¥5000-20000/月",
      "case_brief": "简短案例描述",
      "startup_tips": ["建议1", "建议2", "建议3"]
    },
    {
      "rank": 2,
      "name": "方向名称",
      "match_rate": 85,
      "reason": "匹配原因",
      "income_range": "¥8000-30000/月",
      "case_brief": "简短案例",
      "startup_tips": ["建议1", "建议2", "建议3"]
    },
    {
      "rank": 3,
      "name": "方向名称",
      "match_rate": 78,
      "reason": "匹配原因",
      "income_range": "¥6000-15000/月",
      "case_brief": "简短案例",
      "startup_tips": ["建议1", "建议2", "建议3"]
    }
  ],
  "user_type": "平衡型",
  "user_type_label": "稳健探索型",
  "user_type_desc": "性格类型描述，2-3句话",
  "user_type_strategy": "策略建议，2-3句话",
  "summary": {
    "profile": "你的核心优势总结",
    "directions": "推荐方向总结",
    "strategy": "策略建议总结",
    "city_advice": "城市资源建议",
    "checklist": ["步骤1", "步骤2", "步骤3", "步骤4", "步骤5"],
    "timeline": "时间线预估"
  }
}

要求：
1. 所有文字使用中文
2. 提供 3 个创业方向，匹配度从高到低排列
3. 内容要具体、实用、有针对性
4. 结合用户的城市、技能、性格特点进行分析
5. 收入范围要合理
6. checklist 提供 5 个首月可执行的具体步骤`;

  try {
    const response = await axios.post(
      `${aiConfig.baseUrl}/chat/completions`,
      {
        model: aiConfig.model,
        messages: [
          {
            role: "system",
            content:
              "你是一位专业的创业导师，擅长为一人公司创业者提供个性化的商业方案。请严格按照 JSON 格式输出。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: aiConfig.temperature,
        max_tokens: aiConfig.maxTokens,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${aiConfig.apiKey}`,
        },
        timeout: aiConfig.timeout,
      },
    );

    const content = response.data.choices[0].message.content.trim();

    // 尝试解析 JSON
    try {
      // 去除可能的 markdown 代码块标记
      let jsonStr = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("AI response parse error:", parseError.message);
      console.error("Raw content:", content);
      throw new Error("AI 返回数据格式错误");
    }
  } catch (error) {
    if (error.response) {
      console.error("AI API error:", error.response.status, error.response.data);
      throw new Error(
        `AI 服务调用失败: ${error.response.status} ${error.response.data?.error?.message || error.response.statusText}`,
      );
    } else if (error.code === "ECONNABORTED") {
      throw new Error("AI 服务请求超时，请稍后重试");
    } else {
      throw new Error(`AI 服务调用失败: ${error.message}`);
    }
  }
}

module.exports = { analyzeEntrepreneurProfile };
