import { t } from "../../i18n";
import { hostname } from './hostname';

export interface TopicLanguage {
  code: string;
  name: string;
}

type Linked = { url?: string };

const LANGUAGE_NAMES: Record<string, string> = {
  it: t("topic-language.italian"),
  de: t("topic-language.german"),
  fr: t("topic-language.french"),
  es: t("topic-language.spanish"),
  pt: t("topic-language.portuguese"),
  nl: t("topic-language.dutch"),
  pl: t("topic-language.polish"),
  cs: t("topic-language.czech"),
  sv: t("topic-language.swedish"),
  no: t("topic-language.norwegian"),
  da: t("topic-language.danish"),
  fi: t("topic-language.finnish"),
  el: t("topic-language.greek"),
  tr: t("topic-language.turkish"),
  ru: t("topic-language.russian"),
  uk: t("topic-language.ukrainian"),
  ja: t("topic-language.japanese"),
  zh: t("topic-language.chinese"),
  ko: t("topic-language.korean"),
};

const TLD_TO_LANGUAGE: Record<string, string> = {
  it: 'it',
  de: 'de',
  at: 'de',
  ch: 'de',
  fr: 'fr',
  es: 'es',
  pt: 'pt',
  br: 'pt',
  nl: 'nl',
  be: 'nl',
  pl: 'pl',
  cz: 'cs',
  se: 'sv',
  no: 'no',
  dk: 'da',
  fi: 'fi',
  gr: 'el',
  tr: 'tr',
  ru: 'ru',
  ua: 'uk',
  jp: 'ja',
  cn: 'zh',
  kr: 'ko',
};

const languageOfHost = (host: string): string | null => {
  const wiki =
    /^([a-z]{2})(?:\.m)?\.(wikipedia|wikivoyage|wiktionary)\.org$/.exec(host);
  const code = wiki
    ? wiki[1]!
    : (TLD_TO_LANGUAGE[host.split('.').pop() ?? ''] ?? '');
  return LANGUAGE_NAMES[code] ? code : null;
};

export const detectTopicLanguage = (
  results: Linked[]
): TopicLanguage | null => {
  const counts = new Map<string, number>();
  for (const result of results) {
    if (!result.url) continue;
    const code = languageOfHost(hostname(result.url));
    if (!code) continue;
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }

  let best: string | null = null;
  let bestCount = 0;
  for (const [code, count] of counts) {
    if (count > bestCount) {
      best = code;
      bestCount = count;
    }
  }
  if (!best || bestCount < 2) return null;
  return { code: best, name: LANGUAGE_NAMES[best]! };
};
