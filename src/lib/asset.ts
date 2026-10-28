/**
 * Prefixes a file in /public with the deploy base path. next/link handles
 * this for routes, but plain <img src> does not.
 */
export const asset = (path: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path.startsWith('/') ? path : `/${path}`}`;
