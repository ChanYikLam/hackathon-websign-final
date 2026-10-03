const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const chatRoutes = require("./chat");
const infoCollectRoutes = require("./infoCollect");
const mbtiRoutes = require("./mbti");
const analysisRoutes = require("./analysis");
const aiTeamRoutes = require("./aiTeam");
const aiLogsRoutes = require("./aiLogs");
const feedbackRoutes = require("./feedback");
const complianceRoutes = require("./compliance");
const reviewsRoutes = require("./reviews");
const systemRoutes = require("./system");

// ---- 主路由（原有）----
router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/info-collect", infoCollectRoutes);
router.use("/mbti", mbtiRoutes);
router.use("/analysis", analysisRoutes);
router.use("/ai-team", aiTeamRoutes);
router.use("/ai-logs", aiLogsRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/compliance", complianceRoutes);
router.use("/reviews", reviewsRoutes);
router.use("/system", systemRoutes);

// ---- 路由别名（对齐新前端 API 规范）----

// Auth: 前端用 /user/*，后端是 /auth/*
router.use("/user", authRoutes);

// Review: 前端用 /review*，后端是 /reviews*
router.use("/review", reviewsRoutes);

router.get("/health", (req, res) => {
  res.json({
    code: 0,
    message: "SoloPilot API 运行正常",
    data: { version: "1.0.0", timestamp: new Date().toISOString() },
  });
});

module.exports = router;
