import type { L } from '@/lib/i18n';

/**
 * Everything about you that more than one page shows.
 * Lines marked TODO are placeholders waiting for real content.
 */
export const profile = {
  name: { zh: 'Zihao Xu', en: 'Zihao Xu' } satisfies L, // TODO: Chinese name for the zh version
  // TODO: one line under your name, e.g. school + major, or current role
  tagline: {
    zh: '在这里写一句话介绍自己',
    en: 'A one-line introduction goes here',
  } satisfies L,
  // TODO
  location: { zh: '城市，国家', en: 'City, Country' } satisfies L,
  // Shown on the home page card and at the top of About. TODO
  bio: {
    zh: '这里是一段简短的自我介绍：你在做什么、关心什么、正在学什么。两三句话就够了。',
    en: 'A short introduction: what you work on, what you care about, and what you are learning. Two or three sentences is plenty.',
  } satisfies L,
  // Put a square photo at public/avatar.jpg and set this to '/avatar.jpg'.
  avatar: null as string | null,
  links: [
    { label: 'GitHub', href: 'https://github.com/simon200401' },
    // TODO: add or remove as needed
    // { label: 'LinkedIn', href: 'https://www.linkedin.com/in/...' },
    // { label: 'Email', href: 'mailto:you@example.com' },
  ],
};

export type TimelineItem = { period: string; title: L; detail: L };

// TODO: education, internships, clubs — newest first
export const timeline: TimelineItem[] = [
  {
    period: '2024 – now',
    title: { zh: '学校 / 公司名称', en: 'School / Company' },
    detail: { zh: '专业或职位，以及一句话说明你在这里做了什么。', en: 'Major or role, plus one line on what you did there.' },
  },
  {
    period: '2020 – 2024',
    title: { zh: '上一段经历', en: 'Previous experience' },
    detail: { zh: '同上。', en: 'Same as above.' },
  },
];

// TODO
export const skills: { group: L; items: string[] }[] = [
  { group: { zh: '语言', en: 'Languages' }, items: ['Python', 'TypeScript', 'C++'] },
  { group: { zh: '框架与工具', en: 'Frameworks & tools' }, items: ['React', 'Next.js', 'Git'] },
  { group: { zh: '兴趣', en: 'Interests' }, items: ['AI', '摄影 / Photography'] },
];
