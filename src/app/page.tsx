'use client';

import Link from 'next/link';
import BaseCard from '@/components/BaseCard';
import Avatar from '@/components/Avatar';
import PlaceholderTile from '@/components/PlaceholderTile';
import { useLang } from '@/lib/i18n';
import { asset } from '@/lib/asset';
import { profile } from '@/data/profile';
import { projects, statusLabel } from '@/data/projects';
import { posts } from '@/data/posts';
import { photos } from '@/data/photos';

const featured = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(0, 3);

function CardTitle({ children, href }: { children: React.ReactNode; href?: string }) {
  const { t } = useLang();
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-mist">{children}</h2>
      {href && (
        <Link href={href} className="text-xs text-ink-dim hover:text-sage">
          {t({ zh: '全部 →', en: 'All →' })}
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const { t } = useLang();

  return (
    <div className="page-enter grid grid-cols-1 gap-3 pb-6 md:grid-cols-2 lg:grid-cols-4">
      <BaseCard size="md" glass className="flex flex-col justify-between">
        <div className="flex items-center gap-4">
          <Avatar size={64} />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t(profile.name)}</h1>
            <p className="text-sm text-ink-mid">{t(profile.tagline)}</p>
          </div>
        </div>
        <p className="mt-5 leading-relaxed text-ink-mid">{t(profile.bio)}</p>
      </BaseCard>

      <BaseCard size="sm" glass>
        <CardTitle>{t({ zh: '所在地', en: 'Based in' })}</CardTitle>
        <p className="text-lg font-medium">{t(profile.location)}</p>
      </BaseCard>

      <BaseCard size="sm" glass>
        <CardTitle>{t({ zh: '找到我', en: 'Find me' })}</CardTitle>
        <ul className="space-y-2">
          {profile.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer" className="text-ink-mid hover:text-sage">
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </BaseCard>

      <BaseCard size="md" glass>
        <CardTitle href="/projects/">{t({ zh: '项目', en: 'Projects' })}</CardTitle>
        <ul className="space-y-3">
          {featured.map((p) => (
            <li key={p.slug} className="flex items-baseline justify-between gap-3">
              <span className="font-medium">{t(p.title)}</span>
              <span className="shrink-0 text-xs text-ink-dim">{t(statusLabel[p.status])}</span>
            </li>
          ))}
        </ul>
      </BaseCard>

      <BaseCard size="md" glass>
        <CardTitle href="/blog/">{t({ zh: '最新文章', en: 'Latest writing' })}</CardTitle>
        <ul className="space-y-3">
          {posts.slice(0, 3).map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}/`} className="group block">
                <span className="font-medium group-hover:text-sage">{t(post.title)}</span>
                <span className="ml-2 text-xs text-ink-dim">{post.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </BaseCard>

      <BaseCard size="wide" glass>
        <CardTitle href="/photography/">{t({ zh: '摄影', en: 'Photography' })}</CardTitle>
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {photos.slice(0, 6).map((photo, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-lg bg-surface-4">
              {photo.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset(photo.src)} alt={t(photo.title)} loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <PlaceholderTile index={i} />
              )}
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  );
}
