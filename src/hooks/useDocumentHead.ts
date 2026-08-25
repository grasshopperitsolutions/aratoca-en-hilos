import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import i18n from '../i18n/config';
import { languageFromPath, pageFromPath } from '../i18n/routes';
import { buildHead, renderHeadTags } from '../seo/meta';

/**
 * Keeps the document head in step with client-side navigation.
 *
 * The first page load already has the correct tags baked in by the prerender
 * step; this only matters once react-router starts swapping pages without a
 * reload. Both paths share `renderHeadTags`, so the static and the runtime head
 * can never disagree.
 */
export function useDocumentHead(): void {
  const { pathname } = useLocation();
  const language = languageFromPath(pathname);
  const page = pageFromPath(pathname);

  useEffect(() => {
    document.querySelectorAll('[data-head="1"]').forEach((element) => element.remove());

    if (!page) {
      // Unknown URL: keep it out of the index rather than letting it inherit
      // whatever metadata the previous page left behind.
      document.title = i18n.getFixedT(language)('notFound.title');
      const robots = document.createElement('meta');
      robots.setAttribute('data-head', '1');
      robots.setAttribute('name', 'robots');
      robots.setAttribute('content', 'noindex,nofollow');
      document.head.appendChild(robots);
      return;
    }

    const head = buildHead(page, language);
    document.title = head.title;
    document.head.insertAdjacentHTML('beforeend', renderHeadTags(head));
  }, [page, language]);
}
