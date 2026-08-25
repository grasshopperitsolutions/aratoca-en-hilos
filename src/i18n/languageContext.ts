import { createContext, use } from 'react';

import type { Language, PageKey } from './routes';

export interface LanguageContextValue {
  /** Active language, derived from the URL — never from storage. */
  language: Language;
  /** App-relative path for a page in the active language. */
  path: (page: PageKey) => string;
  /** The current page in the other language, for the header switcher. */
  alternate: (target: Language) => string;
}

/**
 * Separate from `LanguageProvider.tsx` so that file exports only a component —
 * mixing components and hooks in one module breaks React Fast Refresh.
 */
export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage(): LanguageContextValue {
  const context = use(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return context;
}
