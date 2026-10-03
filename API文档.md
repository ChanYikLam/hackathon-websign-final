# SoloPilot API 接口文档

> **版本**: v1.0 | **基础路径**: `/api/v1` | **协议**: HTTPS + JSON

---

## 目录

- [通用约定](#通用约定)
- [错误码说明](#错误码说明)
- [1. 认证模块 (Auth)](#1-认证模块-auth)
- [2. 信息采集模块 (Info Collect)](#2-信息采集模块-info-collect)
- [3. MBTI测评模块](#3-mbti测评模块)
- [4. 分析模块 (Analysis)](#4-分析模块-analysis)
- [5. AI团队模块 (AI Team)](#5-ai团队模块-ai-team)
- [6. 反馈模块 (Feedback)](#6-反馈模块-feedback)
- [7. 合规与复盘模块 (Compliance & Reviews)](#7-合规与复盘模块-compliance--reviews)
- [8. 系统配置模块 (System)](#8-系统配置模块-system)

---

## 通用约定

| 项目 | 规范 |
|------|------|
| 鉴权方式 | Bearer Token（JWT），除标注「无需认证」的接口外均需携带 |
| 请求头 | `Content-Type: application/json`、`Authorization: Bearer {token}` |
| 时间格式 | ISO 8601（`YYYY-MM-DDTHH:mm:ss.sssZ`） |
| 响应结构 | `{ "code": number, "message": string, "data": any }` |

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| `0` | 成功 |
| `400` | 请求参数错误 |
| `401` | 未认证/认证失败 |
| `403` | 账号被禁用 |
| `404` | 资源不存在 |
| `429` | 请求频率限制 |
| `1001` | 缺少认证头 |
| `1002` | Token已过期 |
| `1003` | Token无效 |
| `1004` | 用户名或密码错误/用户不存在 |
| `2001` | 信息采集未完成 |
| `2002` | MBTI测评未完成 |
| `3001` | AI分析服务异常 |

---

## 1. 认证模块 (Auth)

### 1.1 用户注册

- **POST** `/api/v1/auth/register`
- **频率限制**: 同一IP 1小时限5次
- **无需认证**

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名（3-50字符） |
| password | string | 是 | 密码（至少6字符） |
| nickname | string | 否 | 昵称 |
| email | string | 否 | 邮箱 |
| phone | string | 否 | 手机号 |

**响应:**

```json
{
  "code": 0,
  "message": "Registration successful",
  "data": {
    "userId": 1,
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 1.2 用户登录

- **POST** `/api/v1/auth/login`
- **频率限制**: 同一IP 1分钟限10次，连续失败5次锁定15分钟
- **无需认证**

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应:**

```json
{
  "code": 0,
  "message": "Login successful",
  "data": {
    "userId": 1,
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 1.3 刷新Token

- **POST** `/api/v1/auth/refresh-token`
- **无需认证**

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| token | string | 是 | 当前Token |

### 1.4 获取用户资料

- **GET** `/api/v1/auth/profile`
- **需要认证**

### 1.5 更新用户资料

- **PUT** `/api/v1/auth/profile`
- **需要认证**

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | 否 | 昵称 |
| avatar | string | 否 | 头像URL |

### 1.6 更新头像

- **POST** `/api/v1/auth/avatar`
- **需要认证**

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| avatarUrl | string | 是 | 头像URL |

---

## 2. 信息采集模块 (Info Collect)

### 2.1 提交单步答案

- **POST** `/api/v1/info-collect/step`
- **需要认证**

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| step | int | 是 | 步骤编号（1-7） |
| value | string | 是 | 答案值 |
| skill_other | string | 否 | 自定义技能描述（仅step=4时有效） |

**步骤映射:**

| Step | Field | 说明 |
|------|-------|------|
| 1 | city | 城市等级 |
| 2 | gender | 性别 |
| 3 | intensity | 工作强度偏好 |
| 4 | skill | 核心技能 |
| 5 | direction | 方向偏好 |
| 6 | purpose | 创业目的 |
| 7 | schedule | 时间偏好 |

### 2.2 查询采集进度

- **GET** `/api/v1/info-collect/progress`
- **需要认证**

### 2.3 标记完成

- **POST** `/api/v1/info-collect/complete`
- **需要认证**

### 2.4 获取所有答案

- **GET** `/api/v1/info-collect`
- **需要认证**

---

## 3. MBTI测评模块

### 3.1 提交测评

- **POST** `/api/v1/mbti/submit`
- **需要认证**

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| answers | array | 是 | 93道题的答案数组 |

**回答格式:** `[{ "questionNum": 1, "option_key": "E" }, ...]`

### 3.2 保存进度

- **POST** `/api/v1/mbti/progress`
- **需要认证**

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| answeredCount | int | 是 | 已答题数 |
| totalQuestions | int | 是 | 总题数 |

### 3.3 获取测评结果

- **GET** `/api/v1/mbti/result`
- **需要认证**

### 3.4 重置测评

- **POST** `/api/v1/mbti/reset`
- **需要认证**

---

## 4. 分析模块 (Analysis)

### 4.1 触发分析

- **POST** `/api/v1/analysis/trigger`
- **需要认证**
- **频率限制**: 同一用户10分钟限3次
- **前置条件**: 信息采集和MBTI测评均完成

### 4.2 查询任务状态

- **GET** `/api/v1/analysis/status/:taskId`
- **需要认证**

**响应:**

```json
{
  "code": 0,
  "data": {
    "task_id": "uuid-here",
    "status": "queued|processing|completed|failed",
    "progress": 50,
    "started_at": "2026-04-18T10:00:00Z"
  }
}
```

### 4.3 获取分析结果

- **GET** `/api/v1/analysis/result`
- **需要认证**

---

## 5. AI团队模块 (AI Team)

### 5.1 提交测评

- **POST** `/api/v1/ai-team/assess`
- **需要认证**

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| answers | object | 是 | 10道题的答案，格式：`{"1":"A","2":"B",...}` |

### 5.2 获取测评结果

- **GET** `/api/v1/ai-team/result`
- **需要认证**

### 5.3 获取角色详情

- **GET** `/api/v1/ai-team/roles/:planType`
- **需要认证**

**路径参数:** `planType` - A/B/C/D/E/F

---

## 6. 反馈模块 (Feedback)

### 6.1 提交反馈

- **POST** `/api/v1/feedback`
- **需要认证**
- **限制**: 每用户最多5条

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| rating | int | 是 | 满意度评分（1-5） |
| comment | string | 否 | 文字反馈 |
| direction_preference | string | 否 | 是否想探索其他方向 |

### 6.2 获取反馈列表

- **GET** `/api/v1/feedback`
- **需要认证**

---

## 7. 合规与复盘模块 (Compliance & Reviews)

### 7.1 获取合规指引

- **GET** `/api/v1/compliance/guidelines`
- **无需认证**

### 7.2 获取城市政策

- **GET** `/api/v1/compliance/city-policy?city=北京`
- **查询参数**: `city` - 城市名称

### 7.3 创建复盘记录

- **POST** `/api/v1/reviews`
- **需要认证**

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| cycle | string | 是 | 周期：weekly/monthly/quarterly |
| period_label | string | 是 | 周期标签 |
| revenue | string | 否 | 营收 |
| traffic | string | 否 | 流量 |
| customers | string | 否 | 客户数 |
| efficiency | string | 否 | 效率提升 |
| next_goal | string | 否 | 下期目标 |
| notes | string | 否 | 备注 |

### 7.4 获取复盘列表

- **GET** `/api/v1/reviews`
- **需要认证**

**查询参数:** `cycle`（可选）、`page`、`limit`

### 7.5 获取单条复盘

- **GET** `/api/v1/reviews/:id`
- **需要认证**

### 7.6 更新复盘记录

- **PUT** `/api/v1/reviews/:id`
- **需要认证**

### 7.7 删除复盘记录

- **DELETE** `/api/v1/reviews/:id`
- **需要认证**

---

## 8. 系统配置模块 (System)

### 8.1 获取公开配置

- **GET** `/api/v1/system/config`
- **无需认证**

### 8.2 获取所有配置

- **GET** `/api/v1/system/config/all`
- **需要认证**

### 8.3 创建配置

- **POST** `/api/v1/system/config`
- **需要认证**

### 8.4 获取单个配置

- **GET** `/api/v1/system/config/:key`
- **需要认证**

### 8.5 更新配置

- **PUT** `/api/v1/system/config/:key`
- **需要认证**

### 8.6 删除配置

- **DELETE** `/api/v1/system/config/:key`
- **需要认证**

### 8.7 获取配置分类列表

- **GET** `/api/v1/system/config/categories/list`
- **需要认证**

---

## 附录

### A. 健康检查

- **GET** `/api/v1/health`
- **无需认证**

```json
{
  "code": 0,
  "message": "SoloPilot API is running",
  "data": {
    "version": "1.0.0",
    "timestamp": "2026-04-18T10:00:00.000Z"
  }
}
```

### B. AI团队方案类型

| 类型 | 名称 | 匹配规则 |
|------|------|----------|
| A | Content Creator | A选项≥6个 |
| B | Marketing Expert | A选项≥4个 |
| C | Tech Entrepreneur | Q8=A且Q5=A |
| D | Operations Specialist | Q8=C且Q3=C |
| E | Consultant | 其他模式 |
| F | Explorer | 默认兜底 |

**优先级**: C > D > E > F > A/B
