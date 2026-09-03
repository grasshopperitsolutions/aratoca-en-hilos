import { useTranslation } from 'react-i18next';

import SocialGlyph from './SocialGlyph';
import { SOCIAL_LINKS } from '../content/company';
import { detectNetwork } from '../content/social';

export default function SocialLinks({ className = '' }: { className?: string }) {
  const { t } = useTranslation();

  if (SOCIAL_LINKS.length === 0) return null;

  return (
    <div className={`flex gap-4 ${className}`} aria-label={t('footer.social')}>
      {SOCIAL_LINKS.map(({ network, url }) => {
        const detected = detectNetwork(url) ?? (network as never);
        return (
          <a
            key={network}
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={network}
            className="w-12 h-12 rounded-full border border-stone flex items-center justify-center text-earth hover:bg-earth hover:text-cream hover:border-transparent transition-all"
          >
            <SocialGlyph network={detected} />
          </a>
        );
      })}
    </div>
  );
}
