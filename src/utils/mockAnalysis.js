/**
 * Mock data generator for analysis results.
 * Used when LLM service is not available (development/staging).
 * In production, replace with actual LLM API calls.
 */

/**
 * Generate mock analysis result based on user profile
 * @param {{ city?: string, skill?: string, mbti_type?: string, intensity?: string }} profile
 * @returns {object} Mock analysis result
 */
function generateMockResult(profile) {
  const city = profile.city || "一线城市";
  const skill = profile.skill || "内容创作";
  const mbtiType = profile.mbti_type || "INFP";

  return {
    profile: {
      tags: ["一线城市", skill, mbtiType, profile.intensity || "平衡型"],
      desc: `你是一个生活在${city}，擅长${skill}，性格${mbtiType}的创业者。你适合从多个方向中选择最优解，逐步验证并放大。`,
    },
    directions: [
      {
        rank: 1,
        name: "知识付费与内容创作",
        match_rate: 92,
        reason:
          "你擅长内容创作，且MBTI类型显示你有很强的表达能力。知识付费是目前一人公司最成熟的方向之一，边际成本接近零。",
        income_range: "¥5000-20000/月",
        case_brief:
          "一位内容创作者通过公众号+知识星球，6个月实现月入过万。",
        startup_tips: [
          "先选择一个细分领域深耕",
          "每周至少产出3篇高质量内容",
          "建立私域社群提高复购率",
        ],
      },
      {
        rank: 2,
        name: "AI驱动的服务业务",
        match_rate: 85,
        reason:
          "AI工具大幅降低了服务交付成本。你可以利用AI提供文案、设计、数据分析等服务，一个人服务多个客户。",
        income_range: "¥8000-30000/月",
        case_brief:
          "一位自由职业者利用AI工具，一个人同时服务15个客户，月收入稳定在2万以上。",
        startup_tips: [
          "选择2-3个核心AI工具精通",
          "打造标准化的服务流程",
          "在平台建立个人品牌",
        ],
      },
      {
        rank: 3,
        name: "实体轻服务",
        match_rate: 78,
        reason:
          "结合你的城市资源和技能，实体轻服务是现金流最稳定的方向。可以从小规模开始，逐步建立口碑。",
        income_range: "¥6000-15000/月",
        case_brief:
          "一位城市居民通过社区团购+代购服务，月稳定收入8000元。",
        startup_tips: [
          "从社区小范围开始测试",
          "建立稳定的供应链",
          "注重服务质量和口碑",
        ],
      },
    ],
    user_type: "平衡型",
    user_type_label: "稳健探索型",
    user_type_desc:
      "你在风险和稳定之间找到了平衡点。既不会过于保守错失机会，也不会过度冒险。这种性格非常适合一人公司的长期发展。",
    user_type_strategy:
      "建议采用'核心+探索'策略：80%精力投入核心业务保证稳定收入，20%精力尝试新方向寻找增长机会。",
    summary: {
      profile: `你的核心优势在于${skill}和${mbtiType}。结合${city}的资源优势，你有很大的成长空间。`,
      directions:
        "根据你的测评结果，知识付费与内容创作是最匹配的方向。建议先从这个方向开始，验证商业模式后再逐步扩展。",
      strategy:
        "采用'小步快跑'策略，先用最低成本验证方向可行性，确认有市场需求后再投入更多资源。",
      city_advice: `${city}资源丰富但竞争激烈。建议从细分市场切入，找到你的独特定位后再逐步扩大。`,
      checklist: [
        "注册一个自媒体账号并开始日更",
        "选择一个知识付费平台入驻",
        "建立第一个私域社群（至少50人）",
        "完成第一个付费产品原型",
        "获得前10个付费用户",
      ],
      timeline:
        "预计3-6个月可以跑通最小商业闭环，6-12个月可以实现稳定月收入过万。",
    },
  };
}

module.exports = { generateMockResult };
