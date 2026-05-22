export const LANGUAGES = ['ca', 'es', 'en'] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'ca';

export const LANGUAGE_STORAGE_KEY = 'ajedrez-language';

export const LANGUAGE_LABELS: Record<Language, string> = {
  ca: 'Català',
  es: 'Castellà',
  en: 'English',
};
