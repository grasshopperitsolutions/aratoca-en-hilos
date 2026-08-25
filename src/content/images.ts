/**
 * Site imagery.
 *
 * ⚠️ TODO(client): every URL below is a temporary Unsplash stock photo, hotlinked
 * from a third-party CDN. They must be replaced with the client's own
 * photography before handover — both because the current images are not of
 * Aratoca, and because hotlinking leaves the site dependent on an external host.
 *
 * Once the real photos arrive, drop them in `src/assets/` and import them here
 * so Vite fingerprints and bundles them.
 */
export const IMAGES = {
  heroWeaver:
    'https://images.unsplash.com/photo-1584446979603-51eb4eb24ebc?auto=format&fit=crop&q=80&w=1200',
  fiquePlant:
    'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=800',
  fiqueTexture:
    'https://images.unsplash.com/photo-1610488961726-2a8d3de635bc?auto=format&fit=crop&q=80&w=600',
  collectionBags:
    'https://images.unsplash.com/photo-1590874023605-7265be7fc972?auto=format&fit=crop&q=80&w=600',
  collectionTapestries:
    'https://images.unsplash.com/photo-1579738018301-383794bfa2bd?auto=format&fit=crop&q=80&w=600',
  collectionFootwear:
    'https://images.unsplash.com/photo-1603228965688-6f176b6279f5?auto=format&fit=crop&q=80&w=600',
} as const;

/** Open Graph share image. TODO(client): replace with a real branded 1200x630. */
export const OG_IMAGE = IMAGES.heroWeaver;
