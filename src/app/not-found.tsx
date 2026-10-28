import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-5xl font-semibold text-sage">404</p>
      <p className="text-ink-mid">页面不存在 · Page not found</p>
      <Link href="/" className="text-sage hover:underline">
        ← 回到首页 / Home
      </Link>
    </div>
  );
}
