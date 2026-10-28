'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'zh' | 'en';

/** A string in both site languages. Every piece of copy in src/data uses it. */
export type L = { zh: string; en: string };

const STORAGE_KEY = 'lang-preference';
const DEFAULT_LANG: Lang = 'zh';

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (text: L) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Static export renders the default language; a saved choice is adopted
  // after mount.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'zh' || stored === 'en') setLangState(stored);
    } catch {
      // Safari private mode throws on localStorage; keep the default.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Choice just won't survive a reload.
    }
  }, []);

  const toggle = useCallback(() => setLang(lang === 'zh' ? 'en' : 'zh'), [lang, setLang]);
  const t = useCallback((text: L) => text[lang], [lang]);

  return <LangContext.Provider value={{ lang, setLang, toggle, t }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
