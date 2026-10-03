// SoloPilot API 测试脚本
const API_BASE = "http://localhost:3000/api/v1";

// 工具函数
function log(message, type = "info") {
  const output = document.getElementById("output");
  const color =
    type === "error" ? "#ff6b6b" : type === "success" ? "#51cf66" : "#74c0fc";
  output.innerHTML += `<div style="color: ${color}; margin: 5px 0;">${message}</div>`;
  output.scrollTop = output.scrollHeight;
}

function logResponse(data) {
  const output = document.getElementById("output");
  output.innerHTML += `<pre style="background: #2d333b; padding: 10px; border-radius: 6px; overflow-x: auto; font-size: 12px; color: #e6edf3;">${JSON.stringify(data, null, 2)}</pre>`;
  output.scrollTop = output.scrollHeight;
}

function getToken() {
  return localStorage.getItem("token") || "";
}

function setToken(token) {
  localStorage.setItem("token", token);
  document.getElementById("tokenDisplay").innerHTML =
    '<div class="token-display"><div class="token-label">当前 Token</div>' + token + "</div>";
  log("✅ Token 已保存", "success");
}

function clearOutput() {
  document.getElementById("output").innerHTML = "";
}

async function apiRequest(endpoint, method = "GET", body = null, useAuth = false) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (useAuth) {
    const token = getToken();
    if (!token) {
      log("❌ 请先登录获取 Token", "error");
      return null;
    }
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    log(`📡 ${method} ${endpoint}`);
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      log(`❌ HTTP ${response.status}: ${data.message || response.statusText}`, "error");
    }
    logResponse(data);
    return data;
  } catch (error) {
    log(`❌ 请求失败: ${error.message}`, "error");
    return null;
  }
}

// ========== 健康检查与系统配置 ==========
function testHealth() {
  clearOutput();
  apiRequest("/health");
}

function testPublicConfig() {
  clearOutput();
  apiRequest("/system/config");
}

// ========== 用户认证 ==========
function testRegister() {
  clearOutput();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  if (!username || !password) {
    log("❌ 请输入用户名和密码", "error");
    return;
  }
  if (username.length < 3 || username.length > 50) {
    log("❌ 用户名需 3-50 个字符", "error");
    return;
  }
  if (password.length < 6) {
    log("❌ 密码至少 6 个字符", "error");
    return;
  }
  apiRequest("/auth/register", "POST", { username, password }).then((data) => {
    if (data?.data?.token) setToken(data.data.token);
  });
}

function testLogin() {
  clearOutput();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  if (!username || !password) {
    log("❌ 请输入用户名和密码", "error");
    return;
  }
  apiRequest("/auth/login", "POST", { username, password }).then((data) => {
    if (data?.data?.token) setToken(data.data.token);
  });
}

function testGetProfile() {
  clearOutput();
  apiRequest("/auth/profile", "GET", null, true);
}

function testUpdateProfile() {
  clearOutput();
  apiRequest("/auth/profile", "PUT", { nickname: "测试用户" + Date.now() }, true);
}

function testUpdateAvatar() {
  clearOutput();
  apiRequest("/auth/avatar", "POST", { avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + Date.now() }, true);
}

// ========== 信息采集 ==========
function testSubmitInfo() {
  clearOutput();
  const steps = [
    { step: 1, value: "北京" },
    { step: 2, value: "男" },
    { step: 3, value: "996" },
    { step: 4, value: "前端开发" },
    { step: 5, value: "SaaS" },
    { step: 6, value: "财务自由" },
    { step: 7, value: "周末双休" },
  ];

  steps.forEach((item, index) => {
    setTimeout(() => {
      apiRequest("/info-collect/step", "POST", item, true);
    }, index * 500);
  });
}

function testGetProgress() {
  clearOutput();
  apiRequest("/info-collect/progress", "GET", null, true);
}

function testMarkComplete() {
  clearOutput();
  apiRequest("/info-collect/complete", "POST", {}, true);
}

function testGetAllAnswers() {
  clearOutput();
  apiRequest("/info-collect", "GET", null, true);
}

// ========== MBTI 测评 ==========
function testSubmitMbti() {
  clearOutput();
  const opts = ["E", "I", "S", "N", "T", "F", "J", "P"];
  const answers = [];
  for (let i = 1; i <= 93; i++) {
    answers.push({ questionNum: i, option_key: opts[i % 8] });
  }
  apiRequest("/mbti/submit", "POST", { answers }, true);
}

function testGetMbtiResult() {
  clearOutput();
  apiRequest("/mbti/result", "GET", null, true);
}

function testResetMbti() {
  clearOutput();
  apiRequest("/mbti/reset", "POST", {}, true);
}

// ========== AI 智能分析 ==========
function testTriggerAnalysis() {
  clearOutput();
  apiRequest("/analysis/trigger", "POST", {}, true);
}

function testGetAnalysisStatus() {
  clearOutput();
  const taskId = prompt("请输入任务 ID（从触发分析返回的 taskId）:");
  if (taskId) {
    apiRequest(`/analysis/status/${taskId}`, "GET", null, true);
  }
}

function testGetAnalysisResult() {
  clearOutput();
  apiRequest("/analysis/result", "GET", null, true);
}

// ========== AI 团队配置 ==========
function testSubmitTeamAnswers() {
  clearOutput();
  const answers = {
    "1": "A", "2": "A", "3": "A", "4": "A", "5": "A",
    "6": "A", "7": "A", "8": "A", "9": "A", "10": "A",
  };
  apiRequest("/ai-team/assess", "POST", { answers }, true);
}

function testGetTeamResult() {
  clearOutput();
  apiRequest("/ai-team/result", "GET", null, true);
}

function testGetTeamRole(roleId) {
  clearOutput();
  apiRequest(`/ai-team/roles/${roleId}`, "GET", null, true);
}

// ========== 反馈 ==========
function testSubmitFeedback() {
  clearOutput();
  apiRequest("/feedback", "POST", { rating: 5, comment: "测试反馈" }, true);
}

function testGetFeedback() {
  clearOutput();
  apiRequest("/feedback", "GET", null, true);
}

// ========== 合规指引 ==========
function testGetCompliance() {
  clearOutput();
  apiRequest("/compliance/guidelines");
}

// ========== 复盘管理 ==========
function testCreateReview() {
  clearOutput();
  apiRequest("/reviews", "POST", {
    cycle: "weekly",
    period_label: "2026年第16周",
    revenue: "¥1000",
    notes: "测试复盘",
  }, true);
}

function testGetReviews() {
  clearOutput();
  apiRequest("/reviews", "GET", null, true);
}

function testGetReviewDetail() {
  clearOutput();
  const id = prompt("请输入复盘 ID:");
  if (id) apiRequest(`/reviews/${id}`, "GET", null, true);
}

function testUpdateReview() {
  clearOutput();
  const id = prompt("请输入复盘 ID:");
  if (id) {
    apiRequest(`/reviews/${id}`, "PUT", {
      notes: "更新后的复盘内容 " + Date.now(),
    }, true);
  }
}

function testDeleteReview() {
  clearOutput();
  const id = prompt("请输入复盘 ID:");
  if (id) apiRequest(`/reviews/${id}`, "DELETE", null, true);
}

// ========== 系统配置 ==========
function testGetAllConfigs() {
  clearOutput();
  apiRequest("/system/config/all", "GET", null, true);
}

function testCreateConfig() {
  clearOutput();
  log("⚠️ 创建配置需要管理员权限，普通用户会返回 403", "info");
  apiRequest("/system/config", "POST", {
    config_key: "test_key_" + Date.now(),
    config_value: "test_value",
    category: "test",
    description: "测试配置",
  }, true);
}

function testGetConfigDetail() {
  clearOutput();
  const key = prompt("请输入配置 key:");
  if (key) apiRequest(`/system/config/${key}`, "GET", null, true);
}

function testUpdateConfig() {
  clearOutput();
  const key = prompt("请输入配置 key:");
  if (key) {
    apiRequest(`/system/config/${key}`, "PUT", {
      config_value: "updated_" + Date.now(),
    }, true);
  }
}

function testGetConfigsByCategory() {
  clearOutput();
  apiRequest("/system/config/categories/list", "GET", null, true);
}

function testDeleteConfig() {
  clearOutput();
  const key = prompt("请输入配置 key:");
  if (key) apiRequest(`/system/config/${key}`, "DELETE", null, true);
}

// ========== Token 管理 ==========
function testRefreshToken() {
  clearOutput();
  const token = getToken();
  if (!token) { log("❌ 需要当前 Token 才能刷新", "error"); return; }
  apiRequest("/auth/refresh-token", "POST", { token }, true).then((data) => {
    if (data?.data?.token) setToken(data.data.token);
  });
}

// ========== 事件绑定 ==========
document.addEventListener("DOMContentLoaded", function () {
  const btnMap = {
    "health": testHealth,
    "public-config": testPublicConfig,
    "register": testRegister,
    "login": testLogin,
    "get-profile": testGetProfile,
    "update-profile": testUpdateProfile,
    "update-avatar": testUpdateAvatar,
    "refresh-token": testRefreshToken,
    "submit-info": testSubmitInfo,
    "get-progress": testGetProgress,
    "mark-complete": testMarkComplete,
    "get-answers": testGetAllAnswers,
    "submit-mbti": testSubmitMbti,
    "get-mbti": testGetMbtiResult,
    "reset-mbti": testResetMbti,
    "trigger-analysis": testTriggerAnalysis,
    "analysis-status": testGetAnalysisStatus,
    "analysis-result": testGetAnalysisResult,
    "submit-team": testSubmitTeamAnswers,
    "get-team": testGetTeamResult,
    "get-role-1": () => testGetTeamRole("A"),
    "get-role-2": () => testGetTeamRole("B"),
    "get-role-3": () => testGetTeamRole("C"),
    "submit-feedback": testSubmitFeedback,
    "get-feedback": testGetFeedback,
    "compliance": testGetCompliance,
    "create-review": testCreateReview,
    "get-reviews": testGetReviews,
    "get-review": testGetReviewDetail,
    "update-review": testUpdateReview,
    "delete-review": testDeleteReview,
    "get-configs": testGetAllConfigs,
    "create-config": testCreateConfig,
    "get-config": testGetConfigDetail,
    "update-config": testUpdateConfig,
    "get-config-category": testGetConfigsByCategory,
    "delete-config": testDeleteConfig,
  };

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const fn = btnMap[action];
    if (fn) fn();
    else log(`未知操作: ${action}`, "error");
  });

  log("🚀 SoloPilot API 测试页面已加载");
  log("💡 建议测试顺序: 登录 → 信息采集 → MBTI → AI团队 → AI分析");
  log("💡 需要登录 Token 的接口，必须先完成登录");
});
