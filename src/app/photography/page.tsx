'use client';

import { useEffect, useMemo, useState } from 'react';
import PageHeading from '@/components/PageHeading';
import PlaceholderTile from '@/components/PlaceholderTile';
import { asset } from '@/lib/asset';
import { useLang } from '@/lib/i18n';
import { photos } from '@/data/photos';

export default function PhotographyPage() {
  const { t, lang } = useLang();
  const [album, setAlbum] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const albums = useMemo(() => Array.from(new Set(photos.map((p) => p.album[lang]))), [lang]);
  const shown = album ? photos.filter((p) => p.album[lang] === album) : photos;
  const current = open === null ? null : shown[open];

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : (i + 1) % shown.length));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : (i - 1 + shown.length) % shown.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, shown.length]);

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition-colors ${
      active ? 'border-sage bg-sage/15 text-sage-bright' : 'border-line text-ink-mid hover:text-ink'
    }`;

  return (
    <div className="page-enter pb-6">
      <PageHeading
        title={{ zh: '摄影', en: 'Photography' }}
        intro={{ zh: '用镜头记下的一些瞬间。', en: 'Moments I caught on camera.' }}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <button type="button" className={chip(album === null)} onClick={() => setAlbum(null)}>
          {t({ zh: '全部', en: 'All' })}
        </button>
        {albums.map((a) => (
          <button key={a} type="button" className={chip(album === a)} onClick={() => setAlbum(a)}>
            {a}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3">
        {shown.map((photo, i) => (
          <button
            key={`${album}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative mb-3 block w-full overflow-hidden rounded-xl border border-line"
            style={{ aspectRatio: photo.ratio }}
          >
            {photo.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={asset(photo.src)}
                alt={t(photo.title)}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <PlaceholderTile index={i} />
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-left text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
              {t(photo.title)}
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(current.title)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(null)}
        >
          <div className="max-h-full w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto max-h-[80vh] overflow-hidden rounded-lg" style={{ aspectRatio: current.ratio, maxWidth: `calc(80vh * ${current.ratio})` }}>
              {current.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset(current.src)} alt={t(current.title)} className="h-full w-full object-contain" />
              ) : (
                <PlaceholderTile index={open ?? 0} />
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-white/80">
              <span>
                {t(current.title)} · {t(current.album)}
              </span>
              <button type="button" onClick={() => setOpen(null)} className="hover:text-white">
                {t({ zh: '关闭', en: 'Close' })} ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
