import { SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Reveal from '../components/Reveal';
import Button from '../components/Button';
import { useLanguage } from '../i18n/languageContext';

export default function NotFound() {
  const { t } = useTranslation();
  const { path } = useLanguage();

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-32 pb-24">
      <Reveal>
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-moss/20 flex items-center justify-center mx-auto mb-8">
            <SearchX size={36} className="text-terracotta" />
          </div>
          <h1 className="text-6xl md:text-7xl font-fraunces font-bold text-charcoal mb-2">
            {t('notFound.code')}
          </h1>
          <p className="text-stone font-fraunces text-xl mb-6">{t('notFound.title')}</p>
          <p className="text-charcoal/70 text-lg mb-8 font-light">{t('notFound.body')}</p>
          <Button to={path('home')} variant="outline">
            {t('common.backHome')}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
