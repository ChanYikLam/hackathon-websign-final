/**
 * 合规指引数据文件
 * 包含一人公司/个体创业者最常用的法律条款解读
 */

export interface ComplianceArticle {
  id: string
  title: string
  category: '公司法' | '税法' | '劳动法' | '知识产权' | '电子商务' | '个人信息' | '其他'
  lawName: string
  lawDate: string
  articleNumber: string
  content: string
  practicalGuide: string // 实务指南
  riskLevel: '高' | '中' | '低'
}

export interface ComplianceScenario {
  id: string
  title: string
  description: string
  relevantArticles: string[] // 关联的条款ID列表
  icon: string
  routePath: string // 路由路径
}

// 合规场景
export const complianceScenarios: ComplianceScenario[] = [
  {
    id: 'company-setup',
    title: '公司设立',
    description: '选择企业类型、注册资本、股权结构',
    relevantArticles: ['公司法-13', '公司法-23', '个独法-8'],
    icon: 'lucide:building-2',
    routePath: '/compliance/company-setup'
  },
  {
    id: 'tax-compliance',
    title: '税务合规',
    description: '纳税申报、发票管理、税收优惠',
    relevantArticles: ['企税-1', '企税-4', '个税-2', '征管-51'],
    icon: 'lucide:receipt',
    routePath: '/compliance/tax-compliance'
  },
  {
    id: 'labor-employment',
    title: '劳动用工',
    description: '劳动合同、社保缴纳、加班调休',
    relevantArticles: ['劳动法-10', '劳动法-16', '劳动法-20'],
    icon: 'lucide:users',
    routePath: '/compliance/labor-employment'
  },
  {
    id: 'data-privacy',
    title: '数据隐私',
    description: '用户数据收集、存储、使用、跨境传输',
    relevantArticles: ['个保-13', '个保-17', '网安-41', '数安-27'],
    icon: 'lucide:shield',
    routePath: '/compliance/data-privacy'
  },
  {
    id: 'intellectual-property',
    title: '知识产权',
    description: '商标注册、著作权保护、专利申请',
    relevantArticles: ['商标-3', '商标-4', '著作权-2', '著作权-10', '专利-11'],
    icon: 'lucide:lightbulb',
    routePath: '/compliance/intellectual-property'
  },
  {
    id: 'e-commerce',
    title: '电子商务',
    description: '平台入驻、商品描述、消费者权益',
    relevantArticles: ['电商-16', '电商-17', '电商-49', '消保-8'],
    icon: 'lucide:shopping-bag',
    routePath: '/compliance/e-commerce'
  },
  {
    id: 'advertising',
    title: '广告宣传',
    description: '广告内容合规、极限用语、代言人责任',
    relevantArticles: ['广告法-9', '广告法-10', '广告法-28', '反不-8'],
    icon: 'lucide:megaphone',
    routePath: '/compliance/advertising'
  },
  {
    id: 'accounting',
    title: '财务合规',
    description: '会计核算、财务报表、审计要求',
    relevantArticles: ['会计-2', '会计-9', '会计-14'],
    icon: 'lucide:file-spreadsheet',
    routePath: '/compliance/accounting'
  }
]

// 核心法律条款
export const complianceArticles: ComplianceArticle[] = [
  // ========== 公司法 ==========
  {
    id: '公司法-13',
    title: '法定代表人',
    category: '公司法',
    lawName: '公司法',
    lawDate: '2023-12-29',
    articleNumber: '第十三条',
    content: '法定代表人依照公司章程的规定，由董事长、执行董事或者经理担任，并依法登记。',
    practicalGuide: '一人公司的法定代表人通常由唯一股东（也是执行董事兼经理）担任。建议在章程中明确约定，避免权责不清。',
    riskLevel: '高'
  },
  {
    id: '公司法-23',
    title: '公司注册资本',
    category: '公司法',
    lawName: '公司法',
    lawDate: '2023-12-29',
    articleNumber: '第二十三条',
    content: '有限责任公司的注册资本为在公司登记机关登记的全体股东认缴的出资额。法律、行政法规以及国务院决定对有限责任公司注册资本实缴、注册资本最低限额另有规定的，从其规定。',
    practicalGuide: '除特定行业外，公司法已取消最低注册资本限制。但注册资本应与经营规模相匹配，过高可能带来出资风险。',
    riskLevel: '中'
  },
  {
    id: '公司法-50',
    title: '股东表决权',
    category: '公司法',
    lawName: '公司法',
    lawDate: '2023-12-29',
    articleNumber: '第五十条',
    content: '股东会会议由股东按照出资比例行使表决权；但是，公司章程另有规定的除外。',
    practicalGuide: '一人公司不涉及表决权分配问题，但需注意股东决定应以书面形式记录并保存。',
    riskLevel: '低'
  },
  {
    id: '公司法-75',
    title: '一人公司特别规定',
    category: '公司法',
    lawName: '公司法',
    lawDate: '2023-12-29',
    articleNumber: '第七十五条',
    content: '只有一个股东的公司，其注册资本最低限额、设立程序、组织机构、股东权利义务等事项，由国务院规定。',
    practicalGuide: '一人有限公司仍需遵守公司法相关规定，建议咨询专业律师制定公司章程。',
    riskLevel: '高'
  },
  {
    id: '公司法-219',
    title: '公司合并分立',
    category: '公司法',
    lawName: '公司法',
    lawDate: '2023-12-29',
    articleNumber: '第二百一十九条',
    content: '公司合并应当签订合并协议，编制资产负债表和财产清单。公司应当自作出合并决议之日起十日内通知债权人，并于三十日内在报纸上或者国家企业信用信息公示系统公告。',
    practicalGuide: '公司合并、分立可能影响债权债务处理，一人公司更需注意资产独立性证明。',
    riskLevel: '中'
  },

  // ========== 个人独资企业法 ==========
  {
    id: '个独法-2',
    title: '个人独资企业定义',
    category: '公司法',
    lawName: '个人独资企业法',
    lawDate: '1999-08-30',
    articleNumber: '第二条',
    content: '本法所称个人独资企业，是指依照本法在中国境内设立，由一个自然人投资，财产为投资人个人所有，投资人以其个人财产对企业债务承担无限责任的经营实体。',
    practicalGuide: '注意：个人独资企业的投资人对企业债务承担无限责任，而非有限责任。这是与一人公司最大的区别。',
    riskLevel: '高'
  },
  {
    id: '个独法-8',
    title: '设立条件',
    category: '公司法',
    lawName: '个人独资企业法',
    lawDate: '1999-08-30',
    articleNumber: '第八条',
    content: '设立个人独资企业应当具备下列条件：（一）投资人为一个自然人；（二）有合法的企业名称；（三）有投资人申报的出资；（四）有固定的生产经营场所和必要的生产经营条件；（五）有必要的从业人员。',
    practicalGuide: '个人独资企业设立门槛低，但需有固定经营场所。创业者可根据业务需求选择是否需要有限责任保护。',
    riskLevel: '中'
  },
  {
    id: '个独法-16',
    title: '出资要求',
    category: '公司法',
    lawName: '个人独资企业法',
    lawDate: '1999-08-30',
    articleNumber: '第十六条',
    content: '法律、行政法规禁止从事营利性活动的人，不得作为投资人申请设立个人独资企业。',
    practicalGuide: '公务员、法官、检察官等特殊职业人员不得设立个人独资企业从事营利活动。',
    riskLevel: '低'
  },
  {
    id: '个独法-18',
    title: '事务管理',
    category: '公司法',
    lawName: '个人独资企业法',
    lawDate: '1999-08-30',
    articleNumber: '第十八条',
    content: '个人独资企业投资人可以自行管理企业事务，也可以委托或者聘用其他具有民事行为能力的人负责企业的事务管理。',
    practicalGuide: '即使委托他人管理，投资人仍需对企业债务承担无限责任。建议在委托合同中明确权责。',
    riskLevel: '中'
  },

  // ========== 企业所得税法 ==========
  {
    id: '企税-1',
    title: '纳税人',
    category: '税法',
    lawName: '企业所得税法',
    lawDate: '2018-12-29',
    articleNumber: '第一条',
    content: '在中华人民共和国境内，企业和其他取得收入的组织（以下统称企业）为企业所得税的纳税人，依照本法的规定缴纳企业所得税。个人独资企业、合伙企业不适用本法。',
    practicalGuide: '个人独资企业和合伙企业不缴纳企业所得税，而是由投资人缴纳个人所得税。这是选择企业类型时的重要考量因素。',
    riskLevel: '高'
  },
  {
    id: '企税-4',
    title: '小型微利企业优惠',
    category: '税法',
    lawName: '企业所得税法',
    lawDate: '2018-12-29',
    articleNumber: '第四条',
    content: '企业所得税的税率为百分之二十五，符合条件的小型微利企业减按百分之二十的税率征收企业所得税。',
    practicalGuide: '小型微利企业（年应纳税所得额≤300万元、从业人数≤300人、资产总额≤5000万元）享受20%优惠税率。',
    riskLevel: '高'
  },
  {
    id: '企税-26',
    title: '免税收入',
    category: '税法',
    lawName: '企业所得税法',
    lawDate: '2018-12-29',
    articleNumber: '第二十六条',
    content: '企业的下列收入为免税收入：（一）国债利息收入；（二）符合条件的居民企业之间的股息、红利等权益性投资收益；...',
    practicalGuide: '符合条件的居民企业投资收益可免税，如从子公司分红。但个人独资企业主分红需并入个税。',
    riskLevel: '中'
  },
  {
    id: '企税-28',
    title: '研发费用加计扣除',
    category: '税法',
    lawName: '企业所得税法',
    lawDate: '2018-12-29',
    articleNumber: '第二十八条',
    content: '企业的下列支出，可以在计算应纳税所得额时加计扣除：（一）开发新技术、新产品、新工艺发生的研究开发费用，...',
    practicalGuide: '研发费用可按实际发生额加计扣除（一般75%，科技型中小企业100%），是创业企业重要的税收优惠。',
    riskLevel: '中'
  },

  // ========== 个人所得税法 ==========
  {
    id: '个税-1',
    title: '纳税人',
    category: '税法',
    lawName: '个人所得税法',
    lawDate: '2018-08-31',
    articleNumber: '第一条',
    content: '在中国境内有住所，或者无住所而一个纳税年度内在中国境内居住累计满一百八十三天的个人，为居民个人，从中国境内和境外取得的所得，依照本法规定缴纳个人所得税。',
    practicalGuide: '居民个人需就全球所得纳税，非居民个人仅就境内所得纳税。创业初期需确定纳税身份。',
    riskLevel: '中'
  },
  {
    id: '个税-2',
    title: '个人独资企业所得',
    category: '税法',
    lawName: '个人所得税法',
    lawDate: '2018-08-31',
    articleNumber: '第二条',
    content: '下列各项个人所得，应当缴纳个人所得税：（一）工资、薪金所得；（二）劳务报酬所得；（三）稿酬所得；（四）特许权使用费所得；（五）经营所得；...',
    practicalGuide: '个人独资企业主经营所得适用经营所得税目，适用5%-35%超额累进税率。这是与公司制企业的重要区别。',
    riskLevel: '高'
  },
  {
    id: '个税-6',
    title: '专项附加扣除',
    category: '税法',
    lawName: '个人所得税法',
    lawDate: '2018-08-31',
    articleNumber: '第六条',
    content: '专项附加扣除，包括子女教育、继续教育、大病医疗、住房贷款利息或者住房租金、赡养老人等支出。',
    practicalGuide: '创业者本人及家人的专项附加扣除可按规定在个税税前扣除，合理降低税负。',
    riskLevel: '低'
  },

  // ========== 税收征收管理法 ==========
  {
    id: '征管-25',
    title: '纳税申报',
    category: '税法',
    lawName: '税收征收管理法',
    lawDate: '2015-04-24',
    articleNumber: '第二十五条',
    content: '纳税人必须依照法律、行政法规规定或者税务机关依照法律、行政法规的规定确定的申报期限、申报内容如实办理纳税申报，报送纳税申报表、财务会计报表以及税务机关根据实际需要要求纳税人报送的其他纳税资料。',
    practicalGuide: '无论是否有收入，均需按期申报。逾期申报会产生罚款和滞纳金，即使零申报也不能忽视。',
    riskLevel: '高'
  },
  {
    id: '征管-51',
    title: '发票管理',
    category: '税法',
    lawName: '税收征收管理法',
    lawDate: '2015-04-24',
    articleNumber: '第五十一条',
    content: '任何单位和个人有下列行为的，由税务机关责令限期改正，没收违法所得，可以并处一万元以下的罚款：（一）未按照规定的期限申报办理税务登记、变更或者注销登记的；（二）未按照规定设置、保管账簿或者保管记账凭证和有关资料的；...',
    practicalGuide: '发票管理不严可能面临严厉处罚。创业初期建议使用正规发票管理软件或委托代账公司。',
    riskLevel: '高'
  },

  // ========== 劳动法 ==========
  {
    id: '劳动法-10',
    title: '劳动合同签订',
    category: '劳动法',
    lawName: '劳动法',
    lawDate: '2018-12-29',
    articleNumber: '第十条',
    content: '建立劳动关系，应当订立书面劳动合同。已建立劳动关系，未同时订立书面劳动合同的，应当自用工之日起一个月内订立书面劳动合同。',
    practicalGuide: '用工之日起一个月内必须签订劳动合同，否则需支付双倍工资。创业者在雇佣第一名员工时务必注意。',
    riskLevel: '高'
  },
  {
    id: '劳动法-16',
    title: '试用期规定',
    category: '劳动法',
    lawName: '劳动法',
    lawDate: '2018-12-29',
    articleNumber: '第十六条',
    content: '劳动合同期限三个月以上不满一年的，试用期不得超过一个月；一年以上不满三年的，试用期不得超过二个月；三年以上固定期限和无固定期限的劳动合同，试用期不得超过六个月。',
    practicalGuide: '试用期不是强制的，且试用期工资不得低于正式工资的80%。不要重复约定试用期。',
    riskLevel: '中'
  },
  {
    id: '劳动法-20',
    title: '试用期工资',
    category: '劳动法',
    lawName: '劳动法',
    lawDate: '2018-12-29',
    articleNumber: '第二十条',
    content: '劳动者在试用期的工资不得低于本单位相同岗位最低档工资或者劳动合同约定工资的百分之八十，并不得低于用人单位所在地的最低工资标准。',
    practicalGuide: '试用期工资不得低于正式工资的80%，且不得低于当地最低工资。这是创业者在招聘时的硬性约束。',
    riskLevel: '中'
  },
  {
    id: '劳动法-31',
    title: '加班规定',
    category: '劳动法',
    lawName: '劳动法',
    lawDate: '2018-12-29',
    articleNumber: '第三十一条',
    content: '用人单位应当严格执行劳动定额标准，不得强迫或者变相强迫劳动者加班。用人单位安排加班的，应当按照国家有关规定向劳动者支付加班费。',
    practicalGuide: '工作日加班按工资150%支付，休息日加班200%，法定节假日300%。建议合理安排工作，避免加班费争议。',
    riskLevel: '中'
  },
  {
    id: '劳动法-38',
    title: '社保缴纳',
    category: '劳动法',
    lawName: '劳动法',
    lawDate: '2018-12-29',
    articleNumber: '第三十八条',
    content: '用人单位应当依法为劳动者缴纳社会保险费。劳动者有权查阅本人的社会保险缴纳记录。',
    practicalGuide: '社保是强制性的，即使员工自愿放弃也不能不缴。不缴社保可能面临补缴、罚款及员工索赔风险。',
    riskLevel: '高'
  },

  // ========== 电子商务法 ==========
  {
    id: '电商-9',
    title: '平台责任',
    category: '电子商务',
    lawName: '电子商务法',
    lawDate: '2018-08-31',
    articleNumber: '第九条',
    content: '本法所称电子商务经营者，是指通过互联网等信息网络从事销售商品或者提供服务经营活动的自然人、法人和非法人组织。',
    practicalGuide: '通过互联网开展经营活动的创业者都属于电子商务经营者，需依法办理市场主体登记（个人电商豁免登记的除外）。',
    riskLevel: '高'
  },
  {
    id: '电商-10',
    title: '市场主体登记',
    category: '电子商务',
    lawName: '电子商务法',
    lawDate: '2018-08-31',
    articleNumber: '第十条',
    content: '电子商务经营者应当依法办理市场主体登记。但个人销售自产农副产品、家庭手工业产品，或者个人利用自己的技能从事便民劳务活动和零星小额交易活动，以及依照法律、行政法规不需要进行登记的除外。',
    practicalGuide: '个人电商月销售额超过一定额度（各地不同，约10万元）需办理登记。建议尽早规范化。',
    riskLevel: '中'
  },
  {
    id: '电商-16',
    title: '搭售禁止',
    category: '电子商务',
    lawName: '电子商务法',
    lawDate: '2018-08-31',
    articleNumber: '第十六条',
    content: '电子商务经营者搭售商品或者服务，应当以显著方式提请消费者注意，不得将搭售商品或者服务作为默认同意的选项。',
    practicalGuide: '默认勾选额外付费服务是违规的。创业者在设计产品套餐时要避免强制搭售。',
    riskLevel: '中'
  },
  {
    id: '电商-17',
    title: '用户评价',
    category: '电子商务',
    lawName: '电子商务法',
    lawDate: '2018-08-31',
    articleNumber: '第十七条',
    content: '电子商务经营者应当全面、真实、准确、及时地披露商品或者服务信息，保障消费者的知情权和选择权。不得以虚构交易、编造用户评价等方式进行虚假或者引人误解的商业宣传，欺骗、误导消费者。',
    practicalGuide: '刷单、虚假好评是违法行为。创业者应通过真实服务获得好评，避免法律风险。',
    riskLevel: '高'
  },
  {
    id: '电商-38',
    title: '平台审核义务',
    category: '电子商务',
    lawName: '电子商务法',
    lawDate: '2018-08-31',
    articleNumber: '第三十八条',
    content: '电子商务平台经营者知道或者应当知道平台内经营者销售的商品或者提供的服务不符合保障人身、财产安全的要求，或者有其他侵害消费者合法权益行为，未采取必要措施的，依法与该平台内经营者承担连带责任。',
    practicalGuide: '如果平台未尽到审核义务导致消费者受损，平台需承担连带责任。自建平台的创业者需注意审核责任。',
    riskLevel: '高'
  },
  {
    id: '电商-49',
    title: '电子合同',
    category: '电子商务',
    lawName: '电子商务法',
    lawDate: '2018-08-31',
    articleNumber: '第四十九条',
    content: '电子商务当事人订立和履行合同，适用《民法典》合同编的规定。依法成立的合同，自成立时生效。',
    practicalGuide: '用户点击确认即视为合同成立。电商创业者需确保服务条款清晰、合法、有效。',
    riskLevel: '中'
  },

  // ========== 个人信息保护法 ==========
  {
    id: '个保-6',
    title: '收集限制原则',
    category: '个人信息',
    lawName: '个人信息保护法',
    lawDate: '2021-08-20',
    articleNumber: '第六条',
    content: '处理个人信息应当具有明确、合理的目的，并应当与处理目的直接相关，采取对个人权益影响最小的方式。收集个人信息，应当限于实现处理目的的最小范围，不得过度收集个人信息。',
    practicalGuide: '产品设计时应遵循"最小必要"原则，仅收集业务必需的个人信息。例如：聊天APP无需收集职业信息。',
    riskLevel: '高'
  },
  {
    id: '个保-13',
    title: '知情同意',
    category: '个人信息',
    lawName: '个人信息保护法',
    lawDate: '2021-08-20',
    articleNumber: '第十三条',
    content: '符合下列情形之一的，个人信息处理者方可处理个人信息：（一）取得个人的同意；...',
    practicalGuide: '收集用户信息前必须获得明确同意，且同意应当是自愿、明确的。不要使用默认勾选方式获取同意。',
    riskLevel: '高'
  },
  {
    id: '个保-14',
    title: '同意撤回',
    category: '个人信息',
    lawName: '个人信息保护法',
    lawDate: '2021-08-20',
    articleNumber: '第十四条',
    content: '基于个人同意处理个人信息的，该同意应当由个人在充分知情的前提下自愿、明确作出。个人有权撤回其同意。',
    practicalGuide: '用户必须能够随时撤回同意，且撤回同意不应影响此前基于同意进行的处理。需提供便捷的撤回入口。',
    riskLevel: '高'
  },
  {
    id: '个保-17',
    title: '隐私政策要求',
    category: '个人信息',
    lawName: '个人信息保护法',
    lawDate: '2021-08-20',
    articleNumber: '第十七条',
    content: '个人信息处理者应当以显著方式、清晰易懂的语言真实、准确、完整地公开个人信息的处理规则。',
    practicalGuide: '隐私政策必须包含：①处理者名称②处理目的③处理方式④处理个人信息种类⑤保存期限⑥权利行使方式⑦其他事项。',
    riskLevel: '高'
  },
  {
    id: '个保-28',
    title: '敏感个人信息',
    category: '个人信息',
    lawName: '个人信息保护法',
    lawDate: '2021-08-20',
    articleNumber: '第二十八条',
    content: '敏感个人信息是一旦泄露或者非法使用，可能导致个人受到歧视或者人身、财产安全受到危害的个人信息，包括生物识别、宗教信仰、特定身份、医疗健康、金融账户、行踪轨迹等信息，以及不满十四周岁未成年人的个人信息。',
    practicalGuide: '收集敏感信息需要单独明示同意，比一般个人信息有更严格的保护要求。创业产品应尽量避免收集敏感信息。',
    riskLevel: '高'
  },
  {
    id: '个保-51',
    title: '安全保障义务',
    category: '个人信息',
    lawName: '个人信息保护法',
    lawDate: '2021-08-20',
    articleNumber: '第五十一条',
    content: '个人信息处理者应当根据个人信息的处理目的、处理方式、个人信息的种类以及对个人权益的影响、可能存在的安全风险，采取必要的管理措施和技术措施。',
    practicalGuide: '必须采取的安全措施包括：加密存储、访问控制、数据分类、员工培训、应急预案等。数据泄露后需及时通知监管部门和受影响用户。',
    riskLevel: '高'
  },

  // ========== 网络安全法 ==========
  {
    id: '网安-41',
    title: '网络信息安全',
    category: '个人信息',
    lawName: '网络安全法',
    lawDate: '2016-11-07',
    articleNumber: '第四十一条',
    content: '网络运营者不得泄露、篡改、毁损其收集的个人信息；未经被收集者同意，不得向他人提供个人信息。',
    practicalGuide: '用户数据不得随意对外提供或出售，即使是匿名化处理后的数据也需要谨慎。',
    riskLevel: '高'
  },
  {
    id: '网安-76',
    title: '个人信息定义',
    category: '个人信息',
    lawName: '网络安全法',
    lawDate: '2016-11-07',
    articleNumber: '第七十六条',
    content: '个人信息，是指以电子或者其他方式记录的能够单独或者与其他信息结合识别自然人个人身份的各种信息，包括但不限于姓名、出生日期、身份证件号码、个人生物识别信息、住址、电话号码等。',
    practicalGuide: '能够识别特定个人的信息都属于个人信息，包括IP地址、Cookie、设备ID等。',
    riskLevel: '中'
  },

  // ========== 数据安全法 ==========
  {
    id: '数安-21',
    title: '数据分类分级',
    category: '个人信息',
    lawName: '数据安全法',
    lawDate: '2021-06-10',
    articleNumber: '第二十一条',
    content: '国家建立数据分类分级保护制度，根据数据在经济社会发展中的重要程度，以及一旦遭到篡改、破坏、泄露或者非法获取、非法利用，对国家安全、公共利益或者个人、组织合法权益造成的危害程度，对数据实行分类分级保护。',
    practicalGuide: '创业者的数据资产应按重要程度分类，一般数据、重要数据、核心数据有不同的保护要求。',
    riskLevel: '中'
  },
  {
    id: '数安-27',
    title: '数据安全保护义务',
    category: '个人信息',
    lawName: '数据安全法',
    lawDate: '2021-06-10',
    articleNumber: '第二十七条',
    content: '开展数据处理活动应当按照规定建立健全全流程数据安全管理制度，组织开展数据安全教育培训，采取相应的技术措施和其他必要措施，保障数据安全。',
    practicalGuide: '企业需要建立数据安全管理制度，对员工进行数据安全培训，并采取必要的技术防护措施。',
    riskLevel: '中'
  },

  // ========== 商标法 ==========
  {
    id: '商标-3',
    title: '商标注册申请',
    category: '知识产权',
    lawName: '商标法',
    lawDate: '2019-04-23',
    articleNumber: '第三条',
    content: '经商标局核准注册的商标为注册商标，包括商品商标、服务商标和集体商标、证明商标；商标注册人享有商标专用权，受法律保护。',
    practicalGuide: '商标只有注册后才受法律保护。建议创业初期就申请商标，避免被抢注。',
    riskLevel: '高'
  },
  {
    id: '商标-4',
    title: '显著性要求',
    category: '知识产权',
    lawName: '商标法',
    lawDate: '2019-04-23',
    articleNumber: '第四条',
    content: '自然人、法人或者其他组织在生产经营活动中，对其商品或者服务需要取得商标专用权的，应当向商标局申请商标注册。',
    practicalGuide: '商标需要有显著特征，不能是商品的通用名称、图形，也不能与他人在先商标过于近似。',
    riskLevel: '中'
  },
  {
    id: '商标-8',
    title: '禁用标志',
    category: '知识产权',
    lawName: '商标法',
    lawDate: '2019-04-23',
    articleNumber: '第八条',
    content: '任何能够将自然人、法人或者其他组织的商品与他人的商品区别开的标志，包括文字、图形、字母、数字、三维标志、颜色组合和声音等，以及上述要素的组合，均可以作为商标申请注册。',
    practicalGuide: '虽然多种标志可注册商标，但需避免使用国家名称、国徽、红十字等禁用标志。',
    riskLevel: '低'
  },
  {
    id: '商标-33',
    title: '异议程序',
    category: '知识产权',
    lawName: '商标法',
    lawDate: '2019-04-23',
    articleNumber: '第三十三条',
    content: '对初步审定公告的商标，自公告之日起三个月内，在先权利人、利害关系人或者任何人认为违反本法相关规定的，可以向商标局提出异议。',
    practicalGuide: '如果发现他人注册的商标侵犯你的在先权利，可以在公告期内提出异议。创业公司发现侵权时应及时维权。',
    riskLevel: '中'
  },

  // ========== 著作权法 ==========
  {
    id: '著作权-2',
    title: '作品类型',
    category: '知识产权',
    lawName: '著作权法',
    lawDate: '2020-11-11',
    articleNumber: '第二条',
    content: '中国公民、法人或者非法人组织的作品，不论是否发表，依照本法享有著作权。',
    practicalGuide: '作品自创作完成即享有著作权，不需要登记。但登记可以提供著作权归属的初步证据，便于维权。',
    riskLevel: '中'
  },
  {
    id: '著作权-9',
    title: '著作权归属',
    category: '知识产权',
    lawName: '著作权法',
    lawDate: '2020-11-11',
    articleNumber: '第九条',
    content: '著作权属于作者，本法另有规定的除外。创作作品的自然人是作者。由法人或者非法人组织主持，代表法人或者非法人组织意志创作，并由法人或者非法人组织承担责任的作品，法人或者非法人组织视为作者。',
    practicalGuide: '个人创作归个人，公司创作（职务作品）归公司。委托他人开发的产品需在合同中明确著作权归属。',
    riskLevel: '高'
  },
  {
    id: '著作权-10',
    title: '著作权内容',
    category: '知识产权',
    lawName: '著作权法',
    lawDate: '2020-11-11',
    articleNumber: '第十条',
    content: '著作权包括下列人身权和财产权：（一）发表权；（二）署名权；（三）修改权；（四）保护作品完整权；（五）复制权；（六）发行权；（七）信息网络传播权等。',
    practicalGuide: '创业者需尊重他人著作权，使用他人作品需获得授权。同时也要保护自己的软件、文档、设计作品的著作权。',
    riskLevel: '高'
  },
  {
    id: '著作权-24',
    title: '合理使用',
    category: '知识产权',
    lawName: '著作权法',
    lawDate: '2020-11-11',
    articleNumber: '第二十四条',
    content: '在下列情况下使用作品，可以不经著作权人许可，不向其支付报酬，但应当指明作者姓名或者名称、作品名称，并且不得影响该作品的正常使用，也不得不合理地损害著作权人的合法权益：...',
    practicalGuide: '合理使用包括个人学习研究、引用、新闻报道等情形。但商业使用需谨慎，最好获取授权。',
    riskLevel: '中'
  },

  // ========== 专利法 ==========
  {
    id: '专利-2',
    title: '发明创造定义',
    category: '知识产权',
    lawName: '专利法',
    lawDate: '2020-10-17',
    articleNumber: '第二条',
    content: '发明创造是指发明、实用新型和外观设计。发明，是指对产品、方法或者其改进所提出的新的技术方案。实用新型，是指对产品的形状、构造或者其结合所提出的适于实用的新的技术方案。外观设计，是指对产品的整体或者局部的形状、图案或者其结合以及色彩与形状、图案的结合所作出的富有美感并适于工业应用的新设计。',
    practicalGuide: '软件可以申请发明专利（方法专利）或外观设计专利。创业者的技术创新应及时申请专利保护。',
    riskLevel: '中'
  },
  {
    id: '专利-11',
    title: '专利权内容',
    category: '知识产权',
    lawName: '专利法',
    lawDate: '2020-10-17',
    articleNumber: '第十一条',
    content: '发明和实用新型专利权被授予后，除本法另有规定的以外，任何单位或者个人未经专利权人许可，都不得实施其专利。',
    practicalGuide: '专利授权后他人未经许可不得实施（制造、使用、销售、进口）。创业者需确保不侵犯他人专利权。',
    riskLevel: '高'
  },
  {
    id: '专利-22',
    title: '新颖性创造性',
    category: '知识产权',
    lawName: '专利法',
    lawDate: '2020-10-17',
    articleNumber: '第二十二条',
    content: '授予专利权的发明和实用新型应当具备新颖性、创造性和实用性。新颖性，是指该发明或者实用新型不属于现有技术；创造性，是指与现有技术相比，该发明具有突出的实质性特点和显著的进步。',
    practicalGuide: '申请专利前不能公开技术方案（丧失新颖性），也不能使用未公开的技术（缺乏创造性）。',
    riskLevel: '中'
  },

  // ========== 消费者权益保护法 ==========
  {
    id: '消保-8',
    title: '知情权',
    category: '电子商务',
    lawName: '消费者权益保护法',
    lawDate: '2013-10-25',
    articleNumber: '第八条',
    content: '消费者享有知悉其购买、使用的商品或者接受的服务的真实情况的权利。',
    practicalGuide: '电商创业者必须真实披露商品/服务信息，不得有虚假或引人误解的宣传。',
    riskLevel: '高'
  },
  {
    id: '消保-25',
    title: '后悔权',
    category: '电子商务',
    lawName: '消费者权益保护法',
    lawDate: '2013-10-25',
    articleNumber: '第二十五条',
    content: '经营者采用网络、电视、电话、邮购等方式销售商品，消费者有权自收到商品之日起七日内退货，且无需说明理由。',
    practicalGuide: '网购享有七天无理由退货权，但定作、生鲜、数字化商品等除外。退货商品应当完好，经营者应在收到退货后七日内退款。',
    riskLevel: '高'
  },
  {
    id: '消保-29',
    title: '个人信息保护',
    category: '电子商务',
    lawName: '消费者权益保护法',
    lawDate: '2013-10-25',
    articleNumber: '第二十九条',
    content: '经营者收集、使用消费者个人信息，应当遵循合法、正当、必要的原则，明示收集、使用信息的目的、方式和范围，并经消费者同意。',
    practicalGuide: '收集消费者信息必须说明目的、方式、范围，并获得同意。不得收集与交易无关的信息。',
    riskLevel: '高'
  },

  // ========== 广告法 ==========
  {
    id: '广告法-9',
    title: '广告禁用内容',
    category: '其他',
    lawName: '广告法',
    lawDate: '2021-04-29',
    articleNumber: '第九条',
    content: '广告不得有下列情形：（一）使用或者变相使用中华人民共和国的国旗、国歌、国徽，军旗、军歌、军徽；（二）使用"国家级"、"最高级"、"最佳"等用语；...',
    practicalGuide: '极限用语（最、第一、顶级、极品等）属于违法广告，违者罚款二十万起步。创业宣传应避免绝对化表述。',
    riskLevel: '高'
  },
  {
    id: '广告法-10',
    title: '广告代言人',
    category: '其他',
    lawName: '广告法',
    lawDate: '2021-04-29',
    articleNumber: '第十条',
    content: '广告代言人在广告中对商品、服务作推荐、证明，应当依据事实，符合本法和有关法律、行政法规规定，并不得为其未使用过的商品或者未接受过的服务作推荐、证明。',
    practicalGuide: '代言人必须真实使用过商品/服务，否则属于违法。创业者自己为产品代言是允许的。',
    riskLevel: '中'
  },
  {
    id: '广告法-28',
    title: '虚假广告',
    category: '其他',
    lawName: '广告法',
    lawDate: '2021-04-29',
    articleNumber: '第二十八条',
    content: '广告以虚假或者引人误解的内容欺骗、误导消费者的，构成虚假广告。',
    practicalGuide: '虚假广告不仅罚款高，还可能面临消费者索赔。创业者应确保广告内容真实、有据可查。',
    riskLevel: '高'
  },
  {
    id: '广告法-38',
    title: '广告未成年人保护',
    category: '其他',
    lawName: '广告法',
    lawDate: '2021-04-29',
    articleNumber: '第三十八条',
    content: '禁止在针对未成年人的大众传播媒介上发布医疗、药品、保健食品、医疗器械、化妆品、酒类、美容广告，以及不利于未成年人身心健康的网络游戏广告。',
    practicalGuide: '如果创业产品的目标用户包含未成年人，广告投放需格外注意禁止性规定。',
    riskLevel: '中'
  },

  // ========== 反不正当竞争法 ==========
  {
    id: '反不-6',
    title: '混淆行为',
    category: '其他',
    lawName: '反不正当竞争法',
    lawDate: '2019-04-23',
    articleNumber: '第六条',
    content: '经营者不得实施下列混淆行为，引人误认为是他人商品或者与他人存在特定联系：（一）擅自使用与他人有一定影响的商品名称、包装、装潢等相同或者近似的标识；...',
    practicalGuide: '创业时切忌蹭名牌、仿包装，这种混淆行为属于不正当竞争，会被处罚并赔偿。',
    riskLevel: '高'
  },
  {
    id: '反不-8',
    title: '商业诋毁',
    category: '其他',
    lawName: '反不正当竞争法',
    lawDate: '2019-04-23',
    articleNumber: '第八条',
    content: '经营者不得对其商品的性能、功能、质量、销售状况、用户评价、曾获荣誉等作虚假或者引人误解的商业宣传，欺骗、误导消费者。',
    practicalGuide: '不得雇佣他人假扮用户给好评，也不得恶意诋毁竞争对手。商业宣传必须真实。',
    riskLevel: '高'
  },
  {
    id: '反不-9',
    title: '商业贿赂',
    category: '其他',
    lawName: '反不正当竞争法',
    lawDate: '2019-04-23',
    articleNumber: '第九条',
    content: '经营者不得采用财物或者其他手段贿赂下列单位或者个人，以获取交易机会或者竞争优势：（一）交易相对方的工作人员；...',
    practicalGuide: '商业贿赂是严重违法行为，即使是"好处费"、"回扣"等也属于贿赂。创业经营应走正道。',
    riskLevel: '高'
  },

  // ========== 会计法 ==========
  {
    id: '会计-2',
    title: '会计核算',
    category: '其他',
    lawName: '会计法',
    lawDate: '2024-06-28',
    articleNumber: '第二条',
    content: '任何人不得伪造、变造会计凭证、会计账簿和其他会计资料，不得提供虚假的财务会计报告。',
    practicalGuide: '做假账、虚报财务数据是严重违法行为。创业企业应确保会计资料真实、完整。',
    riskLevel: '高'
  },
  {
    id: '会计-9',
    title: '会计主体',
    category: '其他',
    lawName: '会计法',
    lawDate: '2024-06-28',
    articleNumber: '第九条',
    content: '各单位必须根据实际发生的经济业务事项进行会计核算，填制会计凭证，登记会计账簿，编制财务会计报告。',
    practicalGuide: '会计核算必须基于真实业务，单据不全时应先补齐手续再入账。',
    riskLevel: '中'
  },
  {
    id: '会计-14',
    title: '原始凭证',
    category: '其他',
    lawName: '会计法',
    lawDate: '2024-06-28',
    articleNumber: '第十四条',
    content: '办理本法第十条所列的经济业务事项，必须填制或者取得原始凭证并及时送交会计机构。',
    practicalGuide: '发票是核心原始凭证。创业公司务必养成"发票优先"的习惯，所有支出尽量取得正规发票。',
    riskLevel: '高'
  },

  // ========== 电子签名法 ==========
  {
    id: '电签-3',
    title: '电子签名效力',
    category: '其他',
    lawName: '电子签名法',
    lawDate: '2019-04-23',
    articleNumber: '第三条',
    content: '民事活动中的合同或者其他文件、单证等文书，当事人可以约定使用或者不使用电子签名、数据电文。当事人约定使用电子签名、数据电文的文书，不得仅因为其采用电子签名、数据电文的形式而否定其法律效力。',
    practicalGuide: '电子合同与纸质合同具有同等法律效力。但涉及婚姻、收养、继承等人身关系的文书不适用电子签名。',
    riskLevel: '中'
  },
  {
    id: '电签-14',
    title: '可靠电子签名',
    category: '其他',
    lawName: '电子签名法',
    lawDate: '2019-04-23',
    articleNumber: '第十四条',
    content: '可靠的电子签名与手写签名或者盖章具有同等的法律效力。',
    practicalGuide: '仅签名图片或简单电子输入不一定是"可靠电子签名"。重要合同建议使用合规电子签名平台。',
    riskLevel: '中'
  },

  // ========== 印花税法 ==========
  {
    id: '印税-1',
    title: '印花税纳税人',
    category: '税法',
    lawName: '印花税法',
    lawDate: '2021-06-10',
    articleNumber: '第一条',
    content: '在中华人民共和国境内书立应税凭证、进行证券交易的单位和个人，为印花税的纳税人。',
    practicalGuide: '创业者签订合同、书立应税凭证（如借款合同、财产保险合同、营业账簿等）需缴纳印花税。',
    riskLevel: '中'
  },
  {
    id: '印税-7',
    title: '证券交易印花税',
    category: '税法',
    lawName: '印花税法',
    lawDate: '2021-06-10',
    articleNumber: '第七条',
    content: '证券交易印花税扣缴义务人已解缴入库的，才可以向证券交易场所所在地县（市、区）税务机关申请解除税收抵缴风险管控措施。',
    practicalGuide: '对于一般创业者，证券交易印花税主要与股票投资相关，不是日常经营的主要税种。',
    riskLevel: '低'
  },

  // ========== 中小企业促进法 ==========
  {
    id: '中企-2',
    title: '中小企业定义',
    category: '公司法',
    lawName: '中小企业促进法',
    lawDate: '2017-09-01',
    articleNumber: '第二条',
    content: '本法所称中小企业，是指在中华人民共和国境内依法设立的，人员规模、经营规模相对较小的企业，包括中型企业、小型企业和微型企业。',
    practicalGuide: '中小企业在融资、税收、创新等方面享有政策支持。创业者应了解并申请相关优惠政策。',
    riskLevel: '低'
  },
  {
    id: '中企-26',
    title: '财税支持',
    category: '公司法',
    lawName: '中小企业促进法',
    lawDate: '2017-09-01',
    articleNumber: '第二十六条',
    content: '国家完善创业扶持政策，改善创业环境，支持创办各类中小企业。',
    practicalGuide: '国家和地方有多种创业扶持政策，如创业担保贷款、一次性创业补贴、场地租金减免等，创业者应积极申请。',
    riskLevel: '低'
  }
]

// 获取所有分类
export const getCategories = (): string[] => {
  const categories = new Set(complianceArticles.map(a => a.category))
  return Array.from(categories)
}

// 按分类获取条款
export const getArticlesByCategory = (category: string): ComplianceArticle[] => {
  return complianceArticles.filter(a => a.category === category)
}

// 获取高风险条款
export const getHighRiskArticles = (): ComplianceArticle[] => {
  return complianceArticles.filter(a => a.riskLevel === '高')
}

// 根据关键词搜索条款
export const searchArticles = (keyword: string): ComplianceArticle[] => {
  const lowerKeyword = keyword.toLowerCase()
  return complianceArticles.filter(a =>
    a.title.toLowerCase().includes(lowerKeyword) ||
    a.content.toLowerCase().includes(lowerKeyword) ||
    a.lawName.toLowerCase().includes(lowerKeyword)
  )
}

// 根据场景获取相关条款
export const getArticlesByScenario = (scenarioId: string): ComplianceArticle[] => {
  const scenario = complianceScenarios.find(s => s.id === scenarioId)
  if (!scenario) return []
  return scenario.relevantArticles
    .map(articleId => complianceArticles.find(a => a.id === articleId))
    .filter((a): a is ComplianceArticle => a !== undefined)
}

// ========== 导出给 Vue 组件使用的合规指引 ==========
export interface LawReference {
  name: string
  versionDate: string
  applicability: string
  keyClauses: {
    article: string
    summary: string
    practicalTip: string
  }[]
}

export interface ComplianceGuide {
  categoryId: string
  title: string
  description: string
  icon: string
  actionItems: string[]
  lawReferences: LawReference[]
}

// 合规指引（匹配 ComplianceView.vue 组件期望的数据结构）
export const complianceGuides: ComplianceGuide[] = [
  {
    categoryId: 'company-setup',
    title: '公司设立',
    description: '选企业类型、定注册资本、搭股权结构',
    icon: 'lucide:building-2',
    actionItems: [
      '根据业务规模选择企业类型：追求有限责��选择公司制，否则可选个人独资企业',
      '注册资本量力而行，过高可能带来出资风险',
      '在章程中明确约定法定代表人、股东权利义务',
      '公司印章、银行账户要与个人分离'
    ],
    lawReferences: [
      {
        name: '公司法',
        versionDate: '2023年12月修订',
        applicability: '适用于所有在中国设立的有限责任公司和股份有限公司',
        keyClauses: [
          {
            article: '第十三条',
            summary: '法定代表人由董事长、执行董事或经理担任',
            practicalTip: '一人公司通常由唯一股东（也是执行董事兼经理）担任法定代表人'
          },
          {
            article: '第二十三条',
            summary: '有限责任公司注册资本为全体股东认缴的出资额',
            practicalTip: '除特定行业外已取消最低注册资本限制，但应与经营规模相匹配'
          },
          {
            article: '第七十五条',
            summary: '一人公司的特殊规定由国务院另行规定',
            practicalTip: '建议咨询专业律师制定公司章程，明确权责边界'
          }
        ]
      },
      {
        name: '个人独资企业法',
        versionDate: '1999年8月通过',
        applicability: '适用于在中国境内设立的、由一个自然人投资的企业',
        keyClauses: [
          {
            article: '第二条',
            summary: '投资人对企业债务承担无限责任',
            practicalTip: '这是与一人公司最大的区别！选择时需充分考虑风险承受能力'
          },
          {
            article: '第八条',
            summary: '设立需有固定经营场所、必要从业人员和申报出资',
            practicalTip: '创业初期如无固定场所，可考虑挂靠孵化器或使用虚拟地址'
          }
        ]
      }
    ]
  },
  {
    categoryId: 'tax-compliance',
    title: '税务合规',
    description: '纳税申报、发票管理、减税政策',
    icon: 'lucide:receipt',
    actionItems: [
      '无论是否有收入，必须按期申报（零申报也不能忽略）',
      '养成"发票优先"习惯，所有支出尽量取得正规发票',
      '关注小型微利企业税收优惠（年应纳税所得额≤300万）',
      '符合条件记得申请研发费用加计扣除'
    ],
    lawReferences: [
      {
        name: '企业所得税法',
        versionDate: '2018年12月修订',
        applicability: '适用于中国境内的一切企业',
        keyClauses: [
          {
            article: '第四条',
            summary: '企业所得税率25%，小型微利企业减按20%',
            practicalTip: '年应纳税所得额≤300万、从业人数≤300人、资产总额≤5000万可享受优惠'
          },
          {
            article: '第二十八条',
            summary: '研发费用可加计扣除',
            practicalTip: '一般企业加计75%，科技型中小企业可加计100%'
          }
        ]
      },
      {
        name: '个人所得税法',
        versionDate: '2018年8月修订',
        applicability: '适用于在中国境内有住所或居住满183天的个人',
        keyClauses: [
          {
            article: '第二条',
            summary: '个人独资企业主经营所得适用5%-35%超额累进税率',
            practicalTip: '个人独资企业不缴纳企业所得税，而是缴纳个人所得税'
          },
          {
            article: '第六条',
            summary: '专项附加扣除包括子女教育、继续教育、大病医疗、住房贷款利息等',
            practicalTip: '创业者本人及家人的专项附加扣除可按规定在税前扣除'
          }
        ]
      },
      {
        name: '税收征收管理法',
        versionDate: '2015年4月修订',
        applicability: '适用于所有纳税人和扣缴义务人',
        keyClauses: [
          {
            article: '第二十五条',
            summary: '纳税人必须按期办理纳税申报',
            practicalTip: '逾期申报会产生罚款和滞纳金，即使零申报也不能忽视'
          },
          {
            article: '第五十一条',
            summary: '未按规定设置、保管账簿可处一万元以下罚款',
            practicalTip: '建议使用正规发票管理软件或委托代账公司处理'
          }
        ]
      }
    ]
  },
  {
    categoryId: 'labor-employment',
    title: '劳动用工',
    description: '签合同、交社保、加班费',
    icon: 'lucide:users',
    actionItems: [
      '用工之日起一个月内必须签订书面劳动合同',
      '试用期工资不得低于正式工资的80%，且不得低于当地最低工资',
      '社保是强制性的，即使员工自愿放弃也不能不缴',
      '加班需支付加班费：工作日150%、休息日200%、法定节假日300%'
    ],
    lawReferences: [
      {
        name: '劳动法',
        versionDate: '2018年12月修订',
        applicability: '适用于中华人民共和国境内的所有用人单位',
        keyClauses: [
          {
            article: '第十条',
            summary: '建立劳动关系应当订立书面劳动合同',
            practicalTip: '用工之日起一个月内必须签订合同，否则需支付双倍工资'
          },
          {
            article: '第十六条',
            summary: '试用期期限与劳动合同期限挂钩',
            practicalTip: '合同一年以下试用期最长一个月，三年以上最长六个月'
          },
          {
            article: '第二十条',
            summary: '试用期工资不得低于正式工资的80%',
            practicalTip: '同时不得低于当地最低工资标准'
          },
          {
            article: '第三十八条',
            summary: '用人单位应当依法为劳动者缴纳社会保险费',
            practicalTip: '不缴社保可能面临补缴、罚款及员工索赔风险'
          }
        ]
      }
    ]
  },
  {
    categoryId: 'data-privacy',
    title: '数据隐私',
    description: '收集限度、知情同意、用户权利',
    icon: 'lucide:shield',
    actionItems: [
      '遵循"最小必要"原则，仅收集业务必需的个人信息',
      '收集敏感信息（位置、生物识别等）需单独明示同意',
      '必须提供隐私政策，且内容要完整、清晰',
      '用户有权随时撤回同意，需提供便捷撤回入口',
      '数据泄露需及时通知监管部门和受影响用户'
    ],
    lawReferences: [
      {
        name: '个人信息保护法',
        versionDate: '2021年8月通过',
        applicability: '适用于所有处理个人信息的主体',
        keyClauses: [
          {
            article: '第六条',
            summary: '处理个人信息应具有明确目的，最小范围收集',
            practicalTip: '产品设计时应仅收集业务必需的信息，如聊天APP无需收集职业信息'
          },
          {
            article: '第十三条',
            summary: '处理个人信息需取得个人同意',
            practicalTip: '同意应当是自愿、明确的，不要使用默认勾选方式'
          },
          {
            article: '第十四条',
            summary: '个人有权撤回其同意',
            practicalTip: '必须提供便捷的撤回入口，撤回不应影响此前合法处理'
          },
          {
            article: '第十七条',
            summary: '隐私政策必须包含处理者名称、目的、方式、种类、保存期限等',
            practicalTip: '检查你的隐私政策是否包含所有法定要素'
          },
          {
            article: '第二十八条',
            summary: '敏感个人信息包括生物识别、宗教信仰、医疗健康、金融账户等',
            practicalTip: '收集敏感信息需要单独明示同意，有更严格的保护要求'
          }
        ]
      },
      {
        name: '数据安全法',
        versionDate: '2021年6月通过',
        applicability: '适用于所有开展数据处理活动的主体',
        keyClauses: [
          {
            article: '第二十一条',
            summary: '国家建立数据分类分级保护制度',
            practicalTip: '企业数据应按重要程度分类管理，一般数据、重要数据、核心数据不同保护要求'
          },
          {
            article: '第二十七条',
            summary: '开展数据处理应当建立健全全流程数据安全管理制度',
            practicalTip: '需建立数据安全管理制度，进行员工培训，采取技术防护措施'
          }
        ]
      }
    ]
  },
  {
    categoryId: 'intellectual-property',
    title: '知识产权',
    description: '商标注册、著作权保护、专利申请',
    icon: 'lucide:lightbulb',
    actionItems: [
      '商标只有注册后才受法律保护，建议创业初期就申请',
      '软件、文档、设计作品自创作完成即享有著作权',
      '委托他人开发的产品需在合同中明确著作权归属',
      '申请专利前不能公开技术方案（会丧失新颖性）'
    ],
    lawReferences: [
      {
        name: '商标法',
        versionDate: '2019年4月修订',
        applicability: '适用于所有申请和使用商标的主体',
        keyClauses: [
          {
            article: '第三条',
            summary: '注册商标享有商标专用权，受法律保护',
            practicalTip: '商标注册遵循申请在先原则，建议尽早申请避免被抢注'
          },
          {
            article: '第四条',
            summary: '商标需要有显著特征，不能是商品通用名称',
            practicalTip: '选择商标名称时要避免与已有商标过于近似'
          },
          {
            article: '第三十三条',
            summary: '对初步审定公告的商标可提出异议',
            practicalTip: '发现他人抢注你的商标时可在公告期内提异议'
          }
        ]
      },
      {
        name: '著作权法',
        versionDate: '2020年11月修订',
        applicability: '适用于所有文学、艺术和科学作品',
        keyClauses: [
          {
            article: '第二条',
            summary: '作品自创作完成即享有著作权，不需要登记',
            practicalTip: '虽然不强制登记，但登记可以提供著作权归属的初步证据'
          },
          {
            article: '第九条',
            summary: '职务作品著作权归公司，个人创作归个人',
            practicalTip: '委托他人开发的产品需在合同中明确著作权归属'
          },
          {
            article: '第十条',
            summary: '著作权包括人身权（发表权、署名权等）和财产权（复制权、发行权等）',
            practicalTip: '创业者需尊重他人著作权，同时也要保护自己的著作权'
          }
        ]
      },
      {
        name: '专利法',
        versionDate: '2020年10月修订',
        applicability: '适用于所有发明创造',
        keyClauses: [
          {
            article: '第二条',
            summary: '发明创造包括发明、实用新型和外观设计',
            practicalTip: '软件可以申请发明专利（方法专利）或外观设计专利'
          },
          {
            article: '第十一条',
            summary: '专利授权后他人未经许可不得实施',
            practicalTip: '创业者需确保不侵犯他人专利权，创新技术应及时申请专利'
          }
        ]
      }
    ]
  },
  {
    categoryId: 'e-commerce',
    title: '电子商务',
    description: '平台入驻、商品描述、消费者权益',
    icon: 'lucide:shopping-bag',
    actionItems: [
      '通过互联网开展经营活动一般需要办理市场主体登记',
      '网购消费者享有七天无理由退货权（定作、生鲜、数字化商品除外）',
      '产品描述必须真实，不得有虚假或引人误解的宣传',
      '不得刷单、虚假好评，这是违法行为'
    ],
    lawReferences: [
      {
        name: '电子商务法',
        versionDate: '2018年8月通过',
        applicability: '适用于所有电子商务经营者',
        keyClauses: [
          {
            article: '第九条',
            summary: '通过互联网从事经营活动的主体属于电子商务经营者',
            practicalTip: '通过互联网开展经营活动的创业者基本都属于电子商务经营者'
          },
          {
            article: '第十条',
            summary: '电子商务经营者应当依法办理市场主体登记',
            practicalTip: '个人电商月销售额超过一定额度需办理登记，建议尽早规范化'
          },
          {
            article: '第十六条',
            summary: '不得将搭售商品作为默认同意的选项',
            practicalTip: '默认勾选额外付费服务是违规的'
          },
          {
            article: '第十七条',
            summary: '不得虚构交易、编造用户评价进行虚假宣传',
            practicalTip: '刷单、虚假好评是违法行为，违者面临严厉处罚'
          },
          {
            article: '第三十八条',
            summary: '平台未尽审核义务导致消费者受损需承担连带责任',
            practicalTip: '如果自建平台，需承担相应的审核责任'
          }
        ]
      },
      {
        name: '消费者权益保护法',
        versionDate: '2013年10月修订',
        applicability: '适用于所有向消费者提供商品或服务的主体',
        keyClauses: [
          {
            article: '第八条',
            summary: '消费者享有知悉其购买商品或服务真实情况的权利',
            practicalTip: '电商创业者必须真实披露商品/服务信息'
          },
          {
            article: '第二十五条',
            summary: '网购消费者享有七天无理由退货权',
            practicalTip: '退货商品应当完好，经营者收到退货后七日内退款'
          }
        ]
      }
    ]
  },
  {
    categoryId: 'advertising',
    title: '广告宣传',
    description: '广告内容合规、极限用语、代言人',
    icon: 'lucide:megaphone',
    actionItems: [
      '绝对化表述（最、第一、顶级、极品）属于违法广告',
      '代言人必须真实使用过商品/服务',
      '不得雇佣他人假扮用户给好评，也不得恶意诋毁竞争对手',
      '如果产品目标用户包含未成年人，广告投放有特别限制'
    ],
    lawReferences: [
      {
        name: '广告法',
        versionDate: '2021年4月修订',
        applicability: '适用于所有广告主、广告发布者和广告代言人',
        keyClauses: [
          {
            article: '第九条',
            summary: '广告不得使用"国家级"、"最高级"、"最佳"等极限用语',
            practicalTip: '极限用语违者罚款二十万起步！创业宣传应避免绝对化表述'
          },
          {
            article: '第十条',
            summary: '广告代言人必须真实使用过商品或服务',
            practicalTip: '创业者自己为产品代言是允许的'
          },
          {
            article: '第二十八条',
            summary: '以虚假内容欺骗、误导消费者的构成虚假广告',
            practicalTip: '虚假广告不仅罚款高，还可能面临消费者索赔'
          }
        ]
      },
      {
        name: '反不正当竞争法',
        versionDate: '2019年4月修订',
        applicability: '适用于所有经营者',
        keyClauses: [
          {
            article: '第六条',
            summary: '不得擅自使用与他人有一定影响的商品名称、包装等',
            practicalTip: '蹭名牌、仿包装是不正当竞争，会被处罚并赔偿'
          },
          {
            article: '第八条',
            summary: '不得对其商品作虚假或引人误解的商业宣传',
            practicalTip: '不得雇佣他人假扮用户给好评，也不得恶意诋毁竞争对手'
          }
        ]
      }
    ]
  },
  {
    categoryId: 'accounting',
    title: '财务合规',
    description: '会计核算、财务报表、审计',
    icon: 'lucide:file-spreadsheet',
    actionItems: [
      '会计核算必须基于真实业务，单据不全时应先补齐手续再入账',
      '做假账、虚报财务数据是严重违法行为',
      '发票是核心原始凭证，务必养成"发票优先"习惯',
      '公司账户与个人账户必须严格分离'
    ],
    lawReferences: [
      {
        name: '会计法',
        versionDate: '2024年6月修订',
        applicability: '适用于所有办理会计事务的主体',
        keyClauses: [
          {
            article: '第二条',
            summary: '任何人不得伪造、变造会计凭证、会计账簿',
            practicalTip: '做假账、虚报财务数据是严重违法行为，后果严重'
          },
          {
            article: '第九条',
            summary: '必须根据实际发生的经济业务事项进行会计核算',
            practicalTip: '会计核算必须基于真实业务，单据不全时应先补齐手续'
          },
          {
            article: '第十四条',
            summary: '办理经济业务必须填制或取得原始凭证',
            practicalTip: '发票是核心原始凭证，所有支出尽量取得正规发票'
          }
        ]
      }
    ]
  }
]

// 导出给 AI 使用的法律知识库提示
export const complianceKnowledgeForAI = `
你是一位专业的创业法律顾问。以下是中国与一人公司/个体创业者最相关的法律条款：

## 公司法关键条款
1. 法定代表人：法定代表人依照公司章程规定，由董事长、执行董事或经理担任（公司法第13条）
2. 一人公司特别规定：只有一个股东的公司，其注册资本最低限额、设立程序等事项由国务院规定（公司法第75条）
3. 注册资本：除特定行业外已取消最低注册资本限制，但应与经营规模相匹配（公司法第23条）

## 个人独资企业法关键条款
1. 无限责任：个人独资企业投资人对企业债务承担无限责任（个独法第2条）
2. 设立条件：需有固定经营场所、从业人员、投资人申报出资（个独法第8条）

## 税法关键条款
1. 企业所得税：一般税率为25%，小型微利企业减按20%（企税法第4条）
2. 个人独资企业不缴纳企业所得税，而由投资人缴纳个人所得税（企税法第1条）
3. 研发费用可加计扣除（企税法第28条）
4. 经营所得适用5%-35%超额累进税率（个税法第2条）
5. 纳税人必须按期申报纳税（征管法第25条）

## 劳动法关键条款
1. 用工之日起一个月内必须签订劳动合同（劳动法第10条）
2. 试用期工资不得低于正式工资的80%（劳动法第20条）
3. 用人单位应当依法为劳动者缴纳社保（劳动法第38条）
4. 加班费：工作日150%、休息日200%、法定节假日300%（劳动法第31条）

## 知识产权关键条款
1. 商标需注册后才受法律保护（商标法第3条）
2. 著作权自作品创作完成即享有（著作权法第2条）
3. 职务作品著作权归公司（著作权法第9条）
4. 发明和实用新型需具备新颖性、创造性、实用性（专利法第22条）

## 个人信息保护法关键条款
1. 收集个人信息应限于最小必要范围（个保法第6条）
2. 收集敏感信息需单独明示同意（个保法第28条）
3. 用户有权撤回同意（个保法第14条）
4. 隐私政策必须包含处理者名称、目的、方式、种类、保存期限等（个保法第17条）
5. 数据泄露需及时通知监管部门（个保法第51条）

## 电子商务法关键条款
1. 电子商务经营者应办理市场登记（电商法第10条）
2. 不得默认勾选搭售服务（电商法第16条）
3. 不得刷单、虚假好评（电商法第17条）
4. 平台未尽审核义务需承担连带责任（电商法第38条）

## 消费者权益保护法关键条款
1. 消费者享有知情权（消保法第8条）
2. 网购享有七天无理由退货权（消保法第25条）
3. 收集消费者信息需遵循合法、正当、必要原则（消保法第29条）

## 广告法关键条款
1. 禁止"国家级"、"最高级"、"最佳"等极限用语（广告法第9条）
2. 代言人必须真实使用过商品/服务（广告法第10条）
3. 虚假广告会面临高额罚款和消费者索赔（广告法第28条）

## 反不正当竞争法关键条款
1. 不得蹭名牌、仿包装（反不法第6条）
2. 不得虚假宣传或诋毁竞争对手（反不法第8条）
3. 不得商业贿赂（反不法第9条）

## 会计法关键条款
1. 不得伪造、变造会计资料（会计法第2条）
2. 必须根据实际经济业务进行核算（会计法第9条）
3. 务必养成"发票优先"习惯（会计法第14条）

## 法律文件索引（可供详细查询原始条文）

| 法律名称 | 文件路径 |
|---------|---------|
| 中华人民共和国公司法 | solo-pilot-legal/公司法.md |
| 中华人民共和国个人独资企业法 | solo-pilot-legal/个人独资企业法.md |
| 中华人民共和国企业所得税法 | solo-pilot-legal/企业所得税法.md |
| 中华人民共和国个人所得税法 | solo-pilot-legal/个人所得税法.md |
| 中华人民共和国税收征收管理法 | solo-pilot-legal/税收征收管理法.md |
| 中华人民共和国劳动法 | solo-pilot-legal/劳动法.md |
| 中华人民共和国劳动合同法 | solo-pilot-legal/劳动合同法.md |
| 中华人民共和国社会保险法 | solo-pilot-legal/社会保险法.md |
| 中华人民共和国电子商务法 | solo-pilot-legal/电子商务法.md |
| 中华人民共和国消费者权益保护法 | solo-pilot-legal/消费者权益保护法.md |
| 中华人民共和国广告法 | solo-pilot-legal/广告法.md |
| 中华人民共和国反不正当竞争法 | solo-pilot-legal/反不正当竞争法.md |
| 中华人民共和国商标法 | solo-pilot-legal/商标法.md |
| 中华人民共和国著作权法 | solo-pilot-legal/著作权法.md |
| 中华人民共和国专利法 | solo-pilot-legal/专利法.md |
| 中华人民共和国个人信息保护法 | solo-pilot-legal/个人信息保护法.md |
| 中华人民共和国数据安全法 | solo-pilot-legal/数据安全法.md |
| 中华人民共和国网络安全法 | solo-pilot-legal/网络安全法.md |
| 中华人民共和国会计法 | solo-pilot-legal/会计法.md |
| 深圳经济特区人工智能产业促进条例 | solo-pilot-legal/深圳经济特区人工智能产业促进条例.md |
| 深圳经济特区数据条例 | solo-pilot-legal/深圳经济特区数据条例.md |
`

/**
 * 生成 AI 使用的法律摘要（供 AiChat.vue 的 SYSTEM_PROMPT 调用）
 * 将合规指引数据格式化为 AI 可读的法律知识摘要
 */
export function generateLawSummaryForAI(): string {
  // 使用 complianceKnowledgeForAI 作为基础知识库
  return complianceKnowledgeForAI
}
