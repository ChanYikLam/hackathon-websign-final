import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mbtiService } from '@/services/api'

export interface MbtiAnswer {
  questionId: number
  answer: 'A' | 'B'
}

export interface MbtiQuestion {
  id: number
  part: 1 | 2
  question: string
  option_a: string
  option_b: string
  dimension: 'EI' | 'SN' | 'TF' | 'JP'
}

export interface MbtiResult {
  mbti_type: string
  scores: {
    E: number
    I: number
    S: number
    N: number
    T: number
    F: number
    J: number
    P: number
  }
  type_description: string
  entrepreneurship_analysis: {
    strengths: string[]
    blind_spots: string[]
    suitable_directions: string[]
    company_impact?: string
    team_advice?: string
  }
  completed_at: string
}

export const MBTI_QUESTIONS: MbtiQuestion[] = [
  { id: 1, part: 1, question: '你会跟哪些人做朋友？', option_a: '常提出新主意的', option_b: '脚踏实地的', dimension: 'EI' },
  { id: 2, part: 1, question: '在聚会上，你通常会？', option_a: '主动和很多人聊天', option_b: '只和熟悉的几个人聊天', dimension: 'EI' },
  { id: 3, part: 1, question: '当你独自一人时，你倾向于？', option_a: '感到精力充沛', option_b: '感到需要充电', dimension: 'EI' },
  { id: 4, part: 1, question: '你更喜欢哪种工作方式？', option_a: '和团队一起讨论', option_b: '独自安静思考', dimension: 'EI' },
  { id: 5, part: 1, question: '社交活动对你来说？', option_a: '是获取能量的方式', option_b: '会消耗你的能量', dimension: 'EI' },
  { id: 6, part: 1, question: '你更容易记住？', option_a: '人名和面孔', option_b: '事实和数据', dimension: 'SN' },
  { id: 7, part: 1, question: '你更关注？', option_a: '具体的事实和细节', option_b: '未来的可能性', dimension: 'SN' },
  { id: 8, part: 1, question: '你更愿意被称为？', option_a: '实际的人', option_b: '有创意的人', dimension: 'SN' },
  { id: 9, part: 1, question: '当你解决问题时，你更依赖？', option_a: '过去的经验', option_b: '直觉和灵感', dimension: 'SN' },
  { id: 10, part: 1, question: '你更喜欢阅读？', option_a: '事实陈述类的文章', option_b: '小说和诗歌', dimension: 'SN' },
  { id: 11, part: 1, question: '在做决定时，你更看重？', option_a: '逻辑和客观分析', option_b: '人的感受和影响', dimension: 'TF' },
  { id: 12, part: 1, question: '当和他人发生分歧时，你倾向于？', option_a: '坚持自己的观点', option_b: '考虑对方的感受', dimension: 'TF' },
  { id: 13, part: 1, question: '你更在意？', option_a: '公平和正义', option_b: '和谐与关怀', dimension: 'TF' },
  { id: 14, part: 1, question: '当朋友遇到问题时，你首先会？', option_a: '提供解决方案', option_b: '先倾听和共情', dimension: 'TF' },
  { id: 15, part: 1, question: '你认为自己更？', option_a: '理性', option_b: '感性', dimension: 'TF' },
  { id: 16, part: 1, question: '你更喜欢？', option_a: '按照计划行事', option_b: '随性而为', dimension: 'JP' },
  { id: 17, part: 1, question: '你倾向于？', option_a: '提前规划', option_b: '灵活应对', dimension: 'JP' },
  { id: 18, part: 1, question: '你更喜欢？', option_a: '确定的事情', option_b: '保持开放', dimension: 'JP' },
  { id: 19, part: 1, question: '对于截止日期，你通常？', option_a: '提前完成', option_b: '最后一刻完成', dimension: 'JP' },
  { id: 20, part: 1, question: '你的工作空间通常是？', option_a: '整洁有序', option_b: '随性自然', dimension: 'JP' },
  { id: 21, part: 1, question: '你更喜欢？', option_a: '按部就班', option_b: '随机应变', dimension: 'JP' },
  { id: 22, part: 1, question: '当被介绍给别人时，你通常会？', option_a: '主动打招呼', option_b: '等待对方先开口', dimension: 'EI' },
  { id: 23, part: 1, question: '你更享受？', option_a: '说 rather than listen', option_b: '倾听 rather than talk', dimension: 'EI' },
  { id: 24, part: 1, question: '你在工作中更喜欢？', option_a: '与他人互动', option_b: '独立工作', dimension: 'EI' },
  { id: 25, part: 1, question: '你喜欢什么样的电影？', option_a: '动作片和社交片', option_b: '文艺片和纪录片', dimension: 'EI' },
  { id: 26, part: 1, question: '当开始一个新项目时，你通常会？', option_a: '先讨论想法', option_b: '先制定详细计划', dimension: 'EI' },
  { id: 27, part: 2, question: '我更喜欢', option_a: '理论', option_b: '实践', dimension: 'SN' },
  { id: 28, part: 2, question: '我通常', option_a: '先行动再思考', option_b: '先思考再行动', dimension: 'JP' },
  { id: 29, part: 2, question: '我更容易被', option_a: '实际问题', option_b: '抽象概念', dimension: 'SN' },
  { id: 30, part: 2, question: '我更喜欢', option_a: '事实', option_b: '想法', dimension: 'SN' },
  { id: 31, part: 2, question: '我更感兴趣的是', option_a: '已存在的事物', option_b: '可能存在的事物', dimension: 'SN' },
  { id: 32, part: 2, question: '我更注重', option_a: '细节', option_b: '整体', dimension: 'SN' },
  { id: 33, part: 2, question: '我更喜欢', option_a: '实用的东西', option_b: '美观的东西', dimension: 'SN' },
  { id: 34, part: 2, question: '我相信', option_a: '经验', option_b: '直觉', dimension: 'SN' },
  { id: 35, part: 2, question: '我更容易接受', option_a: '传统', option_b: '变革', dimension: 'SN' },
  { id: 36, part: 2, question: '我更欣赏', option_a: '一步一步来', option_b: '跨越式发展', dimension: 'SN' },
  { id: 37, part: 2, question: '在做决定时，我更看重', option_a: '逻辑', option_b: '情感', dimension: 'TF' },
  { id: 38, part: 2, question: '我更愿意', option_a: '说服别人', option_b: '理解别人', dimension: 'TF' },
  { id: 39, part: 2, question: '我更容易', option_a: '批评', option_b: '表扬', dimension: 'TF' },
  { id: 40, part: 2, question: '我更相信', option_a: '公正', option_b: '仁慈', dimension: 'TF' },
  { id: 41, part: 2, question: '我更容易', option_a: '指出问题', option_b: '维护和谐', dimension: 'TF' },
  { id: 42, part: 2, question: '我更倾向于', option_a: '客观', option_b: '主观', dimension: 'TF' },
  { id: 43, part: 2, question: '我更重视', option_a: '效率', option_b: '关系', dimension: 'TF' },
  { id: 44, part: 2, question: '我更容易', option_a: '心硬', option_b: '心软', dimension: 'TF' },
  { id: 45, part: 2, question: '我更喜欢', option_a: '规则明确', option_b: '灵活变通', dimension: 'JP' },
  { id: 46, part: 2, question: '我通常', option_a: '按清单办事', option_b: '随机应变', dimension: 'JP' },
  { id: 47, part: 2, question: '我更喜欢', option_a: '计划好的', option_b: '即兴的', dimension: 'JP' },
  { id: 48, part: 2, question: '我更倾向于', option_a: '列任务清单', option_b: '保持弹性', dimension: 'JP' },
  { id: 49, part: 2, question: '我更喜欢', option_a: '井然有序', option_b: '自然随意', dimension: 'JP' },
  { id: 50, part: 2, question: '我更愿意', option_a: '提前预约', option_b: '随时出现', dimension: 'JP' },
  { id: 51, part: 2, question: '我更喜欢', option_a: '有明确期限', option_b: '没有严格期限', dimension: 'JP' },
  { id: 52, part: 2, question: '我更倾向于', option_a: '遵守承诺', option_b: '留有余地', dimension: 'JP' },
  { id: 53, part: 2, question: '我更喜欢', option_a: '完成任务', option_b: '探索可能性', dimension: 'JP' },
  { id: 54, part: 2, question: '我更感兴趣的是', option_a: '当前问题', option_b: '未来发展', dimension: 'SN' },
  { id: 55, part: 2, question: '我相信', option_a: '眼见为实', option_b: '第六感', dimension: 'SN' },
  { id: 56, part: 2, question: '我更相信', option_a: '事实', option_b: '想象', dimension: 'SN' },
  { id: 57, part: 2, question: '我更容易被', option_a: '具体描述', option_b: '象征比喻', dimension: 'SN' },
  { id: 58, part: 2, question: '我更关注', option_a: '现在', option_b: '未来', dimension: 'SN' },
  { id: 59, part: 2, question: '我更喜欢', option_a: '务实的方法', option_b: '创新的方法', dimension: 'SN' },
  { id: 60, part: 2, question: '我更容易', option_a: '看到细节', option_b: '看到大局', dimension: 'SN' },
  { id: 61, part: 2, question: '我更愿意', option_a: '执行计划', option_b: '随机应变', dimension: 'JP' },
  { id: 62, part: 2, question: '我更喜欢', option_a: '设定目标', option_b: '开放结局', dimension: 'JP' },
  { id: 63, part: 2, question: '我更倾向于', option_a: '组织性', option_b: '适应性', dimension: 'JP' },
  { id: 64, part: 2, question: '我更喜欢', option_a: '已知的', option_b: '未知的', dimension: 'JP' },
  { id: 65, part: 2, question: '我更愿意', option_a: '做决定', option_b: '保留选择', dimension: 'JP' },
  { id: 66, part: 2, question: '我更喜欢', option_a: '结束事情', option_b: '开始事情', dimension: 'JP' },
  { id: 67, part: 2, question: '我更感兴趣的是', option_a: '具体问题', option_b: '总体原则', dimension: 'SN' },
  { id: 68, part: 2, question: '我相信', option_a: '方法', option_b: '目的', dimension: 'TF' },
  { id: 69, part: 2, question: '我更容易', option_a: '一致', option_b: '灵活', dimension: 'TF' },
  { id: 70, part: 2, question: '我更愿意', option_a: '跟随权威', option_b: '质疑权威', dimension: 'TF' },
  { id: 71, part: 2, question: '我更相信', option_a: '专业', option_b: '热情', dimension: 'TF' },
  { id: 72, part: 2, question: '我更容易', option_a: '妥协', option_b: '坚持', dimension: 'TF' },
  { id: 73, part: 2, question: '我更愿意', option_a: '达成共识', option_b: '保持独立', dimension: 'TF' },
  { id: 74, part: 2, question: '我更喜欢', option_a: '安全', option_b: '冒险', dimension: 'JP' },
  { id: 75, part: 2, question: '我更倾向于', option_a: '稳定', option_b: '变化', dimension: 'JP' },
  { id: 76, part: 2, question: '我更喜欢', option_a: '熟悉的环境', option_b: '陌生的环境', dimension: 'EI' },
  { id: 77, part: 2, question: '我更愿意', option_a: '在人群中', option_b: '独自一人', dimension: 'EI' },
  { id: 78, part: 2, question: '我更容易', option_a: '主动联系', option_b: '等待联系', dimension: 'EI' },
  { id: 79, part: 2, question: '我更喜欢', option_a: '聊天', option_b: '写作', dimension: 'EI' },
  { id: 80, part: 2, question: '我更愿意', option_a: '表达想法', option_b: '倾听他人', dimension: 'EI' },
  { id: 81, part: 2, question: '我更感兴趣的是', option_a: '外部世界', option_b: '内心世界', dimension: 'EI' },
  { id: 82, part: 2, question: '我相信', option_a: '行动', option_b: '反思', dimension: 'EI' },
  { id: 83, part: 2, question: '我更容易', option_a: '被关注', option_b: '保持低调', dimension: 'EI' },
  { id: 84, part: 2, question: '我更愿意', option_a: '领导', option_b: '支持', dimension: 'EI' },
  { id: 85, part: 2, question: '我更喜欢', option_a: '引人注目', option_b: '默默无闻', dimension: 'EI' },
  { id: 86, part: 2, question: '我更感兴趣的是', option_a: '新朋友', option_b: '老朋友', dimension: 'EI' },
  { id: 87, part: 2, question: '我更容易', option_a: '建立联系', option_b: '深入交流', dimension: 'EI' },
  { id: 88, part: 2, question: '我更愿意', option_a: '发言', option_b: '思考', dimension: 'EI' },
  { id: 89, part: 2, question: '我更喜欢', option_a: '热闹', option_b: '安静', dimension: 'EI' },
  { id: 90, part: 2, question: '我更愿意', option_a: '组织活动', option_b: '参加活动', dimension: 'EI' },
  { id: 91, part: 2, question: '我更感兴趣的是', option_a: '社交活动', option_b: '个人爱好', dimension: 'EI' },
  { id: 92, part: 2, question: '我相信', option_a: '团队合作', option_b: '独立自主', dimension: 'EI' },
  { id: 93, part: 2, question: '我更容易', option_a: '融入团队', option_b: '独立思考', dimension: 'EI' }
]

export const useMbtiStore = defineStore('mbti', () => {
  const currentQuestion = ref(1)
  const answers = ref<Record<number, 'A' | 'B'>>({})
  const isCompleted = ref(false)
  const result = ref<MbtiResult | null>(null)

  const totalQuestions = computed(() => MBTI_QUESTIONS.length)

  const currentQuestionData = computed(() => {
    return MBTI_QUESTIONS.find(q => q.id === currentQuestion.value)
  })

  const answeredCount = computed(() => Object.keys(answers.value).length)

  const progress = computed(() => {
    return Math.round((answeredCount.value / totalQuestions.value) * 100)
  })

  const setAnswer = (questionId: number, answer: 'A' | 'B') => {
    answers.value[questionId] = answer
    saveToStorage()
  }

  const next = () => {
    if (currentQuestion.value < totalQuestions.value) {
      currentQuestion.value++
      saveToStorage()
    } else {
      isCompleted.value = true
      saveToStorage()
    }
  }

  const prev = () => {
    if (currentQuestion.value > 1) {
      currentQuestion.value--
    }
  }

  const goToQuestion = (questionId: number) => {
    if (questionId >= 1 && questionId <= totalQuestions.value) {
      currentQuestion.value = questionId
    }
  }

  // 16种 MBTI 类型描述（store 顶层，多个函数共用）
  const typeDescriptions: Record<string, string> = {
  'INTJ': '建筑师型 - 有远见的战略家，善于制定长期规划，追求效率与卓越，习惯独立思考和系统性构建。',
  'INTP': '逻辑学家型 - 天生的思想家和理论家，对抽象概念充满好奇，喜欢探索事物背后的原理，追求逻辑自洽。',
  'ENTJ': '指挥官型 - 天生的领导者，果断、有魄力，善于组织资源和人脉，追求效率和成果，是天生的战略统帅。',
  'ENTP': '辩论家型 - 机智的创意发动机，喜欢挑战现状、探索新可能，善于辩论和说服，在智力激荡中获取能量。',
  'INFJ': '提倡者型 - 有深刻洞察力的理想主义者，能直觉地理解他人内心，追求意义和价值，希望帮助他人实现潜能。',
  'INFP': '调停者型 - 内心丰富的理想主义者，忠于个人价值观，具有强烈的创造力和同理心，喜欢通过创作表达自我。',
  'ENFJ': '主人公型 - 天生的激励者和导师，善于发现他人的潜力，具有极强的共情能力和领导魅力，能让团队凝聚在共同愿景下。',
  'ENFP': '竞选者型 - 充满热情的追梦者，精力充沛、创意无限，善于看到人和事的可能性，热爱自由和探索。',
  'ISTJ': '物流师型 - 严谨可靠的秩序守护者，注重细节和事实，责任心强，喜欢结构化的工作环境，做事有条不紊。',
  'ISFJ': '守卫者型 - 温暖尽责的守护者，乐于帮助他人，注重细节和传统，忠诚且可靠，默默地为团队付出。',
  'ESTJ': '总经理型 - 高效务实的管理者，擅长组织和执行，注重规则和成果，是天生的项目经理和运营专家。',
  'ESFJ': '执政官型 - 热心周到的协调者，重视人际关系和团队和谐，善于照顾他人需求，是天生的社群运营者。',
  'ISTP': '鉴赏家型 - 冷静务实的技术专家，善于动手解决实际问题，喜欢探索事物如何运作，在危机中格外冷静从容。',
  'ISFP': '探险家型 - 温柔敏感的艺术家型，注重美感和体验，情感细腻，喜欢通过作品表达自我，对生活有独特的审美追求。',
  'ESTP': '企业家型 - 精力充沛的行动派，善于捕捉机会、快速反应，在动态环境中游刃有余，是天生的销售和谈判高手。',
  'ESFP': '表演者型 - 热情洋溢的社交达人，喜欢成为焦点，善于带动气氛、鼓舞他人，在人际互动中获得能量。'
}

  // 创业分析数据（store 顶层，多个函数共用）
  const entrepreneurshipAnalyses: Record<string, { strengths: string[], blind_spots: string[], suitable_directions: string[], company_impact?: string, team_advice?: string }> = {
  'INTJ': {
    strengths: ['战略思维能力强，善于看到全局并设定清晰的战略路径', '独立工作能力强，不依赖他人即可高效产出', '追求效率与卓越，对质量有极高要求', '擅长长期规划，能预判趋势并提前布局'],
    blind_spots: ['过度追求完美，可能延误决策时机', '容易忽视人情味，员工可能觉得你冷漠难亲近', '在高压创业环境中更易出现焦虑情绪', '对团队成员的情绪需求不够敏感'],
    suitable_directions: ['独立开发（SaaS/AI工具）', '专业咨询（战略/技术方向）', '架构设计类服务'],
    company_impact: '你的公司会以长远规划和高效执行为核心。但你需要刻意补充能润滑团队氛围的搭档，否则再好的战略也可能因团队凝聚力不足而失败。',
    team_advice: '建议找一个善于处理人际关系的F型搭档来帮你平衡。学会授权和倾听，是从\"独狼\"到\"领袖\"的关键。'
  },
  'INTP': {
    strengths: ['从零到一的突破性创新能力强', '能构建别人看不到的理论体系和产品逻辑', '对抽象概念充满好奇，善于发现事物本质', '逻辑思维缜密，分析问题深入'],
    blind_spots: ['对执行落地缺乏耐心，容易在探索中迷失方向', '对社交和管理事务兴趣不大', '当公司需要快速变现时可能感到束缚', '不善于与客户或投资人沟通'],
    suitable_directions: ['知识付费（深度内容/专栏）', '技术博客/开源项目', 'AI/算法类创业'],
    company_impact: '你能提供极具深度的产品或服务，但需要找一个执行力极强的COO型搭档来把想法变成现实。',
    team_advice: '找一个能帮你收敛和执行的人。你负责想，他负责干——这是INTP创业的最佳拍档模式。'
  },
  'ENTJ': {
    strengths: ['最接近\"天生创业者\"画像的类型之一', '善于设置远大目标并调动一切资源来实现它', '果断、有魄力，敢于冒险和决策', '擅长组织和激励团队，追求成果'],
    blind_spots: ['过度强势和控制欲，可能让员工感到窒息', '可能忽视团队成员的情绪需求', '\"上帝情结\"可能导致核心人员流失', '难以容忍效率低下的情况'],
    suitable_directions: ['需要快速扩张的创业项目', '资源整合型业务', '投资/金融领域'],
    company_impact: '你的公司会展现出极强的进取心和清晰的战略方向。但要学会\"授权而不失控\"，并刻意倾听团队的情绪需求。',
    team_advice: '练习\"领导力\"而非\"控制力\"。真正的领袖是让团队自发追随，而非被你的气场压住。'
  },
  'ENTP': {
    strengths: ['能把你公司变成创意实验室', '擅长看到市场机会和商业模式的多种可能性', '在创业早期极具爆发力', '善于辩论和说服，能激励团队'],
    blind_spots: ['难以聚焦，对每个新想法都充满热情却很难做深做透', '可能陷入\"一直在尝试，从未有结果\"的漩涡', '执行能力相对薄弱', '喜欢开始新事物但难以坚持'],
    suitable_directions: ['知识付费（跨学科内容）', '内容创作/自媒体', 'AI应用创新'],
    company_impact: '你需要找一个能帮你收敛和执行的搭档（比如ISTJ），否则公司会一直在尝试新方向却无法突破。',
    team_advice: '学会\"say no\"。每拒绝一个想法，你就在一个方向上前进了一步。'
  },
  'INFJ': {
    strengths: ['公司带有强烈的使命感和价值观', '真诚能吸引志同道合的人', '能直觉地理解用户深层需求', '善于建立长期稳定的关系'],
    blind_spots: ['容易过度理想化，当现实与愿景冲突时陷入内耗', '需要学会设立情感边界，否则容易被团队的情绪需求耗尽', '决策时可能过于考虑他人感受而犹豫不决', '不善于处理冲突和商务谈判'],
    suitable_directions: ['教育/培训类业务', '心理咨询/个人成长', '公益创业/社会企业'],
    company_impact: '你做事情不只是为了赚钱，更希望改变世界。但要学会在理想和现实之间找到平衡点。',
    team_advice: '设立清晰的边界，学会说\"不\"。你的精力是有限的，先照顾好自己才能照顾他人。'
  },
  'INFP': {
    strengths: ['能创造极具个人风格和灵魂的产品或内容', '在艺术、写作、独立品牌等领域有天然优势', '具有强烈的创造力和同理心', '善于建立深度、有意义的连接'],
    blind_spots: ['商业思维薄弱，可能对\"赚钱\"这件事本身感到不适', '在团队管理和果断决策上较为吃力', '容易沉浸在自己的世界里而忽视运营现实', '不善于主动推广和营销'],
    suitable_directions: ['艺术创作/设计', '内容创作/写作', '独立品牌（手工艺/定制）'],
    company_impact: '你需要找一个务实的商业搭档来帮你处理运营和变现，同时保护好自己的创作空间。',
    team_advice: '学会让商业思维为创作服务，而不是觉得商业是\"俗气\"的。钱是让你的创意走得更远的燃料。'
  },
  'ENFJ': {
    strengths: ['能打造出极具凝聚力和人文关怀的团队文化', '员工往往因你的个人魅力而愿意跟随', '擅长对外沟通、建立合作关系', '善于激励和发展团队成员的潜力'],
    blind_spots: ['过度迎合他人的倾向，为了维护团队和谐可能回避必要的冲突', '难以做出\"得罪人\"的正确决定', '可能被团队的情绪需求绑架', '对批评和建议比较敏感'],
    suitable_directions: ['培训/教练类业务', '社群运营', '品牌营销/文化建设'],
    company_impact: '你的公司会让人感到温暖可靠，客户忠诚度高。但要学会在\"照顾他人\"和\"做正确的事\"之间找到平衡。',
    team_advice: '有时候，正确的决定会让人不舒服。学会面对冲突，是你从\"好人\"变成\"好领导\"的必经之路。'
  },
  'ENFP': {
    strengths: ['绝佳的灵感来源和氛围营造者', '能让公司充满活力和正能量', '善于发现新机会和激励团队', '适应能力强，能快速应对变化'],
    blind_spots: ['致命弱点在执行力，太多想法却很难贯彻到底', '可能做出\"瞎承诺\"，执行上虎头蛇尾', '难以专注，容易被新想法带跑', '对重复性事务缺乏耐心'],
    suitable_directions: ['知识付费（创意/个人成长）', '内容创作/短视频', '活动策划/会展'],
    company_impact: '你是绝佳的\"0到1\"选手，但需要找一个擅长规划和执行的搭档来帮你\"1到100\"。',
    team_advice: '学会给想法设截止日期。每周只允许自己启动一个新项目，剩下的必须先完成。'
  },
  'ISTJ': {
    strengths: ['公司会以高度的可靠性和稳定性著称', '善于建立系统和流程，确保每件事都按时按质完成', '注重细节，不会出现流程混乱', '责任感强，说到做到'],
    blind_spots: ['拥抱变化的能力较弱，在快速变化的市场中可能过于僵化', '容易错失创新机会', '对\"不确定性\"感到不适', '可能被认为是\"保守派\"'],
    suitable_directions: ['独立开发（工具类产品）', '信息中介服务', '专业咨询（合规/法务）'],
    company_impact: '你的公司以稳定可靠著称，但要学会对不确定性保持开放。找一个有创意的搭档来帮你突破思维定式。',
    team_advice: '拥抱变化不是让你放弃原则，而是让你在坚持核心的同时，灵活调整方法。'
  },
  'ISFJ': {
    strengths: ['能把公司经营得像个温暖的大家庭', '善于照顾客户和员工的需求，建立长期稳定的关系', '在服务行业或社区型业务中具有巨大优势', '默默付出，不计较个人得失'],
    blind_spots: ['过度牺牲的倾向，可能把太多精力投入到满足他人而忽略公司盈利', '不善于拒绝，被\"占便宜\"时难以开口', '容易把他人的情绪当作自己的负担', '过于关注当下的具体问题而忽略长远发展'],
    suitable_directions: ['实体轻服务（咖啡/手工）', '专业咨询（服务型）', '社区运营'],
    company_impact: '你的公司会让人感到被重视和被照顾。但要学会设立边界，把\"照顾自己\"放在日程表里。',
    team_advice: '你的价值不是通过\"牺牲\"来体现的。学会说不，是对自己和公司都负责的表现。'
  },
  'ESTJ': {
    strengths: ['公司拥有极强的执行力和组织性', '擅长制定计划并严格执行，在时间管理和目标达成上表现卓越', '随着企业运营时间延长，更能保持良好的组织性', '善于处理运营中的各种细节问题'],
    blind_spots: ['过于强调效率而忽视人的感受，员工可能觉得你像一台没有感情的机器', '可能缺乏灵活性和创新思维', '难以接受\"计划外\"的变化', '表达方式可能过于直接而生硬'],
    suitable_directions: ['电商/运营', '项目管理/咨询', '传统行业转型'],
    company_impact: '你的公司运营高效、目标清晰。但要学会放下规则，让团队成员有参与感和自主权。',
    team_advice: '试着在每次开会时，先问\"大家感觉怎么样\"，而不是直接说\"我们开始吧\"。'
  },
  'ESFJ': {
    strengths: ['擅长维护客户关系和团队凝聚力', '公司给人温暖可靠的印象，客户忠诚度高', '善于处理日常运营中的人事协调', '有强烈的责任感和归属感'],
    blind_spots: ['回避冲突的倾向，为了维持和谐可能推迟必要的艰难决策', '难以面对\"得罪人\"的情况', '过于在意他人的看法，可能被舆论绑架', '不善于处理负面反馈'],
    suitable_directions: ['服务业/餐饮', '社群运营/会员制', '人力资源/客服外包'],
    company_impact: '你的公司会让人感到愉快和被重视。但学习面对冲突，是成为更好老板的关键一步。',
    team_advice: '不是每个人都喜欢你，这没关系。学会接受\"有人不喜欢我\"的事实，你会更自由。'
  },
  'ISTP': {
    strengths: ['拥有极强的实战能力和危机处理能力', '当公司遇到突发问题时，你是最可靠的人', '善于用最简单有效的方式搞定复杂问题', '冷静从容，在压力下仍能做出正确判断'],
    blind_spots: ['不善于表达和沟通，习惯\"少说多做\"可能让团队摸不清方向', '可能被认为是冷漠或疏离', '对长期规划缺乏兴趣，更关注当下', '社交和人脉经营能力相对较弱'],
    suitable_directions: ['技术服务（外包/实施）', '技术支持/售后', '技术类销售'],
    company_impact: '你能用最务实的方式解决复杂问题，但需要刻意练习适时回应和主动沟通。',
    team_advice: '有时候说一句\"我今天状态不好\"比默默硬撑更好。沟通不是示弱，而是让合作更顺畅。'
  },
  'ISFP': {
    strengths: ['能创造出极具美感和个人风格的产品或服务', '在设计、时尚、手工艺等领域有天然优势', '对细节和品质有敏锐的感知', '善于理解用户的情感需求'],
    blind_spots: ['过于沉浸在创作中而忽视商业运营', '账单不会自己消失，不重视财务可能导致资金链断裂', '容易从他人的情绪中抽身困难，过度消耗', '难以做出商业决策'],
    suitable_directions: ['设计/艺术创作', '时尚/手工艺', '体验型服务业'],
    company_impact: '你的公司有独特的品牌调性和美感。但找一个务实的搭档来帮你处理数字和流程，同时保护好你的创作空间。',
    team_advice: '每周给自己设定一个\"商业时间\"，专门处理账单、库存、税务这些\"无聊但重要\"的事。'
  },
  'ESTP': {
    strengths: ['最接近\"创业者\"原始含义的类型——敢冒险、行动快', '擅长在不确定性中抓住机会', '在销售和商务拓展上有天然优势', '善于搞定客户，能快速建立信任'],
    blind_spots: ['缺乏长远规划，容易\"想到就冲\"不考虑可持续性', '可能一直处于\"打一枪换一个地方\"的状态', '难以专注和坚持一个方向', '对风险有过度的乐观'],
    suitable_directions: ['销售/中介服务', '活动执行', '商务拓展/招商'],
    company_impact: '你是天生的机会捕捉者，但需要学会做减法。找到方向后，至少给自己6个月去验证，而不是2周就换方向。',
    team_advice: '每当你想说\"这个不行，换一个\"的时候，先逼自己做满3个月再说。'
  },
  'ESFP': {
    strengths: ['能把公司经营得像一场精彩的演出', '天生懂得如何吸引眼球、如何让客户和员工都感到愉快', '在娱乐、活动、体验型业务中如鱼得水', '充满热情和正能量，感染力强'],
    blind_spots: ['过于随性，可能做出\"瞎承诺\"或虎头蛇尾', '难以按进度交出成果', '不善于处理数据和财务', '可能过于追求\"好玩\"而忽视商业本质'],
    suitable_directions: ['娱乐/活动策划', '体验型服务业', '内容创作/直播'],
    company_impact: '你的公司充满活力和乐趣，但要学会按进度交付成果。学会\"靠谱\"是你从\"有趣\"走向\"成功\"的关键。',
    team_advice: '找一个能帮你做规划和收尾工作的搭档。你负责让一切变得有趣，他负责让它真正发生。'
  }
  }

  const submitResult = async (): Promise<MbtiResult> => {
    const answersArray: { question_id: number; answer: 'A' | 'B' }[] = []
    for (let i = 1; i <= totalQuestions.value; i++) {
      if (answers.value[i]) {
        answersArray.push({ question_id: i, answer: answers.value[i] })
      }
    }

    if (answersArray.length !== totalQuestions.value) {
      throw new Error('请回答全部题目')
    }

    try {
      await mbtiService.submit(answersArray.map(a => ({ question_id: a.question_id, answer: a.answer })))
    } catch (error) {
      console.error('Failed to submit to server:', error)
    }

    const result = calculateResult()
    isCompleted.value = true
    saveToStorage()
    return result
  }

  const skipWithMbtiType = async (mbtiType: string) => {
    const upperMbti = mbtiType.toUpperCase().trim()
    
    const VALID_TYPES = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ', 'ESTP', 'ESFP', 'ENFP', 'ENTP']
    
    if (!VALID_TYPES.includes(upperMbti)) {
      return { success: false, error: '无效的 MBTI 类型，请输入如 INTJ、ENFP 等有效类型' }
    }

    try {
      await mbtiService.skip(upperMbti)
    } catch (error) {
      console.error('Failed to submit skipped MBTI to server:', error)
    }

    const analysis = entrepreneurshipAnalyses[upperMbti] || {
      strengths: ['有自己的独特优势'],
      blind_spots: ['需要注意扬长避短'],
      suitable_directions: ['知识付费', '内容创作']
    }

    result.value = {
      mbti_type: upperMbti,
      scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
      type_description: typeDescriptions[upperMbti] || `你选择了 ${upperMbti} 类型`,
      entrepreneurship_analysis: analysis,
      completed_at: new Date().toISOString()
    }

    isCompleted.value = true
    saveToStorage()
    return { success: true, data: result.value }
  }

  const calculateResult = (): MbtiResult => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

    MBTI_QUESTIONS.forEach(q => {
      const answer = answers.value[q.id]
      if (answer === 'A') {
        if (q.dimension === 'EI') scores.E++
        else if (q.dimension === 'SN') scores.S++
        else if (q.dimension === 'TF') scores.T++
        else if (q.dimension === 'JP') scores.J++
      } else if (answer === 'B') {
        if (q.dimension === 'EI') scores.I++
        else if (q.dimension === 'SN') scores.N++
        else if (q.dimension === 'TF') scores.F++
        else if (q.dimension === 'JP') scores.P++
      }
    })

    const mbti_type =
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P')

    const analysis = entrepreneurshipAnalyses[mbti_type] || {
      strengths: ['有自己的独特优势'],
      blind_spots: ['需要注意扬长避短'],
      suitable_directions: ['知识付费', '内容创作']
    }

    return {
      mbti_type,
      scores,
      type_description: typeDescriptions[mbti_type] || '你是一个独特的人。',
      entrepreneurship_analysis: analysis,
      completed_at: new Date().toISOString()
    }
  }

  const setResult = (newResult: MbtiResult) => {
    result.value = newResult
  }

  const saveToStorage = () => {
    localStorage.setItem('mbti', JSON.stringify({
      currentQuestion: currentQuestion.value,
      answers: answers.value,
      isCompleted: isCompleted.value
    }))
  }

  const isLast = computed(() => currentQuestion.value >= totalQuestions.value)
  const isFirst = computed(() => currentQuestion.value <= 1)

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('mbti')
      if (stored) {
        const data = JSON.parse(stored)
        currentQuestion.value = typeof data.currentQuestion === 'number' ? data.currentQuestion : 1
        answers.value = typeof data.answers === 'object' && data.answers !== null ? data.answers : {}
        isCompleted.value = typeof data.isCompleted === 'boolean' ? data.isCompleted : false
      }
    } catch {
      localStorage.removeItem('mbti')
    }
  }

  // 根据 MBTI 类型直接获取解析数据（用于跳过测试的场景）
  const getMbtiAnalysisByType = (mbtiType: string): MbtiResult => {
    const upperType = mbtiType.toUpperCase()
    const analysis = entrepreneurshipAnalyses[upperType] || {
      strengths: ['有自己的独特优势'],
      blind_spots: ['需要注意扬长避短'],
      suitable_directions: ['知识付费', '内容创作']
    }
    return {
      mbti_type: upperType,
      scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
      type_description: typeDescriptions[upperType] || `${upperType}类型`,
      entrepreneurship_analysis: analysis,
      completed_at: new Date().toISOString()
    }
  }

  const reset = () => {
    currentQuestion.value = 1
    answers.value = {}
    isCompleted.value = false
    result.value = null
    localStorage.removeItem('mbti')
  }

  return {
    currentQuestion,
    answers,
    isCompleted,
    result,
    totalQuestions,
    currentQuestionData,
    answeredCount,
    progress,
    isLast,
    isFirst,
    setAnswer,
    next,
    prev,
    goToQuestion,
    calculateResult,
    getMbtiAnalysisByType,
    setResult,
    submitResult,
    skipWithMbtiType,
    saveToStorage,
    loadFromStorage,
    reset
  }
})
