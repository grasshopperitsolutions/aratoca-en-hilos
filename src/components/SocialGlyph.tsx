import { SOCIAL_GLYPHS, type SocialNetwork } from '../content/social';

/** Inline brand mark. See content/social.ts for why these are not from lucide. */
export default function SocialGlyph({
  network,
  size = 20,
}: {
  network: SocialNetwork;
  size?: number;
}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={SOCIAL_GLYPHS[network]} />
    </svg>
  );
}
