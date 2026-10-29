import type { NextConfig } from 'next';

// GitHub Pages serves a project repo under /<repo-name>. The deploy workflow
// passes that prefix in; locally it is empty so `npm run dev` serves from /.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
