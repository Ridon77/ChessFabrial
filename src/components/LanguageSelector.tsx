import { LANGUAGE_LABELS, LANGUAGES } from '../i18n/types';
import { useLanguage } from '../i18n/useLanguage';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label className="language-selector">
      <span className="language-selector__label">{t('lang.select')}</span>
      <select
        className="language-selector__select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as typeof language)}
        aria-label={t('lang.select')}
      >
        {LANGUAGES.map((code) => (
          <option key={code} value={code}>
            {LANGUAGE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
