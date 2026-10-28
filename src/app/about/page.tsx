'use client';

import Avatar from '@/components/Avatar';
import BaseCard from '@/components/BaseCard';
import PageHeading from '@/components/PageHeading';
import { useLang } from '@/lib/i18n';
import { profile, skills, timeline } from '@/data/profile';

export default function AboutPage() {
  const { t } = useLang();

  return (
    <div className="page-enter pb-6">
      <PageHeading title={{ zh: '关于我', en: 'About' }} />

      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar size={96} />
        <div>
          <h2 className="text-xl font-semibold">{t(profile.name)}</h2>
          <p className="text-ink-mid">
            {t(profile.tagline)} · {t(profile.location)}
          </p>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-mid">{t(profile.bio)}</p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-sage-mist">
          {t({ zh: '经历', en: 'Experience' })}
        </h2>
        <ol className="relative space-y-6 border-l border-line pl-6">
          {timeline.map((item, i) => (
            <li key={i} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-sage"
              />
              <p className="text-xs text-ink-dim">{item.period}</p>
              <p className="font-medium">{t(item.title)}</p>
              <p className="text-sm text-ink-mid">{t(item.detail)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-sage-mist">
          {t({ zh: '技能与兴趣', en: 'Skills & interests' })}
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {skills.map((group, i) => (
            <BaseCard key={i} glass hover={false} className="!col-span-1">
              <p className="mb-3 font-medium">{t(group.group)}</p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-mid">
                    {item}
                  </span>
                ))}
              </div>
            </BaseCard>
          ))}
        </div>
      </section>
    </div>
  );
}
