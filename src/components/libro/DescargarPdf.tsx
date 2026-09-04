import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import { useLibroPdf } from '../../hooks/useLibroPdf';

/**
 * Download link for the book's PDF edition.
 *
 * Renders nothing when no PDF has been tagged in the media library, which is
 * the state today — the book is still being finished. Hiding beats a button
 * that 404s, and the client can make it appear by tagging a file in
 * /admin/archivos, with no redeploy.
 *
 * Opens in a new tab rather than forcing a download: the `download` attribute
 * is ignored cross-origin, and Firebase Storage serves from its own host.
 */
export default function DescargarPdf({
  variant = 'outline',
  className = '',
}: {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}) {
  const { t } = useTranslation();
  const pdf = useLibroPdf();

  if (!pdf) return null;

  return (
    <Button href={pdf.url} variant={variant} className={className} external>
      <Download size={16} />
      {t('libro.descargarPdf')}
    </Button>
  );
}
