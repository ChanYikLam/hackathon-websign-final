# SoloPilot 后端 API 项目

> AI驱动的一人公司创业助手 - 后端 API 服务

## 项目简介

SoloPilot 是一个帮助用户评估和规划一人公司创业方向的 AI 驱动平台。本项目提供完整的 RESTful API 接口，涵盖用户认证、信息采集、MBTI测评、AI分析、AI团队测评、反馈、合规与复盘、系统配置等功能模块。

---

## 快速开始

### 环境要求

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | >= 16.0.0 | JavaScript 运行环境 |
| MySQL | >= 8.0 或 MariaDB >= 10.5 | 数据库服务 |
| npm | >= 8.0.0 | 包管理器 |

### 安装步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd solopilot-backend

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写正确的数据库连接信息和密钥

# 4. 初始化数据库
mysql -u root -p < database-schema.sql
# 或按表逐个导入
mysql -u root -p solopilot_db < sql/users.sql

# 5. 启动服务
npm start        # 生产模式
npm run dev      # 开发模式（自动重启）

# 6. 验证服务
curl http://localhost:3000/api/v1/health
```

### 目录结构

```
solopilot-backend/
├── app.js                 # 应用入口
├── package.json           # 项目配置
├── .env                   # 环境变量（不提交到版本控制）
├── .env.example           # 环境变量模板
├── .gitignore             # Git忽略配置
├── database-schema.sql    # 完整数据库结构
├── API文档.md             # 接口文档
├── test-api.js            # 自动化测试脚本
├── README.md              # 本文件
├── sql/                   # 单表SQL导出文件
│   ├── users.sql
│   ├── user_profiles.sql
│   └── ...
├── public/                # 静态文件
│   └── test.html          # 浏览器测试页面
└── src/
    ├── config/            # 配置中心
    │   ├── index.js       # 全局配置
    │   └── database.js    # 数据库连接池
    ├── middleware/        # 中间件
    │   ├── auth.js        # JWT认证中间件
    │   └── error.js       # 统一错误处理
    ├── routes/            # 路由模块
    │   ├── index.js       # 路由聚合
    │   ├── auth.js        # 认证模块
    │   ├── infoCollect.js # 信息采集模块
    │   ├── mbti.js        # MBTI测评模块
    │   ├── analysis.js    # AI分析模块
    │   ├── aiTeam.js      # AI团队模块
    │   ├── aiLogs.js      # AI日志模块
    │   ├── feedback.js    # 反馈模块
    │   ├── compliance.js  # 合规模块
    │   ├── reviews.js     # 复盘模块
    │   └── system.js      # 系统配置模块
    └── utils/             # 工具函数
        ├── auth.js        # JWT工具
        └── crypto.js      # 加密工具
```

---

## Postman 接口测试指南

本指南详细说明如何使用 Postman 对项目中的所有 API 接口进行测试。

### 一、测试环境准备

#### 1.1 软件安装

1. **下载 Postman**
   - 访问 [Postman 官网](https://www.postman.com/downloads/)
   - 选择对应操作系统版本下载
   - 安装完成后启动 Postman

2. **安装 Node.js 和 MySQL**（用于本地运行服务）
   - Node.js: https://nodejs.org/
   - MySQL: https://dev.mysql.com/downloads/

#### 1.2 启动本地服务器

```bash
# 确保数据库已创建并初始化
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS solopilot_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p solopilot_db < database-schema.sql

# 启动服务
npm start
# 或开发模式
npm run dev
```

服务启动后，终端应显示：
```
✓ Database connection pool created successfully

🚀 SoloPilot Server running at http://localhost:3000
📡 API Base URL: http://localhost:3000/api/v1
```

#### 1.3 环境变量配置

确认 `.env` 文件配置正确：

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=solopilot_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your_32char_encryption_key!!
```

---

### 二、Postman 集合配置

#### 2.1 创建新集合

1. 打开 Postman，点击左上角 **New** → **Collection**
2. 命名集合为 `SoloPilot API`
3. 添加描述：`SoloPilot 后端 API 测试集合`
4. 点击 **Create**

#### 2.2 配置集合变量

1. 选中 `SoloPilot API` 集合，点击 **Variables** 标签
2. 添加以下变量：

| 变量名 | 初始值 | 类型 | 说明 |
|--------|--------|------|------|
| `baseUrl` | `http://localhost:3000` | default | API 基础地址 |
| `apiVersion` | `api/v1` | default | API 版本 |
| `token` | (留空) | current | 认证 Token（登录后自动填充） |
| `userId` | (留空) | current | 用户 ID（登录后自动填充） |
| `taskId` | (留空) | current | 分析任务 ID |
| `reviewId` | (留空) | current | 复盘记录 ID |

#### 2.3 配置集合前置脚本

在集合的 **Pre-request Script** 标签中添加：

```javascript
// 无需特殊处理，各请求独立配置
```

#### 2.4 配置集合测试脚本

在集合的 **Tests** 标签中添加：

```javascript
// 自动解析响应数据
const response = pm.response.json();

// 验证响应格式
pm.test("响应格式正确", function() {
    pm.expect(response).to.have.property("code");
    pm.expect(response).to.have.property("message");
    pm.expect(response).to.have.property("data");
});

// 验证成功响应
if (pm.response.code === 200 || pm.response.code === 201) {
    pm.test("请求成功", function() {
        pm.expect(response.code).to.eql(0);
    });
}
```

---

### 三、接口测试详细流程

#### 3.1 健康检查（无需认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/health` |

**预期响应 (200):**

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

**Tests 脚本:**

```javascript
pm.test("健康检查成功", function() {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.code).to.eql(0);
    pm.expect(response.message).to.include("running");
});
```

---

#### 3.2 用户注册

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `POST` |
| URL | `{{baseUrl}}/{{apiVersion}}/auth/register` |
| Body → raw → JSON | 见下方 |

**请求参数:**

```json
{
  "username": "testuser_{{timestamp}}",
  "password": "password123",
  "nickname": "测试用户",
  "email": "test@example.com",
  "phone": "13800138000"
}
```

> **注意**: 使用 `{{timestamp}}` 作为时间戳，需在 Pre-request Script 中设置：
> ```javascript
> pm.variables.set("timestamp", new Date().getTime());
> ```

**Tests 脚本:**

```javascript
pm.test("注册成功", function() {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.code).to.eql(0);
    pm.expect(response.data).to.have.property("userId");
    pm.expect(response.data).to.have.property("token");
    
    // 保存 token 和 userId 到集合变量
    pm.collectionVariables.set("token", response.data.token);
    pm.collectionVariables.set("userId", response.data.userId);
});
```

**预期响应 (201):**

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

---

#### 3.3 用户登录

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `POST` |
| URL | `{{baseUrl}}/{{apiVersion}}/auth/login` |
| Body → raw → JSON | 见下方 |

**请求参数:**

```json
{
  "username": "testuser_{{timestamp}}",
  "password": "password123"
}
```

**Tests 脚本:**

```javascript
pm.test("登录成功", function() {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.code).to.eql(0);
    pm.expect(response.data).to.have.property("token");
    
    pm.collectionVariables.set("token", response.data.token);
    pm.collectionVariables.set("userId", response.data.userId);
});
```

**预期响应 (200):**

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

---

#### 3.4 获取用户资料（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/auth/profile` |
| Headers → Authorization | `Bearer {{token}}` |

**Tests 脚本:**

```javascript
pm.test("获取用户资料成功", function() {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.code).to.eql(0);
    pm.expect(response.data).to.have.property("username");
});
```

---

#### 3.5 更新用户资料（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `PUT` |
| URL | `{{baseUrl}}/{{apiVersion}}/auth/profile` |
| Headers → Authorization | `Bearer {{token}}` |
| Body → raw → JSON | 见下方 |

**请求参数:**

```json
{
  "nickname": "更新后的昵称",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

#### 3.6 刷新 Token

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `POST` |
| URL | `{{baseUrl}}/{{apiVersion}}/auth/refresh-token` |
| Body → raw → JSON | 见下方 |

**请求参数:**

```json
{
  "token": "{{token}}"
}
```

**Tests 脚本:**

```javascript
pm.test("刷新Token成功", function() {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.code).to.eql(0);
    pm.expect(response.data).to.have.property("token");
    pm.collectionVariables.set("token", response.data.token);
});
```

---

#### 3.7 信息采集 - 提交单步答案（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `POST` |
| URL | `{{baseUrl}}/{{apiVersion}}/info-collect/step` |
| Headers → Authorization | `Bearer {{token}}` |
| Body → raw → JSON | 见下方 |

**步骤 1 - 城市等级:**

```json
{
  "step": 1,
  "value": "一线"
}
```

**步骤 2 - 性别:**

```json
{
  "step": 2,
  "value": "男"
}
```

**步骤 3 - 工作强度:**

```json
{
  "step": 3,
  "value": "965"
}
```

**步骤 4 - 核心技能:**

```json
{
  "step": 4,
  "value": "编程",
  "skill_other": "前端开发、Node.js"
}
```

**步骤 5 - 方向偏好:**

```json
{
  "step": 5,
  "value": "SaaS产品"
}
```

**步骤 6 - 创业目的:**

```json
{
  "step": 6,
  "value": "实现财务自由"
}
```

**步骤 7 - 时间偏好:**

```json
{
  "step": 7,
  "value": "工作日晚上和周末"
}
```

---

#### 3.8 查询采集进度（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/info-collect/progress` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.9 标记采集完成（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `POST` |
| URL | `{{baseUrl}}/{{apiVersion}}/info-collect/complete` |
| Headers → Authorization | `Bearer {{token}}` |
| Body → raw → JSON | `{}` |

---

#### 3.10 MBTI测评 - 提交（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `POST` |
| URL | `{{baseUrl}}/{{apiVersion}}/mbti/submit` |
| Headers → Authorization | `Bearer {{token}}` |
| Body → raw → JSON | 见下方 |

**请求参数（示例93题答案）:**

```json
{
  "answers": [
    {"questionNum": 1, "option_key": "E"},
    {"questionNum": 2, "option_key": "I"},
    {"questionNum": 3, "option_key": "S"},
    {"questionNum": 4, "option_key": "N"},
    {"questionNum": 5, "option_key": "T"},
    {"questionNum": 6, "option_key": "F"},
    {"questionNum": 7, "option_key": "J"},
    {"questionNum": 8, "option_key": "P"}
  ]
}
```

> **注意**: 实际需要提交 93 道题的答案，选项值为 E/I/S/N/T/F/J/P 中的一个

**Tests 脚本:**

```javascript
pm.test("MBTI提交成功", function() {
    pm.response.to.have.status(200);
    const response = pm.response.json();
    pm.expect(response.code).to.eql(0);
    pm.expect(response.data).to.have.property("mbtiType");
});
```

---

#### 3.11 MBTI测评 - 获取结果（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/mbti/result` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.12 触发AI分析（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `POST` |
| URL | `{{baseUrl}}/{{apiVersion}}/analysis/trigger` |
| Headers → Authorization | `Bearer {{token}}` |
| Body → raw → JSON | `{}` |

**Tests 脚本:**

```javascript
pm.test("触发分析成功", function() {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.code).to.eql(0);
    pm.expect(response.data).to.have.property("taskId");
    pm.collectionVariables.set("taskId", response.data.taskId);
});
```

---

#### 3.13 查询分析任务状态（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/analysis/status/{{taskId}}` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.14 获取分析结果（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/analysis/result` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.15 AI团队测评 - 提交（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `POST` |
| URL | `{{baseUrl}}/{{apiVersion}}/ai-team/assess` |
| Headers → Authorization | `Bearer {{token}}` |
| Body → raw → JSON | 见下方 |

**请求参数（10题答案）:**

```json
{
  "answers": {
    "1": "A",
    "2": "A",
    "3": "A",
    "4": "B",
    "5": "A",
    "6": "B",
    "7": "A",
    "8": "A",
    "9": "B",
    "10": "A"
  }
}
```

---

#### 3.16 获取AI团队结果（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/ai-team/result` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.17 获取AI团队角色详情（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/ai-team/roles/A` |
| Headers → Authorization | `Bearer {{token}}` |

> 路径参数 `A` 可替换为 `A/B/C/D/E/F`

---

#### 3.18 提交反馈（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `POST` |
| URL | `{{baseUrl}}/{{apiVersion}}/feedback` |
| Headers → Authorization | `Bearer {{token}}` |
| Body → raw → JSON | 见下方 |

**请求参数:**

```json
{
  "rating": 5,
  "comment": "非常详细的分析，对我帮助很大！",
  "direction_preference": "否"
}
```

---

#### 3.19 获取反馈列表（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/feedback` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.20 获取合规指引（无需认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/compliance/guidelines` |

---

#### 3.21 获取城市政策（无需认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/compliance/city-policy?city=北京` |

**查询参数:**

| 参数 | 类型 | 说明 |
|------|------|------|
| `city` | string | 城市名称 |

---

#### 3.22 创建复盘记录（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `POST` |
| URL | `{{baseUrl}}/{{apiVersion}}/reviews` |
| Headers → Authorization | `Bearer {{token}}` |
| Body → raw → JSON | 见下方 |

**请求参数:**

```json
{
  "cycle": "weekly",
  "period_label": "2026年4月第3周",
  "revenue": "$1000",
  "traffic": "5000",
  "customers": "10",
  "next_goal": "提高收入到$2000"
}
```

**Tests 脚本:**

```javascript
pm.test("创建复盘成功", function() {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.code).to.eql(0);
    pm.expect(response.data).to.have.property("reviewId");
    pm.collectionVariables.set("reviewId", response.data.reviewId);
});
```

---

#### 3.23 获取复盘列表（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/reviews?page=1&limit=10` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.24 获取单条复盘（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/reviews/{{reviewId}}` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.25 更新复盘记录（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `PUT` |
| URL | `{{baseUrl}}/{{apiVersion}}/reviews/{{reviewId}}` |
| Headers → Authorization | `Bearer {{token}}` |
| Body → raw → JSON | 见下方 |

**请求参数:**

```json
{
  "revenue": "$1500",
  "next_goal": "更新后的目标"
}
```

---

#### 3.26 删除复盘记录（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `DELETE` |
| URL | `{{baseUrl}}/{{apiVersion}}/reviews/{{reviewId}}` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.27 获取系统配置（无需认证 - 公开配置）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/system/config` |

---

#### 3.28 获取所有系统配置（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/system/config/all` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.29 创建系统配置（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `POST` |
| URL | `{{baseUrl}}/{{apiVersion}}/system/config` |
| Headers → Authorization | `Bearer {{token}}` |
| Body → raw → JSON | 见下方 |

**请求参数:**

```json
{
  "config_key": "test_feature_flag",
  "config_value": "true",
  "category": "test",
  "description": "测试功能开关",
  "is_public": 0
}
```

---

#### 3.30 获取单个系统配置（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/system/config/test_feature_flag` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.31 更新系统配置（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `PUT` |
| URL | `{{baseUrl}}/{{apiVersion}}/system/config/test_feature_flag` |
| Headers → Authorization | `Bearer {{token}}` |
| Body → raw → JSON | 见下方 |

**请求参数:**

```json
{
  "config_value": "false",
  "description": "更新后的描述"
}
```

---

#### 3.32 获取配置分类列表（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `GET` |
| URL | `{{baseUrl}}/{{apiVersion}}/system/config/categories/list` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.33 删除系统配置（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `DELETE` |
| URL | `{{baseUrl}}/{{apiVersion}}/system/config/test_feature_flag` |
| Headers → Authorization | `Bearer {{token}}` |

---

#### 3.34 MBTI重置（需要认证）

**请求配置:**

| 项目 | 值 |
|------|-----|
| 方法 | `POST` |
| URL | `{{baseUrl}}/{{apiVersion}}/mbti/reset` |
| Headers → Authorization | `Bearer {{token}}` |
| Body → raw → JSON | `{}` |

---

### 四、认证请求的通用配置

对于所有需要认证的接口，请在 Postman 请求的 **Headers** 标签中添加：

| Header Key | Header Value |
|------------|--------------|
| `Authorization` | `Bearer {{token}}` |
| `Content-Type` | `application/json` |

或在集合的 **Authorization** 标签中配置：
- **Type**: Bearer Token
- **Token**: `{{token}}`

---

### 五、测试结果验证

#### 5.1 响应结构验证

所有 API 响应遵循统一格式：

```json
{
  "code": 0,
  "message": "操作描述",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | number | `0` 表示成功，非 `0` 表示错误 |
| `message` | string | 操作结果描述 |
| `data` | object/array/null | 返回的数据内容 |

#### 5.2 常见状态码

| HTTP 状态码 | 说明 |
|-------------|------|
| `200` | 请求成功 |
| `201` | 资源创建成功 |
| `400` | 请求参数错误 |
| `401` | 未认证/认证失败 |
| `403` | 账号被禁用 |
| `404` | 资源不存在 |
| `429` | 请求频率限制 |

#### 5.3 业务错误码

| 错误码 | 说明 |
|--------|------|
| `0` | 成功 |
| `1001` | 缺少认证头 |
| `1002` | Token 已过期 |
| `1003` | Token 无效 |
| `1004` | 用户名或密码错误 |
| `2001` | 信息采集未完成 |
| `2002` | MBTI测评未完成 |

---

### 六、常见问题排查与解决办法

#### 6.1 连接失败

**问题**: 请求返回 `Connection Refused` 或 `ECONNREFUSED`

**排查步骤**:
1. 检查服务器是否正在运行：
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Linux/Mac
   lsof -i :3000
   ```
2. 确认 `.env` 文件中 `PORT=3000`
3. 检查防火墙是否阻止了 3000 端口
4. 查看服务器终端是否有错误日志

#### 6.2 认证失败

**问题**: 返回 `401 Unauthorized` 或 `{"code": 1001, "message": "Missing authorization header"}`

**排查步骤**:
1. 确认请求头中包含 `Authorization: Bearer <token>`
2. 检查 token 是否已过期（默认 7 天）
3. 使用刷新 Token 接口获取新 token
4. 确认 token 格式正确，无多余空格

**解决办法**:
```
1. 重新登录获取新 token
2. 在 Postman 集合变量中更新 token
3. 或使用刷新接口：POST /api/v1/auth/refresh-token
```

#### 6.3 速率限制

**问题**: 返回 `429 Too Many Requests`

**排查步骤**:
1. 查看错误信息中的限制说明
2. 检查请求频率是否超过限制

**速率限制规则**:

| 接口 | 限制 | 时间窗口 |
|------|------|----------|
| 登录 | 5 次 | 15 分钟 |
| 注册 | 5 次 | 1 小时 |
| AI分析触发 | 3 次 | 10 分钟 |
| 其他接口 | 60 次 | 1 分钟 |

**解决办法**:
- 等待一段时间后重试
- 开发测试时可临时调整 `.env` 中的限制配置

#### 6.4 参数验证失败

**问题**: 返回 `400 Bad Request` 和参数错误信息

**排查步骤**:
1. 检查请求体格式是否为 JSON
2. 确认 `Content-Type: application/json` 头存在
3. 查看错误信息中的具体参数要求
4. 检查必填字段是否缺失

#### 6.5 数据库错误

**问题**: 返回 `500 Internal Server Error` 和数据库相关错误

**排查步骤**:
1. 检查 MySQL 服务是否运行
2. 确认 `.env` 中数据库配置正确
3. 查看服务器终端错误日志
4. 验证数据库和表是否存在

**解决办法**:
```bash
# 检查 MySQL 服务
mysql -u root -p -e "SHOW DATABASES;"

# 重新导入数据库
mysql -u root -p solopilot_db < database-schema.sql
```

#### 6.6 CORS 错误

**问题**: 浏览器控制台显示 CORS 跨域错误

**排查步骤**:
1. 确认服务器已启用 `cors` 中间件
2. 检查 `CORS_ORIGIN` 环境变量配置
3. 开发模式下默认允许所有来源

#### 6.7 Token 刷新失败

**问题**: 刷新 Token 接口返回错误

**排查步骤**:
1. 确认请求体中包含有效的 token
2. 检查 token 是否已完全过期（超过刷新宽限期）
3. 如果完全过期，需要重新登录

---

### 七、测试完成后的报告整理建议

#### 7.1 测试报告模板

```markdown
# SoloPilot API 测试报告

## 测试信息
- 测试日期: YYYY-MM-DD
- 测试人员: XXX
- 测试环境: 开发/测试/生产
- Postman 版本: vX.X.X

## 测试概览
- 总测试用例: XX
- 通过: XX
- 失败: XX
- 跳过: XX
- 通过率: XX%

## 模块测试结果

### 认证模块
| 接口 | 状态 | 备注 |
|------|------|------|
| 用户注册 | ✅ 通过 | |
| 用户登录 | ✅ 通过 | |
| 刷新Token | ✅ 通过 | |
| 获取用户资料 | ✅ 通过 | |
| 更新用户资料 | ✅ 通过 | |

### 信息采集模块
| 接口 | 状态 | 备注 |
|------|------|------|
| 提交单步答案 | ✅ 通过 | 7步全部完成 |
| 查询进度 | ✅ 通过 | |
| 标记完成 | ✅ 通过 | |

## 失败用例分析

### 用例 XX: XXX接口
- **失败原因**: XXX
- **错误信息**: XXX
- **解决建议**: XXX

## 性能测试
- 平均响应时间: XX ms
- 最长响应时间: XX ms
- 最短响应时间: XX ms

## 问题与建议
1. XXX
2. XXX
```

#### 7.2 使用 Postman 导出测试报告

1. **导出集合**:
   - 右键点击集合 → **Export**
   - 选择格式 → **JSON**
   - 保存文件

2. **导出运行结果**:
   - 打开 **Runner** (集合右键 → **Run collection**)
   - 运行完整测试
   - 完成后点击 **Export Results** → **JSON/CSV**

3. **生成可视化报告**:
   - 使用 Postman Dashboard 查看历史运行结果
   - 或使用 Newman CLI 生成 HTML 报告:
     ```bash
     newman run solopilot-api.postman_collection.json -r html
     ```

#### 7.3 持续集成建议

- 使用 Newman 将 Postman 集合集成到 CI/CD 流水线
- 设置定时任务自动运行 API 测试
- 配置测试失败告警通知

---

### 八、API 接口总览

| 模块 | 接口数 | 需要认证 | 说明 |
|------|--------|----------|------|
| 健康检查 | 1 | ❌ | 服务状态检查 |
| 认证模块 | 6 | 部分 | 用户注册、登录、资料管理 |
| 信息采集 | 4 | ✅ | 7步信息采集 |
| MBTI测评 | 4 | ✅ | 93题测评 |
| AI分析 | 3 | ✅ | 异步分析任务 |
| AI团队 | 3 | ✅ | 团队角色评估 |
| 反馈 | 2 | ✅ | 用户反馈 |
| 合规 | 2 | ❌ | 合规指引和政策 |
| 复盘 | 5 | ✅ | CRUD 操作 |
| 系统配置 | 6 | 部分 | 配置管理 |
| **总计** | **36** | - | - |

---

### 九、安全注意事项

1. **密钥管理**
   - 不要将 `.env` 文件提交到版本控制
   - 生产环境使用强密码和密钥
   - 定期更换 JWT_SECRET 和 ENCRYPTION_KEY

2. **认证安全**
   - Token 有效期为 7 天，建议生产环境缩短
   - 登录失败 5 次将锁定账号 15 分钟
   - 使用 HTTPS 传输敏感数据

3. **速率限制**
   - 生产环境建议启用更严格的限流策略
   - 考虑使用 Redis 实现分布式限流

4. **输入验证**
   - 所有接口均使用 express-validator 进行参数验证
   - SQL 查询使用参数化语句防止注入攻击

---

### 十、技术支持

如有问题，请：
1. 查看服务器终端日志
2. 检查数据库连接状态
3. 参考 [API文档.md](API文档.md) 获取详细接口说明
4. 运行自动化测试: `npm test`

---

**版本**: 1.0.0  
**最后更新**: 2026-04-18
