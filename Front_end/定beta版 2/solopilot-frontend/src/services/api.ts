import http from './http'
import { useAuthStore } from '@/stores/auth'
import { MOCK_MBTI_RESULT, MOCK_ANALYSIS_RESULT, MOCK_AI_TEAM_RESULT } from './mockData'
import { complianceGuides } from '@/data/complianceData'
import type { ApiResponse } from '@/types/common'

const withDemoMode = <T>(getData: () => T): T => {
  const authStore = useAuthStore()
  return authStore.isDemoMode ? getData() : null as unknown as T
}

const demoMode = <T>(data: T): T | null => {
  const authStore = useAuthStore()
  return authStore.isDemoMode ? data : null
}

// ============================================
// 认证模块 (Auth)
// ============================================
export const authService = {
  /**
   * 账号密码注册
   * POST /api/v1/auth/register
   */
  async register(username: string, password: string, nickname?: string): Promise<ApiResponse<{
    token: string
    token_expire_at: string
    user: {
      id: number
      username: string
      nickname: string
      avatar: string | null
      is_info_completed: boolean
      is_mbti_completed: boolean
      created_at: string
    }
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        token: 'demo-token',
        token_expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        user: {
          id: 1,
          username: 'demo_user',
          nickname: nickname || 'Demo用户',
          avatar: null,
          is_info_completed: false,
          is_mbti_completed: false,
          created_at: new Date().toISOString()
        }
      }
    })
    if (demo) return demo
    return http.post('/auth/register', { username, password, nickname }) as Promise<ApiResponse<any>>
  },

  /**
   * 账号密码登录
   * POST /api/v1/auth/login
   */
  async login(username: string, password: string): Promise<ApiResponse<{
    token: string
    token_expire_at: string
    user: {
      id: number
      username: string
      nickname: string
      avatar: string | null
      is_info_completed: boolean
      is_mbti_completed: boolean
      created_at: string
    }
  }>> {
    const authStore = useAuthStore()
    if (authStore.isDemoMode) {
      authStore.login('demo-token', {
        id: 1,
        nickname: 'Demo用户',
        avatar: null
      })
      const demoUser = {
        id: 1,
        username: 'demo_user',
        nickname: 'Demo用户',
        avatar: null,
        is_info_completed: false,
        is_mbti_completed: false,
        created_at: new Date().toISOString()
      }
      return {
        code: 0,
        message: 'success',
        data: {
          token: 'demo-token',
          token_expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          user: demoUser
        }
      }
    }
    return http.post('/auth/login', { username, password }) as Promise<ApiResponse<any>>
  },

  /**
   * 刷新 Token
   * POST /api/v1/auth/refresh
   */
  async refreshToken(): Promise<ApiResponse<{ token: string; token_expire_at: string }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        token: 'demo-token',
        token_expire_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    })
    if (demo) return demo
    return http.post('/auth/refresh') as Promise<ApiResponse<any>>
  }
}

// ============================================
// 用户模块 (User)
// ============================================
export const userService = {
  /**
   * 获取当前用户信息
   * GET /api/v1/user/profile
   */
  async getProfile(): Promise<ApiResponse<{
    id: number
    username: string
    nickname: string
    avatar: string | null
    status: number
    is_info_completed: boolean
    is_mbti_completed: boolean
    is_analysis_done: boolean
    current_step: string
    info_collect_step: number
    mbti_current_question: number
    created_at: string
    last_login_at: string
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        id: 1,
        username: 'demo_user',
        nickname: 'Demo用户',
        avatar: null,
        status: 1,
        is_info_completed: false,
        is_mbti_completed: false,
        is_analysis_done: false,
        current_step: 'info-collect',
        info_collect_step: 0,
        mbti_current_question: 0,
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString()
      }
    })
    if (demo) return demo
    return http.get('/user/profile') as Promise<ApiResponse<any>>
  },

  /**
   * 提交个人信息采集结果（一次性提交全部7个步骤）
   * PUT /api/v1/user/info
   */
  async updateInfo(data: {
    city: string
    gender?: string | null
    intensity: string
    skill: string
    direction: string
    purpose: string
    schedule: string
    skill_other?: string
  }): Promise<ApiResponse<{ is_info_completed: boolean }>> {
    const demo = demoMode({ code: 0, message: 'success', data: { is_info_completed: true } })
    if (demo) return demo
    return http.put('/user/info', data) as Promise<ApiResponse<any>>
  },

  /**
   * 更新用户头像
   * PUT /api/v1/user/avatar
   */
  async updateAvatar(formData: FormData): Promise<ApiResponse<{ avatar: string }>> {
    const demo = demoMode({ code: 0, message: 'success', data: { avatar: 'https://cdn.solopilot.dev/avatars/demo.jpg' } })
    if (demo) return demo
    return http.put('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }) as Promise<ApiResponse<any>>
  }
}

// ============================================
// 信息采集模块 (Info Collect)
// ============================================
export const infoCollectService = {
  /**
   * 获取信息采集进度
   * GET /api/v1/info-collect/progress
   */
  async getProgress(): Promise<ApiResponse<{
    current_step: number
    total_steps: number
    completed: boolean
    answers: Record<string, { field: string; value: string }>
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        current_step: 1,
        total_steps: 7,
        completed: false,
        answers: {}
      }
    })
    if (demo) return demo
    return http.get('/info-collect/progress') as Promise<ApiResponse<any>>
  },

  /**
   * 保存单步采集答案
   * PUT /api/v1/info-collect/step
   */
  async saveStep(step: number, value: string): Promise<ApiResponse<{
    step: number
    saved: boolean
    next_step: number
    is_last_step: boolean
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        step,
        saved: true,
        next_step: step >= 7 ? 0 : step + 1,
        is_last_step: step >= 7
      }
    })
    if (demo) return demo
    return http.post('/info-collect/step', { step, value }) as Promise<ApiResponse<any>>
  },

  /**
   * 完成全部信息采集
   * POST /api/v1/info-collect/complete
   */
  async complete(): Promise<ApiResponse<{
    is_info_completed: boolean
    can_proceed_to_mbti: boolean
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        is_info_completed: true,
        can_proceed_to_mbti: true
      }
    })
    if (demo) return demo
    return http.post('/info-collect/complete') as Promise<ApiResponse<any>>
  }
}

// ============================================
// MBTI 测评模块 (MBTI)
// ============================================
export const mbtiService = {
  /**
   * 获取 MBTI 测评题目列表
   * GET /api/v1/mbti/questions
   */
  async getQuestions(part?: 1 | 2): Promise<ApiResponse<{
    total: number
    part1_count: number
    part2_count: number
    questions: Array<{
      id: number
      part: number
      question: string
      option_a: string
      option_b: string
      dimension: 'EI' | 'SN' | 'TF' | 'JP'
    }>
  }>> {
    const demo = demoMode({ code: 0, message: 'success', data: { total: 93, part1_count: 26, part2_count: 67, questions: [] } })
    if (demo) return demo
    return http.get('/mbti/questions', { params: part ? { part } : {} }) as Promise<ApiResponse<any>>
  },

  /**
   * 获取 MBTI 答题进度
   * GET /api/v1/mbti/progress
   */
  async getProgress(): Promise<ApiResponse<{
    total: number
    answered_count: number
    current_question: number
    is_completed: boolean
    answers: Record<string, 'A' | 'B'>
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        total: 93,
        answered_count: 0,
        current_question: 1,
        is_completed: false,
        answers: {}
      }
    })
    if (demo) return demo
    return http.get('/mbti/progress') as Promise<ApiResponse<any>>
  },

  /**
   * 保存单题答案
   * PUT /api/v1/mbti/answer
   */
  async saveAnswer(questionId: number, answer: 'A' | 'B'): Promise<ApiResponse<{
    question_id: number
    saved: boolean
    answered_count: number
    remaining: number
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        question_id: questionId,
        saved: true,
        answered_count: 1,
        remaining: 92
      }
    })
    if (demo) return demo
    return http.put('/mbti/answer', { question_id: questionId, answer }) as Promise<ApiResponse<any>>
  },

  /**
   * 提交全部答案并获取结果
   * POST /api/v1/mbti/submit
   */
  async submit(answers: Record<string, 'A' | 'B'>): Promise<ApiResponse<{
    mbti_type: string
    scores: Record<string, number>
    type_description: string
    entrepreneurship_analysis: {
      strengths: string[]
      blind_spots: string[]
      suitable_directions: string[]
    }
    completed_at: string
  }>> {
    const demo = demoMode({ code: 0, message: 'success', data: MOCK_MBTI_RESULT })
    if (demo) return demo
    return http.post('/mbti/submit', { answers }) as Promise<ApiResponse<any>>
  },

  /**
   * 获取 MBTI 测评结果（历史）
   * GET /api/v1/mbti/result
   */
  async getResult(): Promise<ApiResponse<{
    mbti_type: string
    scores: Record<string, number>
    type_description: string
    entrepreneurship_analysis: {
      strengths: string[]
      blind_spots: string[]
      suitable_directions: string[]
    }
    completed_at: string
  }>> {
    const demo = demoMode({ code: 0, message: 'success', data: MOCK_MBTI_RESULT })
    if (demo) return demo
    return http.get('/mbti/result') as Promise<ApiResponse<any>>
  },

  /**
   * 跳过 MBTI 测评，直接设置类型
   * POST /api/v1/mbti/skip
   */
  async skip(mbtiType: string): Promise<ApiResponse<{ mbti_type: string }>> {
    const demo = demoMode({ code: 0, message: 'success', data: { mbti_type: mbtiType.toUpperCase() } })
    if (demo) return demo
    return http.post('/mbti/skip', { mbti_type: mbtiType }) as Promise<ApiResponse<any>>
  }
}

// ============================================
// 分析模块 (Analysis)
// ============================================
export const analysisService = {
  /**
   * 触发个性化分析（异步任务）
   * POST /api/v1/analysis/trigger
   */
  async trigger(): Promise<ApiResponse<{
    task_id: string
    status: string
    estimated_time: number
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        task_id: 'demo-task-' + Date.now(),
        status: 'processing',
        estimated_time: 5
      }
    })
    if (demo) return demo
    return http.post('/analysis/trigger') as Promise<ApiResponse<any>>
  },

  /**
   * 查询分析任务状态
   * GET /api/v1/analysis/status
   */
  async getStatus(taskId?: string): Promise<ApiResponse<{
    task_id: string
    status: 'queued' | 'processing' | 'completed' | 'failed'
    progress: number
    result_url?: string
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        task_id: taskId || 'demo-task',
        status: 'completed' as const,
        progress: 100
      }
    })
    if (demo) return demo
    return http.get('/analysis/status', { params: taskId ? { task_id: taskId } : {} }) as Promise<ApiResponse<any>>
  },

  /**
   * 获取分析结果
   * GET /api/v1/analysis/result
   */
  async getResult(): Promise<ApiResponse<typeof MOCK_ANALYSIS_RESULT>> {
    const demo = demoMode({ code: 0, message: 'success', data: MOCK_ANALYSIS_RESULT })
    if (demo) return demo
    return http.get('/analysis/result') as Promise<ApiResponse<any>>
  }
}

// ============================================
// 反馈模块 (Feedback)
// ============================================
export const feedbackService = {
  /**
   * 提交用户反馈
   * POST /api/v1/feedback
   */
  async submit(data: {
    rating: number
    comment?: string
    direction_preference?: '是' | '否' | '不确定'
  }): Promise<ApiResponse<{
    feedback_id: number
    created_at: string
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        feedback_id: Date.now(),
        created_at: new Date().toISOString()
      }
    })
    if (demo) return demo
    return http.post('/feedback', data) as Promise<ApiResponse<any>>
  }
}

// ============================================
// AI 团队模块 (AI Team)
// ============================================
export const aiTeamService = {
  /**
   * 获取 AI 员工测评题目
   * GET /api/v1/ai-team/questions
   */
  async getQuestions(): Promise<ApiResponse<{
    total: number
    questions: Array<{
      id: number
      question: string
      option_a: string
      option_b: string
      tag_a: string
      tag_b: string
    }>
  }>> {
    const demo = demoMode({ code: 0, message: 'success', data: { total: 10, questions: [] } })
    if (demo) return demo
    return http.get('/ai-team/questions') as Promise<ApiResponse<any>>
  },

  /**
   * 提交 AI 测评答案
   * POST /api/v1/ai-team/submit
   */
  async submit(answers: Record<string, 'A' | 'B'>): Promise<ApiResponse<typeof MOCK_AI_TEAM_RESULT>> {
    const demo = demoMode({ code: 0, message: 'success', data: MOCK_AI_TEAM_RESULT })
    if (demo) return demo
    return http.post('/ai-team/submit', { answers }) as Promise<ApiResponse<any>>
  },

  /**
   * 获取 AI 团队推荐方案
   * GET /api/v1/ai-team/result
   */
  async getResult(): Promise<ApiResponse<typeof MOCK_AI_TEAM_RESULT>> {
    const demo = demoMode({ code: 0, message: 'success', data: MOCK_AI_TEAM_RESULT })
    if (demo) return demo
    return http.get('/ai-team/result') as Promise<ApiResponse<any>>
  },

  /**
   * 获取单个角色详情
   * GET /api/v1/ai-team/roles/:roleId
   */
  async getRoleDetail(roleId: string): Promise<ApiResponse<{
    id: string
    name: string
    category: string
    can_do: string[]
    cannot_do: string[]
    you_provide: string[]
    recommended_tools: string[]
    monthly_cost: string
    setup_guide?: string
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        id: roleId,
        name: '内容创作助手',
        category: '内容类',
        can_do: ['根据主题自动生成文案', '学习写作风格保持一致', '改写内容适配不同平台'],
        cannot_do: ['做战略判断', '保证内容绝对准确', '建立情感连接'],
        you_provide: ['10-20篇高质量文章', '品牌调性要求', '主题方向和大纲'],
        recommended_tools: ['Coze', 'Dify', 'ChatGPT Custom GPTs'],
        monthly_cost: '0-50 元'
      }
    })
    if (demo) return demo
    return http.get(`/ai-team/roles/${roleId}`) as Promise<ApiResponse<any>>
  }
}

// ============================================
// 合规模块 (Compliance)
// ============================================
export const complianceService = {
  /**
   * 获取合规指引内容
   * GET /api/v1/compliance/guides
   */
  async getGuides(category?: 'no_company' | 'register' | 'tax' | 'consumer_protection' | 'data_privacy' | 'marketing' | 'labor' | 'ip'): Promise<ApiResponse<{
    guides: Array<{
      category: string
      title: string
      sections: Array<{
        subtitle: string
        content: string
        legalBasis?: string
      }>
    }>
  }>> {
    // 过滤指定分类或返回全部
    const filteredGuides = category
      ? complianceGuides.filter((g: any) => g.category === category)
      : complianceGuides

    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        guides: filteredGuides
      }
    })
    if (demo) return demo
    return http.get('/compliance/guides', { params: category ? { category } : {} }) as Promise<ApiResponse<any>>
  },

  /**
   * 获取城市政策信息
   * GET /api/v1/compliance/city-policy
   */
  async getCityPolicy(cityLevel: string): Promise<ApiResponse<{
    city_level: string
    policies: Array<{
      title: string
      description: string
      source: string
      updated_at: string
    }>
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        city_level: cityLevel,
        policies: [
          {
            title: '个体工商户注册政策',
            description: `一线城市对个体工商户提供便捷注册服务，可在线办理，3个工作日内完成。`,
            source: '地方市场监管局',
            updated_at: '2026-01-15'
          },
          {
            title: '创业扶持补贴',
            description: `符合条件的一人公司可申请创业扶持补贴，最高可达10万元。`,
            source: '人力资源和社会保障局',
            updated_at: '2026-02-01'
          }
        ]
      }
    })
    if (demo) return demo
    return http.get('/compliance/city-policy', { params: { city_level: cityLevel } }) as Promise<ApiResponse<any>>
  }
}

// ============================================
// 复盘模块 (Review)
// ============================================
export const reviewService = {
  /**
   * 创建复盘记录
   * POST /api/v1/review
   */
  async create(data: {
    cycle: 'weekly' | 'monthly' | 'quarterly'
    period_label: string
    revenue?: string
    traffic?: string
    customers?: string
    efficiency?: string
    next_goal?: string
    notes?: string
  }): Promise<ApiResponse<{
    review_id: number
    created_at: string
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        review_id: Date.now(),
        created_at: new Date().toISOString()
      }
    })
    if (demo) return demo
    return http.post('/review', data) as Promise<ApiResponse<any>>
  },

  /**
   * 获取复盘记录列表
   * GET /api/v1/review/list
   */
  async getList(params?: {
    cycle?: 'weekly' | 'monthly' | 'quarterly'
    page?: number
    page_size?: number
  }): Promise<ApiResponse<{
    total: number
    page: number
    page_size: number
    reviews: Array<{
      id: number
      cycle: string
      period_label: string
      revenue?: string
      traffic?: string
      customers?: string
      efficiency?: string
      next_goal?: string
      created_at: string
      updated_at: string
    }>
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        total: 0,
        page: 1,
        page_size: 10,
        reviews: []
      }
    })
    if (demo) return demo
    return http.get('/review/list', { params }) as Promise<ApiResponse<any>>
  },

  /**
   * 获取单条复盘详情
   * GET /api/v1/review/:id
   */
  async getDetail(id: number): Promise<ApiResponse<{
    id: number
    cycle: string
    period_label: string
    revenue?: string
    traffic?: string
    customers?: string
    efficiency?: string
    next_goal?: string
    notes?: string
    created_at: string
    updated_at: string
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        id,
        cycle: 'weekly',
        period_label: '2026年4月第3周',
        revenue: '500 元',
        traffic: '1200 UV',
        customers: '3',
        efficiency: '用AI助手后，内容产出效率提升了一倍',
        next_goal: '下周发布 5 篇内容，争取新增 200 粉丝',
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })
    if (demo) return demo
    return http.get(`/review/${id}`) as Promise<ApiResponse<any>>
  },

  /**
   * 更新复盘记录
   * PUT /api/v1/review/:id
   */
  async update(id: number, data: Partial<{
    cycle: 'weekly' | 'monthly' | 'quarterly'
    period_label: string
    revenue: string
    traffic: string
    customers: string
    efficiency: string
    next_goal: string
    notes: string
  }>): Promise<ApiResponse<{
    review_id: number
    updated_at: string
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        review_id: id,
        updated_at: new Date().toISOString()
      }
    })
    if (demo) return demo
    return http.put(`/review/${id}`, data) as Promise<ApiResponse<any>>
  }
}

// ============================================
// 系统模块 (System)
// ============================================
export const systemService = {
  /**
   * 获取前端系统配置
   * GET /api/v1/system/config
   */
  async getConfig(): Promise<ApiResponse<{
    review_enabled: boolean
    city_policy_enabled: boolean
    mbti_fast_mode_available: boolean
    mbti_total_questions: number
    mbti_fast_mode_questions: number
    info_collect_steps: number
    ai_team_questions: number
    app_version: string
    maintenance_mode: boolean
  }>> {
    const demo = demoMode({
      code: 0,
      message: 'success',
      data: {
        review_enabled: true,
        city_policy_enabled: false,
        mbti_fast_mode_available: true,
        mbti_total_questions: 93,
        mbti_fast_mode_questions: 30,
        info_collect_steps: 7,
        ai_team_questions: 10,
        app_version: '1.0.0',
        maintenance_mode: false
      }
    })
    if (demo) return demo
    return http.get('/system/config') as Promise<ApiResponse<any>>
  }
}
