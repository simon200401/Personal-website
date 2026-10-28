'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import type { Post } from '@/data/posts';

export default function PostView({ post }: { post: Post }) {
  const { t, lang } = useLang();
  // Fall back to the other language when a post was only written in one.
  const body = post.body[lang].length ? post.body[lang] : post.body[lang === 'zh' ? 'en' : 'zh'];

  return (
    <article className="page-enter mx-auto max-w-2xl pb-10">
      <Link href="/blog/" className="text-sm text-ink-dim hover:text-sage">
        ← {t({ zh: '返回博客', en: 'Back to blog' })}
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">{t(post.title)}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink-dim">
        <time>{post.date}</time>
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-line px-2 py-0.5 text-xs">
            {tag}
          </span>
        ))}
      </div>
      <div className="prose-post mt-8">
        {body.map((para, i) =>
          para.startsWith('## ') ? <h2 key={i}>{para.slice(3)}</h2> : <p key={i}>{para}</p>,
        )}
      </div>
    </article>
  );
}
