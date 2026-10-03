const axios = require("axios");

const API_BASE = "http://localhost:3000/api/v1";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function logResponse(title, data) {
  console.log(`\n${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.cyan}${"─".repeat(50)}${colors.reset}`);
  console.log(JSON.stringify(data, null, 2));
  console.log(`${colors.cyan}${"─".repeat(50)}${colors.reset}`);
}

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI() {
  log("\n🚀 开始测试 SoloPilot API 接口\n", "blue");

  let authToken = "";
  let taskId = "";
  let reviewId = "";

  try {
    // 1. 健康检查
    log("\n📌 测试 1: 健康检查", "yellow");
    const healthResponse = await axios.get(`${API_BASE}/health`);
    logResponse("✅ 健康检查成功", healthResponse.data);

    // 2. 获取公开系统配置
    log("\n📌 测试 2: 获取公开系统配置", "yellow");
    const configResponse = await axios.get(`${API_BASE}/system/config`);
    logResponse("✅ 获取系统配置成功", configResponse.data);

    // 3. 用户注册
    log("\n📌 测试 3: 用户注册", "yellow");
    const registerData = {
      username: "solopilot_user_" + Date.now(),
      password: "password123",
      nickname: "测试用户",
    };

    try {
      const registerResponse = await axios.post(
        `${API_BASE}/auth/register`,
        registerData,
      );
      logResponse("✅ 注册成功", registerResponse.data);
      authToken = registerResponse.data.data.token;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        log("⚠️  用户名已存在，尝试登录", "yellow");
      } else {
        throw error;
      }
    }

    // 4. 用户登录
    log("\n📌 测试 4: 用户登录", "yellow");
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      username: registerData.username,
      password: registerData.password,
    });
    logResponse("✅ 登录成功", loginResponse.data);
    authToken = loginResponse.data.data.token;

    const authHeaders = {
      headers: { Authorization: `Bearer ${authToken}` },
    };

    // 5. 获取用户资料
    log("\n📌 测试 5: 获取用户资料", "yellow");
    const profileResponse = await axios.get(
      `${API_BASE}/auth/profile`,
      authHeaders,
    );
    logResponse("✅ 获取用户资料成功", profileResponse.data);

    // 6. 更新用户资料
    log("\n📌 测试 6: 更新用户资料", "yellow");
    const updateProfileResponse = await axios.put(
      `${API_BASE}/auth/profile`,
      { nickname: "更新后的昵称", avatar: "https://example.com/avatar.jpg" },
      authHeaders,
    );
    logResponse("✅ 更新用户资料成功", updateProfileResponse.data);

    // 7. 更新头像
    log("\n📌 测试 7: 更新头像", "yellow");
    const avatarResponse = await axios.post(
      `${API_BASE}/auth/avatar`,
      { avatarUrl: "https://example.com/new-avatar.jpg" },
      authHeaders,
    );
    logResponse("✅ 更新头像成功", avatarResponse.data);

    // 8. 信息采集 - 提交单步答案 (7步)
    log("\n📌 测试 8: 信息采集 - 提交7步答案", "yellow");
    const steps = [
      { step: 1, value: "一线" },
      { step: 2, value: "男" },
      { step: 3, value: "965" },
      { step: 4, value: "编程" },
      { step: 5, value: "SaaS产品" },
      { step: 6, value: "实现财务自由" },
      { step: 7, value: "工作日晚上和周末" },
    ];

    for (const step of steps) {
      const stepResponse = await axios.post(
        `${API_BASE}/info-collect/step`,
        step,
        authHeaders,
      );
      log(`  ✓ Step ${step.step} 提交成功`, "green");
    }

    // 9. 查询采集进度
    log("\n📌 测试 9: 查询采集进度", "yellow");
    const progressResponse = await axios.get(
      `${API_BASE}/info-collect/progress`,
      authHeaders,
    );
    logResponse("✅ 查询进度成功", progressResponse.data);

    // 10. 标记完成
    log("\n📌 测试 10: 标记信息采集完成", "yellow");
    const completeResponse = await axios.post(
      `${API_BASE}/info-collect/complete`,
      {},
      authHeaders,
    );
    logResponse("✅ 标记完成成功", completeResponse.data);

    // 11. 获取所有答案
    log("\n📌 测试 11: 获取所有答案", "yellow");
    const answersResponse = await axios.get(
      `${API_BASE}/info-collect`,
      authHeaders,
    );
    logResponse("✅ 获取答案成功", answersResponse.data);

    // 12. MBTI测评 - 提交
    // MBTI 测评 - 提交 93 题
    // option_key: A 对应维度左字母(E/S/T/J)，B 对应维度右字母(I/N/F/P)
    log("\n📌 测试 12: MBTI测评 - 提交", "yellow");
    const mbtiAnswers = [];
    for (let i = 1; i <= 93; i++) {
      mbtiAnswers.push({
        questionNum: i,
        option_key: i % 2 === 0 ? "A" : "B",
      });
    }

    const mbtiResponse = await axios.post(
      `${API_BASE}/mbti/submit`,
      { answers: mbtiAnswers },
      authHeaders,
    );
    logResponse("✅ MBTI提交成功", mbtiResponse.data);

    // 13. MBTI测评 - 获取结果
    log("\n📌 测试 13: 获取MBTI结果", "yellow");
    const mbtiResultResponse = await axios.get(
      `${API_BASE}/mbti/result`,
      authHeaders,
    );
    logResponse("✅ 获取MBTI结果成功", mbtiResultResponse.data);

    // 14. 触发AI分析
    log("\n📌 测试 14: 触发AI分析", "yellow");
    const triggerResponse = await axios.post(
      `${API_BASE}/analysis/trigger`,
      {},
      authHeaders,
    );
    logResponse("✅ 触发分析成功", triggerResponse.data);
    taskId = triggerResponse.data.data.taskId;

    // 等待分析完成
    log("  ⏳ 等待分析完成...", "yellow");
    await new Promise((resolve) => setTimeout(resolve, 4000));

    // 15. 查询分析任务状态
    log("\n📌 测试 15: 查询分析任务状态", "yellow");
    const statusResponse = await axios.get(
      `${API_BASE}/analysis/status/${taskId}`,
      authHeaders,
    );
    logResponse("✅ 查询状态成功", statusResponse.data);

    // 16. 获取分析结果
    log("\n📌 测试 16: 获取分析结果", "yellow");
    const analysisResultResponse = await axios.get(
      `${API_BASE}/analysis/result`,
      authHeaders,
    );
    logResponse("✅ 获取分析结果成功", analysisResultResponse.data);

    // 17. AI团队测评
    log("\n📌 测试 17: AI团队测评", "yellow");
    const aiTeamAnswers = {};
    for (let i = 1; i <= 10; i++) {
      aiTeamAnswers[i.toString()] = "A";
    }

    const aiTeamResponse = await axios.post(
      `${API_BASE}/ai-team/assess`,
      { answers: aiTeamAnswers },
      authHeaders,
    );
    logResponse("✅ AI团队测评成功", aiTeamResponse.data);

    // 18. 获取AI团队结果
    log("\n📌 测试 18: 获取AI团队结果", "yellow");
    const aiTeamResultResponse = await axios.get(
      `${API_BASE}/ai-team/result`,
      authHeaders,
    );
    logResponse("✅ 获取AI团队结果成功", aiTeamResultResponse.data);

    // 19. 获取角色详情
    log("\n📌 测试 19: 获取角色详情", "yellow");
    const rolesResponse = await axios.get(
      `${API_BASE}/ai-team/roles/A`,
      authHeaders,
    );
    logResponse("✅ 获取角色详情成功", rolesResponse.data);

    // 20. 提交反馈
    log("\n📌 测试 20: 提交反馈", "yellow");
    const feedbackResponse = await axios.post(
      `${API_BASE}/feedback`,
      {
        rating: 5,
        comment: "Very helpful analysis!",
        direction_preference: "否",
      },
      authHeaders,
    );
    logResponse("✅ 提交反馈成功", feedbackResponse.data);

    // 21. 获取反馈列表
    log("\n📌 测试 21: 获取反馈列表", "yellow");
    const feedbackListResponse = await axios.get(
      `${API_BASE}/feedback`,
      authHeaders,
    );
    logResponse("✅ 获取反馈列表成功", feedbackListResponse.data);

    // 22. 获取合规指引
    log("\n📌 测试 22: 获取合规指引", "yellow");
    const guidelinesResponse = await axios.get(
      `${API_BASE}/compliance/guidelines`,
    );
    logResponse("✅ 获取合规指引成功", guidelinesResponse.data);

    // 23. 获取城市政策
    log("\n📌 测试 23: 获取城市政策", "yellow");
    const policyResponse = await axios.get(
      `${API_BASE}/compliance/city-policy?city=北京`,
    );
    logResponse("✅ 获取城市政策成功", policyResponse.data);

    // 24. 创建复盘记录
    log("\n📌 测试 24: 创建复盘记录", "yellow");
    const reviewResponse = await axios.post(
      `${API_BASE}/reviews`,
      {
        cycle: "weekly",
        period_label: "2026年4月第3周",
        revenue: "$1000",
        traffic: "5000",
        customers: "10",
        next_goal: "Increase revenue to $2000",
      },
      authHeaders,
    );
    logResponse("✅ 创建复盘记录成功", reviewResponse.data);
    reviewId = reviewResponse.data.data.reviewId;

    // 25. 获取复盘列表
    log("\n📌 测试 25: 获取复盘列表", "yellow");
    const reviewsResponse = await axios.get(`${API_BASE}/reviews`, authHeaders);
    logResponse("✅ 获取复盘列表成功", reviewsResponse.data);

    // 26. 获取单条复盘
    log("\n📌 测试 26: 获取单条复盘", "yellow");
    const singleReviewResponse = await axios.get(
      `${API_BASE}/reviews/${reviewId}`,
      authHeaders,
    );
    logResponse("✅ 获取单条复盘成功", singleReviewResponse.data);

    // 27. 更新复盘记录
    log("\n📌 测试 27: 更新复盘记录", "yellow");
    const updateReviewResponse = await axios.put(
      `${API_BASE}/reviews/${reviewId}`,
      { revenue: "$1500", next_goal: "Updated goal" },
      authHeaders,
    );
    logResponse("✅ 更新复盘记录成功", updateReviewResponse.data);

    // 28. 删除复盘记录
    log("\n📌 测试 28: 删除复盘记录", "yellow");
    const deleteReviewResponse = await axios.delete(
      `${API_BASE}/reviews/${reviewId}`,
      authHeaders,
    );
    logResponse("✅ 删除复盘记录成功", deleteReviewResponse.data);

    // 29. 获取所有系统配置
    log("\n📌 测试 29: 获取所有系统配置", "yellow");
    const allConfigResponse = await axios.get(
      `${API_BASE}/system/config/all`,
      authHeaders,
    );
    logResponse("✅ 获取所有系统配置成功", allConfigResponse.data);

    // 30. 创建系统配置
    log("\n📌 测试 30: 创建系统配置", "yellow");
    const createConfigResponse = await axios.post(
      `${API_BASE}/system/config`,
      {
        config_key: "test_feature_flag",
        config_value: "true",
        category: "test",
        description: "Test feature flag",
        is_public: 0,
      },
      authHeaders,
    );
    logResponse("✅ 创建系统配置成功", createConfigResponse.data);

    // 31. 获取单个系统配置
    log("\n📌 测试 31: 获取单个系统配置", "yellow");
    const singleConfigResponse = await axios.get(
      `${API_BASE}/system/config/test_feature_flag`,
      authHeaders,
    );
    logResponse("✅ 获取单个系统配置成功", singleConfigResponse.data);

    // 32. 更新系统配置
    log("\n📌 测试 32: 更新系统配置", "yellow");
    const updateConfigResponse = await axios.put(
      `${API_BASE}/system/config/test_feature_flag`,
      { config_value: "false", description: "Updated description" },
      authHeaders,
    );
    logResponse("✅ 更新系统配置成功", updateConfigResponse.data);

    // 33. 获取配置分类列表
    log("\n📌 测试 33: 获取配置分类列表", "yellow");
    const categoriesResponse = await axios.get(
      `${API_BASE}/system/config/categories/list`,
      authHeaders,
    );
    logResponse("✅ 获取配置分类列表成功", categoriesResponse.data);

    // 34. 删除系统配置
    log("\n📌 测试 34: 删除系统配置", "yellow");
    const deleteConfigResponse = await axios.delete(
      `${API_BASE}/system/config/test_feature_flag`,
      authHeaders,
    );
    logResponse("✅ 删除系统配置成功", deleteConfigResponse.data);

    // 35. 刷新Token
    log("\n📌 测试 35: 刷新Token", "yellow");
    const refreshTokenResponse = await axios.post(
      `${API_BASE}/auth/refresh-token`,
      {
        token: authToken,
      },
    );
    logResponse("✅ 刷新Token成功", refreshTokenResponse.data);

    // 36. MBTI重置
    log("\n📌 测试 36: MBTI重置", "yellow");
    const resetMbtiResponse = await axios.post(
      `${API_BASE}/mbti/reset`,
      {},
      authHeaders,
    );
    logResponse("✅ MBTI重置成功", resetMbtiResponse.data);

    log("\n✅ 所有 36 项测试通过！", "green");
    log("\n📊 测试总结:", "blue");
    log("  - 健康检查：✓", "green");
    log("  - 用户认证：✓（注册、登录、Token刷新、资料CRUD）", "green");
    log("  - 信息采集：✓（7步提交、进度查询、完成标记）", "green");
    log("  - MBTI测评：✓（提交、结果获取、重置）", "green");
    log("  - AI分析：✓（触发、状态查询、结果获取）", "green");
    log("  - AI团队：✓（测评、结果、角色详情）", "green");
    log("  - 反馈：✓（提交、列表查询）", "green");
    log("  - 合规：✓（指引、城市政策）", "green");
    log("  - 复盘：✓（CRUD完整测试）", "green");
    log("  - 系统配置：✓（CRUD、分类列表）", "green");
    log("\n", "reset");
  } catch (error) {
    log("\n❌ 测试失败！", "red");
    if (error.response) {
      log(`状态码：${error.response.status}`, "red");
      logResponse("错误详情", error.response.data);
    } else if (error.request) {
      log("无法连接到服务器，请确保服务器正在运行", "red");
      log(`错误：${error.message}`, "red");
    } else {
      log(`错误：${error.message}`, "red");
    }
    process.exit(1);
  }
}

// 检查必要的依赖
try {
  require.resolve("axios");
} catch (error) {
  log("❌ 缺少 axios 依赖，正在安装...", "red");
  const { execSync } = require("child_process");
  execSync("npm install axios", { stdio: "inherit" });
}

testAPI();
