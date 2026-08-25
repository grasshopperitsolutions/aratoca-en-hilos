import { Link } from 'react-router-dom';
import { Leaf, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import SocialLinks from './SocialLinks';
import { COMPANY, FULL_ADDRESS, MAILTO_URL } from '../content/company';
import { useLanguage } from '../i18n/languageContext';
import { LEGAL_PAGES, NAV_PAGES } from '../i18n/routes';

export default function Footer() {
  const { t } = useTranslation();
  const { path } = useLanguage();

  // Home is already the logo link above, so it is dropped from the column.
  const navPages = NAV_PAGES.filter((page) => page !== 'home');

  return (
    <footer className="bg-cream border-t border-stone/30 pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 mb-16 text-center md:text-left">
          <div className="md:w-1/3">
            <Link
              to={path('home')}
              className="text-2xl font-fraunces font-bold text-earth mb-4 flex items-center justify-center md:justify-start gap-2"
            >
              <Leaf className="text-penca" size={20} />
              Aratoca{' '}
              <span className="italic font-light text-terracotta">{t('site.nameAccent')}</span>
            </Link>
            <p className="text-charcoal/60 text-sm mt-4">{t('footer.about')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-12 text-sm">
            <div>
              <h2 className="font-bold uppercase tracking-widest text-charcoal mb-4">
                {t('footer.navigate')}
              </h2>
              <ul className="space-y-3 text-charcoal/70">
                {navPages.map((page) => (
                  <li key={page}>
                    <Link to={path(page)} className="hover:text-terracotta transition-colors">
                      {t(`nav.${page}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-bold uppercase tracking-widest text-charcoal mb-4">
                {t('footer.legal')}
              </h2>
              <ul className="space-y-3 text-charcoal/70">
                {LEGAL_PAGES.map((page) => (
                  <li key={page}>
                    <Link to={path(page)} className="hover:text-terracotta transition-colors">
                      {t(`nav.${page}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-bold uppercase tracking-widest text-charcoal mb-4">
                {t('footer.contact')}
              </h2>
              <ul className="space-y-3 text-charcoal/70">
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <Mail size={14} className="text-penca shrink-0" />
                  <a href={MAILTO_URL} className="hover:text-terracotta transition-colors break-all">
                    {COMPANY.email}
                  </a>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin size={14} className="text-penca shrink-0" />
                  <span>{FULL_ADDRESS}</span>
                </li>
              </ul>
            </div>
          </div>

          <SocialLinks />
        </div>

        <div className="text-center text-stone text-xs uppercase tracking-widest border-t border-stone/20 pt-8">
          {t('footer.rights', { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
