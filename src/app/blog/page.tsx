'use client';

import Link from 'next/link';
import PageHeading from '@/components/PageHeading';
import { useLang } from '@/lib/i18n';
import { posts } from '@/data/posts';

export default function BlogPage() {
  const { t } = useLang();

  return (
    <div className="page-enter pb-6">
      <PageHeading
        title={{ zh: '博客', en: 'Blog' }}
        intro={{ zh: '笔记、想法和记录。', en: 'Notes, ideas and logs.' }}
      />
      <ul className="divide-y divide-line border-y border-line">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}/`} className="group block py-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-lg font-medium group-hover:text-sage">{t(post.title)}</h2>
                <time className="text-sm text-ink-dim">{post.date}</time>
              </div>
              <p className="mt-1 text-ink-mid">{t(post.summary)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
