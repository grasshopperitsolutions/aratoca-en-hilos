import { useTranslation } from 'react-i18next';

import PageHeader from '../components/PageHeader';
import LegalDocument from '../components/LegalDocument';
import { useLanguage } from '../i18n/languageContext';
import { LEGAL_VALUES, TERMS_SECTIONS, formatLegalDate } from '../content/legal';

export default function Terminos() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <>
      <PageHeader title={t('terminos.title')} />
      <LegalDocument
        namespace="terminos"
        sections={TERMS_SECTIONS}
        values={LEGAL_VALUES}
        updated={t('terminos.updated', { date: formatLegalDate(language) })}
        intro={t('terminos.intro', LEGAL_VALUES)}
      />
    </>
  );
}
