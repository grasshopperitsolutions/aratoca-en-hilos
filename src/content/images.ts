import panoramaAratoca from '../assets/libro/vista_panoramica_aratoca.webp';
import plantaFiqueMaguey from '../assets/libro/planta_fique_maguey.webp';
import pencaCortada from '../assets/libro/penga_fique_cortada.webp';

/**
 * Site imagery.
 *
 * These are the municipality's own photographs of Aratoca, copied from the
 * book's asset folder and imported so Vite fingerprints and bundles them. They
 * replace the hotlinked Unsplash stock that used to sit here, which was neither
 * the client's nor of Aratoca, and which left the site depending on a
 * third-party CDN staying up.
 *
 * ⚠️ TODO(client): the three collection slots are `null` because no product
 * photography exists yet — the book's photographs document the plant, the
 * terrain and the extraction of the fibre, not the finished pieces. A `null`
 * renders as a marked placeholder naming the shot that belongs there rather
 * than as a picture of something else. See `pendientes.ts`.
 */
export const IMAGES = {
  /** The municipality from the air. Stands in for the weaver-at-loom shot the
   *  hero was designed around, which the client has yet to supply. */
  heroWeaver: panoramaAratoca,
  fiquePlant: plantaFiqueMaguey,
  fiqueTexture: pencaCortada,
  collectionBags: null,
  collectionTapestries: null,
  collectionFootwear: null,
} as const;

/**
 * Open Graph share image.
 *
 * TODO(client): a branded 1200x630 would be better — this is a 16:9 photograph,
 * which social cards crop. It is at least real, self-hosted and of Aratoca.
 */
export const OG_IMAGE = panoramaAratoca;
