const axios = require('axios');
const aiConfig = require('./src/config/ai');

console.log('AI Config:', JSON.stringify(aiConfig, null, 2));
console.log('API Key present:', !!aiConfig.apiKey);
console.log('API Key prefix:', aiConfig.apiKey ? aiConfig.apiKey.substring(0, 10) + '...' : 'EMPTY');

// Test with the full actual prompt used by aiService.js
const profile = { city: '一线城市', skill: '编程', mbti_type: 'INTJ', intensity: '965', work_schedule: '工作日晚上和周末' };

const prompt = `你是一位专业的创业导师和商业分析师。请根据以下用户画像信息，为该用户生成详细的创业方案。

用户画像：
- 城市：${profile.city || "未提供"}
- 核心技能：${profile.skill || "未提供"}
- MBTI性格：${profile.mbti_type || "未提供"}
- 工作强度偏好：${profile.intensity || "未提供"}
- 工作时间安排：${profile.work_schedule || "未提供"}

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

(async () => {
  try {
    const startTime = Date.now();
    console.log('\nCalling AI API with full prompt...');
    const response = await axios.post(
      aiConfig.baseUrl + '/chat/completions',
      {
        model: aiConfig.model,
        messages: [
          { role: 'system', content: '你是一位专业的创业导师，擅长为一人公司创业者提供个性化的商业方案。请严格按照 JSON 格式输出。' },
          { role: 'user', content: prompt }
        ],
        temperature: aiConfig.temperature,
        max_tokens: aiConfig.maxTokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + aiConfig.apiKey,
        },
        timeout: aiConfig.timeout,
      },
    );
    const elapsed = Date.now() - startTime;
    console.log('AI API call SUCCESS in', elapsed, 'ms');
    const content = response.data.choices[0].message.content;
    console.log('Response length:', content.length);
    console.log('Response first 200 chars:', content.substring(0, 200));

    // Try parsing
    let jsonStr = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    try {
      const parsed = JSON.parse(jsonStr);
      console.log('\nJSON parse SUCCESS');
      console.log('Profile tags:', parsed.profile?.tags);
      console.log('Directions count:', parsed.directions?.length);
    } catch (e) {
      console.log('\nJSON parse FAILED:', e.message);
      console.log('Last 100 chars:', jsonStr.substring(jsonStr.length - 100));
    }
  } catch (error) {
    console.log('AI API call FAILED');
    if (error.response) {
      console.log('HTTP Status:', error.response.status);
      console.log('Error data:', JSON.stringify(error.response.data));
    } else if (error.code === 'ECONNABORTED') {
      console.log('Request TIMEOUT after', aiConfig.timeout, 'ms');
    } else {
      console.log('Error code:', error.code);
      console.log('Error:', error.message);
    }
  }

  process.exit(0);
})();
