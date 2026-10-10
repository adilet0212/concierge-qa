import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { isBugOn } from '../../shared/seeded-bugs.ts';
import type { LocalizedText } from '../../shared/types.ts';

type Dictionary = Record<string, string>;

// Every JSON file in ./locales is a language. Adding a language = adding one file
// (with a "language.name" key for the language picker). No code changes needed.
const localeFiles = import.meta.glob<Dictionary>('./locales/*.json', { eager: true, import: 'default' });

export const LOCALES = Object.entries(localeFiles)
  .map(([file, dictionary]) => ({
    code: file.replace('./locales/', '').replace('.json', ''),
    label: dictionary['language.name'],
    dictionary,
  }))
  .sort((a, b) => (a.code === 'en' ? -1 : b.code === 'en' ? 1 : a.code.localeCompare(b.code)));

const LOCALE_KEY = 'aurelle.locale';
type Vars = Record<string, string | number>;

interface I18nValue {
  locale: string;
  setLocale(code: string): void;
  /** Translates a key. A missing key is shown as the raw key, so tests (and people) can spot it. */
  t(key: string, vars?: Vars): string;
  /** Picks the current language from data like { en: 'Caesar salad', fr: 'Salade César' }. */
  localized(text: LocalizedText): string;
}

const I18nContext = createContext<I18nValue | null>(null);

function savedLocale(): string {
  const saved = window.localStorage.getItem(LOCALE_KEY);
  return LOCALES.some((locale) => locale.code === saved) ? saved! : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(savedLocale);
  const dictionary = LOCALES.find((l) => l.code === locale)?.dictionary ?? {};

  // Screen readers and browsers use <html lang> to pick pronunciation and fonts.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function t(key: string, vars: Vars = {}): string {
    // SEEDED BUG #4: simulates a translator forgetting one key in fr.json, so the
    // French confirmation page shows the raw key "booking.confirm.title".
    const simulateMissingKey = isBugOn(4) && locale === 'fr' && key === 'booking.confirm.title';
    let text = simulateMissingKey ? undefined : dictionary[key];
    if (text === undefined) return key;

    for (const [name, value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, String(value));
    return text;
  }

  const value: I18nValue = {
    locale,
    setLocale(code) {
      window.localStorage.setItem(LOCALE_KEY, code);
      setLocaleState(code);
    },
    t,
    localized: (text) => text[locale] ?? text.en,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const i18n = useContext(I18nContext);
  if (!i18n) throw new Error('useI18n must be used inside <I18nProvider>');
  return i18n;
}
