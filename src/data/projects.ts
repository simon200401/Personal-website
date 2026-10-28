import type { L } from '@/lib/i18n';

export type ProjectStatus = 'live' | 'dev' | 'planned';

export type Project = {
  slug: string;
  title: L;
  summary: L;
  category: L;
  status: ProjectStatus;
  tags: string[];
  year: string;
  link?: string;
  repo?: string;
  featured?: boolean;
};

// TODO: replace these placeholders with your own projects.
export const projects: Project[] = [
  {
    slug: 'personal-website',
    title: { zh: '个人网站', en: 'Personal Website' },
    summary: {
      zh: '你正在看的这个网站：Next.js 静态导出，部署在 GitHub Pages，支持中英切换和深浅色主题。',
      en: 'The site you are looking at: a Next.js static export on GitHub Pages with a language switch and light/dark themes.',
    },
    category: { zh: '网页', en: 'Web' },
    status: 'live',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
    year: '2026',
    repo: 'https://github.com/simon200401/Personal-website',
    featured: true,
  },
  {
    slug: 'project-two',
    title: { zh: '项目二（占位）', en: 'Project Two (placeholder)' },
    summary: {
      zh: '一两句话说明这个项目解决什么问题、你负责什么。',
      en: 'One or two sentences on what problem it solves and what you did.',
    },
    category: { zh: 'AI', en: 'AI' },
    status: 'dev',
    tags: ['Python'],
    year: '2026',
  },
  {
    slug: 'project-three',
    title: { zh: '项目三（占位）', en: 'Project Three (placeholder)' },
    summary: {
      zh: '一两句话说明这个项目解决什么问题、你负责什么。',
      en: 'One or two sentences on what problem it solves and what you did.',
    },
    category: { zh: '课程', en: 'Coursework' },
    status: 'planned',
    tags: ['C++'],
    year: '2025',
  },
];

export const statusLabel: Record<ProjectStatus, L> = {
  live: { zh: '已上线', en: 'Live' },
  dev: { zh: '开发中', en: 'In progress' },
  planned: { zh: '计划中', en: 'Planned' },
};
