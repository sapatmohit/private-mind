// @babelize-generated i18n config
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ICU from 'i18next-icu';
import { getLocales } from 'expo-localization';

import { resources } from './locales';

const SOURCE_LOCALE = "en";

/**
 * The device's preferred language that has translations: the full tag
 * (zh-Hant-TW), then shorter ones (zh-Hant), then any variant of the
 * language (zh-Hans for zh).
 */
function deviceLanguage(): string {
  const available = Object.keys(resources);
  const find = (tag: string) => available.find((l) => l.toLowerCase() === tag.toLowerCase());
  for (const locale of getLocales()) {
    const parts = locale.languageTag.split('-');
    for (let i = parts.length; i > 0; i--) {
      const match = find(parts.slice(0, i).join('-'));
      if (match) return match;
    }
    const sameLanguage = available.find((l) => l.split('-')[0].toLowerCase() === parts[0].toLowerCase());
    if (sameLanguage) return sameLanguage;
  }
  return SOURCE_LOCALE;
}

i18n
  .use(ICU)
  .use(initReactI18next)
  .init({
    resources,
    lng: deviceLanguage(),
    fallbackLng: SOURCE_LOCALE,
    // Translations are bundled: initialize synchronously so t() works before the first render.
    initAsync: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export const t = i18n.t.bind(i18n);
export default i18n;
