import type { L10n, Lang } from "./schema";

/**
 * The fonts edit mode offers for the site's four type roles: Korean headings, Korean text,
 * English headings and English text. The defaults ship with the site; any other choice is
 * loaded from its official web distribution (Google Fonts or the font's own CDN), only on
 * pages that use it. Every font here is free for commercial use (SIL Open Font License).
 */

export type FontScript = "ko" | "en";
export type FontKind = "serif" | "sans" | "display";

export type FontOption = {
  id: string;
  /** As shown in the picker. */
  name: string;
  script: FontScript;
  kind: FontKind;
  /** The CSS font-family value. */
  family: string;
  /** Stylesheet that defines the font; absent for the fonts bundled with the site. */
  css?: string;
  /** Who made it, shown under the name. */
  note?: L10n;
};

export type FontChoice = { koDisplay: string; koText: string; enDisplay: string; enText: string };
export type FontRole = keyof FontChoice;

const google = (family: string) =>
  `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap`;

const g = (id: string, family: string, script: FontScript, kind: FontKind, name = family, note?: L10n): FontOption => ({
  id,
  name,
  script,
  kind,
  family: `'${family}'`,
  css: google(family),
  note,
});

export const FONTS: FontOption[] = [
  // ── Korean · serif (명조·바탕) ───────────────────────────────────────────────
  {
    id: "maruburi",
    name: "마루 부리 MaruBuri",
    script: "ko",
    kind: "serif",
    family: "'MaruBuri'",
    css: "/fonts/maruburi/maruburi.css",
    note: { en: "Naver · AG Typography Institute", ko: "네이버 · AG타이포그라피연구소" },
  },
  g("hahmlet", "Hahmlet", "ko", "serif", "함렛 Hahmlet", { en: "Hypertype", ko: "하이퍼타입" }),
  g("gowun-batang", "Gowun Batang", "ko", "serif", "고운바탕 Gowun Batang", { en: "Ryu Yang-hee", ko: "류양희" }),
  g("nanum-myeongjo", "Nanum Myeongjo", "ko", "serif", "나눔명조 Nanum Myeongjo", { en: "Naver", ko: "네이버" }),
  g("noto-serif-kr", "Noto Serif KR", "ko", "serif", "본명조 Noto Serif KR", { en: "Adobe · Google", ko: "어도비 · 구글" }),
  g("song-myung", "Song Myung", "ko", "serif", "송명 Song Myung", { en: "JIKJI Soft", ko: "직지소프트" }),
  g("diphylleia", "Diphylleia", "ko", "serif", "디필레아 Diphylleia"),

  // ── Korean · sans (고딕) ─────────────────────────────────────────────────────
  {
    id: "pretendard",
    name: "프리텐다드 Pretendard",
    script: "ko",
    kind: "sans",
    family: "'Pretendard Variable', Pretendard",
    note: { en: "Kil Hyung-jin · the Korean web standard", ko: "길형진 · 국내 웹 표준 서체" },
  },
  {
    id: "wanted-sans",
    name: "원티드 산스 Wanted Sans",
    script: "ko",
    kind: "sans",
    family: "'Wanted Sans Variable', 'Wanted Sans'",
    css: "https://cdn.jsdelivr.net/npm/wanted-sans@1.0.3/fonts/webfonts/variable/split/WantedSansVariable.min.css",
    note: { en: "Wanted Lab", ko: "원티드랩" },
  },
  {
    id: "suit",
    name: "수트 SUIT",
    script: "ko",
    kind: "sans",
    family: "'SUIT Variable', SUIT",
    css: "https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/variable/woff2/SUIT-Variable.css",
  },
  {
    id: "spoqa-han-sans",
    name: "스포카 한 산스 Neo",
    script: "ko",
    kind: "sans",
    family: "'Spoqa Han Sans Neo'",
    css: "https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css",
    note: { en: "Spoqa", ko: "스포카" },
  },
  g("noto-sans-kr", "Noto Sans KR", "ko", "sans", "본고딕 Noto Sans KR", { en: "Adobe · Google", ko: "어도비 · 구글" }),
  g("ibm-plex-sans-kr", "IBM Plex Sans KR", "ko", "sans", "IBM Plex Sans KR", { en: "IBM · Sandoll", ko: "IBM · 산돌" }),
  g("gothic-a1", "Gothic A1", "ko", "sans", "고딕 A1 Gothic A1", { en: "HanYang I&C", ko: "한양정보통신" }),
  g("nanum-gothic", "Nanum Gothic", "ko", "sans", "나눔고딕 Nanum Gothic", { en: "Naver", ko: "네이버" }),
  g("gowun-dodum", "Gowun Dodum", "ko", "sans", "고운돋움 Gowun Dodum", { en: "Ryu Yang-hee", ko: "류양희" }),
  g("orbit", "Orbit", "ko", "sans", "오르빗 Orbit"),

  // ── Korean · display (제목용) ────────────────────────────────────────────────
  g("do-hyeon", "Do Hyeon", "ko", "display", "도현 Do Hyeon", { en: "Woowa Brothers", ko: "우아한형제들" }),
  g("black-han-sans", "Black Han Sans", "ko", "display", "검은고딕 Black Han Sans", { en: "Zess Type", ko: "제스타입" }),

  // ── English · serif ──────────────────────────────────────────────────────────
  { id: "cormorant-garamond", name: "Cormorant Garamond", script: "en", kind: "serif", family: "var(--font-cormorant)", note: { en: "Christian Thalmann", ko: "크리스티안 탈만" } },
  g("eb-garamond", "EB Garamond", "en", "serif"),
  g("cormorant", "Cormorant", "en", "serif"),
  g("playfair-display", "Playfair Display", "en", "serif"),
  g("libre-caslon", "Libre Caslon Text", "en", "serif"),
  g("dm-serif-display", "DM Serif Display", "en", "serif"),
  g("fraunces", "Fraunces", "en", "serif"),
  g("newsreader", "Newsreader", "en", "serif"),
  g("instrument-serif", "Instrument Serif", "en", "serif"),
  g("bodoni-moda", "Bodoni Moda", "en", "serif"),
  g("lora", "Lora", "en", "serif"),
  g("spectral", "Spectral", "en", "serif"),
  g("crimson-pro", "Crimson Pro", "en", "serif"),

  // ── English · sans ───────────────────────────────────────────────────────────
  { id: "inter", name: "Inter", script: "en", kind: "sans", family: "var(--font-inter)", note: { en: "Rasmus Andersson", ko: "라스무스 안데르손" } },
  g("manrope", "Manrope", "en", "sans"),
  g("dm-sans", "DM Sans", "en", "sans"),
  g("work-sans", "Work Sans", "en", "sans"),
  g("ibm-plex-sans", "IBM Plex Sans", "en", "sans"),
  g("source-sans-3", "Source Sans 3", "en", "sans"),
  g("figtree", "Figtree", "en", "sans"),
  g("plus-jakarta-sans", "Plus Jakarta Sans", "en", "sans"),
  g("geist", "Geist", "en", "sans"),
  g("outfit", "Outfit", "en", "sans"),
  g("archivo", "Archivo", "en", "sans"),
  g("montserrat", "Montserrat", "en", "sans"),
  g("barlow", "Barlow", "en", "sans"),
  g("instrument-sans", "Instrument Sans", "en", "sans"),
];

/** Option A: MaruBuri headings with Pretendard text in Korean; Cormorant Garamond and Inter in English. */
export const DEFAULT_FONTS: FontChoice = {
  koDisplay: "maruburi",
  koText: "pretendard",
  enDisplay: "cormorant-garamond",
  enText: "inter",
};

export const FONT_PRESETS: { id: string; name: L10n; fonts: FontChoice }[] = [
  { id: "a", name: { en: "A · MaruBuri + Pretendard", ko: "A · 마루 부리 + 프리텐다드" }, fonts: DEFAULT_FONTS },
  { id: "d", name: { en: "D · Wanted Sans + Pretendard", ko: "D · 원티드 산스 + 프리텐다드" }, fonts: { ...DEFAULT_FONTS, koDisplay: "wanted-sans" } },
  { id: "b", name: { en: "B · Pretendard only", ko: "B · 프리텐다드만" }, fonts: { ...DEFAULT_FONTS, koDisplay: "pretendard" } },
];

export const fontById = (id: string) => FONTS.find((f) => f.id === id);

const GENERIC: Record<FontKind, string> = { serif: "serif", sans: "sans-serif", display: "sans-serif" };

/** Keeps a saved choice valid: unknown ids (a font later removed from the list) fall back to the default. */
export function normalizeFonts(value: unknown): FontChoice {
  const v = (value && typeof value === "object" ? value : {}) as Partial<FontChoice>;
  const pick = (role: FontRole, script: FontScript) => {
    const id = v[role];
    return typeof id === "string" && fontById(id)?.script === script ? id : DEFAULT_FONTS[role];
  };
  return { koDisplay: pick("koDisplay", "ko"), koText: pick("koText", "ko"), enDisplay: pick("enDisplay", "en"), enText: pick("enText", "en") };
}

/**
 * The font-family stacks for a page: the page language's font first, the other language's
 * next (so a Korean name on an English page still gets a Korean font), then a generic.
 */
export function fontStacks(choice: FontChoice, lang: Lang) {
  const stack = (first: string, second: string) => {
    const a = fontById(first)!;
    const b = fontById(second)!;
    return `${a.family}, ${b.family}, ${GENERIC[a.kind]}`;
  };
  return lang === "ko"
    ? { display: stack(choice.koDisplay, choice.enDisplay), text: stack(choice.koText, choice.enText) }
    : { display: stack(choice.enDisplay, choice.koDisplay), text: stack(choice.enText, choice.koText) };
}

/** Stylesheets the chosen fonts need (bundled fonts need none). */
export const fontStylesheets = (choice: FontChoice) =>
  [...new Set(Object.values(choice).map((id) => fontById(id)?.css).filter((css): css is string => !!css))];
