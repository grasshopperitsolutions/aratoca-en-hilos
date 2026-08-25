import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import es from '../locales/es/translation.json';
import en from '../locales/en/translation.json';
import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from './routes';

/**
 * Deliberately no `i18next-browser-languagedetector`.
 *
 * The active language is a pure function of the URL (`/` = es, `/en/…` = en).
 * A localStorage/navigator detector would fight the route prefix and would make
 * the prerendered HTML non-deterministic, which breaks the SEO build.
 * `LanguageProvider` is the only thing that sets the language.
 */
i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: LANGUAGES as unknown as string[],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

/**
 * Switch language synchronously. Safe to call during render: every resource is
 * bundled at build time, so there is no async load and no flash of the wrong
 * language. Used by both `LanguageProvider` and the SSR entry.
 */
export function setLanguage(language: Language): void {
  if (i18n.language !== language) {
    void i18n.changeLanguage(language);
  }
}

export default i18n;
