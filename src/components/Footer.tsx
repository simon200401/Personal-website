'use client';

import { useLang } from '@/lib/i18n';
import { profile } from '@/data/profile';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative z-10 mx-auto max-w-6xl px-4 py-10 text-sm text-ink-dim md:px-8">
      <div className="flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
        <span>
          © {new Date().getFullYear()} {t(profile.name)}
        </span>
        <div className="flex gap-4">
          {profile.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="hover:text-sage">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
