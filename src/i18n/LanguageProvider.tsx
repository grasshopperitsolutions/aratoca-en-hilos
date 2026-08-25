import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { setLanguage } from './config';
import { LanguageContext, type LanguageContextValue } from './languageContext';
import { alternatePath, buildPath, languageFromPath } from './routes';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const language = languageFromPath(pathname);

  // Applied during render (synchronous, resources are bundled) so the very
  // first paint is already in the right language.
  setLanguage(language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextValue = {
    language,
    path: (page) => buildPath(page, language),
    alternate: (target) => alternatePath(pathname, target),
  };

  return <LanguageContext value={value}>{children}</LanguageContext>;
}
