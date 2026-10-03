import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AiTeamAnswer {
  questionId: number
  answer: 'A' | 'B'
}

export interface AiTeamQuestion {
  id: number
  question: string
  option_a: string
  option_b: string
  tag_a: string
  tag_b: string
}

export interface AiRole {
  id: string
  name: string
  priority: number
  solves: string
  expected_effect: string
  can_do: string[]
  cannot_do: string[]
  you_provide: string[]
  recommended_tools: string[]
  monthly_cost: string
}

export interface AiTeamResult {
  plan_type: string
  plan_name: string
  plan_description: string
  monthly_budget: string
  roles: AiRole[]
  startup_tips: string[]
}

export const AI_TEAM_QUESTIONS: AiTeamQuestion[] = [
  { id: 1, question: '你的业务主要靠什么赚钱？', option_a: '卖知识、卖内容、卖课程', option_b: '卖产品、卖服务、卖工具', tag_a: '内容型', tag_b: '产品型' },
  { id: 2, question: '你的客户主要通过什么渠道找到你？', option_a: '社交媒体、搜索引擎、内容平台', option_b: '熟人介绍、行业展会、线下渠道', tag_a: '线上获客', tag_b: '线下获客' },
  { id: 3, question: '你每天需要产出内容吗？', option_a: '需要，而且要持续产出', option_b: '偶尔需要，但不是重点', tag_a: '内容创作', tag_b: '产品运营' },
  { id: 4, question: '你和技术团队打交道多吗？', option_a: '多，我自己就是技术背景', option_b: '不多，技术是弱项', tag_a: '技术型', tag_b: '非技术型' },
  { id: 5, question: '你更擅长？', option_a: '把经验变成可复制的系统', option_b: '一对一的沟通和服务', tag_a: '系统化', tag_b: '个性化' },
  { id: 6, question: '你的客户通常什么时候找你？', option_a: '主动搜索后来咨询', option_b: '朋友推荐或介绍', tag_a: '被动获客', tag_b: '主动获客' },
  { id: 7, question: '你希望AI助手帮你？', option_a: '自动产出内容，省时间', option_b: '帮我服务客户，提高效率', tag_a: '内容自动化', tag_b: '服务自动化' },
  { id: 8, question: '你对技术的态度是？', option_a: '喜欢研究新技术，能自己搞定', option_b: '能用就行，不想深入研究', tag_a: '技术达人', tag_b: '技术小白' },
  { id: 9, question: '你的产品/服务定价是？', option_a: '标准化产品，定价固定', option_b: '定制化服务，价格面议', tag_a: '标准化', tag_b: '定制化' },
  { id: 10, question: '你现在处于哪个阶段？', option_a: '已经有一些客户了', option_b: '还在探索，还没开始', tag_a: '已起步', tag_b: '筹备期' }
]

export const useAiTeamStore = defineStore('aiTeam', () => {
  const answers = ref<Record<number, 'A' | 'B'>>({})
  const currentQuestion = ref(1)
  const result = ref<AiTeamResult | null>(null)
  const isCompleted = ref(false)

  const totalQuestions = AI_TEAM_QUESTIONS.length

  // O(1) lookup Map instead of O(n) find per answer
  const questionMap = new Map(AI_TEAM_QUESTIONS.map(q => [q.id, q]))

  const answeredCount = () => Object.keys(answers.value).length

  const setAnswer = (questionId: number, answer: 'A' | 'B') => {
    answers.value[questionId] = answer
    saveToStorage()
  }

  const next = () => {
    if (currentQuestion.value < totalQuestions) {
      currentQuestion.value++
    } else {
      isCompleted.value = true
    }
    saveToStorage()
  }

  const prev = () => {
    if (currentQuestion.value > 1) {
      currentQuestion.value--
    }
  }

  const calculateResult = (): AiTeamResult => {
    const tagCounts: Record<string, number> = { '内容型': 0, '产品型': 0, '线上获客': 0, '线下获客': 0 }

    Object.entries(answers.value).forEach(([qId, answer]) => {
      const q = questionMap.get(parseInt(qId))
      if (q) {
        if (answer === 'A') tagCounts[q.tag_a]++
        else tagCounts[q.tag_b]++
      }
    })

    let planType = 'F'
    if (answers.value[8] === 'A' && answers.value[5] === 'A') planType = 'C'
    else if (answers.value[6] === 'A' && answers.value[1] === 'B') planType = 'D'
    else if (answers.value[3] === 'B' && answers.value[6] === 'B') planType = 'E'
    else if (answers.value[5] === 'B' && answers.value[10] === 'A') planType = 'F'
    else if (tagCounts['内容型'] >= 6) planType = 'A'
    else if (tagCounts['产品型'] >= 6) planType = 'B'

    const plans: Record<string, AiTeamResult> = {
      'A': {
        plan_type: 'A',
        plan_name: '内容创作者型',
        plan_description: '你靠内容吸引客户，卖知识、课程或个人品牌。最大的痛点是没时间持续产出。',
        monthly_budget: '50-100元',
        roles: [
          { id: 'content_creator', name: '内容创作助手', priority: 1, solves: '每天自动生成3-5篇社媒文案、博客草稿', expected_effect: '从"没东西发"变成"选哪篇发"', can_do: ['根据主题自动生成文案', '学习你的写作风格', '改写内容适配不同平台'], cannot_do: ['做战略判断', '保证内容绝对准确', '建立情感连接'], you_provide: ['10-20篇高质量文章', '品牌调性要求', '主题方向'], recommended_tools: ['Coze', 'Dify', 'ChatGPT'], monthly_cost: '0-50元' },
          { id: 'social_media_operator', name: '社媒运营员', priority: 2, solves: '定时发布、评论互动、数据分析', expected_effect: '减少运营时间投入', can_do: ['自动发布内容', '回复常见评论', '分析数据报告'], cannot_do: ['处理复杂投诉', '创意策划'], you_provide: ['账号权限', '内容日历'], recommended_tools: ['剪映', '新榜'], monthly_cost: '0-30元' },
          { id: 'seo_optimizer', name: 'SEO优化师', priority: 3, solves: '提升搜索排名', expected_effect: '更多自然流量', can_do: ['关键词分析', '内容优化建议'], cannot_do: ['保证排名'], you_provide: ['网站后台权限'], recommended_tools: ['站长工具', '爱站网'], monthly_cost: '0-20元' }
        ],
        startup_tips: ['先只搭"内容创作助手"一个角色，运行2周看效果', '用Coze或Dify搭建，零代码，半小时能搞定', '投喂10-20篇你过去写的高质量文章，让它学习你的风格']
      },
      'B': {
        plan_type: 'B',
        plan_name: '产品/服务运营型',
        plan_description: '你有明确的产品或服务在卖，需要提高运营效率和客户服务质量。',
        monthly_budget: '100-200元',
        roles: [
          { id: 'smart_customer_service', name: '智能客服', priority: 1, solves: '自动回复客户咨询，减少响应时间', expected_effect: '客户满意度提升', can_do: ['自动回复常见问题', '收集客户信息', '转接人工'], cannot_do: ['处理复杂投诉', '做销售'], you_provide: ['产品/服务FAQ'], recommended_tools: ['Intercom', 'Zendesk'], monthly_cost: '50-100元' },
          { id: 'sales_assistant', name: '销售助理', priority: 2, solves: '辅助销售流程，跟进潜在客户', expected_effect: '提高转化率', can_do: ['跟进线索', '发送报价', '提醒跟进'], cannot_do: ['谈判', '做决策'], you_provide: ['客户名单', '产品信息'], recommended_tools: ['Salesforce', 'HubSpot'], monthly_cost: '0-50元' }
        ],
        startup_tips: ['先搭智能客服，处理80%常见问题', '销售助理用于跟进高价值客户']
      },
      'F': {
        plan_type: 'F',
        plan_name: '起步探索型',
        plan_description: '你还在筹备期，零基础，AI助手可以帮你快速起步。',
        monthly_budget: '0-50元',
        roles: [
          { id: 'universal_assistant', name: '万能助理', priority: 1, solves: '回答各种问题，协助做决策', expected_effect: '有个随时可问的顾问', can_do: ['回答问题', '提供建议', '整理信息'], cannot_do: ['代替你行动', '保证结果'], you_provide: ['问题背景'], recommended_tools: ['ChatGPT', 'Claude'], monthly_cost: '0元' },
          { id: 'content_creator', name: '内容创作助手', priority: 2, solves: '快速产出内容，测试方向', expected_effect: '低成本试错', can_do: ['生成内容', '提供创意'], cannot_do: ['完全替代创作'], you_provide: ['主题方向'], recommended_tools: ['ChatGPT'], monthly_cost: '0元' }
        ],
        startup_tips: ['先从万能助理开始，有问题随时问', '内容创作助手帮你快速测试哪个方向有感觉']
      }
    }

    return plans[planType] || plans['F']
  }

  const setResult = (newResult: AiTeamResult) => {
    result.value = newResult
  }

  const saveToStorage = () => {
    localStorage.setItem('ai_team', JSON.stringify({
      answers: answers.value,
      currentQuestion: currentQuestion.value,
      isCompleted: isCompleted.value
    }))
  }

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('ai_team')
      if (stored) {
        const data = JSON.parse(stored)
        answers.value = typeof data.answers === 'object' && data.answers !== null ? data.answers : {}
        currentQuestion.value = typeof data.currentQuestion === 'number' ? data.currentQuestion : 1
        isCompleted.value = typeof data.isCompleted === 'boolean' ? data.isCompleted : false
      }
    } catch {
      localStorage.removeItem('ai_team')
    }
  }

  const reset = () => {
    answers.value = {}
    currentQuestion.value = 1
    isCompleted.value = false
    result.value = null
    localStorage.removeItem('ai_team')
  }

  return {
    answers,
    currentQuestion,
    result,
    isCompleted,
    totalQuestions,
    answeredCount,
    setAnswer,
    next,
    prev,
    calculateResult,
    setResult,
    saveToStorage,
    loadFromStorage,
    reset
  }
})
