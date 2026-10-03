const express = require("express");
const { asyncHandler } = require("../middleware/error");
const router = express.Router();

// GET /api/v1/compliance/guidelines（原有）
router.get(
  "/guidelines",
  asyncHandler(async (req, res) => {
    res.json({
      code: 0,
      data: {
        guidelines: [
          {
            title: "Business Registration",
            content: "Register your business according to local regulations.",
          },
          {
            title: "Tax Compliance",
            content: "Keep accurate financial records and file taxes on time.",
          },
          {
            title: "Intellectual Property",
            content:
              "Protect your intellectual property through proper registration.",
          },
        ],
      },
    });
  }),
);

// GET /api/v1/compliance/guides（前端使用的路径别名，指向同一个逻辑）
router.get(
  "/guides",
  asyncHandler(async (req, res) => {
    const category = req.query.category;

    // 返回基础合规指引数据
    const baseGuides = [
      { category: "no_company", title: "个体工商户注册", sections: [{ subtitle: "注册流程", content: "个体工商户注册相对简单，可在线办理。准备好身份证、经营场所证明等材料，到当地市场监管局或通过政务服务平台申请即可。" }] },
      { category: "register", title: "公司注册指南", sections: [{ subtitle: "一人有限公司", content: "一人有限责任公司是指只有一个自然人股东或者一个法人股东的有限责任公司。股东以其认缴的出资额为限对公司承担责任。" }] },
      { category: "tax", title: "税务申报须知", sections: [{ subtitle: "纳税义务", content: "无论是否开展业务，每月都需要按时进行税务申报（即使零收入也要申报）。逾期可能产生罚款。" }] },
    ];

    let guides = baseGuides;
    if (category) {
      guides = baseGuides.filter(g => g.category === category);
    }

    res.json({ code: 0, data: { guides } });
  }),
);

// GET /api/v1/compliance/city-policy
router.get(
  "/city-policy",
  asyncHandler(async (req, res) => {
    // 兼容前端传的 city_level 参数
    const cityLevel = req.query.city_level || req.query.city || req.query.cityLevel;
    
    if (!cityLevel) {
      return res
        .status(400)
        .json({ code: 400, message: "请提供城市等级参数" });
    }

    res.json({
      code: 0,
      data: {
        city_level: cityLevel,
        policies: [
          {
            title: "个体工商户注册政策",
            description: `${cityLevel}城市对个体工商户提供便捷注册服务，可在线办理，3个工作日内完成。`,
            source: "地方市场监管局",
            updated_at: new Date().toISOString().slice(0, 10),
          },
          {
            title: "创业扶持补贴",
            description: `符合条件的${cityLevel}城市一人公司可申请创业扶持补贴，最高可达10万元。`,
            source: "人力资源和社会保障局",
            updated_at: new Date().toISOString().slice(0, 10),
          },
        ],
      },
    });
  }),
);

module.exports = router;
