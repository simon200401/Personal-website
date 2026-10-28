import type { L } from '@/lib/i18n';

export type Photo = {
  /** Path under /public, e.g. '/photos/sunset.jpg'. Null shows a placeholder tile. */
  src: string | null;
  title: L;
  album: L;
  /** Width / height, so the grid can reserve space before the image loads. */
  ratio: number;
};

// TODO: put web-sized JPEGs (about 2000px on the long edge) in public/photos/
// and list them here. Keep originals out of the repo; they bloat it fast.
export const photos: Photo[] = [
  { src: null, title: { zh: '街头', en: 'Street' }, album: { zh: '城市', en: 'City' }, ratio: 3 / 2 },
  { src: null, title: { zh: '黄昏', en: 'Dusk' }, album: { zh: '风景', en: 'Landscape' }, ratio: 2 / 3 },
  { src: null, title: { zh: '人像', en: 'Portrait' }, album: { zh: '人像', en: 'Portrait' }, ratio: 4 / 5 },
  { src: null, title: { zh: '夜景', en: 'Night' }, album: { zh: '城市', en: 'City' }, ratio: 3 / 2 },
  { src: null, title: { zh: '海边', en: 'Coast' }, album: { zh: '风景', en: 'Landscape' }, ratio: 16 / 9 },
  { src: null, title: { zh: '咖啡馆', en: 'Café' }, album: { zh: '日常', en: 'Daily' }, ratio: 1 },
];
