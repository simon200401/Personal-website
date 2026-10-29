// 全站文案（中英）。改内容只改这里；标了 TODO 的是占位。
// 面板可选字段：image { src, alt }（配图）、sections [{ heading, items }]（带小标题的分组要点）。

export const LANGS = ['zh', 'en'];

// 十个宇宙：id 对应 assets/styles/<id>.webp
export const STYLES = [
  { id: 'comic', earth: 'EARTH-1610', sfx: 'THWIP!', ink: '#14121c', paper: '#fff6e0', accent: '#e5484d', name: { zh: '布鲁克林墨线', en: 'Brooklyn Ink' } },
  { id: 'noir', earth: 'EARTH-90214', sfx: 'BANG.', ink: '#0c0c10', paper: '#f2efe6', accent: '#e5484d', name: { zh: '黑白默片', en: 'Noir' } },
  { id: 'pop', earth: 'EARTH-1962', sfx: 'WHAAM!', ink: '#101014', paper: '#fffbea', accent: '#e8212b', name: { zh: '波普', en: 'Pop Art' } },
  { id: 'anime', earth: 'EARTH-14512', sfx: 'KIRA!', ink: '#3a2466', paper: '#f6f0ff', accent: '#ff7ac8', name: { zh: '机甲动漫', en: 'Mecha Anime' } },
  { id: 'watercolor', earth: 'EARTH-65', sfx: 'SPLASH~', ink: '#4a4660', paper: '#fffaf0', accent: '#5fb8b0', name: { zh: '水彩', en: 'Watercolor' } },
  { id: 'punk', earth: 'EARTH-138', sfx: 'OI!', ink: '#0c0b10', paper: '#f8f400', accent: '#ff2e88', name: { zh: '朋克拼贴', en: 'Punk Zine' } },
  { id: 'neon', earth: 'EARTH-928', sfx: 'BZZT!', ink: '#e8f6ff', paper: '#0d0a24', accent: '#00f0ff', name: { zh: '霓虹 2099', en: 'Neon 2099' } },
  { id: 'sketch', earth: 'EARTH-1504', sfx: 'SCRITCH', ink: '#3d2616', paper: '#e8d5ac', accent: '#a8402a', name: { zh: '文艺复兴手稿', en: 'Renaissance Sketch' } },
  { id: 'pixel', earth: 'EARTH-8BIT', sfx: 'BLIP!', ink: '#1a1c2c', paper: '#f4f4f4', accent: '#ef7d57', name: { zh: '像素街机', en: 'Arcade Pixel' } },
  { id: 'void', earth: 'EARTH-42B', sfx: 'BLOT.', ink: '#111114', paper: '#fbfaf6', accent: '#ff5a1f', name: { zh: '墨点虚空', en: 'Ink Void' } },
];

// 场景里的热点名 → 面板；action 表示不是面板的特殊行为
export const HOTS = {
  board: { panel: 'about' },
  press: { panel: 'press' },
  monitor: { action: 'chat' },
  keyboard: { action: 'chat' },
  mask: { action: 'style' },
  'zine-1': { panel: 'project1' },
  phone: { panel: 'project3' },
  'zine-2': { panel: 'project2' },
  'zine-3': { panel: 'project3' },
  notebook: { panel: 'blog' },
  plant: { panel: 'interests' },
  badge: { panel: 'work' },
  news: { panel: 'news' },
  photos: { panel: 'photos' },
  games: { panel: 'games' },
  music: { panel: 'music' },
  contact: { panel: 'contact' },
  camera: { panel: 'photos' },
  fries: { panel: 'fries' },
  cars: { panel: 'cars' },
  calendar: { panel: 'review' },
  globe: { panel: 'places' },
  movies: { panel: 'movies' },
  cards: { panel: 'knowledge' },
  cat: { panel: 'cat' },
  now: { panel: 'now' },
};

export const LABELS = {
  board: { zh: '我是谁', en: 'Who is Simon?' },
  press: { zh: '剪报墙', en: 'Press clippings' },
  monitor: { zh: '跟我聊聊', en: 'Talk to me' },
  keyboard: { zh: '点键盘，跟我聊', en: 'Click the keyboard. Talk to me.' },
  mask: { zh: '换一个宇宙', en: 'Switch universe' },
  'zine-1': { zh: 'F1 网站', en: 'F1 website' },
  phone: { zh: 'iOS App', en: 'iOS app' },
  'zine-2': { zh: 'AIGC 短片', en: 'AIGC short film' },
  'zine-3': { zh: 'iOS App', en: 'iOS app' },
  notebook: { zh: '博客', en: 'Blog' },
  plant: { zh: '兴趣爱好', en: 'Interests' },
  badge: { zh: '实习 / 工作', en: 'Work' },
  news: { zh: '今日新闻', en: 'News desk' },
  photos: { zh: '摄影', en: 'Photography' },
  games: { zh: '我喜欢的游戏', en: 'Games I love' },
  music: { zh: '放张唱片', en: 'Play a record' },
  contact: { zh: '联系我', en: 'Contact' },
  camera: { zh: '摄影', en: 'Photography' },
  fries: { zh: '一盘薯条', en: 'A plate of fries' },
  cars: { zh: '保时捷和赛车', en: 'Porsche & racing' },
  calendar: { zh: '年度回顾', en: 'Year in review' },
  globe: { zh: '去过的地方', en: 'Places' },
  movies: { zh: '喜欢的电影和剧', en: 'Films & shows' },
  cards: { zh: '认知积累：播客和公众号', en: 'Ideas I collect: podcasts & reads' },
  cat: { zh: '小布（我的美短）', en: 'Xiaobu, my cat' },
  now: { zh: '最近在做什么', en: 'Now' },
};

const L = (zh, en) => ({ zh, en });

// TODO：以下面板都是占位，换成你自己的内容。每段文字都要写中英两版。
const project = (n, zh, en, subZh, subEn) => ({
  kicker: L(`项目 · 0${n}`, `PROJECT · 0${n}`),
  title: L(zh, en),
  sub: L(subZh, subEn),
  body: L(['TODO：这个项目是什么、为什么做、做到了哪一步。'], ['TODO: what it is, why I made it, and where it stands.']),
  bullets: L([], []),
  tags: [],
  links: [],
});

export const PANELS = {
  about: {
    kicker: L('WHO IS SIMON?', 'WHO IS SIMON?'),
    title: L('Simon Xu · 许子豪', 'Simon Xu'),
    sub: L('AI 产品经理 · 知行合一', 'AI product manager · Knowing and doing as one'),
    body: L(
      ['我是 Simon，做 AI 产品。从数据分析、ESG 咨询一路做到数据产品、策略产品，现在在腾讯做 AI 产品经理。', '工作之外，我是个赛车迷和游戏玩家：开一台火山灰的帕拉梅拉，F1 只追维斯塔潘。这张桌子上的东西，就是我自己。'],
      ['I’m Simon, and I build AI products. I went from data analysis and ESG consulting to data and strategy products, and I’m now an AI product manager at Tencent.', 'Outside work I’m a racing fan and a gamer: I drive a Volcano Grey Panamera and in F1 I only follow Max Verstappen. Everything on this desk is a piece of me.'],
    ),
    bullets: L([], []),
    sections: [
      { heading: L('经历', 'Path'), items: L(['2026　腾讯 · AI 产品经理', '2026　字节跳动 · AI 产品经理实习', '2026　Soul · 策略产品经理实习', '2025　德勤 · 数据产品经理实习', '2024　立信 · ESG 咨询实习', '2023　易思汇 · 国际社区运营与数据分析实习'], ['2026　Tencent · AI Product Manager', '2026　ByteDance · AI PM Intern', '2026　Soul · Strategy PM Intern', '2025　Deloitte · Data PM Intern', '2024　BDO China · ESG Consulting Intern', '2023　EasyTransfer · Community Ops & Data Intern']) },
      { heading: L('喜欢', 'Into'), items: L(['F1 和保时捷', '游戏：塞尔达、战神、黑神话', '电影：星际穿越、搏击俱乐部、蜘蛛侠平行宇宙'], ['F1 and Porsche', 'Games: Zelda, God of War, Black Myth', 'Films: Interstellar, Fight Club, Spider-Verse']) },
    ],
    tags: ['AI Product', 'LLM Evaluation', 'Agents', 'Data'],
    links: [{ label: L('实习经历', 'Work'), action: 'work' }, { label: L('GitHub', 'GitHub'), href: 'https://github.com/simon200401' }, { label: L('联系我', 'Get in touch'), action: 'contact' }],
  },
  work: {
    kicker: L('实习 / 工作', 'WORK'),
    title: L('从数据到 AI 产品', 'From data to AI products'),
    sub: L('六段经历，2023 – 至今', 'Six roles, 2023 – now'),
    body: L([], []),
    bullets: L([], []),
    sections: [
      { heading: L('腾讯 · AI 产品经理（实习）· 深圳 · 2026.10 – 至今', 'Tencent · AI Product Manager (intern) · Shenzhen · Oct 2026 – now'), items: L(['刚刚开始，后面再写。'], ['Just started; more soon.']) },
      { heading: L('字节跳动 · AI 产品经理实习 · 上海 · 2026.05 – 2026.09', 'ByteDance · AI PM Intern · Shanghai · May – Sep 2026'), items: L(
        ['设计 AgentCall 的端到端流程：话术配置、模拟、批量评测、自动优化到上线，覆盖 80% 外呼场景，商家转化意向提升 15.7%。', '搭建商家模拟 Agent 和自动化测试沙盒，覆盖 5 类画像、516 种对话-动作组合；双盲测试拟人通过率 98%。', '主导四维度 LLM 评测体系，多 Agent 评审加仲裁；通过重做意图体系、调 Prompt、SFT 和回归测试，意图识别准确率从 73.3% 提到 90.5%。', '建立「评测 - 诊断 - 修复 - 回归」闭环和可复用的 Harness 编排层，人工只在上线前复核。'],
        ['Designed AgentCall’s end-to-end workflow (script configuration, simulation, batch evaluation, automated optimisation, deployment), covering 80% of outbound-calling scenarios and lifting merchant conversion intent by 15.7%.', 'Built a merchant-simulation agent and test sandbox across 5 personas and 516 dialogue-action combinations; double-blind tests hit a 98% human-likeness pass rate.', 'Led a four-dimension LLM evaluation system with multi-agent review and arbitration; raised intent-recognition accuracy from 73.3% to 90.5% through taxonomy redesign, prompt tuning, SFT and regression testing.', 'Created an evaluation – diagnosis – patch – regression loop and a reusable harness layer, keeping human review only before launch.']) },
      { heading: L('Soul · 策略产品经理实习 · 上海 · 2026.02 – 2026.05', 'Soul App · Strategy PM Intern · Shanghai · Feb – May 2026'), items: L(
        ['诊断新用户从曝光到留存的漏斗，定位冷启动信号弱、推荐相关性低的问题。', '搭建「用户标签 - 房间标签 - 行为反馈」框架，和运营一起用 LLM 做房间标题分类和首轮匹配。', '负责 A/B 实验设计、流量分配、指标定义、灰度和分析；单次进房平均停留时长提升 34.7%，核心指标全部正向。'],
        ['Diagnosed the new-user funnel from exposure to retention, finding weak cold-start signals and low recommendation relevance.', 'Built a user tags – room tags – behavioural feedback framework; worked with operations to use LLMs for room-title classification and first-round matching.', 'Owned A/B test design, traffic allocation, metric definitions, staged rollout and analysis; average dwell time per room entry rose 34.7% with every core metric improving.']) },
      { heading: L('德勤 · 数据产品经理实习 · 北京 · 2025.06 – 2025.09', 'Deloitte · Data PM Intern · Beijing · Jun – Sep 2025'), items: L(
        ['从 0 到 1 交付一个 B2B Tableau 分析产品，从需求、PRD 到迭代和上线验收。', '推进 DWD 到 ADS 的数据建模，用 Hive SQL 做指标提取和异常诊断，搭建漏斗和端到端业务指标体系。', '用 Excel 和 VBA 自动化月度对账，沉淀标准化的数据产品交付手册。'],
        ['Led 0-to-1 delivery of a B2B Tableau analytics product, from requirements and PRD through iteration and launch acceptance.', 'Drove DWD-to-ADS data modelling and used Hive SQL for metric extraction and anomaly diagnosis; built funnel and end-to-end business metric systems.', 'Automated monthly reconciliation with Excel and VBA and wrote a standard data-product delivery playbook.']) },
      { heading: L('立信会计师事务所 · ESG 咨询实习 · 上海 · 2024.07 – 2024.09', 'BDO China · ESG Consulting Intern · Shanghai · Jul – Sep 2024'), items: L(
        ['为科创板上市公司和轮胎制造客户编制 ESG 披露，统一指标口径，对齐 GRI 和 SASB。', '参与制造业战略和碳中和项目。'],
        ['Prepared ESG disclosures for STAR Market-listed and tyre-manufacturing clients, standardising indicators and aligning with GRI and SASB.', 'Supported manufacturing strategy and carbon-neutrality engagements.']) },
      { heading: L('易思汇 · 国际社区运营与数据分析实习 · 北京 · 2023.07 – 2023.09', 'EasyTransfer · Community Ops & Data Intern · Beijing · Jul – Sep 2023'), items: L(
        ['分析 1000+ 条用户交易记录，按支付频次、金额和收款机构做用户分层，找出漏斗流失点。', '搭建 Excel 看板，和运营、产品一起把发现落成提升学生活跃、支付完成率和转化效率的动作。'],
        ['Analysed 1,000+ user transactions by payment frequency, value and destination to build customer segments and find funnel drop-offs.', 'Built Excel dashboards and worked with operations and product to turn findings into initiatives for engagement, payment completion and conversion.']) },
    ],
    tags: ['Tencent', 'ByteDance', 'Soul', 'Deloitte', 'BDO', 'EasyTransfer'],
    links: [],
  },
  interests: {
    kicker: L('兴趣', 'INTERESTS'),
    title: L('工作之外', 'Outside work'),
    sub: L('赛车、游戏、电影，还有一只叫小布的猫', 'Racing, games, films, and a cat called Xiaobu'),
    body: L(['桌上的每样东西都对应一个爱好：车模是一台 911，海报是 F1，PS5 和 Switch 是游戏，票根是电影，卡片盒是我听的播客和看的公众号。点它们看看。'], ['Each thing on the desk is a hobby: the model is a 911, the poster is F1, the PS5 and Switch are games, the stubs are films, and the card box holds the podcasts and reads I learn from. Click around.']),
    bullets: L([], []),
    tags: [],
    links: [{ label: L('游戏', 'Games'), action: 'games' }, { label: L('赛车', 'Racing'), action: 'cars' }, { label: L('电影', 'Films'), action: 'movies' }],
  },
  project1: project(1, 'F1 网站', 'F1 website', '还没发布', 'Not launched yet'),
  project2: project(2, 'AIGC 短片', 'AIGC short film', '用生成式 AI 做的短片', 'A short film made with generative AI'),
  project3: project(3, 'iOS App', 'iOS app', '一个 iPhone 应用', 'An iPhone app'),
  games: {
    kicker: L('PRESS START', 'PRESS START'),
    title: L('我喜欢的游戏', 'Games I love'),
    sub: L('开放世界、动作、肉鸽、射击，什么都玩', 'Open worlds, action, roguelikes, shooters: a bit of everything'),
    body: L([], []),
    bullets: L(
      ['塞尔达传说：荒野之息', '战神 4', '黑神话：悟空', 'GTA 系列', '赛博朋克 2077', '看门狗', '无主之地', 'Apex 英雄', '杀戮尖塔', '死亡细胞', '任天堂明星大乱斗'],
      ['The Legend of Zelda: Breath of the Wild', 'God of War (2018)', 'Black Myth: Wukong', 'The GTA series', 'Cyberpunk 2077', 'Watch Dogs', 'Borderlands', 'Apex Legends', 'Slay the Spire', 'Dead Cells', 'Super Smash Bros.'],
    ),
    tags: [],
    links: [],
  },
  cars: {
    kicker: L('POLE TO WIN', 'POLE TO WIN'),
    title: L('保时捷和赛车', 'Porsche & racing'),
    sub: L('我的车，和我追的比赛', 'My car, and the racing I follow'),
    body: L(['我开一台 2026 款保时捷帕拉梅拉，火山灰色。桌上那台 1:24 车模是银色的 911 GT3 Touring，我最喜欢的跑车。F1 里最喜欢的车手是维斯塔潘：杆位起步，一路领跑到终点。'], ['I drive a 2026 Porsche Panamera in Volcano Grey. The 1:24 model on the desk is a silver 911 GT3 Touring, my favourite sports car. My favourite F1 driver is Max Verstappen: pole to win.']),
    bullets: L(['我的车：2026 款保时捷帕拉梅拉 · 火山灰', '最喜欢的跑车：保时捷 911 · 银色', '最喜欢的车手：Max Verstappen'], ['My car: 2026 Porsche Panamera, Volcano Grey', 'Favourite sports car: Porsche 911, silver', 'Favourite driver: Max Verstappen']),
    tags: ['Porsche', 'F1'],
    links: [{ label: L('F1 网站', 'F1 website'), action: 'project1' }],
  },
  review: {
    kicker: L('YEAR IN REVIEW', 'YEAR IN REVIEW'),
    title: L('2026 年度回顾', '2026 in review'),
    sub: L('台历上圈出来的三个月', 'The three months circled on the calendar'),
    body: L([], []),
    bullets: L(['2 月：加入 Soul，做策略产品', '5 月：加入字节跳动，做 AgentCall', '10 月：加入腾讯，做 AI 产品经理'], ['February: joined Soul as a strategy PM intern', 'May: joined ByteDance to work on AgentCall', 'October: joined Tencent as an AI product manager']),
    tags: [],
    links: [{ label: L('实习经历', 'Work'), action: 'work' }],
  },
  places: {
    kicker: L('PLACES', 'PLACES'),
    title: L('去过的地方', 'Places'),
    sub: L('6 个国家和地区，13 座国内城市', '6 countries and regions, 13 cities in mainland China'),
    body: L([], []),
    bullets: L([], []),
    sections: [
      { heading: L('海外', 'Abroad'), items: L(['美国', '澳大利亚', '新西兰', '日本', '印尼 · 巴厘岛'], ['United States', 'Australia', 'New Zealand', 'Japan', 'Bali, Indonesia']) },
      { heading: L('港澳', 'Hong Kong & Macau'), items: L(['香港', '澳门'], ['Hong Kong', 'Macau']) },
      { heading: L('国内', 'Mainland China'), items: L(['北京', '上海', '杭州', '苏州', '南京', '广州', '深圳', '重庆', '成都', '长沙', '贵州', '大理', '丽江'], ['Beijing', 'Shanghai', 'Hangzhou', 'Suzhou', 'Nanjing', 'Guangzhou', 'Shenzhen', 'Chongqing', 'Chengdu', 'Changsha', 'Guizhou', 'Dali', 'Lijiang']) },
    ],
    tags: [],
    links: [],
  },
  movies: {
    kicker: L('ADMIT ONE', 'ADMIT ONE'),
    title: L('最喜欢的电影', 'Favourite films'),
    sub: L('看了不止一遍的那些', 'The ones I watched more than once'),
    body: L([], []),
    bullets: L(['星际穿越', '搏击俱乐部', '蜘蛛侠：平行宇宙（所以桌上有个蜘蛛侠面具）'], ['Interstellar', 'Fight Club', 'Spider-Man: Into the Spider-Verse (hence the mask on the desk)']),
    tags: [],
    links: [],
  },
  knowledge: {
    kicker: L('认知积累', 'IDEAS I COLLECT'),
    title: L('播客和公众号', 'Podcasts & reads'),
    sub: L('通勤路上听的、睡前看的', 'What I listen to on the commute and read before bed'),
    body: L([], []),
    bullets: L([], []),
    sections: [
      { heading: L('播客', 'Podcasts'), items: L(['硅谷101', 'AI 炼金术', '张小珺商业访谈录'], ['Silicon Valley 101', 'AI Alchemy', 'Zhang Xiaojun’s business interviews']) },
      { heading: L('公众号', 'WeChat accounts'), items: L(['数字生命卡兹克', 'Datawhale', '白鲸出海', 'Elsewhere 别处发生', '极客公园'], ['Digital Life Khazix', 'Datawhale', 'Baijing Chuhai', 'Elsewhere', 'GeekPark']) },
    ],
    tags: [],
    links: [],
  },
  cat: {
    kicker: L('MEOW', 'MEOW'),
    title: L('小布', 'Xiaobu'),
    sub: L('一只银色虎斑美短（快要来了）', 'A silver tabby American Shorthair, coming soon'),
    body: L(['桌上睡觉的就是它。等它真的到家，这里会换成照片。'], ['That’s it sleeping on the desk. Photos once it actually moves in.']),
    bullets: L([], []),
    tags: [],
    links: [],
  },
  now: {
    kicker: L('NOW', 'NOW'),
    title: L('最近在做什么', 'What I am up to now'),
    sub: L('2026 年 10 月', 'October 2026'),
    body: L([], []),
    bullets: L(['在做：腾讯 AI 产品经理', '在搭：这个网站和一个 F1 网站', '在等：小布到家'], ['Doing: AI product manager at Tencent', 'Building: this site and an F1 website', 'Waiting for: Xiaobu to move in']),
    tags: [],
    links: [],
  },
  press: {
    kicker: L('THE DAILY SIMON', 'THE DAILY SIMON'),
    title: L('剪报墙', 'Press clippings'),
    sub: L('墙上贴的几件事', 'What is pinned to the wall'),
    body: L([], []),
    bullets: L(['AgentCall 覆盖 80% 外呼场景，转化意向 +15.7%', '意图识别准确率 73.3% → 90.5%', 'Soul 进房停留时长 +34.7%', '2026 年 10 月加入腾讯'], ['AgentCall covers 80% of outbound calls; conversion intent +15.7%', 'Intent accuracy 73.3% → 90.5%', 'Soul room dwell time +34.7%', 'Joined Tencent in October 2026']),
    tags: [],
    links: [{ label: L('实习经历', 'Work'), action: 'work' }],
  },
  contact: {
    kicker: L('CONTACT', 'CONTACT'),
    title: L('联系我', 'Get in touch'),
    sub: L('欢迎来聊', 'Happy to chat'),
    body: L(['聊 AI 产品、F1 或者游戏都可以。'], ['Happy to talk AI products, F1 or games.']),
    bullets: L([], []),
    tags: [],
    links: [{ label: L('邮箱 xuzihao1218@126.com', 'Email xuzihao1218@126.com'), href: 'mailto:xuzihao1218@126.com' }, { label: L('GitHub @simon200401', 'GitHub @simon200401'), href: 'https://github.com/simon200401' }],
  },
  fries: {
    kicker: L('彩蛋', 'EASTER EGG'),
    title: L('一盘薯条', 'A plate of fries'),
    sub: L('工作也要吃饭', 'Even builders need snacks'),
    body: L(['你发现了桌上的薯条。'], ['You found the fries.']),
    bullets: L([], []),
    tags: [],
    links: [],
  },
};

// 阅读模式的顺序
export const INTRO_ORDER = ['about', 'now', 'work', 'project1', 'project2', 'project3', 'review', 'cars', 'games', 'movies', 'knowledge', 'places', 'cat', 'interests', 'blog', 'photos', 'music', 'news', 'contact'];

// 这几个面板的正文来自 assets/data/<file>.json
export const DYNAMIC = {
  projects: { file: 'projects', kicker: L('PRESS START', 'PRESS START'), title: L('全部项目', 'All projects'), sub: L('做过的东西，都在这儿', 'Everything I have built') },
  blog: { file: 'blog', kicker: L('BLOG', 'BLOG'), title: L('博客', 'Blog'), sub: L('笔记、想法和记录', 'Notes, ideas and logs') },
  // 日记是私人的：没有 data 文件，正文加密存在 Worker 里，输密码才读得到（见 journal.js）
  journal: { file: null, kicker: L('JOURNAL', 'JOURNAL'), title: L('日记', 'Journal'), sub: L('只有我自己看得到：做了什么，有什么感悟', 'Private: what I did and what I took from it') },
  photos: { file: 'photos', kicker: L('PHOTOGRAPHY', 'PHOTOGRAPHY'), title: L('摄影', 'Photography'), sub: L('一组一组地看：点封面，翻开整个合集', 'In collections: open a cover to see the whole set') },
  news: { file: 'news', kicker: L('AI DAILY', 'AI DAILY'), title: L('新闻', 'News desk'), sub: L('AI · 研究 · 行业 · 国际', 'AI · Research · Industry · Global') },
  friends: { file: 'friends', kicker: L('FRIENDS', 'FRIENDS'), title: L('朋友们', 'Friends'), sub: L('他们的站也值得看', 'Their sites are worth a visit') },
  music: { file: 'music', kicker: L('NOW SPINNING', 'NOW SPINNING'), title: L('唱片机', 'Turntable'), sub: L('我的 Apple Music 歌单', 'My Apple Music playlist') },
  // 显示器前那座绿色小城：一根柱子是一天。wide：一整年 53 列要排得下，桌面端面板加宽（见 app.js 的 panelLayout）
  github: { file: 'github', wide: true, kicker: L('GITHUB · @simon200401', 'GITHUB · @simon200401'), title: L('贡献墙', 'Contribution wall'), sub: L('一格是一天，绿得越深，那天提交越多', 'One square per day; the deeper the green, the more I shipped') },
};

// 笔记本里可以放几个面板，面板顶上有一排按钮切换。日记要先部署 workers/api，再改成 ['blog', 'journal'] 并放进 INTRO_ORDER
export const NOTEBOOK = [];

// 唱片机放的 Apple Music 歌单（公开歌单的分享链接）；留空就用 music.json 里的曲目和自带播放器
export const APPLE_MUSIC = 'https://music.apple.com/cn/playlist/life/pl.u-vxy69q3FWBvN9eo';

// 分享链接 → 嵌入播放器地址；不是 Apple Music 歌单链接就返回 null
export function appleEmbed(url) {
  const m = /^https:\/\/music\.apple\.com\/([a-z]{2})\/playlist\/([^/?#]+)\/(pl\.[\w.-]+)/i.exec(url || '');
  return m ? `https://embed.music.apple.com/${m[1]}/playlist/${m[2]}/${m[3]}` : null;
}

// 摄影合集的先后和名字：key 是 photos.json 里每张照片的 category。没登记的分类会排在最后。
export const ALBUMS = [
  { key: 'Street', name: L('街头', 'Street') },
  { key: 'Portrait', name: L('人像', 'Portrait') },
  { key: 'Architecture', name: L('建筑', 'Architecture') },
  { key: 'Landscape', name: L('风光', 'Landscape') },
  { key: 'Night', name: L('夜', 'Night') },
  { key: 'Nature', name: L('自然', 'Nature') },
  { key: 'Wildlife', name: L('野生动物', 'Wildlife') },
  { key: 'Travel', name: L('旅途', 'Travel') },
];

// 显示器里的对话：api 填自己部署的 workers/api 地址后接真模型；留空就只用下面的预设回答
export const CHAT = {
  api: '',
  hello: L('你好，我是 Simon 的 AI 分身。直接问，或者点下面的问题。', 'Hi, I’m Simon’s AI stand-in. Ask anything, or pick a question below.'),
  fallback: L('这个我没准备台词。试试问：你是谁、做过什么项目、怎么联系你。', 'I don’t have a line for that. Try: who are you, what have you built, how to reach you.'),
  topics: [
    { id: 'who', keys: ['你是谁', '介绍', 'who', 'about', 'yourself', 'simon'], q: L('你是谁？', 'Who are you?'), a: L('我是 Simon，许子豪，在腾讯做 AI 产品经理。之前在字节跳动做 AgentCall 和 LLM 评测，在 Soul 做策略产品。工作之外是赛车迷和游戏玩家。', 'I’m Simon Xu, an AI product manager at Tencent. Before that I worked on AgentCall and LLM evaluation at ByteDance and on strategy products at Soul. Outside work: racing fan and gamer.'), panel: 'about' },
    { id: 'projects', keys: ['项目', '做过', 'project', 'build', 'built'], q: L('你做过什么项目？', 'What have you built?'), a: L('三个：一个还没发布的 F1 网站、一部 AIGC 短片和一个 iOS App。桌上的三本刊物就是它们。', 'Three: an F1 website that hasn’t launched yet, an AIGC short film and an iOS app. They’re the three zines on the desk.'), panel: 'project1' },
    { id: 'styles', keys: ['风格', '宇宙', 'style', 'universe', 'blender', '怎么做'], q: L('为什么有十种画风？', 'Why ten styles?'), a: L('同一张桌子在 Blender 里建模，一个机位渲出底色、光影和轮廓，再合成十种印刷风格。点桌上的面具，或者按空格，就换一个宇宙。', 'One desk modelled in Blender, one camera, rendered into colour, light and outline passes, then composited into ten print styles. Click the mask on the desk, or press Space, to jump universes.') },
    { id: 'contact', keys: ['联系', '邮箱', 'email', 'contact', 'reach'], q: L('怎么联系你？', 'How do I reach you?'), a: L('发邮件到 xuzihao1218@126.com，或者点桌上的名片。', 'Email xuzihao1218@126.com, or click the business card on the desk.'), panel: 'contact' },
  ],
};

export const UI = {
  loading: L('正在穿越宇宙…', 'Crossing universes…'),
  desk: L('DESK 探索', 'DESK explore'),
  intro: L('INTRO 阅读', 'INTRO read'),
  back: L('← 回到桌面', '← BACK TO DESK'),
  hint: L('点面具或按空格，换一个宇宙', 'Click the mask or press Space to switch universe'),
  hintTouch: L('拖动看整张桌子 · 点面具换宇宙', 'Drag to explore · tap the mask'),
  chatPlaceholder: L('问我点什么…', 'Ask me something…'),
  send: L('发送', 'Send'),
  soundOn: L('声音：开', 'Sound: on'),
  soundOff: L('声音：关', 'Sound: off'),
  more: L('展开', 'Open'),
  introTitle: L('一张桌子，十个宇宙', 'One desk, ten universes'),
  thinking: L('正在输入…', 'typing…'),
  offline: L('（AI 暂时连不上，这是预设回答）', '(The AI is unreachable right now; this is a canned answer.)'),
  all: L('全部', 'All'),
  updated: L('更新于', 'Updated'),
  backToList: L('← 返回列表', '← Back to list'),
  backToAlbums: L('← 全部合集', '← All collections'),
  photoCount: L('{n} 张', '{n} photos'),
  loadFailed: L('内容加载失败，稍后再试。', 'Could not load this. Try again later.'),
  close: L('关闭', 'Close'),
  prev: L('上一张', 'Previous'),
  next: L('下一张', 'Next'),
  webHint: L('每个朋友都是一个平行宇宙。顺着蛛丝选一个，过去串门。', 'Every friend is a universe of their own. Pick a thread and go visit.'),
  visit: L('去串门 →', 'Visit →'),
  musicIdle: L('挑一张碟，放下唱针', 'Pick a record, drop the needle'),
  musicPlay: L('播放', 'Play'),
  musicPause: L('暂停', 'Pause'),
  musicPrev: L('上一首', 'Previous track'),
  musicNext: L('下一首', 'Next track'),
  musicShuffle: L('随机播放', 'Shuffle'),
  musicSeek: L('播放进度', 'Seek'),
  musicVolume: L('音量', 'Volume'),
  musicCrate: L('选碟台', 'The crate'),
  musicCount: L('{n} 首能直接放 · 歌单共 {total} 首', '{n} play right here · {total} in the playlist'),
  musicOpen: L('在网易云打开歌单 →', 'Open on NetEase Music →'),
  musicBlocked: L('这几首在你这边放不出来，多半是地区限制。去网易云听，或者换一首试试。', 'These tracks will not play from where you are, most likely a region lock. Try NetEase Music, or pick another one.'),
  musicEmpty: L('歌单暂时是空的。', 'The crate is empty right now.'),
  canvasLabel: L('Simon 的工位：可点击的 3D 场景。完整内容见 INTRO 阅读模式。', 'Simon’s desk: a clickable 3D scene. The full content is available in INTRO read mode.'),
};

// 文字提问 → 话题：命中关键词最多的那个（并列取靠前的）；一个都没命中返回 null。纯函数，方便测试
export function matchTopic(text) {
  const t = String(text || '').toLowerCase();
  const scored = CHAT.topics.map((topic) => ({ topic, hits: topic.keys.filter((k) => t.includes(k.toLowerCase())).length }));
  const best = scored.reduce((top, cur) => (cur.hits > top.hits ? cur : top), { topic: null, hits: 0 });
  return best.topic;
}
