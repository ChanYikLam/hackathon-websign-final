# SoloPilot 前端软件架构文档

## 文档信息

| 字段 | 内容 |
|------|------|
| 产品名称 | SoloPilot -- AI 驱动的一人公司创业规划助手 |
| 文档版本 | v1.0 |
| 创建日期 | 2026-04-18 |
| 关联文档 | SoloPilot-PRD.md、SoloPilot-WebDesign.md |
| 文档定位 | 前端工程架构、模块划分、数据流设计、技术选型及决策记录 |

---

## 1. 架构总览

### 1.1 系统定位

SoloPilot 是一个面向"有意向或正在运营一人公司"的用户的 AI 驱动规划助手平台。前端承载全部用户交互流程：从登录认证、信息采集、性格测评，到结果展示和后续服务。核心特征是**多步表单串联 + AI 后端驱动 + 单页面应用**。

### 1.2 架构风格决策

| 备选方案 | 优势 | 劣势 | 结论 |
|----------|------|------|------|
| SPA（单页应用） | 流畅的页面切换、对话式体验连贯、状态管理统一 | 首次加载较大、SEO 弱 | **采用** -- 产品以注册后交互为主，SEO 不是核心诉求 |
| MPA（多页应用） | SEO 友好、首屏加载快 | 页面切换需刷新、多步表单状态难以保持 | 不采用 |
| SSR（服务端渲染） | SEO + SPA 兼顾 | 架构复杂度高、需要 Node 运行时 | 不采用 -- 黑客松 48 小时约束下过度工程 |

### 1.3 架构约束

| 约束 | 说明 |
|------|------|
| 开发周期 | 黑客松 48 小时，P0 功能必须交付 |
| 团队规模 | 小型学生团队，技术栈需低学习成本 |
| 运行环境 | 移动端优先，最低 375px，需响应式支持 Desktop/Tablet/Mobile |
| 后端对接 | AI 分析逻辑由后端 LLM API 承载，前端负责数据采集和结果渲染 |
| 严格禁止 | 紫色/靛蓝色系、Tailwind 默认色板、Shadcn/Material UI 默认组件、emoji |

---

## 2. 技术选型与决策记录

### 2.1 核心技术栈

| 层面 | 选型 | 版本 | 选择理由 |
|------|------|------|----------|
| 框架 | Vue 3 | ^3.4 | PRD 指定；Composition API 适合多步表单的状态管理；学生团队上手快 |
| 构建工具 | Vite | ^5.x | 开箱即用、HMR 极快、Vue 官方推荐 |
| 状态管理 | Pinia | ^2.x | Vue 3 官方状态管理；TypeScript 原生支持；DevTools 集成好 |
| 路由 | Vue Router 4 | ^4.x | 嵌套路由支持对话式多步流程；路由守卫实现登录鉴权 |
| CSS 方案 | SCSS + CSS Variables | -- | Design Token 以 CSS 变量形式注入；SCSS 提供嵌套和混入；不使用 Tailwind（AGENTS.md 禁止默认色板） |
| HTTP 客户端 | Axios | ^1.x | 拦截器统一处理鉴权和错误；请求/响应拦截 |
| 图标 | Iconify Vue | ^4.x | AGENTS.md 指定图标库；按需加载，图标体积极小 |

### 2.2 ADR-001：状态管理选型 Pinia 而非 Vuex

| 字段 | 内容 |
|------|------|
| 状态 | 已接受 |
| 上下文 | SoloPilot 存在大量跨步骤的状态共享：用户信息采集（7 步）、MBTI 测评（93 题）、结果展示均需访问同一份数据 |
| 决策 | 使用 Pinia 而非 Vuex |
| 理由 | Pinia 的 Composition API 风格更契合 Vue 3；无需 mutations，代码量少约 30%；天然支持 TypeScript 类型推导；Vue DevTools 原生集成 |

### 2.3 ADR-002：CSS 方案不使用 Tailwind

| 字段 | 内容 |
|------|------|
| 状态 | 已接受 |
| 上下文 | AGENTS.md 明确禁止 Tailwind 默认色板，要求自定义设计系统 |
| 决策 | 使用 SCSS + CSS Variables 实现 Design Token 系统 |
| 理由 | WebDesign 文档定义了完整的 Design Token（间距、字体、颜色、阴影、z-index），以 CSS 变量形式注入更可控；避免 Tailwind 工具类导致 HTML 语义混乱；自定义样式对视觉一致性更有保障 |

### 2.4 ADR-003：测试通道与免登录 Demo 模式

| 字段 | 内容 |
|------|------|
| 状态 | 已接受 |
| 上下文 | 黑客松演示场景需要快速展示完整流程；评委/观众可能没有注册账号；开发调试需要快速验证全链路 |
| 决策 | 提供开发者测试码（8888）入口，输入后激活 Demo 模式，跳过登录直接进入核心流程；数据仅存 localStorage，使用内置 mock 数据 |
| 理由 | 降低演示门槛 -- 任何人输入一个码即可体验全部功能；前后端解耦 -- Demo 模式不依赖后端可用性，离线也能演示；开发效率 -- 前端可独立联调 UI 流程，无需等后端 API 就绪 |
| 后果 | 需要维护 mock 数据集（需与真实 API 数据结构保持同步）；Demo 用户数据不可持久化（刷新后可能丢失）；需在结果页明确标注"演示数据"避免误导 |

### 2.5 ADR-004：数据持久化策略 -- localStorage + 服务端双写

| 字段 | 内容 |
|------|------|
| 状态 | 已接受 |
| 上下文 | MBTI 93 题测评可能中断；信息采集 7 步需要支持恢复 |
| 决策 | 表单数据实时写入 localStorage，登录后同步至服务端 |
| 理由 | 离线恢复零延迟；服务端存储保证跨设备一致性；localStorage 作为缓存层降低网络请求频率 |

---

## 3. 目录结构设计

```
solopilot-frontend/
|-- public/
|   |-- favicon.svg                    # 站点图标
|   +-- fonts/                         # 自定义字体文件（如有）
|
|-- src/
|   |-- assets/                        # 静态资源
|   |   |-- images/                    # 插图、占位图
|   |   +-- icons/                     # 本地 SVG 图标（Iconify 未覆盖的）
|   |
|   |-- styles/                        # 全局样式与 Design Token
|   |   |-- tokens/
|   |   |   |-- _colors.scss           # 颜色语义变量
|   |   |   |-- _spacing.scss          # 间距尺度变量
|   |   |   |-- _typography.scss       # 字体系统变量
|   |   |   |-- _shadows.scss          # 阴影层级变量
|   |   |   |-- _z-index.scss          # z-index 层级变量
|   |   |   +-- _radius.scss           # 圆角变量
|   |   |-- base/
|   |   |   |-- reset.scss             # CSS Reset
|   |   |   +-- global.scss            # 全局基础样式（body、a、img 等）
|   |   |-- mixins/
|   |   |   |-- responsive.scss        # 响应式断点混入
|   |   |   +-- animation.scss         # 动效混入（尊重 prefers-reduced-motion）
|   |   +-- index.scss                 # 样式入口（按顺序导入所有 Token 和 Base）
|   |
|   |-- components/                    # 全局可复用组件
|   |   |-- ui/                        # 基础 UI 组件
|   |   |   |-- SpButton.vue           # 按钮（6 状态状态机）
|   |   |   |-- SpCard.vue             # 卡片容器
|   |   |   |-- SpProgressBar.vue      # 进度条（信息采集 + MBTI 共用）
|   |   |   |-- SpInput.vue            # 文本输入框
|   |   |   |-- SpToast.vue            # 全局消息提示
|   |   |   |-- SpModal.vue            # 模态框
|   |   |   |-- SpRating.vue           # 评分星级组件
|   |   |   +-- SpSkeleton.vue         # 骨架屏占位
|   |   |-- layout/                    # 布局组件
|   |   |   |-- AppHeader.vue          # 顶部导航栏（Desktop/Tablet）
|   |   |   |-- AppTabBar.vue          # 底部 Tab 栏（Mobile）
|   |   |   +-- AppShell.vue           # 应用外壳（根据断点切换导航模式）
|   |   +-- business/                  # 业务组件
|   |       |-- ChatBubble.vue         # 对话气泡（AI 助手 + 用户回答）
|   |       |-- OptionCard.vue         # 选项卡片（信息采集步骤）
|   |       |-- DirectionCard.vue      # 方向推荐卡片
|   |       |-- ProfileTag.vue         # 用户画像标签
|   |       +-- MatchProgress.vue      # 匹配度进度条（动画）
|   |
|   |-- views/                         # 页面级组件（对应 SCR 界面 ID）
|   |   |-- HomeView.vue               # SCR-00: 公共首页（含介绍 + 测试通道入口）
|   |   |-- LoginView.vue              # SCR-01: 登录页（二级页面，含测试码入口）
|   |   |-- IntroView.vue              # SCR-02: 一人公司详细介绍
|   |   |-- InfoCollectView.vue        # SCR-03: 个人信息采集
|   |   |-- MbtiTestView.vue           # SCR-04: MBTI 测评
|   |   |-- AnalysisLoadingView.vue    # SCR-05: 分析加载中
|   |   |-- ResultView.vue             # SCR-06/07/08: 结果展示（画像+推荐+总结）
|   |   |-- FeedbackView.vue           # SCR-09: 反馈页
|   |   |-- ComplianceView.vue         # SCR-10: 合规指引
|   |   |-- AiTeamView.vue             # SCR-11: AI 员工配置
|   |   +-- ReviewView.vue             # SCR-12: 长期复盘
|   |
|   |-- stores/                        # Pinia 状态仓库
|   |   |-- auth.ts                    # 用户认证状态（token、用户信息）
|   |   |-- infoCollect.ts             # 个人信息采集数据（7 步）
|   |   |-- mbti.ts                    # MBTI 测评状态（当前题号、答案记录、进度）
|   |   |-- result.ts                  # 分析结果数据（画像、推荐、方案）
|   |   |-- aiTeam.ts                  # AI 员工测评状态
|   |   +-- app.ts                     # 全局应用状态（导航、Toast 队列、网络状态）
|   |
|   |-- composables/                   # 可复用组合式函数
|   |   |-- useLocalStorage.ts         # localStorage 持久化 Hook
|   |   |-- useCountdown.ts            # 倒计时 Hook（验证码、防抖）
|   |   |-- useBreakpoint.ts           # 响应式断点检测 Hook
|   |   |-- useAnimation.ts            # 动效控制（尊重 prefers-reduced-motion）
|   |   |-- useStepper.ts              # 多步表单控制器（前进/后退/进度计算）
|   |   +-- useDemoMode.ts             # Demo 模式管理（激活/退出/状态判断）
|   |
|   |-- services/                      # API 服务层
|   |   |-- auth.ts                    # 登录、验证码、鉴权刷新
|   |   |-- user.ts                    # 用户信息 CRUD
|   |   |-- mbti.ts                    # MBTI 答案提交、结果获取
|   |   |-- analysis.ts                # 触发分析、获取结果
|   |   |-- feedback.ts                # 反馈提交
|   |   |-- mockData.ts                # Demo 模式模拟数据集（全流程覆盖）
|   |   +-- http.ts                    # Axios 实例（拦截器配置 + Demo 模式短路）
|   |
|   |-- router/                        # 路由配置
|   |   |-- index.ts                   # 路由实例 + 全局守卫
|   |   +-- routes.ts                  # 路由表定义
|   |
|   |-- types/                         # TypeScript 类型定义
|   |   |-- user.ts                    # 用户相关类型
|   |   |-- mbti.ts                    # MBTI 题目、答案、结果类型
|   |   |-- analysis.ts                # 画像、推荐、方案类型
|   |   +-- api.ts                     # API 请求/响应通用类型
|   |
|   |-- utils/                         # 工具函数
|   |   |-- storage.ts                 # localStorage 封装
|   |   |-- format.ts                  # 格式化工具
|   |   +-- validate.ts                # 校验工具（手机号、验证码等）
|   |
|   |-- App.vue                        # 根组件
|   +-- main.ts                        # 应用入口
|
|-- index.html                         # HTML 入口
|-- vite.config.ts                     # Vite 配置
|-- tsconfig.json                      # TypeScript 配置
|-- package.json                       # 依赖声明
+-- env.d.ts                           # 环境变量类型声明
```

### 3.1 目录设计原则

| 原则 | 说明 |
|------|------|
| 按角色分层 | `views`（页面）、`components`（组件）、`stores`（状态）、`services`（接口）职责清晰 |
| 业务组件独立 | `components/business/` 存放与 SoloPilot 业务强绑定的组件，与 `ui/` 基础组件分离 |
| 组合式函数提取复用逻辑 | 倒计时、localStorage、断点检测等横切关注点统一收口到 `composables/` |
| 样式 Token 化 | 所有设计变量集中管理在 `styles/tokens/`，组件只引用变量名不写死数值 |

---

## 4. 路由与页面流设计

### 4.1 路由表

| 路由路径 | 页面组件 | 界面 ID | 鉴权要求 | 说明 |
|----------|----------|---------|----------|------|
| `/` | HomeView | SCR-00 | 否 | 公共首页（含产品介绍 + CTA 入口） |
| `/login` | LoginView | SCR-01 | 否 | 登录页（二级入口，从首页或导航进入） |
| `/intro` | IntroView | SCR-02 | 是 | 一人公司详细介绍页（可选深度阅读） |
| `/info-collect` | InfoCollectView | SCR-03 | 是* | 个人信息采集（7 步对话式），测试码免登可访问 |
| `/info-collect/:step` | InfoCollectView | SCR-03 | 是* | 步骤参数化，支持直接跳转到某步 |
| `/mbti-test` | MbtiTestView | SCR-04 | 是* | MBTI 测评（93 题），测试码免登可访问 |
| `/mbti-test/:question` | MbtiTestView | SCR-04 | 是* | 题号参数化，支持断点恢复 |
| `/analyzing` | AnalysisLoadingView | SCR-05 | 是* | 分析加载过渡页 |
| `/result` | ResultView | SCR-06/07/08 | 是* | 结果展示（画像+推荐+总结三合一长页面） |
| `/result#profile` | ResultView | SCR-06 | 是* | 锚点跳转至画像区块 |
| `/result#direction` | ResultView | SCR-07 | 是* | 锚点跳转至方向推荐区块 |
| `/result#summary` | ResultView | SCR-08 | 是* | 锚点跳转至总结方案区块 |
| `/feedback` | FeedbackView | SCR-09 | 是 | 用户反馈 |
| `/compliance` | ComplianceView | SCR-10 | 是 | 合规指引 |
| `/ai-team` | AiTeamView | SCR-11 | 是 | AI 员工配置 |
| `/review` | ReviewView | SCR-12 | 是 | 长期复盘 |

> * 标注"是*"的页面：正常用户需登录后访问；通过开发者测试码 8888 进入的用户可直接访问（demo 模式）。

### 4.2 路由守卫与测试通道逻辑

```
全局前置守卫 (beforeEach)
  |
  +-- 目标路由需要鉴权?
  |     |
  |     +-- 是 -> 检查 auth store 是否已认证
  |     |           |
  |     |           +-- 已登录 (token 存在) -> 放行
  |     |           +-- Demo 模式 (isDemoMode = true) -> 放行
  |     |           +-- 未认证 -> 重定向至 /login
  |     |
  |     +-- 否 -> 放行（公共页面：/ 和 /login）
  |
  +-- 目标是 /result 或 /feedback?
        |
        +-- 是 -> 检查 result store 是否有数据
                  |
                  +-- 无数据 -> 重定向至 /info-collect（引导完成测评）
                  +-- 有数据 -> 放行

---

测试通道逻辑 (Demo 模式):
  |
  +-- 触发方式:
  |     方式 A: /login 页面输入开发者码 "8888" 并确认
  |     方式 B: URL 参数 ?demo=8888 直接激活
  |
  +-- 验证通过后:
  |     1. auth.store.isDemoMode = true
  |     2. auth.store.user = { id: 'demo-user', nickname: 'Demo 用户', avatar: null }
  |     3. localStorage 标记 demo_mode = 'active'
  |     4. 跳转至 /info-collect（免登录直接进入核心流程）
  |
  +-- Demo 模式特征:
        - 数据仅存于 localStorage，不提交到服务端
        - 结果展示页标注"演示数据，非真实分析"
        - 可随时退出 demo 模式（清除标记，跳转首页）
        - API 请求携带 X-Demo-Mode: true 头（后端可选识别）
```

### 4.3 核心用户流程

```
/ (公共首页 / HomeView)
  |
  +-- [方式 A: 正常用户]
  |     |
  |     +-- 点击"登录使用" -> /login ----(认证成功)----> /info-collect
  |     |
  +-- [方式 B: 测试通道]
  |     |
  |     +-- 输入开发者码 8888 -> Demo 模式激活 -> /info-collect
  |     |       (免登录，数据仅存本地)
  |     |
  +-- [方式 C: 浏览介绍]
        |
        +-- 阅读首页内容后点击"了解更多" -> /intro

/info-collect/1
  |
  (对话式引导 7 步)
  |
  /info-collect/7 ----(完成)----> /mbti-test/1
                                  |
                            (93 题问卷，支持中断)
                                  |
                          /mbti-test/93 --(完成)--> /analyzing
                                                          |
                                                    (至少 3s 加载动画)
                                                          |
                                                      /result
                                                          |
                                                      /feedback
                                                          |
                                                      /compliance
                                                          |
                                                      /ai-team
```

---

## 5. 状态管理架构

### 5.1 Store 清单与职责

| Store | 核心数据 | 持久化 | 跨页面共享 |
|-------|----------|--------|------------|
| `auth` | `token`、`user`（id、nickname、avatar）、`isDemoMode`（布尔值）、`demoCodeVerified`（是否已验证开发者码） | localStorage（含 demo_mode 标记） | 全局 |
| `infoCollect` | `currentStep`、`answers`（7 个字段的值）、`isCompleted` | localStorage | InfoCollect -> Result |
| `mbti` | `currentQuestion`、`answers`（题号->选项映射）、`isCompleted`、`result`（MBTI 类型） | localStorage | MbtiTest -> Result |
| `result` | `profile`（画像标签）、`directions`（推荐方向列表）、`type`（四型分类）、`summary`（总结方案） | --（服务端获取） | Result -> Feedback |
| `aiTeam` | `answers`（10 题答案）、`planType`（方案类型 A-F）、`roles`（推荐角色列表） | localStorage | AiTeam 独立使用 |
| `app` | `isOnline`、`toasts`（消息队列）、`isLoading` | -- | 全局 |

### 5.2 Auth Store 测试通道逻辑

```
auth store Demo 模式状态机:
  |
  +-- 初始态: isDemoMode = false, token = null
  |
  +-- activateDemo(code: string) 动作:
  |     |
  |     +-- code === '8888' ?
  |           |
  |           +-- 是 -> isDemoMode = true
  |           |        user = { id: 'demo-user', nickname: 'Demo 用户', avatar: null }
  |           |        localStorage.setItem('demo_mode', 'active')
  |           |        返回 { success: true }
  |           |
  |           +-- 否 -> 返回 { success: false, error: '无效的开发者码' }
  |
  +-- deactivateDemo() 动作:
  |     isDemoMode = false
  |     user = null
  |     localStorage.removeItem('demo_mode')
  |
  +-- 应用初始化时:
        从 localStorage 读取 demo_mode 标记
        若存在且为 'active'，自动恢复 isDemoMode = true
```

### 5.4 数据流向图

```
[用户交互]                    [Pinia Store]                    [后端 API]
    |                              |                               |
    |-- 正常登录 --> auth.save()  ----> POST /auth/login ---------->|
    |                              |<----- { token, user } --------|
    |                                                              |
    |-- 测试码 8888 -> auth.activateDemo()                          |
    |   (本地激活，不请求后端)                                       |
    |                                                              |
    |-- 填写信息 --> infoCollect.setStepAnswer()
    |     (Demo 模式下仅存 localStorage)                            |
    |                                                              |
    |-- 完成信息采集 (非 Demo)-->                                   |
    |   POST /user/info ------->|--------------------------------->|
    |                              |<----- 200 OK -----------------|
    |                                                              |
    |-- MBTI 答题 --> mbti.setAnswer()                             |
    |                                                              |
    |-- 完成测评 (非 Demo)-->                                      |
    |   POST /mbti/submit ----->|--------------------------------->|
    |                              |<----- { mbtiType, scores } ---|
    |                                                              |
    |-- 触发分析 (非 Demo)-->                                      |
    |   POST /analysis --------->|--------------------------------->|
    |                              |<----- { profile, directions,  |
    |                              |         type, summary }        |
    |   result.setData()  <-------|                               |
    |                                                              |
    |-- Demo 模式结果:                                              |
    |   使用 mock 数据填充 result store（前端内置模拟数据集）          |
    |   不调用后端 API                                              |
    |                                                              |
    |-- 查看结果 <-- result.profile / result.directions            |
    |                                                              |
    |-- 提交反馈 (非 Demo) -->                                      |
    |   POST /feedback --------->|---------------------------------|
    |                              |<----- 201 Created ------------|
    |                                                              |
    |-- AI 测评 (非 Demo) --> aiTeam.setAnswer()                   |
    |   POST /ai-team/submit --->|------------------------------->|
    |                              |<----- { planType, roles } -----|
```

### 5.5 Store 间依赖关系

```
auth (独立，含 Demo 模式)
  |
  +-- Demo 模式下: result 可直接使用 mock 数据（不依赖后端）
  +-- 正常模式: result 依赖 auth（需要 user.id 请求分析结果）
  +-- infoCollect 依赖 auth（提交信息需要 user.id）

mbti (独立)
  |
  +-- result 依赖 mbti（提交测评触发分析；Demo 模式用 mock 替代）

infoCollect 与 mbti 无直接依赖，但 result 同时依赖两者。

result 是数据汇聚点:
  - 正常模式: infoCollect + mbti 数据的后端计算产物
  - Demo 模式: 前端内置的模拟数据集（展示完整流程体验）
```

---

## 6. 组件架构

### 6.1 组件层级树

```
App.vue
  +-- AppShell.vue
      |
      +-- AppHeader.vue (Desktop/Tablet 可见)
      |     +-- Logo
      |     +-- NavLinks (5 个一级导航)
      |
      +-- <router-view /> (页面内容)
      |     |
      |     +-- HomeView.vue (公共首页)
      |     |     +-- HeroSection (品牌宣言 + CTA 按钮 x2: 登录使用 / 测试通道)
      |     |     +-- FeatureSection (3 个核心卖点卡片，不对称布局)
      |     |     +-- IntroPreview (一人公司简介摘要)
      |     |     +-- DemoEntryCard (开发者码入口: 输入框 + 确认按钮)
      |     |     +-- CTASection ("立即开始" / "了解更多")
      |     |
      |     +-- LoginView.vue (二级登录页)
      |     |     +-- SpInput (手机号)
      |     |     +-- SpInput (验证码)
      |     |     +-- SpButton (登录)
      |     |     +-- DividerOr ("或"分隔线)
      |     |     +-- DemoCodeEntry (开发者码输入框 + 提示文案 "输入 8888 免登录体验")
      |     |
      |     +-- IntroView.vue
      |     |     +-- IntroSection (循环 4 个详细介绍模块)
      |     |     +-- CTASection
      |     |
      |     +-- InfoCollectView.vue
      |     |     +-- SpProgressBar
      |     |     +-- ChatBubble (AI 助手问题)
      |     |     +-- OptionCard (选项卡片网格)
      |     |     +-- ChatBubble (用户已选回答)
      |     |     +-- SpInput (开放文本输入)
      |     |
      |     +-- MbtiTestView.vue
      |     |     +-- SpProgressBar
      |     |     +-- QuestionCard (题目 + A/B 选项)
      |     |
      |     +-- AnalysisLoadingView.vue
      |     |     +-- LoadingAnimation (Logo 脉冲)
      |     |     +-- SpProgressBar (模拟进度)
      |     |
      |     +-- ResultView.vue
      |     |     +-- ProfileSection
      |     |     |     +-- ProfileTag (x4)
      |     |     +-- DirectionSection
      |     |     |     +-- DirectionCard (x2-3)
      |     |     |           +-- MatchProgress
      |     |     +-- TypeSection (四型分类)
      |     |     +-- SummarySection
      |     |           +-- ActionChecklist
      |     |
      |     +-- FeedbackView.vue
      |     |     +-- SpRating
      |     |     +-- SpInput (文本域)
      |     |     +-- SpButton (提交)
      |     |
      |     +-- ComplianceView.vue
      |     |     +-- TabNav (合规/复盘切换)
      |     |     +-- ComplianceTab
      |     |     +-- ReviewTab
      |     |           +-- SpInput (复盘表单)
      |     |
      |     +-- AiTeamView.vue
      |           +-- SpButton (开始测评)
      |           +-- PlanCard (x6 方案卡片)
      |           +-- RoleCard (推荐角色详情)
      |           +-- StepGuide (搭建五步法)
      |
      +-- AppTabBar.vue (Mobile 可见)
      +-- SpToast (全局浮动)
      +-- SpModal (全局浮动)
```

### 6.2 核心组件 Props/Emit 接口定义

#### SpButton

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | 视觉变体 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `loading` | `boolean` | `false` | 加载状态（内嵌 spinner） |
| `disabled` | `boolean` | `false` | 禁用状态 |

| Emit | 参数 | 说明 |
|------|------|------|
| `click` | `MouseEvent` | 点击事件（disabled/loading 时阻止） |

#### ChatBubble

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `role` | `'ai' \| 'user'` | `'ai'` | 气泡角色（决定位置和颜色） |
| `content` | `string` | -- | 气泡文本内容 |

#### OptionCard

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `label` | `string` | -- | 选项文本 |
| `selected` | `boolean` | `false` | 是否选中 |
| `icon` | `string` | -- | Iconify 图标名 |

| Emit | 参数 | 说明 |
|------|------|------|
| `select` | 无 | 点击选中 |

#### SpProgressBar

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `current` | `number` | -- | 当前进度值 |
| `total` | `number` | -- | 总量 |
| `animated` | `boolean` | `true` | 是否启用过渡动画 |

#### DirectionCard

| Prop | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 方向名称 |
| `matchRate` | `number` | 匹配度百分比（0-100） |
| `reason` | `string` | 匹配理由 |
| `incomeRange` | `string` | 预期收入范围 |
| `expanded` | `boolean` | 是否展开详情 |

| Emit | 参数 | 说明 |
|------|------|------|
| `toggle` | 无 | 展开/收起详情 |

---

## 7. 关键业务逻辑设计

### 7.1 对话式信息采集流程

InfoCollectView 采用"单步展示 + 状态驱动"的模式，通过 `useStepper` 组合函数控制。

```
useStepper 逻辑:
  - state: currentStep (1-7)
  - getters: progress (百分比), isFirst, isLast
  - actions: next(), prev(), setAnswer(field, value), skip()
  - 每次调用 next() 时：
    1. 校验当前步骤是否已填写（Step 2 性别可跳过）
    2. 触发 CSS 过渡动画（当前气泡淡出 + 新气泡淡入）
    3. 更新 currentStep
    4. 自动保存到 localStorage
  - 最后一步 next() 触发跳转至 /mbti-test
```

**步骤配置表**（数据驱动，写在 store 或独立配置文件中）：

```typescript
interface StepConfig {
  id: number
  field: string           // 对应 infoCollect store 中的字段名
  question: string        // AI 助手气泡的文案
  type: 'single' | 'text' // 选项类型：单选 或 文本输入
  options?: string[]      // 选项数组（type=single 时必填）
  placeholder?: string    // 文本输入占位符（type=text 时可选）
  skippable: boolean      // 是否可跳过
  quickTags?: string[]    // 快捷标签（Step 6 用）
}
```

### 7.2 MBTI 测评流程

```
MbtiTestView 状态机:
  - 状态: currentQuestion (1-93), answers: Map<number, 'A'|'B'>
  - 用户点击 A/B 选项:
    1. 记录 answers[question] = 'A'|'B'
    2. 300ms 防抖动画
    3. currentQuestion++
    4. 保存至 localStorage
    5. 第 27 题切换时触发"第二部分"提示动画
    6. 第 93 题完成后跳转 /analyzing

  - 计分逻辑（前端本地计算，后端二次验证）:
    E/I: 统计 21 道题中 E 的得分
    S/N: 统计词义偏好题中 S 的得分
    T/F: 统计词义偏好题中 T 的得分
    J/P: 统计词义偏好题中 J 的得分

  - 断点恢复:
    用户重新进入 /mbti-test 时，从 localStorage 读取 answers
    跳转到最后一道已答题 + 1
    如果全部完成，直接跳转 /result
```

### 7.3 分析加载过渡

```
AnalysisLoadingView 逻辑:
  - 正常模式:
    进入页面时立即调用 POST /analysis（携带 infoCollect + mbti 数据）
    前端动画独立于后端请求，最少展示 3 秒，最多 8 秒
  - Demo 模式:
    不调用后端 API，直接从 mockData.ts 加载模拟结果
    延迟 200ms 后设置 result store 数据
    动画照常播放（保持体验一致性），最少 3 秒
  - 动画阶段:
    0-30%:  "正在分析你的性格特征..."     (约 1s)
    30-60%: "正在匹配适合你的行业方向..."  (约 1s)
    60-90%: "正在生成个性化创业方案..."   (约 1s)
    90-100%:"马上就好..."                (约 0.5s)
  - 使用 setInterval 模拟进度推进
  - 后端请求完成后:
    - 如果动画已结束 -> 立即跳转 /result
    - 如果动画未结束 -> 等待动画结束再跳转
  - 请求失败 -> 展示错误提示 + "重新分析" 按钮
```

### 7.4 结果展示页（三合一长页面）

```
ResultView 结构:
  - 使用 <section> + id 实现页内锚点
  - Demo 模式标识:
    页面顶部显示"演示数据"标签（仅在 isDemoMode = true 时可见）
    标注说明: "当前展示为模拟数据，用于体验完整流程"
  - 画像区块 (#profile):
    正常模式: 从 result.store 读取 profile.tags[] 渲染 ProfileTag
    Demo 模式: 从 mockData.mockProfile 获取数据
  - 方向推荐区块 (#direction):
    遍历 result.directions[] (或 mock) 渲染 DirectionCard
    默认收起，点击展开详情（案例、启动建议）
  - 四型分类区块 (#type):
    显示 result.type（保守型/平衡型/激进型）
    对应策略文案从 result.typeAdvice 获取
  - 总结方案区块 (#summary):
    结构化表格展示（画像/方向/策略/城市/行动清单/时间线）
    行动清单使用可勾选 checkbox
  - 导航联动:
    Desktop 端侧边浮动目录，点击滚动至对应区块
    IntersectionObserver 监听滚动，高亮当前区块
```

---

## 8. API 服务层设计

### 8.1 HTTP 实例配置

```
services/http.ts:
  - 基础 URL: import.meta.env.VITE_API_BASE_URL
  - 请求拦截器:
    自动注入 Authorization: Bearer <token>
    添加 X-Request-Id（用于错误追踪）
    Demo 模式下添加 X-Demo-Mode: true（后端可选识别）
    **Demo 模式短路**: 若 auth.isDemoMode === true，直接返回 mock 数据，不发实际请求
  - 响应拦截器:
    2xx -> 返回 response.data
    401 -> 清除 token，重定向至 /login，Toast 提示"登录已过期"
    429 -> Toast 提示"请求过于频繁，请稍后再试"
    5xx -> Toast 提示"服务异常，请稍后重试"，提供重试按钮
    网络断开 -> app.store.isOnline = false，顶部黄色横幅提示

services/mockData.ts (Demo 模式专用):
  - 包含完整流程的预置模拟数据:
    - mockProfile / mockDirections / mockType / mockSummary (结果页数据)
    - mockMbtiResult (MBTI 测评结果)
  - 通过 http.ts 拦截器按 API 路径匹配返回对应 mock
  - 延迟 200ms 模拟网络耗时，保持真实体验感
```

### 8.2 API 接口清单

| 模块 | 方法 | 路径 | 说明 | 请求体 | 响应体 |
|------|------|------|------|--------|--------|
| 认证 | POST | `/auth/send-code` | 发送验证码 | `{ phone }` | `{ message }` |
| 认证 | POST | `/auth/login` | 手机号登录 | `{ phone, code }` | `{ token, user }` |
| 用户 | PUT | `/user/info` | 提交个人信息 | `{ city, gender, intensity, skill, direction, purpose, schedule }` | `{ success }` |
| MBTI | POST | `/mbti/submit` | 提交测评答案 | `{ answers: Record<number, 'A'\|'B'> }` | `{ mbtiType, scores }` |
| 分析 | POST | `/analysis` | 触发个性化分析 | `{ userId }` | `{ profile, directions, type, summary }` |
| 反馈 | POST | `/feedback` | 提交用户反馈 | `{ rating, comment }` | `{ success }` |
| AI团队 | POST | `/ai-team/submit` | 提交 AI 测评 | `{ answers: Record<number, 'A'\|'B'> }` | `{ planType, roles }` |
| 复盘 | POST | `/review` | 保存复盘记录 | `{ cycle, content }` | `{ success }` |
| 复盘 | GET | `/review/list` | 获取复盘列表 | -- | `{ reviews[] }` |

> **Demo 模式说明**：以上所有 API 在 Demo 模式下均不实际调用，由前端 `mockData.ts` 返回预置模拟数据。HTTP 拦截器在检测到 `isDemoMode = true` 时自动短路请求并返回 mock 数据。

---

## 9. 响应式策略

### 9.1 断点系统

```scss
// styles/mixins/_responsive.scss
$breakpoints: (
  'mobile':  375px,
  'tablet':  768px,
  'desktop': 1024px,
  'wide':    1440px
);

@mixin mobile  { @media (max-width: 767px)  { @content; } }
@mixin tablet  { @media (min-width: 768px) and (max-width: 1023px) { @content; } }
@mixin desktop { @media (min-width: 1024px) { @content; } }
```

### 9.2 导航模式切换

| 断点 | 导航形式 | 实现方式 |
|------|----------|----------|
| Mobile（375-767px） | 底部 Tab 栏，图标 + 文字 | `AppTabBar.vue`，5 个入口，高度 56px |
| Tablet（768-1023px） | 顶部导航，文字缩写 | `AppHeader.vue`，如"合规复盘"缩写为"合规" |
| Desktop（1024px+） | 顶部导航，完整文字 | `AppHeader.vue`，完整导航名 |

切换逻辑在 `AppShell.vue` 中通过 `useBreakpoint` 组合函数判断当前断点，条件渲染对应导航组件。

### 9.3 关键组件响应式规则

| 组件 | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| 首页 Hero 区块 | 单列居中 | 单列左对齐 | 双列（文字 + 配图） |
| 首页卖点卡片 | 单列堆叠 | 不对称 2 列 | 3 列不规则排列 |
| 首页测试码入口 | 全宽卡片 | 居中卡片 (max-width: 480px) | 居中卡片 + 右侧装饰图 |
| 信息采集选项卡片 | 2 列网格 | 3 列网格 | 4 列网格 |
| 方向推荐卡片 | 单列堆叠 | 单列堆叠 | 单列堆叠（最大宽度 720px 居中） |
| AI 员工方案卡片 | 2 列网格 | 3 列网格 | 6 列网格 |
| 用户画像标签 | 2x2 网格 | 4 列横排 | 4 列横排 |
| 介绍详情页 Hero | 单列居中 | 单列左对齐 | 双列（文字 + 配图） |
| 优势/劣势对比 | 上下堆叠 | 上下堆叠 | 左右双栏 |

---

## 10. 性能优化策略

### 10.1 路由级代码分割

```
路由采用懒加载，所有 views 组件通过 dynamic import 按需加载:
  const HomeView = () => import('@/views/HomeView.vue')
  const LoginView = () => import('@/views/LoginView.vue')

Vite 自动将每个懒加载路由打包为独立 chunk。
首屏只加载 AppShell + HomeView（公共首页，无需登录即可展示）。
HomeView 包含测试码入口，可直接激活 Demo 模式进入后续页面。
```

### 10.2 资源优化

| 优化项 | 策略 |
|--------|------|
| 图片 | 使用 `<picture>` + srcset 按设备 DPR 加载不同分辨率；未可见图片懒加载（`loading="lazy"`） |
| 图标 | Iconify 按需加载 SVG，不打包未使用的图标 |
| 字体 | 使用系统字体栈，不加载自定义字体文件（零额外网络请求） |
| CSS | Vite 构建时自动 Tree-shake 未使用的 SCSS；Design Token 以 CSS Variables 注入，无冗余 |
| MBTI 题目数据 | 93 道题数据存为独立 JSON 文件，路由进入 MbtiTestView 时才加载 |

### 10.3 运行时优化

| 优化项 | 策略 |
|--------|------|
| 列表渲染 | DirectionCard 列表使用 `v-memo` 避免 key 未变时重新渲染 |
| 动画性能 | 动画只使用 `transform` 和 `opacity`，不触发 layout/paint |
| 防抖 | 选项卡片点击 300ms 防抖；验证码输入防抖提交 |
| 状态粒度 | Store 数据按需订阅，组件使用 `storeToRefs` 避免全量响应式追踪 |

---

## 11. 错误处理与容错设计

### 11.1 错误分级

| 级别 | 场景 | 处理方式 | 用户感知 |
|------|------|----------|----------|
| L1-静默 | 非关键数据加载失败（如复盘列表） | 控制台告警，展示空状态 | "暂无数据" |
| L2-提示 | API 超时、频率限制 | Toast 提示 + 重试按钮 | "请求超时，请稍后重试" |
| L3-阻断 | 登录过期、token 失效（正常模式） | 全局拦截器处理，重定向登录页 | "登录已过期，请重新登录" |
| L3-Demo | Demo 模式下所有 API 错误 | 不展示错误，自动降级为 mock 数据返回 | 无感知（开发者可从控制台看到警告） |
| L4-故障 | 网络断开、服务不可用 | 顶部横幅持续提示，操作按钮 disabled | "网络连接已断开" |
| L5-崩溃 | 未知运行时错误 | 全局错误边界捕获，展示错误页面 | "出了点问题" + [返回首页] |

### 11.2 数据一致性保障

| 场景 | 策略 |
|------|------|
| 表单中断后恢复 | localStorage 存储每一步答案，重新进入时从断点继续 |
| MBTI 答题中断 | localStorage 存储已答题号和答案，恢复时自动跳转到下一题 |
| 提交失败重试 | 失败的请求放入重试队列，网络恢复后自动重试（最多 3 次，指数退避） |
| 并发编辑冲突 | SoloPilot 单用户操作，不存在并发冲突场景 |

---

## 12. 可访问性设计

### 12.1 基础标准

| 要求 | 实现方式 |
|------|----------|
| 颜色对比度 >= 4.5:1 (WCAG AA) | Design Token 中所有前景色已验证对比度 |
| 键盘导航 | 所有交互元素 Tab 可达；Enter/Space 激活；MBTI 支持键盘 A/B 快捷键 |
| 焦点指示 | 统一 `focus-visible` 样式：2px solid Brand-Primary，offset 2px |
| 触控目标 >= 44x44px | 选项卡片、按钮等所有可交互元素最小触控区域 |
| 文字大小 >= 14px | Design Token 中 text-xs = 12px 仅用于辅助标签，正文不小于 14px |
| 动效尊重系统设置 | 所有动画包裹在 `@media (prefers-reduced-motion: no-preference)` 内 |

### 12.2 ARIA 标签清单

| 组件 | ARIA 属性 |
|------|-----------|
| 顶部导航 | `role="navigation"` `aria-label="主导航"` |
| 底部 Tab 栏 | `role="tablist"` 每个 Tab `role="tab"` `aria-selected` |
| 进度条 | `role="progressbar"` `aria-valuenow` `aria-valuemin` `aria-valuemax` |
| 评分组件 | `role="radiogroup"` 每颗星 `role="radio"` `aria-checked` |
| 对话气泡 | AI 气泡 `aria-label="系统消息"` 用户气泡 `aria-label="你的回答"` |
| Toast | `role="alert"` `aria-live="polite"` |
| 模态框 | `role="dialog"` `aria-modal="true"` `aria-labelledby` |
| 加载状态 | `aria-busy="true"` `aria-label="正在加载"` |

---

## 13. 构建与部署

### 13.1 环境变量

| 变量名 | 用途 | 示例值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | 后端 API 地址 | `https://api.solopilot.dev` |
| `VITE_DEMO_CODE` | 开发者测试码 | `8888` |
| `VITE_APP_TITLE` | 页面标题 | `SoloPilot - AI 创业规划助手` |

### 13.2 构建产物

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 开发模式，Vite Dev Server，HMR 热更新 |
| `pnpm build` | 生产构建，输出到 `dist/` 目录 |
| `pnpm preview` | 本地预览生产构建产物 |

### 13.3 部署目标

| 环境 | 平台 | 说明 |
|------|------|------|
| 开发/演示 | Vercel 或 Netlify | 自动构建、自动 HTTPS、PR 预览 |
| 生产（黑客松演示） | 同上 | 连接自定义域名即可 |

---

## 14. 开发优先级与里程碑

### 14.1 P0 -- 核心流程（必须完成）

| 里程碑 | 包含页面 | 预估工时 | 依赖 |
|--------|----------|----------|------|
| M1-骨架搭建 | 项目初始化、路由、布局、Design Token、Demo 模式基础 | 2.5h | -- |
| M2-公共首页 | SCR-00 首页（品牌 + 卖点 + 测试码入口）、HomeView | 2h | M1 |
| M3-登录页（二级） | SCR-01 登录页（手机号+验证码+测试码入口）、auth store | 1.5h | M1 |
| M4-介绍详情 | SCR-02 介绍页（静态深度内容渲染） | 1.5h | M1 |
| M5-信息采集 | SCR-03 对话式 7 步、infoCollect store、mock 数据支持 | 4h | M1 |
| M6-MBTI 测评 | SCR-04 93 题问卷、mbti store、计分逻辑、mock 结果 | 4h | M1 |
| M7-结果展示 | SCR-05/06/07/08 加载页 + 画像 + 推荐 + 总结 + mock 数据集 | 4h | M5 + M6 |
| **P0 合计** | | **19.5h** | |

> 注：P0 中所有页面均需兼容 Demo 模式（免登录访问），mock 数据在 M1 基础设施阶段统一搭建。

### 14.2 P1 -- 重要功能（尽量完成）

| 里程碑 | 包含页面 | 预估工时 |
|--------|----------|----------|
| M8-反馈 | SCR-09 评分 + 开放式反馈 | 1.5h |
| M9-合规指引 | SCR-10 静态内容 + Tab 切换 | 2h |
| M10-AI 团队 | SCR-11 测评 + 方案展示 | 3h |

### 14.3 P2 -- 锦上添花

| 里程碑 | 包含页面 | 预估工时 |
|--------|----------|----------|
| M11-复盘 | SCR-12 复盘模板 + 记录管理 | 2h |
| M12-响应式打磨 | Desktop/Tablet 断点适配完善 | 3h |
| M13-第三方登录扩展 | 对接微信/支付宝等第三方 OAuth（架构已预留扩展点） | 2h |

---

## 15. 附录

### 附录 A：Design Token 快速参考

```
颜色:
  --color-brand-primary: #2563EB;
  --color-brand-primary-hover: #1D4ED8;
  --color-brand-primary-light: #EFF6FF;
  --color-gray-900: #111827;
  --color-gray-700: #374151;
  --color-gray-500: #6B7280;
  --color-gray-200: #E5E7EB;
  --color-gray-100: #F3F4F6;
  --color-gray-50: #F9FAFB;
  --color-success: #059669;
  --color-error: #DC2626;
  --color-warning: #D97706;

间距:
  --space-xs: 4px;  --space-sm: 8px;  --space-md: 16px;
  --space-lg: 24px; --space-xl: 32px; --space-2xl: 48px;

字体:
  --font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --text-xs: 12px; --text-sm: 14px; --text-base: 16px;
  --text-lg: 20px; --text-xl: 24px; --text-2xl: 30px; --text-3xl: 36px;

圆角:
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px;

阴影:
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
```

### 附录 B：项目依赖清单

```json
{
  "dependencies": {
    "vue": "^3.4",
    "vue-router": "^4.3",
    "pinia": "^2.1",
    "axios": "^1.6",
    "@iconify/vue": "^4.1"
  },
  "devDependencies": {
    "vite": "^5.4",
    "@vitejs/plugin-vue": "^5.0",
    "typescript": "^5.4",
    "vue-tsc": "^2.0",
    "sass": "^1.72",
    "eslint": "^8.57",
    "prettier": "^3.2"
  }
}
```

### 附录 C：ESLint 与代码规范

| 规则 | 说明 |
|------|------|
| `vue/multi-word-component-names` | 关闭（允许 `LoginView` 这种命名） |
| `@typescript-eslint/no-explicit-any` | 开启（禁止 any） |
| 组件命名 | PascalCase，视图组件以 `View` 结尾 |
| 文件命名 | views/ 用 PascalCase，stores/ 用 camelCase，composables/ 以 `use` 开头 |
| 注释 | 公共组件必须包含 JSDoc 注释说明 Props 和 Emit |
