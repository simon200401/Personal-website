import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { ALBUMS, CHAT, DYNAMIC, HOTS, INTRO_ORDER, LABELS, LANGS, NOTEBOOK, PANELS, STYLES, UI, matchTopic } from '../site/js/content.js';

const hasPanel = (key) => Boolean(PANELS[key] || DYNAMIC[key]);

const bothLangs = (pair, where) => LANGS.forEach((l) => assert.ok(pair && pair[l] != null && pair[l].length !== undefined, `${where} 缺少 ${l}`));

test('十个宇宙，id 唯一，字段齐全', () => {
  assert.equal(STYLES.length, 10);
  assert.equal(new Set(STYLES.map((s) => s.id)).size, 10);
  STYLES.forEach((s) => {
    ['ink', 'paper', 'accent'].forEach((k) => assert.match(s[k], /^#[0-9a-f]{6}$/i, `${s.id}.${k}`));
    assert.ok(s.earth.startsWith('EARTH-'));
    assert.ok(s.sfx.length > 0);
    bothLangs(s.name, `style ${s.id}`);
  });
});

test('每个热点都有标签，并指向存在的面板或动作', () => {
  Object.entries(HOTS).forEach(([name, hot]) => {
    bothLangs(LABELS[name], `label ${name}`);
    if (hot.panel) assert.ok(hasPanel(hot.panel), `${name} → ${hot.panel} 不存在`);
    else assert.ok(['chat', 'style'].includes(hot.action), `${name} 的动作未知`);
  });
});

test('面板中英文齐全，条目数量一致，链接合法', () => {
  Object.entries(PANELS).forEach(([key, p]) => {
    ['kicker', 'title', 'sub', 'body', 'bullets'].forEach((f) => bothLangs(p[f], `${key}.${f}`));
    assert.equal(p.bullets.zh.length, p.bullets.en.length, `${key} 的要点中英文条数不同`);
    assert.equal(p.body.zh.length, p.body.en.length, `${key} 的正文中英文段数不同`);
    (p.sections || []).forEach((sec, i) => {
      bothLangs(sec.heading, `${key}.sections[${i}].heading`);
      bothLangs(sec.items, `${key}.sections[${i}].items`);
      assert.equal(sec.items.zh.length, sec.items.en.length, `${key} 第 ${i + 1} 组要点中英文条数不同`);
      assert.ok(sec.items.zh.length > 0);
    });
    if (p.image) {
      bothLangs(p.image.alt, `${key}.image.alt`);
      LANGS.forEach((l) => assert.ok(existsSync(new URL(`../site/${p.image.src[l]}`, import.meta.url)), `${key} 的配图不存在：${p.image.src[l]}`));
    }
    p.links.forEach((l) => {
      bothLangs(l.label, `${key} link`);
      assert.ok(l.href || l.action, `${key} 的链接既没有 href 也没有 action`);
      if (l.href) assert.match(l.href, /^(https:\/\/|mailto:|assets\/)/, `${key}: ${l.href}`);
      if (l.action && l.action !== 'intro') assert.ok(hasPanel(l.action), `${key} → ${l.action}`);
    });
  });
});

test('联系面板：至少有一个联系方式', () => {
  assert.ok(PANELS.contact.links.some((l) => l.href), '联系面板里没有链接');
});

test('新物件：赛道、台历、地球仪、票根、卡片盒、小猫、NOW 便签都有面板，阅读模式里有它们', () => {
  const want = { cars: 'cars', calendar: 'review', globe: 'places', movies: 'movies', cards: 'knowledge', cat: 'cat', now: 'now', games: 'games' };
  Object.entries(want).forEach(([hot, panel]) => {
    assert.equal(HOTS[hot].panel, panel);
    assert.ok(INTRO_ORDER.includes(panel), panel);
  });
  ['trophy', 'github', 'friends', 'table-model'].forEach((h) => assert.ok(!HOTS[h], `${h} 应该已经去掉`));
});

test('桌上每个热点都有名字，指向的面板存在', () => {
  Object.entries(HOTS).forEach(([name, hot]) => {
    bothLangs(LABELS[name], `LABELS.${name}`);
    if (hot.panel) assert.ok(hasPanel(hot.panel), `${name} → ${hot.panel}`);
  });
});

test('阅读模式引用的面板都存在', () => {
  INTRO_ORDER.forEach((k) => assert.ok(hasPanel(k), k));
});

test('笔记本：点开的是博客；笔记本里的面板都在阅读模式里', () => {
  assert.equal(HOTS.notebook.panel, 'blog');
  NOTEBOOK.forEach((k) => {
    assert.ok(DYNAMIC[k], `${k} 不是动态面板`);
    assert.ok(INTRO_ORDER.includes(k), `阅读模式里没有 ${k}`);
  });
});

test('日记是私人的：站点目录里不放任何日记正文或索引', () => {
  assert.equal(DYNAMIC.journal.file, null);
  assert.ok(!existsSync(new URL('../site/assets/data/journal', import.meta.url)));
  assert.ok(!existsSync(new URL('../site/assets/data/journal.json', import.meta.url)));
});

test('界面文案中英文齐全', () => {
  Object.entries(UI).forEach(([k, v]) => bothLangs(v, `UI.${k}`));
  bothLangs(CHAT.hello, 'chat.hello');
  bothLangs(CHAT.fallback, 'chat.fallback');
});

test('对话话题：问答齐全，可选面板存在', () => {
  CHAT.topics.forEach((t) => {
    bothLangs(t.q, t.id);
    bothLangs(t.a, t.id);
    assert.ok(t.keys.length > 0);
    if (t.panel) assert.ok(hasPanel(t.panel));
  });
});

test('matchTopic 按关键词匹配，中英文都行，匹配不到返回 null', () => {
  assert.equal(matchTopic('你是谁').id, 'who');
  assert.equal(matchTopic('What projects have you built?').id, 'projects');
  assert.equal(matchTopic('how can I contact you').id, 'contact');
  assert.equal(matchTopic('今天天气如何'), null);
  assert.equal(matchTopic(''), null);
  assert.equal(matchTopic(undefined), null);
});

test('对外文案不出现 FinalBoss', () => {
  assert.ok(!/finalboss/i.test(JSON.stringify(PANELS)));
});

test('渲染产物与内容对得上（跑过 stylize 之后才检查）', { skip: !existsSync(new URL('../site/assets/scene.json', import.meta.url)) }, () => {
  const scene = JSON.parse(readFileSync(new URL('../site/assets/scene.json', import.meta.url), 'utf8'));
  assert.deepEqual(scene.styles, STYLES.map((s) => s.id));
  Object.keys(scene.hots).forEach((name) => assert.ok(HOTS[name], `场景里的热点 ${name} 没有对应内容`));
  STYLES.forEach((s) => ['', '@1x'].forEach((suffix) => assert.ok(existsSync(new URL(`../site/assets/styles/${s.id}${suffix}.webp`, import.meta.url)), `${s.id}${suffix}.webp`)));
});

test('简历不公开：没有简历面板、话题，也没有 PDF', () => {
  assert.ok(!('resume' in PANELS) && !('resume' in HOTS));
  assert.ok(!CHAT.topics.some((t) => t.id === 'resume'));
  assert.equal(matchTopic('能发我简历吗'), null);
});

test('动态面板：文案齐全，数据文件存在且形状正确', { skip: !existsSync(new URL('../site/assets/data', import.meta.url)) }, () => {
  const read = (file) => JSON.parse(readFileSync(new URL(`../site/assets/data/${file}.json`, import.meta.url), 'utf8'));
  Object.entries(DYNAMIC).forEach(([key, meta]) => {
    ['kicker', 'title', 'sub'].forEach((f) => bothLangs(meta[f], `${key}.${f}`));
    if (meta.file) assert.ok(read(meta.file), key);     // 日记是私人的，没有公开的数据文件
  });
  const news = read('news');
  assert.ok(news.items.length > 0);
  news.items.forEach((n) => assert.match(n.url, /^https?:\/\//));
  const photos = read('photos');
  assert.equal(new Set(photos.map((p) => p.id)).size, photos.length, '照片 id 有重复');
  photos.forEach((p) => {
    assert.ok(existsSync(new URL(`../site/assets/photos/${p.id}.webp`, import.meta.url)), `photo ${p.id}`);
    assert.ok(existsSync(new URL(`../site/assets/photos/${p.id}-t.webp`, import.meta.url)), `thumb ${p.id}`);
    assert.ok(ALBUMS.some((a) => a.key === p.category), `照片 ${p.id} 的分类 ${p.category} 没有登记成合集`);
    assert.ok(p.title && p.w > 0 && p.h > 0);
  });
  read('blog').forEach((p) => assert.ok(p.title && p.content));
  read('projects').forEach((p) => assert.ok(p.title && Array.isArray(p.tech)));
  const friends = read('friends');
  assert.equal(new Set(friends.map((f) => f.link)).size, friends.length, '友链有重复');
  friends.forEach((f) => {
    assert.ok(f.name && f.desc, `友链缺名字或简介：${f.link}`);
    assert.match(f.link, /^https:\/\//);
  });
  const music = read('music');     // 还没设歌单时是空的
  if (music.tracks.length) assert.match(music.playlist.url, /^https:\/\/music\.163\.com\//);
  assert.ok(music.playlist.total >= music.tracks.length);
  assert.equal(new Set(music.tracks.map((t) => t.id)).size, music.tracks.length, '歌单里有重复的歌');
  music.tracks.forEach((t) => {
    assert.ok(Number.isInteger(t.id) && t.title, `歌曲缺 id 或标题：${JSON.stringify(t)}`);
    assert.ok(t.cover === '' || t.cover.startsWith('https://'), `${t.title} 的封面不是 https`);
    assert.ok(t.duration >= 0);
  });
});

test('摄影合集：名字中英文齐全，key 不重复', () => {
  assert.equal(new Set(ALBUMS.map((a) => a.key)).size, ALBUMS.length);
  ALBUMS.forEach((a) => bothLangs(a.name, `album ${a.key}`));
});

test('对话接口地址要么留空（只用预设回答），要么是 https', () => {
  assert.ok(CHAT.api === '' || /^https:\/\//.test(CHAT.api), CHAT.api);
});

test('Apple Music：分享链接能转成嵌入地址', async () => {
  const { APPLE_MUSIC, appleEmbed } = await import('../site/js/content.js');
  assert.equal(appleEmbed('https://music.apple.com/cn/playlist/life/pl.u-vxy69q3FWBvN9eo'), 'https://embed.music.apple.com/cn/playlist/life/pl.u-vxy69q3FWBvN9eo');
  assert.equal(appleEmbed('https://example.com/x'), null);
  assert.equal(appleEmbed(''), null);
  if (APPLE_MUSIC) assert.ok(appleEmbed(APPLE_MUSIC));
});
