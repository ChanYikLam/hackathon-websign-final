# SoloPilot 后端接口文档

## 文档信息

| 字段 | 内容 |
|------|------|
| 产品名称 | SoloPilot -- AI 驱动的一人公司创业规划助手 |
| 文档版本 | v1.0 |
| 创建日期 | 2026-04-18 |
| 关联文档 | SoloPilot-PRD.md、SoloPilot-前端软件架构文档.md、数据库表结构(1).md |
| 文档定位 | 后端 RESTful API 接口规范，供前后端协作开发使用 |

---

## 1. 总体约定

### 1.1 基础信息

| 项目 | 说明 |
|------|------|
| 协议 | HTTPS |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |
| 时间格式 | ISO 8601（如 `2026-04-18T14:00:00+08:00`） |
| API 基础路径 | `/api/v1` |

### 1.2 统一响应结构

所有接口返回统一的 JSON 响应体：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | integer | 业务状态码，0 表示成功，非 0 表示各类错误 |
| `message` | string | 状态描述，成功为 `"success"`，失败为具体错误信息 |
| `data` | object/string/null | 业务数据载体，错误时为 null 或错误详情 |

### 1.3 通用错误码

| 错误码 | HTTP 状态码 | 含义 | 说明 |
|--------|------------|------|------|
| 0 | 200 | 成功 | 请求处理成功 |
| 400 | 400 | 参数错误 | 请求参数校验不通过 |
| 401 | 401 | 未认证 | 缺少或无效的 Token |
| 403 | 403 | 无权限 | Token 有效但无权访问该资源 |
| 404 | 404 | 资源不存在 | 请求的资源未找到 |
| 429 | 429 | 请求过于频繁 | 触发频率限制 |
| 500 | 500 | 服务器内部错误 | 后端未捕获的异常 |
| 1001 | 200 | 用户名已存在 | 注册时用户名已被占用 |
| 1002 | 200 | 用户名或密码错误 | 登录时账号密码不匹配 |
| 1003 | 200 | 用户名格式错误 | 用户名不符合规则（4-20位字母数字下划线） |
| 1004 | 200 | 密码格式错误 | 密码不符合规则（6-20位，至少含字母和数字） |
| 2001 | 200 | 用户信息不完整 | 未完成信息采集步骤 |
| 2002 | 200 | MBTI 测评未完成 | 未完成全部答题 |
| 3001 | 200 | AI 分析服务异常 | LLM API 调用失败或超时 |

### 1.4 鉴权机制

除登录相关接口外，所有接口需在请求头中携带 JWT Token：

```
Authorization: Bearer <token>
```

Token 有效期：7 天。过期后需重新登录。

### 1.5 频率限制

| 接口类别 | 限制规则 |
|----------|----------|
| 注册 | 同一 IP 1 小时限 5 次 |
| 登录 | 同一 IP 1 分钟限 10 次 |
| 触发分析 | 同一用户 10 分钟限 3 次 |
| 提交反馈 | 同一用户 1 分钟限 2 次 |
| 其他接口 | 同一用户 1 分钟限 60 次 |

---

## 2. 接口清单总览

| 模块 | 方法 | 路径 | 鉴权 | 优先级 | 说明 |
|------|------|------|------|--------|------|
| 认证 | POST | `/auth/register` | 否 | P0 | 账号密码注册 |
| 认证 | POST | `/auth/login` | 否 | P0 | 账号密码登录 |
| 认证 | POST | `/auth/refresh` | 是 | P0 | 刷新 Token |
| 用户 | GET | `/user/profile` | 是 | P0 | 获取当前用户信息 |
| 用户 | PUT | `/user/info` | 是 | P0 | 提交个人信息采集结果 |
| 用户 | PUT | `/user/avatar` | 是 | P2 | 更新用户头像 |
| 信息采集 | GET | `/info-collect/progress` | 是 | P0 | 获取信息采集进度 |
| 信息采集 | PUT | `/info-collect/step` | 是 | P0 | 保存单步采集答案 |
| 信息采集 | POST | `/info-collect/complete` | 是 | P0 | 完成全部信息采集 |
| MBTI | GET | `/mbti/questions` | 是 | P0 | 获取 MBTI 测评题目列表 |
| MBTI | GET | `/mbti/progress` | 是 | P0 | 获取 MBTI 答题进度 |
| MBTI | PUT | `/mbti/answer` | 是 | P0 | 保存单题答案 |
| MBTI | POST | `/mbti/submit` | 是 | P0 | 提交全部答案并获取结果 |
| MBTI | GET | `/mbti/result` | 是 | P0 | 获取 MBTI 测评结果（历史） |
| 分析 | POST | `/analysis/trigger` | 是 | P0 | 触发个性化分析 |
| 分析 | GET | `/analysis/result` | 是 | P0 | 获取分析结果 |
| 分析 | GET | `/analysis/status` | 是 | P0 | 查询分析任务状态 |
| 反馈 | POST | `/feedback` | 是 | P1 | 提交用户反馈 |
| AI 团队 | GET | `/ai-team/questions` | 是 | P1 | 获取 AI 员工测评题目 |
| AI 团队 | POST | `/ai-team/submit` | 是 | P1 | 提交 AI 测评答案 |
| AI 团队 | GET | `/ai-team/result` | 是 | P1 | 获取 AI 团队推荐方案 |
| AI 团队 | GET | `/ai-team/roles/:roleId` | 是 | P1 | 获取单个角色详情 |
| 合规 | GET | `/compliance/guides` | 是 | P1 | 获取合规指引内容 |
| 合规 | GET | `/compliance/city-policy` | 是 | P2 | 获取城市政策信息 |
| 复盘 | POST | `/review` | 是 | P2 | 创建复盘记录 |
| 复盘 | GET | `/review/list` | 是 | P2 | 获取复盘记录列表 |
| 复盘 | GET | `/review/:id` | 是 | P2 | 获取单条复盘详情 |
| 复盘 | PUT | `/review/:id` | 是 | P2 | 更新复盘记录 |
| 系统 | GET | `/system/config` | 是 | P0 | 获取前端系统配置 |

---

## 3. 接口详细说明

### 3.1 认证模块（Auth）

#### 3.1.1 账号密码注册

创建新账号。注册成功后自动签发 JWT Token，无需额外登录。

- **URL**: `POST /api/v1/auth/register`
- **鉴权**: 否
- **优先级**: P0

**请求体**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 用户名。4-20 位，仅支持字母、数字、下划线 |
| `password` | string | 是 | 密码。6-20 位，至少包含一个字母和一个数字 |
| `nickname` | string | 否 | 昵称。2-20 字符，不传时取用户名 |

**请求示例**:

```json
{
  "username": "zhangsan",
  "password": "abc123456",
  "nickname": "小张"
}
```

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "token_expire_at": "2026-04-25T14:00:00+08:00",
    "user": {
      "id": 1,
      "username": "zhangsan",
      "nickname": "小张",
      "avatar": null,
      "is_info_completed": false,
      "is_mbti_completed": false,
      "created_at": "2026-04-18T14:00:00+08:00"
    }
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `token` | string | JWT 访问令牌 |
| `token_expire_at` | string | Token 过期时间 |
| `user.id` | integer | 用户 ID |
| `user.username` | string | 用户名 |
| `user.nickname` | string | 用户昵称 |
| `user.avatar` | string/null | 头像 URL |
| `user.is_info_completed` | boolean | 是否已完成个人信息采集 |
| `user.is_mbti_completed` | boolean | 是否已完成 MBTI 测评 |
| `user.created_at` | string | 注册时间 |

**失败响应示例**:

```json
{
  "code": 1001,
  "message": "用户名已存在",
  "data": null
}
```

```json
{
  "code": 1003,
  "message": "用户名格式错误，需4-20位字母数字下划线",
  "data": null
}
```

```json
{
  "code": 1004,
  "message": "密码格式错误，需6-20位且至少包含字母和数字",
  "data": null
}
```

**涉及数据库表**: `users`

**业务规则**:
- 用户名不可重复，大小写不敏感（`ZhangSan` 和 `zhangsan` 视为相同）
- 密码使用 bcrypt 哈希存储，不可逆
- 注册成功后自动签发 Token，用户无需再次登录
- 同一 IP 1 小时内限注册 5 次

---

#### 3.1.2 账号密码登录

验证用户名和密码，通过后签发 JWT Token。

- **URL**: `POST /api/v1/auth/login`
- **鉴权**: 否
- **优先级**: P0

**请求体**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | string | 是 | 用户名 |
| `password` | string | 是 | 密码 |

**请求示例**:

```json
{
  "username": "zhangsan",
  "password": "abc123456"
}
```

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "token_expire_at": "2026-04-25T14:00:00+08:00",
    "user": {
      "id": 1,
      "username": "zhangsan",
      "nickname": "小张",
      "avatar": null,
      "is_info_completed": false,
      "is_mbti_completed": false,
      "created_at": "2026-04-18T14:00:00+08:00"
    }
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `token` | string | JWT 访问令牌 |
| `token_expire_at` | string | Token 过期时间 |
| `user.id` | integer | 用户 ID |
| `user.username` | string | 用户名 |
| `user.nickname` | string | 用户昵称 |
| `user.avatar` | string/null | 头像 URL |
| `user.is_info_completed` | boolean | 是否已完成个人信息采集 |
| `user.is_mbti_completed` | boolean | 是否已完成 MBTI 测评 |
| `user.created_at` | string | 注册时间 |

**失败响应示例**:

```json
{
  "code": 1002,
  "message": "用户名或密码错误",
  "data": null
}
```

> 注意：无论用户名不存在还是密码错误，均返回相同的错误信息 1002，防止用户名枚举攻击。

**涉及数据库表**: `users`

**业务规则**:
- 密码使用 bcrypt 逐次比对，防止时序攻击
- 同一 IP 1 分钟内限 10 次请求
- 同一用户名连续失败 5 次后锁定 15 分钟
- Token 有效期 7 天
- 登录成功后更新 `users.last_login_at` 字段

---

#### 3.1.3 刷新 Token

在当前 Token 即将过期时获取新的 Token。

- **URL**: `POST /api/v1/auth/refresh`
- **鉴权**: 是
- **优先级**: P0

**请求体**: 无

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "token_expire_at": "2026-04-25T14:00:00+08:00"
  }
}
```

**业务规则**:
- 仅在当前 Token 剩余有效期不足 24 小时时允许刷新
- 刷新后旧 Token 在 5 分钟内仍有效（宽限期），之后失效

---

### 3.2 用户模块（User）

#### 3.2.1 获取当前用户信息

获取已登录用户的基本信息和业务进度状态。

- **URL**: `GET /api/v1/user/profile`
- **鉴权**: 是
- **优先级**: P0

**请求参数**: 无（从 Token 中提取用户 ID）

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "zhangsan",
    "nickname": "小张",
    "avatar": null,
    "status": 1,
    "is_info_completed": false,
    "is_mbti_completed": false,
    "is_analysis_done": false,
    "current_step": "info-collect",
    "info_collect_step": 3,
    "mbti_current_question": 15,
    "created_at": "2026-04-18T14:00:00+08:00",
    "last_login_at": "2026-04-18T14:00:00+08:00"
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `current_step` | string | 用户当前所在流程阶段。可选值：`info-collect`（信息采集中）、`mbti-test`（MBTI 测评中）、`analyzing`（分析中）、`result`（已出结果）、`completed`（全流程完成） |
| `info_collect_step` | integer | 信息采集当前步骤（1-7），0 表示未开始 |
| `mbti_current_question` | integer | MBTI 当前题号（1-93），0 表示未开始 |
| `is_analysis_done` | boolean | 是否已生成分析结果 |

**涉及数据库表**: `users`

---

#### 3.2.2 提交个人信息采集结果

一次性提交全部 7 个步骤的采集结果。

- **URL**: `PUT /api/v1/user/info`
- **鉴权**: 是
- **优先级**: P0

**请求体**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `city` | string | 是 | 城市等级。枚举：`一线` / `新一线` / `二线` / `三线` |
| `gender` | string | 否 | 性别。枚举：`男` / `女`，null 表示未填写 |
| `intensity` | string | 是 | 工作强度偏好。枚举：`007` / `996` / `965` / `越少工作越好` |
| `skill` | string | 是 | 核心技能。枚举：`写作内容` / `编程技术` / `设计美术` / `销售商务` / `教学培训` / `行业专业` / `暂不确定` / `其他` |
| `direction` | string | 是 | 七大方向偏好。枚举：`知识付费与内容创作` / `独立开发与微型SaaS` / `专业技能咨询与服务` / `跨境与利基电商` / `AI驱动的服务业务` / `实体轻服务` / `信息中介与资源对接` |
| `purpose` | string | 是 | 成立一人公司目的。最大 200 字 |
| `schedule` | string | 是 | 工作时间偏好。枚举：`固定时间坐班型-长白班` / `固定时间坐班型-夜猫子` / `零碎工作时间类型-碎片化响应` / `零碎工作时间类型-大块专注时段` / `都可以` |
| `skill_other` | string | 否 | 当 `skill` 为 `其他` 时，自定义技能描述。最大 50 字 |

**请求示例**:

```json
{
  "city": "新一线",
  "gender": "女",
  "intensity": "965",
  "skill": "写作内容",
  "direction": "知识付费与内容创作",
  "purpose": "想利用业余时间做内容创作，增加收入来源",
  "schedule": "零碎工作时间类型-碎片化响应"
}
```

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "is_info_completed": true
  }
}
```

**涉及数据库表**: `user_profiles`

**业务规则**:
- 所有必填字段均不可为空
- 提交后更新 `users` 表的完成标记
- 数据写入 `user_profiles` 表，若已存在则更新
- 同时更新前端架构文档中 `user_profiles` 表的 `personality_tags`、`interests` 等字段

---

#### 3.2.3 更新用户头像

- **URL**: `PUT /api/v1/user/avatar`
- **鉴权**: 是
- **优先级**: P2

**请求体**: `multipart/form-data`

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `avatar` | file | 是 | 图片文件，支持 jpg/png/webp，最大 2MB |

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "avatar": "https://cdn.solopilot.dev/avatars/1_168xxxxx.jpg"
  }
}
```

---

### 3.3 信息采集模块（Info Collect）

本模块支持分步保存，前端每次回答一个问题后调用保存接口，实现断点续答。

#### 3.3.1 获取信息采集进度

- **URL**: `GET /api/v1/info-collect/progress`
- **鉴权**: 是
- **优先级**: P0

**请求参数**: 无

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "current_step": 3,
    "total_steps": 7,
    "completed": false,
    "answers": {
      "1": { "field": "city", "value": "新一线" },
      "2": { "field": "gender", "value": "女" }
    }
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `current_step` | integer | 当前应回答的步骤编号（1-7） |
| `total_steps` | integer | 总步骤数，固定为 7 |
| `completed` | boolean | 是否已完成全部采集 |
| `answers` | object | 已完成的步骤答案，key 为步骤编号 |

---

#### 3.3.2 保存单步采集答案

保存单个步骤的答案。前端在用户选择选项或填写文本后调用。

- **URL**: `PUT /api/v1/info-collect/step`
- **鉴权**: 是
- **优先级**: P0

**请求体**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `step` | integer | 是 | 步骤编号（1-7） |
| `value` | string | 是 | 用户回答的值，对应步骤的枚举值或文本 |

**步骤与字段映射**:

| step | 字段 | 可选值 |
|------|------|--------|
| 1 | `city` | `一线` / `新一线` / `二线` / `三线` |
| 2 | `gender` | `男` / `女` / `skip`（跳过） |
| 3 | `intensity` | `007` / `996` / `965` / `越少工作越好` |
| 4 | `skill` | `写作内容` / `编程技术` / `设计美术` / `销售商务` / `教学培训` / `行业专业` / `暂不确定` / `其他` |
| 5 | `direction` | `知识付费与内容创作` / `独立开发与微型SaaS` / `专业技能咨询与服务` / `跨境与利基电商` / `AI驱动的服务业务` / `实体轻服务` / `信息中介与资源对接` |
| 6 | `purpose` | 自由文本，最大 200 字 |
| 7 | `schedule` | `固定时间坐班型-长白班` / `固定时间坐班型-夜猫子` / `零碎工作时间类型-碎片化响应` / `零碎工作时间类型-大块专注时段` / `都可以` |

**请求示例**:

```json
{
  "step": 4,
  "value": "写作内容"
}
```

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "step": 4,
    "saved": true,
    "next_step": 5,
    "is_last_step": false
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `next_step` | integer | 下一步骤编号，若当前为最后一步则为 0 |
| `is_last_step` | boolean | 是否为最后一步 |

---

#### 3.3.3 完成全部信息采集

前端在 7 步全部完成后调用此接口，标记信息采集流程完成。

- **URL**: `POST /api/v1/info-collect/complete`
- **鉴权**: 是
- **优先级**: P0

**请求体**: 无

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "is_info_completed": true,
    "can_proceed_to_mbti": true
  }
}
```

**业务规则**:
- 校验 7 个步骤是否全部已保存（步骤 2 性别允许跳过）
- 未全部完成时返回错误码 2001
- 完成后更新 `users` 表的 `is_info_completed` 为 true
- 将所有采集数据写入 `user_profiles` 表

---

### 3.4 MBTI 测评模块（MBTI）

MBTI 测评共 93 题，分为两部分：情境行为题（1-26 题）和词语偏好题（27-93 题）。每题有 A/B 两个选项。

#### 3.4.1 获取 MBTI 测评题目列表

获取全部 93 道题目。题目数据为静态内容，前端可在首次请求后缓存。

- **URL**: `GET /api/v1/mbti/questions`
- **鉴权**: 是
- **优先级**: P0

**请求参数**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `part` | integer | 否 | 按部分获取。`1` 为情境行为题（1-26），`2` 为词语偏好题（27-93）。不传则返回全部 |

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 93,
    "part1_count": 26,
    "part2_count": 67,
    "questions": [
      {
        "id": 1,
        "part": 1,
        "question": "你会跟哪些人做朋友？",
        "option_a": "常提出新主意的",
        "option_b": "脚踏实地的",
        "dimension": "EI"
      },
      {
        "id": 2,
        "part": 1,
        "question": "...",
        "option_a": "...",
        "option_b": "...",
        "dimension": "SN"
      }
    ]
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `questions[].id` | integer | 题目编号（1-93） |
| `questions[].part` | integer | 所属部分（1 或 2） |
| `questions[].question` | string | 题目内容 |
| `questions[].option_a` | string | 选项 A 内容 |
| `questions[].option_b` | string | 选项 B 内容 |
| `questions[].dimension` | string | 该题测试的 MBTI 维度：`EI` / `SN` / `TF` / `JP` |

---

#### 3.4.2 获取 MBTI 答题进度

- **URL**: `GET /api/v1/mbti/progress`
- **鉴权**: 是
- **优先级**: P0

**请求参数**: 无

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 93,
    "answered_count": 15,
    "current_question": 16,
    "is_completed": false,
    "answers": {
      "1": "A",
      "2": "B",
      "3": "A"
    }
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `answered_count` | integer | 已答题数 |
| `current_question` | integer | 当前应答题号（最后一道已答题 + 1） |
| `is_completed` | boolean | 是否已全部完成 |
| `answers` | object | 已答题目映射，key 为题号，value 为 `"A"` 或 `"B"` |

---

#### 3.4.3 保存单题答案

用户选择 A 或 B 后，前端实时保存该题答案。

- **URL**: `PUT /api/v1/mbti/answer`
- **鉴权**: 是
- **优先级**: P0

**请求体**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `question_id` | integer | 是 | 题目编号（1-93） |
| `answer` | string | 是 | 用户选择，`"A"` 或 `"B"` |

**请求示例**:

```json
{
  "question_id": 15,
  "answer": "A"
}
```

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "question_id": 15,
    "saved": true,
    "answered_count": 15,
    "remaining": 78
  }
}
```

**业务规则**:
- 答案以 JSON 格式存储，key 为题号字符串，value 为 `"A"` 或 `"B"`
- 允许修改已答题目（覆盖存储）
- 数据临时存储于 Redis，key 格式 `mbti:answers:{userId}`

---

#### 3.4.4 提交全部答案并获取结果

用户完成全部 93 题后提交，后端进行计分并返回 MBTI 类型。

- **URL**: `POST /api/v1/mbti/submit`
- **鉴权**: 是
- **优先级**: P0

**请求体**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `answers` | object | 是 | 全部 93 题答案映射 |

**请求示例**:

```json
{
  "answers": {
    "1": "A",
    "2": "B",
    "3": "A"
  }
}
```

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "mbti_type": "ENFP",
    "scores": {
      "E": 14,
      "I": 7,
      "S": 10,
      "N": 57,
      "T": 30,
      "F": 37,
      "J": 22,
      "P": 45
    },
    "type_description": "ENFP（竞选者）-- 你是一个充满创意和热情的人...",
    "entrepreneurship_analysis": {
      "strengths": ["创意丰富，善于发现新机会", "擅长与人建立连接，天然的内容创作者"],
      "blind_spots": ["执行力偏弱，容易虎头蛇尾", "对枯燥的运营细节缺乏耐心"],
      "suitable_directions": ["知识付费与内容创作", "跨境电商", "AI 驱动的服务业务"]
    },
    "completed_at": "2026-04-18T14:30:00+08:00"
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `mbti_type` | string | 四字母 MBTI 类型（如 `ENFP`） |
| `scores` | object | 四维度各端得分 |
| `type_description` | string | 该类型的人格描述 |
| `entrepreneurship_analysis` | object | 对一人公司创业的影响分析 |
| `entrepreneurship_analysis.strengths` | array | 该类型的创业优势 |
| `entrepreneurship_analysis.blind_spots` | array | 该类型的创业盲区 |
| `entrepreneurship_analysis.suitable_directions` | array | 适合的创业方向 |

**涉及数据库表**: `user_profiles`

**业务规则**:
- 校验答案是否为 93 题（全部作答）
- 计分规则：
  - E/I 维度：统计第 1-26 题中 E 选项（A 端）的得分
  - S/N、T/F、J/P 维度：统计词语偏好题（27-93）中各维度的 A 端得分
  - 每维度得分高的一端为该维度的类型字母
- 结果持久化到 `user_profiles` 表
- 从 Redis 中清除临时答案缓存

---

#### 3.4.5 获取 MBTI 测评结果（历史）

用户再次进入结果页时，直接获取已生成的 MBTI 结果。

- **URL**: `GET /api/v1/mbti/result`
- **鉴权**: 是
- **优先级**: P0

**请求参数**: 无

**成功响应**: 同 3.4.4 的 `data` 结构。

**失败响应**:

```json
{
  "code": 2002,
  "message": "MBTI测评未完成",
  "data": null
}
```

---

### 3.5 分析模块（Analysis）

分析模块是 SoloPilot 的核心，综合用户的个人信息和 MBTI 结果，通过 LLM 生成个性化创业方案。

#### 3.5.1 触发个性化分析

提交用户信息采集和 MBTI 结果，后端调用 LLM 生成个性化分析报告。该接口为异步任务，立即返回任务 ID。

- **URL**: `POST /api/v1/analysis/trigger`
- **鉴权**: 是
- **优先级**: P0

**请求体**: 无（后端自动从数据库读取用户的个人信息和 MBTI 结果）

**请求参数**: 无

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_1713412345_1",
    "status": "processing",
    "estimated_time": 5
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `task_id` | string | 分析任务 ID，用于后续查询状态和结果 |
| `status` | string | 任务状态：`processing`（处理中） |
| `estimated_time` | integer | 预估处理时间（秒） |

**失败响应**:

```json
{
  "code": 2001,
  "message": "用户信息不完整，请先完成信息采集",
  "data": null
}
```

```json
{
  "code": 2002,
  "message": "MBTI测评未完成，请先完成测评",
  "data": null
}
```

**涉及数据库表**: `user_profiles`、`ai_chat_records`、`ai_logs`

**业务规则**:
- 校验用户是否已完成信息采集和 MBTI 测评
- 若已有分析结果，允许重新触发（覆盖旧结果）
- 后端调用 LLM API，Prompt 中需包含：
  - 用户的 7 项个人信息
  - MBTI 四维度得分和类型
  - 七大方向的知识库内容
  - 四型分类的判断矩阵
- LLM 返回结构化 JSON，包含画像、推荐方向、四型分类、总结方案
- 任务状态存储于 Redis，key 格式 `analysis:task:{taskId}`

---

#### 3.5.2 获取分析结果

获取已生成的分析结果。

- **URL**: `GET /api/v1/analysis/result`
- **鉴权**: 是
- **优先级**: P0

**请求参数**: 无

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "profile": {
      "tags": ["一线城市", "写作内容", "ENFP", "平衡型"],
      "description": "你是一个生活在一线城市、擅长内容创作、性格开放热情的创业者。你适合从多个方向中选择最优解，逐步验证并放大。"
    },
    "directions": [
      {
        "rank": 1,
        "name": "知识付费与内容创作",
        "match_rate": 92,
        "reason": "你的核心技能是写作内容，这与知识付费方向高度匹配。ENFP 型的你擅长发现新机会、与人建立连接，天然适合内容传播和社群运营。你在一线城市的优势是可以接触到更多行业资源和优质合作方。",
        "income_range": "月入 5,000 - 30,000 元",
        "case_brief": "参考案例：某一线城市前媒体人，通过付费专栏和社群运营，6 个月后月入稳定在 2 万元以上",
        "startup_tips": ["从你擅长的领域开始，先写 10 篇深度内容", "选择一个小红书或公众号作为主阵地", "先免费积累 1000 粉丝，再考虑付费转化"]
      },
      {
        "rank": 2,
        "name": "AI 驱动的服务业务",
        "match_rate": 85,
        "reason": "...",
        "income_range": "月入 8,000 - 50,000 元",
        "case_brief": "...",
        "startup_tips": ["..."]
      }
    ],
    "user_type": {
      "type": "平衡型",
      "label": "平衡型创业者",
      "description": "你目前的情况比较灵活，有时间和空间尝试不同方向。建议先选择 1 个方向用 3 个月验证，成功后再考虑加大投入。",
      "strategy": "提供 2-3 个可选方案让用户选择，推荐从中等投入的路径开始"
    },
    "summary": {
      "your_profile": "一线城市的 ENFP 内容创作者，偏好平衡的工作节奏",
      "recommended_directions": "知识付费与内容创作（首选）、AI 驱动的服务业务（备选）",
      "strategy_advice": "营销优先策略 -- 先建立个人品牌和内容体系，再考虑产品化",
      "city_advice": "一线城市对你来说是优势，充分利用本地行业资源和人脉",
      "first_month_checklist": [
        { "id": 1, "content": "确定内容主阵地（小红书/公众号/抖音）", "completed": false },
        { "id": 2, "content": "发布第一篇深度内容", "completed": false },
        { "id": 3, "content": "完成 MBTI 结果的个性化解读文章", "completed": false },
        { "id": 4, "content": "建立内容选题库（至少 20 个选题）", "completed": false },
        { "id": 5, "content": "研究 3 个同领域的成功案例", "completed": false },
        { "id": 6, "content": "加入 2 个相关行业社群", "completed": false }
      ],
      "expected_timeline": "1-2 周内完成内容体系搭建，1-3 个月积累首批付费用户，3-6 个月月收入达到 3,000-5,000 元"
    },
    "generated_at": "2026-04-18T14:35:00+08:00"
  }
}
```

**响应字段说明**:

| 字段路径 | 类型 | 说明 |
|----------|------|------|
| `profile.tags` | array[string] | 用户画像标签（4 个），用于前端标签展示 |
| `profile.description` | string | 一段话描述用户特征 |
| `directions` | array | 推荐方向列表（2-3 个），按匹配度降序排列 |
| `directions[].rank` | integer | 推荐排名 |
| `directions[].name` | string | 方向名称 |
| `directions[].match_rate` | integer | 匹配度百分比（0-100） |
| `directions[].reason` | string | 个性化匹配理由（需引用用户的具体回答） |
| `directions[].income_range` | string | 预期收入范围 |
| `directions[].case_brief` | string | 参考案例简介 |
| `directions[].startup_tips` | array[string] | 启动建议列表 |
| `user_type.type` | string | 四型分类。枚举：`保守型` / `平衡型` / `激进型` |
| `user_type.strategy` | string | 对应的策略建议 |
| `summary.first_month_checklist` | array[object] | 首月行动清单，每个条目包含 id、内容、是否已完成 |
| `summary.expected_timeline` | string | 预期时间线描述 |

**涉及数据库表**: `user_profiles`

---

#### 3.5.3 查询分析任务状态

前端在分析加载页轮询此接口，获取任务进度。

- **URL**: `GET /api/v1/analysis/status`
- **鉴权**: 是
- **优先级**: P0

**请求参数**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `task_id` | string | 否 | 任务 ID。不传时查询用户最新的分析任务 |

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "task_id": "task_1713412345_1",
    "status": "completed",
    "progress": 100,
    "result_url": "/api/v1/analysis/result"
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | string | 任务状态：`queued`（排队中）、`processing`（处理中）、`completed`（已完成）、`failed`（失败） |
| `progress` | integer | 处理进度百分比（0-100），供前端进度条使用 |

**失败响应**:

```json
{
  "code": 3001,
  "message": "AI分析服务异常，请稍后重试",
  "data": {
    "status": "failed",
    "error_detail": "LLM API timeout after 30s"
  }
}
```

**业务规则**:
- 前端建议每 2 秒轮询一次
- 任务完成后前端应停止轮询，直接调用 `/analysis/result` 获取结果
- `processing` 状态下 `progress` 从 0 递增到 100（后端模拟或基于实际进度）

---

### 3.6 反馈模块（Feedback）

#### 3.6.1 提交用户反馈

用户对推荐结果进行满意度和开放式反馈。

- **URL**: `POST /api/v1/feedback`
- **鉴权**: 是
- **优先级**: P1

**请求体**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `rating` | integer | 是 | 满意度评分（1-5 分）。1=很差，5=很好 |
| `comment` | string | 否 | 开放式反馈文本。最大 500 字 |
| `direction_preference` | string | 否 | 是否想探索其他方向。枚举：`是` / `否` / `不确定` |

**请求示例**:

```json
{
  "rating": 4,
  "comment": "推荐的方向很符合我的情况，但对AI服务业务的收入预期感觉偏乐观",
  "direction_preference": "不确定"
}
```

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "feedback_id": 42,
    "created_at": "2026-04-18T15:00:00+08:00"
  }
}
```

**涉及数据库表**: 建议新增 `user_feedback` 表

**业务规则**:
- `rating` 必须在 1-5 范围内
- 每个用户最多提交 5 次反馈
- 反馈数据用于优化后续推荐算法

---

### 3.7 AI 团队模块（AI Team）

#### 3.7.1 获取 AI 员工测评题目

获取 10 道 AI 员工选择测评题。

- **URL**: `GET /api/v1/ai-team/questions`
- **鉴权**: 是
- **优先级**: P1

**请求参数**: 无

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 10,
    "questions": [
      {
        "id": 1,
        "question": "你的业务主要靠什么赚钱？",
        "option_a": "卖知识、卖内容、卖课程",
        "option_b": "卖产品、卖服务、卖工具",
        "tag_a": "内容型",
        "tag_b": "产品型"
      },
      {
        "id": 2,
        "question": "你的客户主要通过什么渠道找到你？",
        "option_a": "社交媒体、搜索引擎、内容平台",
        "option_b": "熟人介绍、行业展会、线下渠道",
        "tag_a": "线上获客",
        "tag_b": "线下获客"
      }
    ]
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `questions[].tag_a` | string | 选项 A 的业务特征标签（用于后台匹配方案） |
| `questions[].tag_b` | string | 选项 B 的业务特征标签 |

---

#### 3.7.2 提交 AI 测评答案

提交 10 道题的答案，后端根据答案匹配推荐方案。

- **URL**: `POST /api/v1/ai-team/submit`
- **鉴权**: 是
- **优先级**: P1

**请求体**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `answers` | object | 是 | 10 道题答案映射，key 为题号（1-10），value 为 `"A"` 或 `"B"` |

**请求示例**:

```json
{
  "answers": {
    "1": "A",
    "2": "A",
    "3": "A",
    "4": "A",
    "5": "B",
    "6": "A",
    "7": "A",
    "8": "B",
    "9": "A",
    "10": "B"
  }
}
```

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "plan_type": "A",
    "plan_name": "内容创作者型",
    "plan_description": "你靠内容吸引客户，卖知识、课程或个人品牌。最大的痛点是没时间持续产出。",
    "monthly_budget": "50-100 元",
    "roles": [
      {
        "id": "content_creator",
        "name": "内容创作助手",
        "priority": 1,
        "solves": "每天自动生成 3-5 篇社媒文案、博客草稿",
        "expected_effect": "从'没东西发'变成'选哪篇发'",
        "can_do": [
          "根据你给的主题，自动生成博客文章、社媒文案、短视频脚本",
          "学习你的写作风格，保持输出一致性",
          "自动改写同一内容为不同平台适配的版本"
        ],
        "cannot_do": [
          "替你做战略判断（什么话题值得写、什么不能说）",
          "保证内容的绝对准确性和专业性",
          "替你建立与读者的情感连接"
        ],
        "you_provide": [
          "10-20 篇你过去写的高质量文章",
          "你的品牌调性要求",
          "主题方向和大纲"
        ],
        "recommended_tools": ["Coze", "Dify", "ChatGPT Custom GPTs"],
        "monthly_cost": "0-50 元"
      }
    ],
    "startup_tips": [
      "先只搭'内容创作助手'一个角色，运行 2 周看效果",
      "用 Coze 或 Dify 搭建，零代码，半小时能搞定",
      "投喂 10-20 篇你过去写的高质量文章，让它学习你的风格"
    ]
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `plan_type` | string | 方案类型。枚举：`A`-`F` |
| `plan_name` | string | 方案名称 |
| `roles` | array | 推荐角色列表，按优先级排序 |
| `roles[].id` | string | 角色 ID（英文标识） |
| `roles[].name` | string | 角色名称 |
| `roles[].priority` | integer | 优先级（1 最高） |
| `roles[].can_do` | array[string] | 角色能做什么 |
| `roles[].cannot_do` | array[string] | 角色做不了什么 |
| `roles[].you_provide` | array[string] | 需要用户提供什么 |
| `roles[].recommended_tools` | array[string] | 推荐工具列表 |
| `roles[].monthly_cost` | string | 预估月费 |

**方案匹配规则**:

| 方案 | 匹配条件 |
|------|----------|
| A: 内容创作者型 | 选 A 6 个及以上 |
| B: 产品/服务运营型 | 选 B 6 个及以上 |
| C: 技术创业者型 | 问题 8 选 A 且问题 5 选 A |
| D: 咨询/教练型 | 问题 6 选 A 且问题 1 选 B |
| E: 电商卖家型 | 问题 3 选 B 且问题 6 选 B |
| F: 起步探索型 | 问题 5 选 B 且问题 10 选 A |

**业务规则**:
- 多个方案条件同时满足时，优先级为：C > D > E > F > A/B
- 匹配结果持久化到 `user_profiles` 表

---

#### 3.7.3 获取 AI 团队推荐方案

获取已生成的 AI 团队推荐结果。

- **URL**: `GET /api/v1/ai-team/result`
- **鉴权**: 是
- **优先级**: P1

**请求参数**: 无

**成功响应**: 同 3.7.2 的 `data` 结构。

---

#### 3.7.4 获取单个角色详情

- **URL**: `GET /api/v1/ai-team/roles/:roleId`
- **鉴权**: 是
- **优先级**: P1

**路径参数**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `roleId` | string | 是 | 角色 ID（如 `content_creator`、`smart_customer_service`） |

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "content_creator",
    "name": "内容创作助手",
    "category": "内容类",
    "can_do": [...],
    "cannot_do": [...],
    "you_provide": [...],
    "recommended_tools": ["Coze", "Dify", "ChatGPT Custom GPTs"],
    "monthly_cost": "0-50 元",
    "setup_guide": "..."
  }
}
```

**可用角色 ID 列表**:

| ID | 名称 | 分类 |
|----|------|------|
| `content_creator` | 内容创作助手 | 内容类 |
| `social_media_operator` | 社媒运营员 | 运营类 |
| `seo_optimizer` | SEO 优化师 | 内容类 |
| `image_generator` | 配图生成器 | 内容类 |
| `smart_customer_service` | 智能客服 | 销售类 |
| `sales_assistant` | 销售助理 | 销售类 |
| `operations_manager` | 运营管家 | 运营类 |
| `schedule_manager` | 日程管家 | 运营类 |
| `competitor_monitor` | 竞品监控员 | 分析类 |
| `user_feedback_analyst` | 用户反馈分析员 | 分析类 |
| `content_marketer` | 内容营销员 | 内容类 |
| `email_private_operator` | 邮件/私域运营员 | 运营类 |
| `solution_generator` | 方案生成器 | 专业类 |
| `doc_generator` | 文档生成器 | 专业类 |
| `ecommerce_customer_service` | 智能客服（电商版） | 销售类 |
| `price_monitor` | 竞品价格监控 | 分析类 |
| `product_copywriter` | 产品文案员 | 内容类 |
| `finance_accountant` | 财务记账员 | 分析类 |
| `universal_assistant` | 万能助理 | 通用类 |
| `tech_customer_service` | 技术客服 | 销售类 |

---

### 3.8 合规模块（Compliance）

#### 3.8.1 获取合规指引内容

获取一人公司相关的合规指引信息。

- **URL**: `GET /api/v1/compliance/guides`
- **鉴权**: 是
- **优先级**: P1

**请求参数**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `category` | string | 否 | 指引分类。枚举：`no_company`（无公司运营）、`register`（公司注册）、`tax`（税务）。不传返回全部 |

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "guides": [
      {
        "category": "no_company",
        "title": "无公司运营指引",
        "sections": [
          {
            "subtitle": "支付收款方案",
            "content": "个人主体运营时，可通过以下方式收款：..."
          },
          {
            "subtitle": "用户登录方案",
            "content": "..."
          }
        ]
      }
    ]
  }
}
```

**业务规则**:
- 合规指引为静态内容，建议前端首次请求后缓存
- 内容来源于 `文字资料/一人公司.md` 基础设施章节

---

#### 3.8.2 获取城市政策信息

根据用户所在城市获取当地一人公司扶持政策。

- **URL**: `GET /api/v1/compliance/city-policy`
- **鉴权**: 是
- **优先级**: P2

**请求参数**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `city_level` | string | 是 | 城市等级。枚举：`一线` / `新一线` / `二线` / `三线` |

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "city_level": "一线",
    "policies": [
      {
        "title": "个体工商户注册政策",
        "description": "...",
        "source": "...",
        "updated_at": "2026-01-01"
      }
    ]
  }
}
```

**业务规则**:
- 内容来源于 `一人公司城市选择分析.md`
- 前端可传用户 `user_profiles` 中存储的 `city` 字段

---

### 3.9 复盘模块（Review）

#### 3.9.1 创建复盘记录

用户按周期填写复盘内容。

- **URL**: `POST /api/v1/review`
- **鉴权**: 是
- **优先级**: P2

**请求体**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cycle` | string | 是 | 复盘周期。枚举：`weekly` / `monthly` / `quarterly` |
| `period_label` | string | 是 | 周期标签（如 `2026年4月第3周`、`2026年4月`） |
| `revenue` | string | 否 | 本期收入 |
| `traffic` | string | 否 | 本期流量/访客数 |
| `customers` | string | 否 | 本期客户数 |
| `efficiency` | string | 否 | 效率改善说明 |
| `next_goal` | string | 否 | 下期目标 |
| `notes` | string | 否 | 其他备注。最大 1000 字 |

**请求示例**:

```json
{
  "cycle": "weekly",
  "period_label": "2026年4月第3周",
  "revenue": "500 元",
  "traffic": "1200 UV",
  "customers": "3",
  "efficiency": "用AI助手后，内容产出效率提升了一倍",
  "next_goal": "下周发布 5 篇内容，争取新增 200 粉丝",
  "notes": ""
}
```

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "review_id": 10,
    "created_at": "2026-04-18T16:00:00+08:00"
  }
}
```

**涉及数据库表**: 建议新增 `user_reviews` 表

---

#### 3.9.2 获取复盘记录列表

- **URL**: `GET /api/v1/review/list`
- **鉴权**: 是
- **优先级**: P2

**请求参数**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cycle` | string | 否 | 按周期筛选。枚举：`weekly` / `monthly` / `quarterly` |
| `page` | integer | 否 | 页码，默认 1 |
| `page_size` | integer | 否 | 每页条数，默认 10，最大 50 |

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 5,
    "page": 1,
    "page_size": 10,
    "reviews": [
      {
        "id": 10,
        "cycle": "weekly",
        "period_label": "2026年4月第3周",
        "revenue": "500 元",
        "traffic": "1200 UV",
        "customers": "3",
        "efficiency": "用AI助手后，内容产出效率提升了一倍",
        "next_goal": "下周发布 5 篇内容",
        "created_at": "2026-04-18T16:00:00+08:00",
        "updated_at": "2026-04-18T16:00:00+08:00"
      }
    ]
  }
}
```

---

#### 3.9.3 获取单条复盘详情

- **URL**: `GET /api/v1/review/:id`
- **鉴权**: 是
- **优先级**: P2

**路径参数**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | integer | 是 | 复盘记录 ID |

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 10,
    "cycle": "weekly",
    "period_label": "2026年4月第3周",
    "revenue": "500 元",
    "traffic": "1200 UV",
    "customers": "3",
    "efficiency": "用AI助手后，内容产出效率提升了一倍",
    "next_goal": "下周发布 5 篇内容，争取新增 200 粉丝",
    "notes": "",
    "created_at": "2026-04-18T16:00:00+08:00",
    "updated_at": "2026-04-18T16:00:00+08:00"
  }
}
```

---

#### 3.9.4 更新复盘记录

- **URL**: `PUT /api/v1/review/:id`
- **鉴权**: 是
- **优先级**: P2

**路径参数**: 同 3.9.3

**请求体**: 同 3.9.1（所有字段可选，仅传需更新的字段）

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "review_id": 10,
    "updated_at": "2026-04-18T17:00:00+08:00"
  }
}
```

---

### 3.10 系统模块（System）

#### 3.10.1 获取前端系统配置

获取前端需要的系统配置项，如功能开关、提示文案等。

- **URL**: `GET /api/v1/system/config`
- **鉴权**: 是
- **优先级**: P0

**请求参数**: 无

**成功响应** (`code: 0`):

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "review_enabled": true,
    "city_policy_enabled": false,
    "mbti_fast_mode_available": true,
    "mbti_total_questions": 93,
    "mbti_fast_mode_questions": 30,
    "info_collect_steps": 7,
    "ai_team_questions": 10,
    "app_version": "1.0.0",
    "maintenance_mode": false
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `review_enabled` | boolean | 复盘功能是否开启 |
| `city_policy_enabled` | boolean | 城市政策功能是否开启 |
| `mbti_fast_mode_available` | boolean | MBTI 快速版是否可用 |
| `mbti_total_questions` | integer | MBTI 完整版题数 |
| `mbti_fast_mode_questions` | integer | MBTI 快速版题数 |
| `maintenance_mode` | boolean | 是否处于维护模式 |

**涉及数据库表**: `sys_config`

**业务规则**:
- 前端启动时应优先调用此接口获取配置
- 配置数据缓存于 Redis，更新后 5 分钟内生效

---


## 5. 接口开发优先级与里程碑

### P0 -- 核心接口（黑客松必须完成）

| 里程碑 | 包含接口 | 预估工时 | 依赖 |
|--------|----------|----------|------|
| M1-认证 | `/auth/register`、`/auth/login`、`/auth/refresh` | 3h | 数据库初始化 |
| M2-用户与信息采集 | `/user/profile`、`/user/info`、`/info-collect/*` | 3h | M1 |
| M3-MBTI | `/mbti/questions`、`/mbti/progress`、`/mbti/answer`、`/mbti/submit`、`/mbti/result` | 4h | M1 |
| M4-分析 | `/analysis/trigger`、`/analysis/result`、`/analysis/status` | 5h | M2 + M3 |
| M5-系统配置 | `/system/config` | 0.5h | M1 |
| **P0 合计** | | **15.5h** | |

### P1 -- 重要接口（尽量完成）

| 里程碑 | 包含接口 | 预估工时 |
|--------|----------|----------|
| M6-反馈 | `/feedback` | 1h |
| M7-合规 | `/compliance/guides` | 1h |
| M8-AI 团队 | `/ai-team/*` | 3h |

### P2 -- 锦上添花

| 里程碑 | 包含接口 | 预估工时 |
|--------|----------|----------|
| M10-城市政策 | `/compliance/city-policy` | 1h |
| M11-复盘 | `/review/*` | 2h |
| M12-头像 | `/user/avatar` | 0.5h |

---

## 6. 附录

### 附录 A：前端 Store 与后端接口映射

| Pinia Store | 对应后端接口 |
|-------------|-------------|
| `auth.ts` | `/auth/register`、`/auth/login`、`/auth/refresh` |
| `infoCollect.ts` | `/info-collect/progress`、`/info-collect/step`、`/info-collect/complete`、`/user/info` |
| `mbti.ts` | `/mbti/questions`、`/mbti/progress`、`/mbti/answer`、`/mbti/submit`、`/mbti/result` |
| `result.ts` | `/analysis/trigger`、`/analysis/result`、`/analysis/status` |
| `aiTeam.ts` | `/ai-team/questions`、`/ai-team/submit`、`/ai-team/result`、`/ai-team/roles/:roleId` |
| `app.ts` | `/system/config` |

### 附录 B：LLM Prompt 构建要点

分析模块（`/analysis/trigger`）是后端的核心复杂度所在。LLM Prompt 需包含以下信息：

| 信息来源 | 内容 | 用途 |
|----------|------|------|
| 用户信息采集 7 个字段 | 城市等级、性别、工作强度、技能、方向偏好、目的、时间偏好 | 画像生成依据 |
| MBTI 四维度得分 | E/I、S/N、T/F、J/P 各端得分 | 性格分析与方向匹配 |
| 七大方向知识库 | 每个方向的详细说明、收入范围、案例 | 推荐方向的内容基础 |
| MBTI 与方向映射表 | 16 种类型对应的适合方向和盲区（PRD 附录 A） | 方向匹配的参考矩阵 |
| 四型分类矩阵 | 保守型/平衡型/激进型的判断条件和策略 | 用户类型判断 |

LLM 返回格式必须为严格 JSON，包含 `profile`、`directions`、`user_type`、`summary` 四个顶层字段。

### 附录 C：敏感数据加密策略

| 字段 | 加密方式 | 说明 |
|------|----------|------|
| `users.username` | 明文存储 | 用户名用于登录查询，需建立唯一索引（大小写不敏感） |
| `users.password_hash` | bcrypt | 密码哈希存储，cost factor 建议为 12 |
| `users.email` | AES-256 | 邮箱加密存储（预留字段） |
| `users.real_name` | AES-256 | 真实姓名加密存储（预留字段） |
| JWT Token | HS256 | 签名密钥存储于环境变量 |

---

*文档版本: v1.0*
*创建日期: 2026-04-18*
*适用范围: SoloPilot 后端开发、前后端联调、接口测试*
