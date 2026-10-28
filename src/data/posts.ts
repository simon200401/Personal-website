import type { L } from '@/lib/i18n';

export type Post = {
  slug: string;
  date: string; // YYYY-MM-DD
  title: L;
  summary: L;
  tags: string[];
  /**
   * Paragraphs of the post. A paragraph starting with "## " renders as a
   * heading. Leave a language empty ([]) to fall back to the other one.
   */
  body: { zh: string[]; en: string[] };
};

// Newest first. TODO: replace the placeholder post with real ones.
export const posts: Post[] = [
  {
    slug: 'hello-world',
    date: '2026-10-28',
    title: { zh: '你好，世界', en: 'Hello, world' },
    summary: {
      zh: '第一篇文章：为什么要做个人网站，以及这里之后会写什么。',
      en: 'First post: why I built a personal site and what I plan to write here.',
    },
    tags: ['随笔 / Notes'],
    body: {
      zh: [
        '这是一篇占位文章。把 src/data/posts.ts 里的内容换成你自己的就行。',
        '## 怎么写新文章',
        '在 posts 数组最前面加一项，填好 slug、日期、标题、摘要和正文。slug 会成为网址的一部分，例如 /blog/hello-world/。',
      ],
      en: [
        'This is a placeholder post. Replace the content in src/data/posts.ts with your own.',
        '## Writing a new post',
        'Add an entry to the front of the posts array with a slug, date, title, summary and body. The slug becomes part of the URL, e.g. /blog/hello-world/.',
      ],
    },
  },
];
