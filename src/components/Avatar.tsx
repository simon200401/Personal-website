'use client';

import { asset } from '@/lib/asset';
import { useLang } from '@/lib/i18n';
import { profile } from '@/data/profile';

/** Shows public/avatar.* when profile.avatar is set, otherwise initials. */
export default function Avatar({ size = 72 }: { size?: number }) {
  const { t } = useLang();
  const name = t(profile.name);
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (profile.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={asset(profile.avatar)}
        alt={name}
        width={size}
        height={size}
        className="rounded-full border border-line object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center rounded-full border border-line font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: 'linear-gradient(135deg, rgb(var(--p-sage)), rgb(var(--p-teal)))',
        color: 'rgb(var(--p-on-accent))',
      }}
    >
      {initials}
    </div>
  );
}
