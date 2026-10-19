import type { L10n } from "./schema";

/**
 * Every fixed piece of text on the site, in English and Korean. All of it is editable in
 * edit mode; these are the starting values, and any key missing from saved content falls
 * back to the value here. In multi-line fields, a line break starts a new line and
 * `*words*` sets words in italic (in Korean, a heavier weight).
 */
export const TEXT_DEFAULTS = {
  "lang.self": { en: "English", ko: "한국어" },

  "nav.home": { en: "Home", ko: "홈" },
  "nav.work": { en: "Work", ko: "작품" },
  "nav.about": { en: "About", ko: "소개" },
  "nav.contact": { en: "Contact", ko: "문의" },
  "nav.menu": { en: "Menu", ko: "메뉴" },
  "nav.close": { en: "Close", ko: "닫기" },
  "intro.skip": { en: "Skip intro", ko: "인트로 건너뛰기" },

  "hero.eyebrow": { en: "Jin Sam Choi — Television Director & Producer", ko: "최진삼 — 방송 다큐멘터리 PD" },
  "hero.title": { en: "I go where\n*the story* is.", ko: "*이야기*가 있는 곳이면\n어디든 갑니다." },
  "hero.sub": {
    en: "More than fifty documentaries and films for broadcasters, companies and the stage — from the Joseon archives to the Siberian winter.",
    ko: "방송과 기업, 무대를 위해 만든 50편이 넘는 다큐멘터리와 영상. 조선의 기록에서 시베리아의 겨울까지.",
  },
  "statement.text": {
    en: "I'm Jin Sam Choi, a television director and producer. I find the story, film it and finish it myself — for broadcasters, for companies and for the stage.",
    ko: "방송 PD 최진삼입니다. 이야기를 찾고, 직접 촬영하고, 마지막 편집까지 손수 마무리합니다. 방송사와 기업, 그리고 무대를 위해.",
  },

  "person.name": { en: "Jin Sam Choi", ko: "최진삼" },
  "person.nameAlt": { en: "최진삼", ko: "Jin Sam Choi" },
  "person.role": { en: "Director & Producer", ko: "연출 · 프로듀서" },

  "featured.eyebrow": { en: "Featured documentary", ko: "대표 다큐멘터리" },
  "label.broadcaster": { en: "Broadcaster", ko: "방송" },
  "label.client": { en: "Client", ko: "클라이언트" },
  "label.year": { en: "Year", ko: "연도" },
  "label.runtime": { en: "Runtime", ko: "러닝타임" },
  "label.role": { en: "Role", ko: "역할" },

  "work.eyebrow": { en: "The work", ko: "작품" },
  "work.title": {
    en: "Three kinds of film. *One standard* — the one I learned in broadcast.",
    ko: "세 가지 영상, *하나의 기준*. 방송에서 배운 기준입니다.",
  },
  "work.all": { en: "All works", ko: "작품 전체 보기" },
  "work.films": { en: "films", ko: "편" },
  "work.stills": { en: "Stills", ko: "사진" },
  "work.watch": { en: "Watch", ko: "보기" },
  "work.full": { en: "Watch the full film", ko: "전편 보기" },
  "work.fullShort": { en: "Full film", ko: "전편" },
  "work.highlights": { en: "Highlights", ko: "하이라이트" },
  "work.comingSoon": { en: "Film coming soon", ko: "영상 준비 중" },
  "work.other": { en: "Other works", ko: "다른 작품" },
  "work.showAll": { en: "Show all", ko: "모두 보기" },
  "work.showLess": { en: "Show less", ko: "접기" },
  "work.filterAll": { en: "All", ko: "전체" },
  "work.copyLink": { en: "Copy link", ko: "링크 복사" },
  "work.linkCopied": { en: "Link copied", ko: "링크를 복사했습니다" },
  "work.close": { en: "Close", ko: "닫기" },
  "work.youtube": { en: "Open on YouTube", ko: "YouTube에서 보기" },

  "category.selected": { en: "Selected works", ko: "대표작" },
  "category.next": { en: "Next", ko: "다음" },
  "category.unavailable": { en: "This page isn't available.", ko: "볼 수 없는 페이지입니다." },

  "partners.eyebrow": { en: "Broadcasters & institutions", ko: "함께한 방송사 · 기관" },
  "partners.title": {
    en: "Made for broadcasters, museums and public institutions.",
    ko: "방송사, 박물관, 공공기관과 함께 만들었습니다.",
  },

  "photography.all": { en: "All photographs", ko: "사진 전체 보기" },
  "photography.portfolio": { en: "Photographs", ko: "사진" },
  "photography.location": { en: "On location", ko: "촬영 현장" },
  "photography.open": { en: "Open photograph", ko: "사진 크게 보기" },
  "photography.previous": { en: "Previous", ko: "이전" },
  "photography.next": { en: "Next", ko: "다음" },

  "about.eyebrow": { en: "About", ko: "소개" },
  "about.title": {
    en: "From the first idea to the final frame — *one person.*",
    ko: "기획부터 마지막 장면까지, *한 사람*의 손으로.",
  },
  "about.body": {
    en: "D2 Communication is my production company. I have made more than fifty documentaries for Korean television, most of them narrated by professional announcers, and films for companies, museums and the stage.",
    ko: "D2 Communication은 제가 이끄는 영상 제작사입니다. 전문 아나운서의 내레이션과 함께한 50편이 넘는 방송 다큐멘터리를 만들었고, 기업과 박물관, 무대를 위한 영상도 만들어 왔습니다.",
  },
  "about.crafts": { en: "What I do", ko: "작업 분야" },

  "contact.eyebrow": { en: "Contact", ko: "문의" },
  "contact.title": { en: "Tell me about *your film.*", ko: "만들고 싶은 *영상 이야기*를\n들려주세요." },
  "contact.body": {
    en: "Documentary, brand film or performance — I read and answer every message myself.",
    ko: "다큐멘터리, 기업 홍보 영상, 공연 영상까지. 모든 문의는 제가 직접 읽고 답합니다.",
  },
  "contact.email": { en: "Email", ko: "이메일" },
  "contact.copy": { en: "Copy", ko: "복사" },
  "contact.copied": { en: "Copied", ko: "복사됨" },

  "footer.rights": { en: "All rights reserved.", ko: "All rights reserved." },
  "footer.top": { en: "Back to top", ko: "맨 위로" },

  "meta.title": { en: "D2 Communication — Jin Sam Choi, Director & Producer", ko: "D2 Communication — 다큐멘터리 PD 최진삼" },
  "meta.description": {
    en: "Documentaries, corporate films and performance films by television director and producer Jin Sam Choi.",
    ko: "방송 PD 최진삼이 연출한 다큐멘터리, 기업 홍보 영상, 공연 영상.",
  },
} satisfies Record<string, L10n>;

export type TextKey = keyof typeof TEXT_DEFAULTS;
