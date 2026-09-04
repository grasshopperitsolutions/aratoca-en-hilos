import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '../i18n/languageContext';
import { LANGUAGES, NAV_PAGES } from '../i18n/routes';

function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  const { language, alternate } = useLanguage();

  return (
    <div className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest ${className}`}>
      {LANGUAGES.map((code, index) => (
        <span key={code} className="flex items-center gap-1">
          {index > 0 && <span className="text-stone/50">/</span>}
          {code === language ? (
            <span className="text-terracotta" aria-current="true">
              {code}
            </span>
          ) : (
            <Link
              to={alternate(code)}
              hrefLang={code}
              title={t('language.switchTo')}
              className="text-current opacity-60 hover:opacity-100 hover:text-terracotta transition-all"
            >
              {code}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { path } = useLanguage();

  const menuItems = NAV_PAGES.map((page) => ({
    page,
    label: t(`nav.${page}`),
    to: path(page),
  }));

  // Split around the centred logo. Derived rather than hardcoded so adding a
  // nav entry rebalances the two columns instead of piling onto the right one.
  const splitAt = Math.ceil(menuItems.length / 2);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const prevPathname = useRef(location.pathname);
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      setMobileMenuOpen(false);
      prevPathname.current = location.pathname;
    }
  }, [location.pathname]);

  const linkClasses = (to: string) =>
    `text-sm font-semibold tracking-widest uppercase transition-colors ${
      location.pathname === to ? 'text-terracotta' : 'text-charcoal hover:text-terracotta'
    }`;

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 border-b ${
        isScrolled
          ? 'bg-cream/90 backdrop-blur-md py-4 border-stone/20 shadow-sm'
          : 'bg-transparent py-6 border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Menú Izquierdo (Desktop) */}
        <nav className="hidden md:flex gap-6 w-1/3">
          {menuItems.slice(0, splitAt).map((item) => (
            <Link key={item.page} to={item.to} className={linkClasses(item.to)}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logo Central */}
        <Link
          to={path('home')}
          className="w-1/3 flex justify-start md:justify-center items-center z-50 cursor-pointer"
        >
          <span className="text-2xl md:text-3xl font-fraunces font-bold text-earth tracking-tight flex items-center gap-2">
            <Leaf className="text-penca" size={24} />
            Aratoca{' '}
            <span className="italic font-light text-terracotta">{t('site.nameAccent')}</span>
          </span>
        </Link>

        {/* Menú Derecho (Desktop) */}
        <nav className="hidden md:flex gap-6 w-1/3 justify-end items-center">
          {menuItems.slice(splitAt).map((item) => (
            <Link key={item.page} to={item.to} className={linkClasses(item.to)}>
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher className="text-charcoal pl-2 border-l border-stone/30" />
        </nav>

        {/* Botón Menú Mobile */}
        <button
          className="md:hidden z-50 text-charcoal"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú Mobile Fullscreen */}
      <div
        className={`fixed inset-0 bg-charcoal text-cream flex flex-col justify-center items-center gap-10 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:hidden ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="absolute top-10 left-10 opacity-10">
          <Leaf size={200} />
        </div>
        {menuItems.map((item, i) => (
          <Link
            key={item.page}
            to={item.to}
            onClick={() => setMobileMenuOpen(false)}
            className="text-4xl font-fraunces hover:text-fique transition-colors"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {item.label}
          </Link>
        ))}
        <LanguageSwitcher className="text-cream mt-4 text-sm" />
      </div>
    </header>
  );
}
