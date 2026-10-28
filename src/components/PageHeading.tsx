'use client';

import { useLang, type L } from '@/lib/i18n';

export default function PageHeading({ title, intro }: { title: L; intro?: L }) {
  const { t } = useLang();
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{t(title)}</h1>
      {intro && <p className="mt-3 max-w-2xl text-ink-mid">{t(intro)}</p>}
    </div>
  );
}
