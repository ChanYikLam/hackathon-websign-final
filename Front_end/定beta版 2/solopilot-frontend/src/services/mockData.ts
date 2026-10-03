import type { AnalysisResult } from '@/stores/result'
import type { MbtiResult } from '@/stores/mbti'
import type { AiTeamResult } from '@/stores/aiTeam'

export const MOCK_MBTI_RESULT: MbtiResult = {
  mbti_type: 'ENFP',
  scores: { E: 14, I: 7, S: 10, N: 57, T: 30, F: 37, J: 22, P: 45 },
  type_description: 'ENFP（竞选者）-- 你是一个充满创意和热情的人，善于发现新的可能性并激励他人。',
  entrepreneurship_analysis: {
    strengths: ['创意丰富，善于发现新机会', '擅长与人建立连接，天然的内容创作者', '热情有感染力，善于激励团队'],
    blind_spots: ['执行力偏弱，容易虎头蛇尾', '对枯燥的运营细节缺乏耐心', '有时过于理想化'],
    suitable_directions: ['知识付费与内容创作', '跨境电商', 'AI驱动的服务业务']
  },
  completed_at: new Date().toISOString()
}

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  profile: {
    tags: ['一线城市', '写作内容', 'ENFP', '平衡型'],
    description: '你是一个生活在一线城市、擅长内容创作、性格开放热情的创业者。你适合从多个方向中选择最优解，逐步验证并放大。'
  },
  directions: [
    {
      rank: 1,
      name: '知识付费与内容创作',
      match_rate: 92,
      reason: '你的核心技能是写作内容，这与知识付费方向高度匹配。ENFP型的你擅长发现新机会、与人建立连接，天然适合内容传播和社群运营。你在一线城市的优势是可以接触到更多行业资源和优质合作方。',
      income_range: '月入 5,000 - 30,000 元',
      case_brief: '参考案例：某一线城市前媒体人，通过付费专栏和社群运营，6个月后月入稳定在2万元以上',
      startup_tips: ['从你擅长的领域开始，先写10篇深度内容', '选择一个小红书或公众号作为主阵地', '先免费积累1000粉丝，再考虑付费转化']
    },
    {
      rank: 2,
      name: 'AI驱动的服务业务',
      match_rate: 85,
      reason: '2025-2026年AI发展迅猛，你对新技术保持开放态度。AI工具可以放大你的内容创作能力，让你一个人完成以前需要一个团队才能完成的工作。',
      income_range: '月入 8,000 - 50,000 元',
      case_brief: '参考案例：用AI工具做内容代运营，3个月积累50个付费客户，月入突破3万',
      startup_tips: ['先学习2-3个主流AI工具', '找到一个细分领域深耕', '用AI提效，用人工建立壁垒']
    },
    {
      rank: 3,
      name: '实体轻服务',
      match_rate: 78,
      reason: '你的社交能力和热情服务意识让你在线下服务场景中有优势。可以考虑结合你的内容能力，做本地化服务。',
      income_range: '月入 3,000 - 15,000 元',
      case_brief: '参考案例：私人定制旅行策划，结合内容推广，半年实现稳定月入1.5万',
      startup_tips: ['选择一个本地细分市场', '用内容建立个人品牌', '注重服务质量和口碑']
    }
  ],
  user_type: {
    type: '平衡型',
    label: '平衡型创业者',
    description: '你目前的情况比较灵活，有时间和空间尝试不同方向。建议先选择1个方向用3个月验证，成功后再考虑加大投入。',
    strategy: '提供2-3个可选方案让用户选择，推荐从中等投入的路径开始'
  },
  summary: {
    your_profile: '一线城市的ENFP内容创作者，偏好平衡的工作节奏',
    recommended_directions: '知识付费与内容创作（首选）、AI驱动的服务业务（备选）',
    strategy_advice: '营销优先策略 -- 先建立个人品牌和内容体系，再考虑产品化',
    city_advice: '一线城市对你来说是优势，充分利用本地行业资源和人脉',
    first_month_checklist: [
      { id: 1, content: '确定内容主阵地（小红书/公众号/抖音）', completed: false },
      { id: 2, content: '发布第一篇深度内容', completed: false },
      { id: 3, content: '完成MBTI结果的个性化解读文章', completed: false },
      { id: 4, content: '建立内容选题库（至少20个选题）', completed: false },
      { id: 5, content: '研究3个同领域的成功案例', completed: false },
      { id: 6, content: '加入2个相关行业社群', completed: false }
    ],
    expected_timeline: '1-2周内完成内容体系搭建，1-3个月积累首批付费用户，3-6个月月收入达到3,000-5,000元'
  },
  generated_at: new Date().toISOString()
}

export const MOCK_AI_TEAM_RESULT: AiTeamResult = {
  plan_type: 'A',
  plan_name: '内容创作者型',
  plan_description: '你靠内容吸引客户，卖知识、课程或个人品牌。最大的痛点是没时间持续产出。',
  monthly_budget: '50-100元',
  roles: [
    {
      id: 'content_creator',
      name: '内容创作助手',
      priority: 1,
      solves: '每天自动生成3-5篇社媒文案、博客草稿',
      expected_effect: '从"没东西发"变成"选哪篇发"',
      can_do: [
        '根据主题自动生成博客文章、社媒文案、短视频脚本',
        '学习你的写作风格，保持输出一致性',
        '自动改写同一内容为不同平台适配的版本'
      ],
      cannot_do: [
        '替你做战略判断（什么话题值得写、什么不能说）',
        '保证内容的绝对准确性和专业性',
        '替你建立与读者的情感连接'
      ],
      you_provide: [
        '10-20篇你过去写的高质量文章',
        '你的品牌调性要求',
        '主题方向和大纲'
      ],
      recommended_tools: ['Coze', 'Dify', 'ChatGPT Custom GPTs'],
      monthly_cost: '0-50元'
    },
    {
      id: 'social_media_operator',
      name: '社媒运营员',
      priority: 2,
      solves: '定时发布内容、回复评论、分析数据',
      expected_effect: '减少运营时间投入，把精力放在创作上',
      can_do: [
        '按照预定时间自动发布内容',
        '回复常见评论和私信',
        '生成每周数据报告'
      ],
      cannot_do: [
        '处理复杂投诉和危机公关',
        '做创意策划'
      ],
      you_provide: [
        '社交账号授权',
        '内容发布时间表',
        '常见问题回复模板'
      ],
      recommended_tools: ['剪映', '新榜', '即刻'],
      monthly_cost: '0-30元'
    },
    {
      id: 'seo_optimizer',
      name: 'SEO优化师',
      priority: 3,
      solves: '提升搜索排名，带来更多自然流量',
      expected_effect: '让目标用户更容易找到你',
      can_do: [
        '分析关键词机会',
        '提供内容优化建议',
        '跟踪排名变化'
      ],
      cannot_do: [
        '保证具体排名',
        '替代内容质量'
      ],
      you_provide: [
        '网站或博客后台权限',
        '主要关键词列表'
      ],
      recommended_tools: ['站长工具', '爱站网', 'Google Search Console'],
      monthly_cost: '0-20元'
    }
  ],
  startup_tips: [
    '先只搭"内容创作助手"一个角色，运行2周看效果',
    '用Coze或Dify搭建，零代码，半小时能搞定',
    '投喂10-20篇你过去写的高质量文章，让它学习你的风格'
  ]
}
