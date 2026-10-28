'use client';

import { useMemo, useState } from 'react';
import BaseCard from '@/components/BaseCard';
import PageHeading from '@/components/PageHeading';
import { useLang } from '@/lib/i18n';
import { projects, statusLabel, type ProjectStatus } from '@/data/projects';

const statusColor: Record<ProjectStatus, string> = {
  live: 'var(--color-status-live)',
  dev: 'var(--color-status-dev)',
  planned: 'var(--color-status-planned)',
};

export default function ProjectsPage() {
  const { t, lang } = useLang();
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category[lang]))),
    [lang],
  );
  const shown = category ? projects.filter((p) => p.category[lang] === category) : projects;

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition-colors ${
      active ? 'border-sage bg-sage/15 text-sage-bright' : 'border-line text-ink-mid hover:text-ink'
    }`;

  return (
    <div className="page-enter pb-6">
      <PageHeading
        title={{ zh: '项目', en: 'Projects' }}
        intro={{ zh: '我做过和正在做的东西。', en: 'Things I have built or am building.' }}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <button type="button" className={chip(category === null)} onClick={() => setCategory(null)}>
          {t({ zh: '全部', en: 'All' })}
        </button>
        {categories.map((c) => (
          <button key={c} type="button" className={chip(category === c)} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <BaseCard key={p.slug} glass className="!col-span-1 flex flex-col">
            <div className="mb-2 flex items-center justify-between text-xs text-ink-dim">
              <span>
                {t(p.category)} · {p.year}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: statusColor[p.status] }} />
                {t(statusLabel[p.status])}
              </span>
            </div>
            <h2 className="text-lg font-semibold">{t(p.title)}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-mid">{t(p.summary)}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-surface-4 px-2 py-0.5 text-xs text-ink-mid">
                  {tag}
                </span>
              ))}
            </div>
            {(p.link || p.repo) && (
              <div className="mt-4 flex gap-4 text-sm">
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="text-sage hover:underline">
                    {t({ zh: '访问', en: 'Visit' })} ↗
                  </a>
                )}
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noreferrer" className="text-sage hover:underline">
                    {t({ zh: '源码', en: 'Code' })} ↗
                  </a>
                )}
              </div>
            )}
          </BaseCard>
        ))}
      </div>
    </div>
  );
}
