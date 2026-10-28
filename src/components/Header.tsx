'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { useLang, type L } from '@/lib/i18n';
import { profile } from '@/data/profile';

const NAV: { href: string; label: L }[] = [
  { href: '/', label: { zh: '首页', en: 'Home' } },
  { href: '/about/', label: { zh: '关于', en: 'About' } },
  { href: '/projects/', label: { zh: '项目', en: 'Projects' } },
  { href: '/blog/', label: { zh: '博客', en: 'Blog' } },
  { href: '/photography/', label: { zh: '摄影', en: 'Photography' } },
];

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, ''));

export default function Header() {
  const pathname = usePathname();
  const { lang, toggle, t } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="font-semibold tracking-tight text-ink">
          {t(profile.name)}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                isActive(pathname, item.href)
                  ? 'bg-sage/15 text-sage-bright'
                  : 'text-ink-mid hover:text-ink'
              }`}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="theme-toggle text-xs font-medium"
            aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
            title={lang === 'zh' ? 'Switch to English' : '切换到中文'}
          >
            {lang === 'zh' ? 'EN' : '中'}
          </button>
          <ThemeToggle />
          {/* Wrapped because .theme-toggle sets display and would override md:hidden. */}
          <div className="md:hidden">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setOpen((v) => !v)}
              aria-label={t({ zh: '菜单', en: 'Menu' })}
              aria-expanded={open}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line px-4 py-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2.5 ${
                isActive(pathname, item.href) ? 'text-sage-bright' : 'text-ink-mid'
              }`}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
