import type { Metadata } from 'next';
import './globals.css';
import { THEME_SCRIPT } from '@/lib/theme';
import { LangProvider } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SiteBackdrop from '@/components/SiteBackdrop';

// TODO: set this to your custom domain once you have one.
const SITE_URL = 'https://simon200401.github.io/Personal-website';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Zihao Xu',
    template: '%s · Zihao Xu',
  },
  description: 'Personal website of Zihao Xu: projects, writing and photography.',
  authors: [{ name: 'Zihao Xu' }],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Zihao Xu',
    title: 'Zihao Xu',
    description: 'Personal website of Zihao Xu: projects, writing and photography.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* Must stay first in <head>: stamps the theme class on <html>
            before paint so light-mode visitors never flash dark. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <LangProvider>
          <SiteBackdrop />
          <Header />
          <main className="relative z-10 mx-auto min-h-[calc(100vh-8rem)] max-w-6xl px-4 pt-24 md:px-8">
            {children}
          </main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
