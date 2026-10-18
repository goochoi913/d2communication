/** The landing-page design options under review. Shared by the index page and the switcher. */
export type DesignOption = {
  id: number;
  name: string;
  brief: string;
  concept: string;
  palette: string[];
  type: string;
  tone: "dark" | "light";
};

export const designOptions: DesignOption[] = [
  {
    id: 1,
    name: "Reel",
    brief: "No restrictions",
    concept:
      "A modern studio site that leads with the showreel. The reel opens as a framed film and expands to full screen as you scroll. Then a tablet-frame feature film, stacked category chapters, and a closing call to action.",
    palette: ["#0a0a0a", "#f5f5f4", "#d4d4d4", "#e8b04b"],
    type: "Inter Tight + Instrument Serif",
    tone: "dark",
  },
  {
    id: 2,
    name: "Monogram",
    brief: "Built from the logo",
    concept:
      "The d2 logo is the brand experience. Its blocks assemble on load and its grey folds unfold. The block grid, red gradient and fold shading shape every section on a clean white page.",
    palette: ["#ffffff", "#CC0606", "#EA4E4E", "#A6A6A6", "#6C6F6F"],
    type: "Archivo (expanded) + Archivo",
    tone: "light",
  },
  {
    id: 3,
    name: "Frozen River",
    brief: "Based on the original mockup",
    concept:
      "Jin Sam Choi's own concept, done properly. The frozen-river photograph in deep black-and-white with one red line left in colour. A dark sky for legible serif type, the navigation at the top, and a first-person story.",
    palette: ["#0a0a0a", "#fafafa", "#737373", "#CC0606"],
    type: "Cormorant Garamond + Inter",
    tone: "dark",
  },
  {
    id: 4,
    name: "Premiere",
    brief: "Cinematic and dark",
    concept:
      "Showreel first, like a studio reel or festival screening. A title sequence, a letterboxed full-bleed reel, credit-style type and timecodes. The work is presented as a screening programme with hover previews.",
    palette: ["#000000", "#ededed", "#8a8a8a", "#CC0606"],
    type: "Barlow Condensed + JetBrains Mono",
    tone: "dark",
  },
  {
    id: 5,
    name: "Archive",
    brief: "Editorial documentary",
    concept:
      "A broadcaster's archive printed as a magazine. A masthead, a lead feature, large serif headlines, a strict grid of works, an index of credits, and calm whitespace.",
    palette: ["#f7f5f0", "#171717", "#737373", "#CC0606"],
    type: "Newsreader + Inter",
    tone: "light",
  },
  {
    id: 6,
    name: "Multiview",
    brief: "Extra option: everything at a glance",
    concept:
      "Modelled on a broadcast gallery's multiview wall. One screen of tiles shows the featured film, every category, the numbers and the contact, so a busy client gets the whole picture in five seconds.",
    palette: ["#e5e5e5", "#0a0a0a", "#ffffff", "#CC0606"],
    type: "Geist + Geist Mono",
    tone: "light",
  },
];
