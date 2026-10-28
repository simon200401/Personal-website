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
  phone: { panel: 'project1' },
  'zine-2': { panel: 'project2' },
  'zine-3': { panel: 'project3' },
  'zine-4': { panel: 'project4' },
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
  board: { zh: '我是谁', en: 'Who is Zihao?' },
  press: { zh: '剪报墙', en: 'Press clippings' },
  monitor: { zh: '跟我聊聊', en: 'Talk to me' },
  keyboard: { zh: '点键盘，跟我聊', en: 'Click the keyboard. Talk to me.' },
  mask: { zh: '换一个宇宙', en: 'Switch universe' },
  'zine-1': { zh: '项目一', en: 'Project one' },
  phone: { zh: '项目一', en: 'Project one' },
  'zine-2': { zh: '项目二', en: 'Project two' },
  'zine-3': { zh: '项目三', en: 'Project three' },
  'zine-4': { zh: '项目四', en: 'Project four' },
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
  cat: { zh: '我的美短', en: 'My cat' },
  now: { zh: '最近在做什么', en: 'Now' },
};

const L = (zh, en) => ({ zh, en });

// TODO：以下面板都是占位，换成你自己的内容。每段文字都要写中英两版。
const project = (n, zh, en) => ({
  kicker: L(`项目 · 0${n}`, `PROJECT · 0${n}`),
  title: L(zh, en),
  sub: L('一句话说明这个项目', 'One line about this project'),
  body: L(['这个项目解决什么问题、你在里面负责什么、做出了什么结果。两三句话就够了。'], ['What problem it solves, what you did, and what came of it. Two or three sentences is plenty.']),
  bullets: L(['亮点一', '亮点二'], ['Highlight one', 'Highlight two']),
  tags: ['Tag'],
  links: [],
});

export const PANELS = {
  about: {
    kicker: L('WHO IS ZIHAO?', 'WHO IS ZIHAO?'),
    title: L('Zihao Xu', 'Zihao Xu'),
    sub: L('一句话介绍：学校、专业，或者现在在做什么', 'One line: school, major, or what you do now'),
    body: L(
      ['这里是自我介绍的第一段：你是谁，在哪里，在学什么或做什么。', '第二段可以写你最近在做的事情，以及你在意什么。'],
      ['First paragraph of your introduction: who you are, where you are, what you study or do.', 'A second paragraph about what you are working on lately and what you care about.'],
    ),
    bullets: L([], []),
    sections: [
      { heading: L('基本信息', 'Basics'), items: L(['所在城市', '学校 / 专业', '语言'], ['City', 'School / major', 'Languages']) },
      { heading: L('时间线', 'Timeline'), items: L(['2026　最近的一段经历', '2025　上一段经历'], ['2026　Most recent experience', '2025　Previous experience']) },
      { heading: L('技能', 'Skills'), items: L(['语言：Python、TypeScript', '工具：Git、Blender'], ['Languages: Python, TypeScript', 'Tools: Git, Blender']) },
    ],
    tags: ['Tag'],
    links: [{ label: L('全部项目', 'All projects'), action: 'projects' }, { label: L('GitHub', 'GitHub'), href: 'https://github.com/simon200401' }, { label: L('联系我', 'Get in touch'), action: 'contact' }],
  },
  work: {
    kicker: L('实习 / 工作', 'WORK'),
    title: L('公司或组织名称', 'Company or organisation'),
    sub: L('职位 · 时间', 'Role · dates'),
    body: L(['在这里做了什么，用一两句话说清楚。'], ['What you did there, in a sentence or two.']),
    bullets: L(['做成的一件事', '另一件事'], ['One thing you got done', 'Another one']),
    tags: [],
    links: [],
  },
  interests: {
    kicker: L('兴趣', 'INTERESTS'),
    title: L('工作之外', 'Outside work'),
    sub: L('喜欢做的事', 'Things I enjoy'),
    body: L(['写几样你的兴趣爱好。'], ['A few things you enjoy.']),
    bullets: L([], []),
    tags: [],
    links: [],
  },
  project1: project(1, '项目一（占位）', 'Project one (placeholder)'),
  project2: project(2, '项目二（占位）', 'Project two (placeholder)'),
  project3: project(3, '项目三（占位）', 'Project three (placeholder)'),
  project4: project(4, '项目四（占位）', 'Project four (placeholder)'),
  games: {
    kicker: L('PRESS START', 'PRESS START'),
    title: L('我喜欢的游戏', 'Games I love'),
    sub: L('玩过、在玩、想玩的', 'Played, playing, want to play'),
    body: L(['每个游戏一句话：为什么喜欢它。'], ['One line per game: why I love it.']),
    bullets: L(['游戏一（占位）', '游戏二（占位）'], ['Game one (placeholder)', 'Game two (placeholder)']),
    tags: [],
    links: [],
  },
  cars: {
    kicker: L('POLE TO WIN', 'POLE TO WIN'),
    title: L('保时捷和赛车', 'Porsche & racing'),
    sub: L('我的车，和我追的比赛', 'My car, and the racing I follow'),
    body: L(['我开一台保时捷（车型和颜色待补）。F1 里最喜欢的车手是维斯塔潘。'], ['I drive a Porsche (model and colour to come). My favourite F1 driver is Max Verstappen.']),
    bullets: L(['我的车：车型（占位）', '最喜欢的车手：Max Verstappen'], ['My car: model (placeholder)', 'Favourite driver: Max Verstappen']),
    tags: ['Porsche', 'F1'],
    links: [],
  },
  review: {
    kicker: L('YEAR IN REVIEW', 'YEAR IN REVIEW'),
    title: L('年度回顾', 'Year in review'),
    sub: L('每年写一页：做了什么、去了哪、学会了什么', 'One page a year: what I did, where I went, what I learned'),
    body: L(['今年的回顾（占位）。'], ['This year in review (placeholder).']),
    bullets: L(['一件重要的事（占位）'], ['One thing that mattered (placeholder)']),
    tags: [],
    links: [],
  },
  places: {
    kicker: L('PLACES', 'PLACES'),
    title: L('去过的地方', 'Places'),
    sub: L('去过、住过的城市', 'Cities I have visited or lived in'),
    body: L([], []),
    bullets: L(['城市一（占位）', '城市二（占位）'], ['City one (placeholder)', 'City two (placeholder)']),
    tags: [],
    links: [],
  },
  movies: {
    kicker: L('ADMIT ONE', 'ADMIT ONE'),
    title: L('喜欢的电影和剧', 'Films & shows'),
    sub: L('看了不止一遍的那些', 'The ones I watched more than once'),
    body: L([], []),
    bullets: L(['电影一（占位）', '电影二（占位）'], ['Film one (placeholder)', 'Film two (placeholder)']),
    tags: [],
    links: [],
  },
  knowledge: {
    kicker: L('认知积累', 'IDEAS I COLLECT'),
    title: L('播客和公众号', 'Podcasts & reads'),
    sub: L('常听的播客、常看的公众号，以及从里面记下的东西', 'Podcasts I listen to, accounts I read, and what I took from them'),
    body: L([], []),
    bullets: L(['播客一（占位）', '公众号一（占位）'], ['Podcast one (placeholder)', 'WeChat account one (placeholder)']),
    tags: [],
    links: [],
  },
  cat: {
    kicker: L('MEOW', 'MEOW'),
    title: L('我的美短', 'My cat'),
    sub: L('一只美国短毛猫（快要来了）', 'An American Shorthair, coming soon'),
    body: L(['名字还没想好。'], ['No name yet.']),
    bullets: L([], []),
    tags: [],
    links: [],
  },
  now: {
    kicker: L('NOW', 'NOW'),
    title: L('最近在做什么', 'What I am up to now'),
    sub: L('经常更新', 'Updated often'),
    body: L([], []),
    bullets: L(['在做：（占位）', '在学：（占位）', '在玩：（占位）'], ['Doing: (placeholder)', 'Learning: (placeholder)', 'Playing: (placeholder)']),
    tags: [],
    links: [],
  },
  press: {
    kicker: L('THE DAILY ZIHAO', 'THE DAILY ZIHAO'),
    title: L('剪报墙', 'Press clippings'),
    sub: L('墙上贴的几件事', 'What is pinned to the wall'),
    body: L([], []),
    bullets: L(['剪报一（占位）', '剪报二（占位）'], ['Clipping one (placeholder)', 'Clipping two (placeholder)']),
    tags: [],
    links: [{ label: L('联系我', 'Get in touch'), action: 'contact' }],
  },
  contact: {
    kicker: L('CONTACT', 'CONTACT'),
    title: L('联系我', 'Get in touch'),
    sub: L('欢迎来聊', 'Happy to chat'),
    body: L(['想合作或者交流，都可以通过下面的方式找到我。'], ['Reach me through any of the links below.']),
    bullets: L([], []),
    tags: [],
    links: [{ label: L('GitHub @simon200401', 'GitHub @simon200401'), href: 'https://github.com/simon200401' }],
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
export const INTRO_ORDER = ['about', 'now', 'work', 'project1', 'project2', 'project3', 'project4', 'review', 'cars', 'games', 'movies', 'knowledge', 'places', 'cat', 'interests', 'blog', 'photos', 'music', 'news', 'contact'];

// 这几个面板的正文来自 assets/data/<file>.json
export const DYNAMIC = {
  projects: { file: 'projects', kicker: L('PRESS START', 'PRESS START'), title: L('全部项目', 'All projects'), sub: L('做过的东西，都在这儿', 'Everything I have built') },
  blog: { file: 'blog', kicker: L('BLOG', 'BLOG'), title: L('博客', 'Blog'), sub: L('笔记、想法和记录', 'Notes, ideas and logs') },
  // 日记是私人的：没有 data 文件，正文加密存在 Worker 里，输密码才读得到（见 journal.js）
  journal: { file: null, kicker: L('JOURNAL', 'JOURNAL'), title: L('日记', 'Journal'), sub: L('只有我自己看得到：做了什么，有什么感悟', 'Private: what I did and what I took from it') },
  photos: { file: 'photos', kicker: L('PHOTOGRAPHY', 'PHOTOGRAPHY'), title: L('摄影', 'Photography'), sub: L('一组一组地看：点封面，翻开整个合集', 'In collections: open a cover to see the whole set') },
  news: { file: 'news', kicker: L('AI DAILY', 'AI DAILY'), title: L('新闻', 'News desk'), sub: L('AI · 研究 · 行业 · 国际', 'AI · Research · Industry · Global') },
  friends: { file: 'friends', kicker: L('FRIENDS', 'FRIENDS'), title: L('朋友们', 'Friends'), sub: L('他们的站也值得看', 'Their sites are worth a visit') },
  music: { file: 'music', kicker: L('NOW SPINNING', 'NOW SPINNING'), title: L('唱片机', 'Turntable'), sub: L('我的网易云歌单，放下唱针就响', 'My NetEase playlist. Drop the needle.') },
  // 显示器前那座绿色小城：一根柱子是一天。wide：一整年 53 列要排得下，桌面端面板加宽（见 app.js 的 panelLayout）
  github: { file: 'github', wide: true, kicker: L('GITHUB · @simon200401', 'GITHUB · @simon200401'), title: L('贡献墙', 'Contribution wall'), sub: L('一格是一天，绿得越深，那天提交越多', 'One square per day; the deeper the green, the more I shipped') },
};

// 笔记本里可以放几个面板，面板顶上有一排按钮切换。日记要先部署 workers/api，再改成 ['blog', 'journal'] 并放进 INTRO_ORDER
export const NOTEBOOK = [];

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
  hello: L('你好，我是 Zihao 的 AI 分身。直接问，或者点下面的问题。', 'Hi, I’m Zihao’s AI stand-in. Ask anything, or pick a question below.'),
  fallback: L('这个我没准备台词。试试问：你是谁、做过什么项目、怎么联系你。', 'I don’t have a line for that. Try: who are you, what have you built, how to reach you.'),
  topics: [
    { id: 'who', keys: ['你是谁', '介绍', 'who', 'about', 'yourself', 'zihao'], q: L('你是谁？', 'Who are you?'), a: L('我是 Zihao Xu。（TODO：换成一两句真实的自我介绍）', 'I’m Zihao Xu. (TODO: replace with a real one- or two-line intro)'), panel: 'about' },
    { id: 'projects', keys: ['项目', '做过', 'project', 'build', 'built'], q: L('你做过什么项目？', 'What have you built?'), a: L('桌上那几本刊物和手柄后面都是我的项目，点开看看。', 'The zines and the gamepad on the desk lead to my projects. Have a look.'), panel: 'projects' },
    { id: 'styles', keys: ['风格', '宇宙', 'style', 'universe', 'blender', '怎么做'], q: L('为什么有十种画风？', 'Why ten styles?'), a: L('同一张桌子在 Blender 里建模，一个机位渲出底色、光影和轮廓，再合成十种印刷风格。点桌上的面具，或者按空格，就换一个宇宙。', 'One desk modelled in Blender, one camera, rendered into colour, light and outline passes, then composited into ten print styles. Click the mask on the desk, or press Space, to jump universes.') },
    { id: 'contact', keys: ['联系', '邮箱', 'email', 'contact', 'reach'], q: L('怎么联系你？', 'How do I reach you?'), a: L('点桌上的名片，联系方式都在那里。', 'Click the business card on the desk; my contact details are there.'), panel: 'contact' },
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
  canvasLabel: L('Zihao 的工位：可点击的 3D 场景。完整内容见 INTRO 阅读模式。', 'Zihao’s desk: a clickable 3D scene. The full content is available in INTRO read mode.'),
};

// 文字提问 → 话题：命中关键词最多的那个（并列取靠前的）；一个都没命中返回 null。纯函数，方便测试
export function matchTopic(text) {
  const t = String(text || '').toLowerCase();
  const scored = CHAT.topics.map((topic) => ({ topic, hits: topic.keys.filter((k) => t.includes(k.toLowerCase())).length }));
  const best = scored.reduce((top, cur) => (cur.hits > top.hits ? cur : top), { topic: null, hits: 0 });
  return best.topic;
}
