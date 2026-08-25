import { useTranslation } from 'react-i18next';

import PageHeader from '../components/PageHeader';
import LegalDocument from '../components/LegalDocument';
import { useLanguage } from '../i18n/languageContext';
import { LEGAL_VALUES, PRIVACY_SECTIONS, formatLegalDate } from '../content/legal';

export default function Privacidad() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <>
      <PageHeader title={t('privacidad.title')} />
      <LegalDocument
        namespace="privacidad"
        sections={PRIVACY_SECTIONS}
        values={LEGAL_VALUES}
        updated={t('privacidad.updated', { date: formatLegalDate(language) })}
        intro={t('privacidad.intro', LEGAL_VALUES)}
      />
    </>
  );
}
