/**
 * Exact geometry and colours of the official D2 Communication logo, copied verbatim from
 * public/brand/d2communication-logo-no-background.svg.
 *
 * The logo must never be redrawn or altered. Animations may move, clip, or scale these
 * pieces, but every piece must come to rest exactly as defined here.
 *
 * Anatomy: two red letters ("d" and "2", sharing a baseline at y = 305.2) plus five grey
 * "fold" pieces. Each shaded grey piece starts with a dark strip where it tucks under a
 * red letter, like the back of a folded ribbon. The flat grey piece at top-left has no
 * shadow because nothing sits above it.
 */

export const LOGO_VIEWBOX = { width: 636, height: 506 } as const;
export const LOGO_ASPECT = LOGO_VIEWBOX.width / LOGO_VIEWBOX.height;
export const LOGO_BASELINE = 305.2;

export const LOGO_COLORS = {
  red: "#CC0606",
  redLight: "#EA4E4E",
  gray: "#A6A6A6",
  grayShadow: "#6C6F6F",
} as const;

export type LogoGradient = {
  x: number;
  y1: number;
  y2: number;
  from: string;
  to: string;
};

export type LogoPiece = {
  key: string;
  d: string;
  /** Flat colour or vertical linear gradient (userSpaceOnUse), exactly as in the source SVG. */
  fill: string | LogoGradient;
  evenOdd?: boolean;
  kind: "letter" | "fold";
  /** Bounding box in viewBox units. */
  box: { x: number; y: number; w: number; h: number };
  /** Hinge for unfold animations, as fractions of the box (0,0 = top-left). */
  hinge: { x: number; y: number };
};

const shadow = (x: number, y1: number): LogoGradient => ({
  x,
  y1,
  y2: y1 + 30,
  from: LOGO_COLORS.grayShadow,
  to: LOGO_COLORS.gray,
});

/** Paint order matches the source file: grey folds first, red letters on top. */
export const LOGO_PIECES: LogoPiece[] = [
  {
    key: "fold-top",
    d: "M19.4004 28.8008H210.4V80.0008H19.4004V28.8008ZM19.4004 80.0008H97.8004V135.401H19.4004V80.0008Z",
    fill: LOGO_COLORS.gray,
    kind: "fold",
    box: { x: 19.4, y: 28.8, w: 191, h: 106.6 },
    hinge: { x: 1, y: 1 },
  },
  {
    key: "tail-d",
    d: "M19.4004 305.199H94.3004V485.999H19.4004V305.199Z",
    fill: shadow(-79.9996, 305.199),
    kind: "fold",
    box: { x: 19.4, y: 305.2, w: 74.9, h: 180.8 },
    hinge: { x: 0.5, y: 0 },
  },
  {
    key: "fold-2-upper",
    d: "M351.801 82.1992H424.401V136.599H351.801V82.1992Z",
    fill: shadow(-79.9992, 82.1992),
    kind: "fold",
    box: { x: 351.8, y: 82.2, w: 72.6, h: 54.4 },
    hinge: { x: 0.5, y: 0 },
  },
  {
    key: "fold-2-lower",
    d: "M542.4 192.4H616.8V247.2H542.4V192.4Z",
    fill: shadow(-79.9993, 192.4),
    kind: "fold",
    box: { x: 542.4, y: 192.4, w: 74.4, h: 54.8 },
    hinge: { x: 0.5, y: 0 },
  },
  {
    key: "tail-2",
    d: "M542.601 305.199H616.801V413.999C616.801 423.454 614.938 432.817 611.32 441.552C607.702 450.288 602.398 458.225 595.712 464.911C589.027 471.597 581.089 476.9 572.354 480.519C563.619 484.137 554.256 485.999 544.801 485.999H475.001L451.801 411.599H530.601C538.601 411.599 542.601 407.599 542.601 399.599V305.199Z",
    fill: shadow(-79.9992, 305.199),
    kind: "fold",
    box: { x: 451.8, y: 305.2, w: 165, h: 180.8 },
    hinge: { x: 0.55, y: 0 },
  },
  {
    key: "letter-d",
    d: "M210.4 28.8008H285.6V135.401H210.4V28.8008ZM19.4004 135.401H285.6V305.201H19.4004V135.401ZM97.8004 192.401H210.4V247.201H97.8004V192.401Z",
    fill: { x: -79.9996, y1: 19.0008, y2: 305.201, from: LOGO_COLORS.red, to: LOGO_COLORS.redLight },
    evenOdd: true,
    kind: "letter",
    box: { x: 19.4, y: 28.8, w: 266.2, h: 276.4 },
    hinge: { x: 0.5, y: 1 },
  },
  {
    key: "letter-2",
    d: "M351.801 19H616.801V82.2H351.801V19ZM537.601 82.2H616.801V136.6H537.601V82.2ZM351.801 136.6H616.801V192.4H351.801V136.6ZM351.801 192.4H428.401V247.2H351.801V192.4ZM351.801 247.2H616.801V305.2H351.801V247.2Z",
    fill: { x: -79.9992, y1: 19, y2: 305.2, from: LOGO_COLORS.red, to: LOGO_COLORS.redLight },
    evenOdd: true,
    kind: "letter",
    box: { x: 351.8, y: 19, w: 265, h: 286.2 },
    hinge: { x: 0.5, y: 1 },
  },
];

/** CSS gradient matching the logo's red, for UI accents derived from the brand. */
export const BRAND_RED_GRADIENT = `linear-gradient(180deg, ${LOGO_COLORS.red} 0%, ${LOGO_COLORS.redLight} 100%)`;

/** Make a React useId() value safe for use inside url(#…) references. */
export function svgSafeId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "");
}
