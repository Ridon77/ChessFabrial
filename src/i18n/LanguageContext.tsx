import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { LanguageContext } from './languageContextState';
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
  type Language,
} from './types';
import { translate } from './translations';

function readStoredLanguage(): Language {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && (LANGUAGES as readonly string[]).includes(stored)) {
    return stored as Language;
  }
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key: Parameters<typeof translate>[1], params?: Record<string, string | number>) =>
      translate(language, key, params),
    [language],
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}
