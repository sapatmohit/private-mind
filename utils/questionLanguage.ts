import { t } from "../i18n";

export interface QuestionLanguage {
  code: string;
  name: string;
  script?: string;
  evidence?: number;
}

const NAMES: Record<string, string> = {
  pl: t("question-language.polish"),
  en: t("question-language.english"),
  de: t("question-language.german"),
  nl: t("question-language.dutch"),
  fr: t("question-language.french"),
  es: t("question-language.spanish"),
  it: t("question-language.italian"),
  pt: t("question-language.portuguese"),
  ro: t("question-language.romanian"),
  cs: t("question-language.czech"),
  tr: t("question-language.turkish"),
  id: 'Indonesian',
  vi: t("question-language.vietnamese"),
  ru: t("question-language.russian"),
  uk: t("question-language.ukrainian"),
  hi: t("question-language.hindi"),
  bn: t("question-language.bengali"),
  ur: t("question-language.urdu"),
  ar: t("question-language.arabic"),
  fa: t("question-language.persian"),
  he: t("question-language.hebrew"),
  el: t("question-language.greek"),
  th: t("question-language.thai"),
  zh: t("question-language.chinese"),
  ja: t("question-language.japanese"),
  ko: t("question-language.korean"),
};

const SCRIPTS: Record<string, string> = {
  ru: t("question-language.cyrillicScript"),
  uk: t("question-language.cyrillicScript_2"),
  hi: t("question-language.devanagariScript"),
  bn: t("question-language.bengaliScript"),
  ur: t("question-language.arabicScript"),
  ar: t("question-language.arabicScript_2"),
  fa: t("question-language.arabicScript_3"),
  he: t("question-language.hebrewScript"),
  el: t("question-language.greekScript"),
  th: t("question-language.thaiScript"),
  zh: t("question-language.chineseCharacters"),
  ja: t("question-language.japaneseScript"),
  ko: t("question-language.hangul"),
};

const KANA = /[ぁ-ヺ]/;
const HAN = /[一-鿿]/;
const HANGUL = /[가-힣]/;
const DEVANAGARI = /[ऀ-ॿ]/;
const BENGALI = /[ঀ-৿]/;
const THAI = /[฀-๿]/;
const GREEK = /[ͰͲ-Ͽ]|[α-ωΑ-Ω]/;
const HEBREW = /[֐-׿]/;
const ARABIC_SCRIPT = /[؀-ۿ]/;
const CYRILLIC = /[Ѐ-ӿ]/;

const SCRIPT_GROUPS: [RegExp, string[]][] = [
  [HANGUL, ['ko']],
  [DEVANAGARI, ['hi']],
  [BENGALI, ['bn']],
  [THAI, ['th']],
  [HEBREW, ['he']],
  [GREEK, ['el']],
  [HAN, ['zh']],
  [ARABIC_SCRIPT, ['ar', 'fa', 'ur']],
  [CYRILLIC, ['ru', 'uk']],
];

const MIN_SCRIPT_CHARS = 2;

const PERSO_URDU_LETTERS =
  /[\u067E\u0686\u0698\u06A9\u06AF\u06CC\u06D2\u06D3\u06C1\u06C2\u06BA\u06BE\u0679\u0688\u0691]/gu;
const ARABIC_ONLY_LETTERS = /[\u0643\u064A]/gu;

const countOf = (text: string, letters: RegExp): number =>
  text.match(letters)?.length ?? 0;

const rulesOutArabic = (text: string): boolean =>
  countOf(text, PERSO_URDU_LETTERS) > countOf(text, ARABIC_ONLY_LETTERS);

const narrowedByLetters = (candidates: string[], text: string): string[] =>
  candidates.includes('ar') && rulesOutArabic(text)
    ? candidates.filter((code) => code !== 'ar')
    : candidates;

const fallbackWithinScript = (candidates: string[]): string | null => {
  if (candidates.includes('ar')) return 'ar';
  if (candidates.includes('ur')) return 'ur';
  return null;
};

const LATIN_CANDIDATES = [
  'en',
  'pl',
  'cs',
  'de',
  'nl',
  'fr',
  'es',
  'pt',
  'it',
  'ro',
  'tr',
  'id',
  'vi',
];

const LETTERS: Record<string, string> = {
  pl: 'ąęłżźśćń',
  cs: 'ěřůňďť',
  de: 'äöüß',
  tr: 'ığşçöü',
  fr: 'œùêîôâëïèàçé',
  it: 'èàòìùé',
  es: 'ñ¿¡áéíóú',
  pt: 'ãõçàêóáéíú',
  ro: 'ăîâșț',
  vi: 'ơưđạệếốộằ',
  nl: 'ĳ',
  ru: 'ыэъё',
  uk: 'іїєґ',
  ur: 'ٹڈڑںھےہپچژگ',
  fa: 'پچژگ',
};

const WORDS: Record<string, string> = {
  en: t("question-language.whoWhatWhichIsAre"),
  pl: t("question-language.ktoKimKomuKogoCo"),
  cs: t("question-language.kdoCoJeJsouJak"),
  de: t("question-language.werWasIstSindWie"),
  nl: t("question-language.wieWatWelkeIsZijn"),
  fr: t("question-language.quiQueQuoiQuelQuelle"),
  es: t("question-language.quiénQuienQuéCuálCual"),
  it: t("question-language.chiCheCosaQualeÈ"),
  pt: t("question-language.quemQueQualÉSão"),
  ro: t("question-language.cineCeCareEsteSunt"),
  tr: t("question-language.kimNeHangiNedirNasıl"),
  id: 'siapa apa yang mana adalah bagaimana dimana kapan mengapa kenapa hari ini besok sekarang berita cuaca harga berapa untuk saya cara membuat mendapatkan terbaru',
  vi: t("question-language.nàoThếĐâuKhiTại"),
  ru: 'кто что какой какая какое где когда почему сегодня завтра сейчас как новости погода цена сколько стоит для мне мой самый последние получить сделать составляет около это на по так его она',
  uk: 'хто що який яка яке де коли чому сьогодні завтра зараз як новини погода ціна скільки коштує для мені мій найновіші отримати зробити',
  ar: 'من ما هو هي كيف أين متى لماذا اليوم غدا الآن أخبار الطقس سعر كم كيفية أفضل هل في على هذا هذه التي الذي عن مع كان ليس يوجد حوالي',
  fa: 'کیست چیست چطور چگونه کجا چرا امروز فردا اکنون الان اخبار هوا قیمت چند بهترین آیا است در از به این که را با برای هست نیست حدود دارد',
  ur: 'کون کیا ہے ہیں کیسے کہاں کب کیوں آج کل ابھی خبریں موسم قیمت کتنی کتنا بہترین کے کی کا میں اور سے پر نہیں ہوتا تقریبا',
};

const MARKS = /[̀-ͯ]/g;
const SPECIAL_FOLDS: Record<string, string> = {
  ł: 'l',
  ı: 'i',
  đ: 'd',
  ø: 'o',
  ß: 'ss',
  ħ: 'h',
  ی: 'ي',
  ى: 'ي',
  ک: 'ك',
  أ: 'ا',
  إ: 'ا',
  آ: 'ا',
  ة: 'ه',
};

const FOLDABLE = /[łıđøßħیىکأإآة]/g;

const fold = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(MARKS, '')
    .replace(FOLDABLE, (char) => SPECIAL_FOLDS[char] ?? char);

const DIGRAPH_FOLDS: Record<string, string> = {
  ä: 'ae',
  ö: 'oe',
  ü: 'ue',
  ß: 'ss',
  å: 'aa',
  æ: 'ae',
  ø: 'oe',
};

const DIGRAPHABLE = /[äöüßåæø]/g;

const asciiDigraphs = (text: string): string =>
  text
    .toLowerCase()
    .replace(DIGRAPHABLE, (char) => DIGRAPH_FOLDS[char] ?? char);

const wordUnits = (value: string): string[] => {
  const units = new Set<string>();
  for (const source of [fold(value), fold(asciiDigraphs(value))]) {
    for (const word of source.split(/\s+/)) {
      if (word.length >= 2) units.add(word);
    }
  }
  return [...units];
};

const index = (source: Record<string, string>, split: 'words' | 'chars') => {
  const map = new Map<string, Set<string>>();
  for (const [code, value] of Object.entries(source)) {
    const units =
      split === 'words' ? wordUnits(value) : [...value.toLowerCase()];
    for (const unit of units) {
      const langs = map.get(unit) ?? new Set<string>();
      langs.add(code);
      map.set(unit, langs);
    }
  }
  return map;
};

const WORD_INDEX = index(WORDS, 'words');
const LETTER_INDEX = index(LETTERS, 'chars');

const EXCLUSIVE_WEIGHT = 3;
const STEM_LENGTH = 4;

const STEM_INDEX = (() => {
  const map = new Map<string, [string, Set<string>][]>();
  for (const [word, langs] of WORD_INDEX) {
    if (word.length < STEM_LENGTH) continue;
    const stem = word.slice(0, STEM_LENGTH);
    map.set(stem, [...(map.get(stem) ?? []), [word, langs]]);
  }
  return map;
})();

const inflectedLanguages = (token: string): Set<string> | undefined => {
  const entries = STEM_INDEX.get(token.slice(0, STEM_LENGTH));
  if (!entries) return undefined;
  const merged = new Set<string>();
  for (const [word, langs] of entries) {
    if (!token.startsWith(word)) continue;
    for (const code of langs) merged.add(code);
  }
  return merged.size > 0 ? merged : undefined;
};

const wordLanguages = (token: string): Set<string> | undefined =>
  WORD_INDEX.get(token) ??
  (token.length > STEM_LENGTH ? inflectedLanguages(token) : undefined);

const longestEvidence = (
  codes: string[],
  longestHit: Map<string, number>
): string | null => {
  let best: string | null = null;
  let bestLength = 0;
  let tied = false;
  for (const code of codes) {
    const length = longestHit.get(code) ?? 0;
    if (length > bestLength) {
      best = code;
      bestLength = length;
      tied = false;
    } else if (length === bestLength) {
      tied = true;
    }
  }
  return tied ? null : best;
};

interface Candidate {
  code: string;
  evidence: number;
}

const pickCandidate = (
  question: string,
  candidates: string[]
): Candidate | null => {
  if (candidates.length === 1) return { code: candidates[0]!, evidence: 0 };
  const allowed = new Set(candidates);
  const score = new Map<string, number>();
  const exclusive = new Map<string, number>();
  const supporting = new Map<string, Set<string>>();
  const longestHit = new Map<string, number>();

  const decisive = (token: string): boolean =>
    token.length >= 3 || !/^[a-z]+$/.test(token);

  const credit = (
    langs: Set<string> | undefined,
    isDecisive: boolean,
    tokenLength: number,
    token = ''
  ) => {
    if (!langs) return;
    const hits = [...langs].filter((code) => allowed.has(code));
    if (hits.length === 0) return;
    const weight = hits.length === 1 ? EXCLUSIVE_WEIGHT : 1;
    for (const code of hits) {
      score.set(code, (score.get(code) ?? 0) + weight);
      if (token) {
        const seen = supporting.get(code) ?? new Set<string>();
        seen.add(token);
        supporting.set(code, seen);
      }
      longestHit.set(code, Math.max(longestHit.get(code) ?? 0, tokenLength));
      if (hits.length === 1 && isDecisive) {
        exclusive.set(code, (exclusive.get(code) ?? 0) + 1);
      }
    }
  };

  for (const token of fold(question).split(/[^\p{L}]+/u)) {
    if (token.length >= 2) {
      credit(wordLanguages(token), decisive(token), token.length, token);
    }
  }
  for (const char of new Set(question.toLowerCase())) {
    credit(LETTER_INDEX.get(char), true, EXCLUSIVE_WEIGHT, char);
  }

  let best: string | null = null;
  let bestScore = 0;
  let runnerUp = 0;
  for (const [code, value] of score) {
    if (value > bestScore) {
      runnerUp = bestScore;
      best = code;
      bestScore = value;
    } else if (value > runnerUp) {
      runnerUp = value;
    }
  }
  const found = (code: string | null): Candidate | null =>
    code ? { code, evidence: supporting.get(code)?.size ?? 0 } : null;

  if (!best) return null;
  if (bestScore === runnerUp) {
    const tied = [...score.entries()]
      .filter(([, value]) => value === bestScore)
      .map(([code]) => code);
    const withDecisive = tied.filter((code) => (exclusive.get(code) ?? 0) > 0);
    if (withDecisive.length === 1) return found(withDecisive[0]!);
    return found(
      longestEvidence(withDecisive.length > 1 ? withDecisive : tied, longestHit)
    );
  }
  if (exclusive.get(best)) return found(best);
  return bestScore >= EXCLUSIVE_WEIGHT && bestScore - runnerUp >= 2
    ? found(best)
    : null;
};

const named = (candidate: Candidate): QuestionLanguage => ({
  code: candidate.code,
  name: NAMES[candidate.code]!,
  ...(SCRIPTS[candidate.code] ? { script: SCRIPTS[candidate.code] } : {}),
  evidence: candidate.evidence,
});

const dominantScript = (question: string): string[] | null => {
  if (KANA.test(question)) return ['ja'];
  let best: string[] | null = null;
  let bestCount = MIN_SCRIPT_CHARS - 1;
  for (const [pattern, candidates] of SCRIPT_GROUPS) {
    let count = 0;
    for (const char of question) if (pattern.test(char)) count += 1;
    if (count > bestCount) {
      best = candidates;
      bestCount = count;
    }
  }
  return best;
};

export const detectQuestionLanguage = (
  question: string
): QuestionLanguage | null => {
  if (!question.trim()) return null;
  const scriptCandidates = dominantScript(question);
  if (scriptCandidates) {
    const candidates = narrowedByLetters(scriptCandidates, question);
    const picked = pickCandidate(question, candidates);
    if (picked) return named(picked);
    const fallback = fallbackWithinScript(candidates);
    return fallback ? named({ code: fallback, evidence: 0 }) : null;
  }
  const latin = pickCandidate(question, LATIN_CANDIDATES);
  return latin ? named(latin) : null;
};

const LATIN_CODES = new Set(LATIN_CANDIDATES);

const isLatinScript = (question: string): boolean =>
  question.trim() !== '' && dominantScript(question) === null;

export const detectThreadLanguage = (
  userMessages: string[]
): QuestionLanguage | null => {
  const latest = userMessages.at(-1) ?? '';
  const detectedLatest = detectQuestionLanguage(latest);
  if (detectedLatest) return detectedLatest;
  for (let i = userMessages.length - 2; i >= 0; i--) {
    const detected = detectQuestionLanguage(userMessages[i] ?? '');
    if (!detected) continue;
    if (isLatinScript(latest) && !LATIN_CODES.has(detected.code)) return null;
    return detected;
  }
  return null;
};
