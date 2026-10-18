/**
 * Single source of truth for the company, categories and videos.
 *
 * Adding a video never needs a code change: append a record to `videos`.
 * Hiding a category: set its `visibility`.
 *   - "public"     shown in navigation, sitemap and search engines
 *   - "link-only"  reachable by direct URL only (not in nav, sitemap, or search)
 *   - "hidden"     not reachable at all
 *
 * EVERYTHING BELOW IS PLACEHOLDER CONTENT for the design demos — titles, years,
 * broadcasters, clients, runtimes, contact details, and YouTube IDs. Facts confirmed by
 * the brief: the name Jin Sam Choi, 50+ documentaries and corporate films, documentary
 * subjects (history, science, IT), performance and event filming, and the crafts
 * (videography, cinematography, photography, editing, VFX).
 */

export type CategorySlug = "broadcast" | "promo" | "performance" | "photography";
export type Visibility = "public" | "link-only" | "hidden";

export type Category = {
  slug: CategorySlug;
  /** Short navigation label. */
  name: string;
  /** Section / page title. */
  title: string;
  tagline: string;
  description: string;
  visibility: Visibility;
  subGenres: string[];
  /** Placeholder still used for the category's cover. */
  cover: string;
};

export type Video = {
  id: string;
  youtubeId: string;
  title: string;
  category: Exclude<CategorySlug, "photography">;
  subGenre: string;
  year: number;
  /** Client or broadcaster. */
  client: string;
  role: string;
  runtime: string;
  description: string;
  featured: boolean;
  /** Optional local still; when absent, the YouTube thumbnail is used. */
  poster?: string;
  /** Optional start offset in seconds, for background loops that should skip title cards. */
  start?: number;
};

export type Photo = {
  src: string;
  alt: string;
  caption: string;
  orientation: "landscape" | "portrait";
};

export const company = {
  name: "D2 Communication",
  founder: {
    name: "Jin Sam Choi",
    nameKo: "최진삼",
    role: "Director & Producer",
  },
  domain: "d2communication.com",
  email: "contact@d2communication.com", // PLACEHOLDER
  phone: "+82 10 0000 0000", // PLACEHOLDER
  location: "Seoul, Republic of Korea", // PLACEHOLDER
  youtube: "https://www.youtube.com/@D2Communication", // PLACEHOLDER
} as const;

export const copy = {
  headline: "True stories, made for the screen.",
  /** One-paragraph introduction in the company voice. */
  intro:
    "D2 Communication is the production company of director and producer Jin Sam Choi. He has made more than fifty documentaries and corporate films — for national broadcasters, for companies, and for the stage.",
  /** Longer introduction in the company voice. */
  about:
    "For more than two decades, Jin Sam Choi has written, directed and produced documentaries on history, science and technology for Korean television, most of them narrated by leading broadcast announcers. The same storytelling now serves companies and cultural institutions: brand films with documentary credibility, and performance films recorded with broadcast discipline. Development, direction, cinematography, photography, editing and VFX happen under one roof, so the person who shapes the story frames every shot.", // PLACEHOLDER: confirm career length
  /** First-person version, for designs that speak as Jin Sam Choi himself. */
  firstPerson:
    "I'm Jin Sam Choi, a television director and producer. I have made more than fifty documentaries for broadcast — on history, science and technology — as well as promotional films for companies and recordings of live performance. I develop the story, shoot it, and finish it myself.",
  crafts: ["Directing", "Cinematography", "Photography", "Editing", "VFX"],
  /** PLACEHOLDER quote for review; needs Jin Sam Choi's approval before launch. */
  quote: {
    text: "A documentary makes one promise to its audience: this really happened. Everything I do, for a broadcaster or for a brand, starts from that promise.",
    by: "Jin Sam Choi",
  },
  contactCta: "Tell us about your film.",
};

export const stats = [
  { value: 50, suffix: "+", label: "Documentaries & films" },
  { value: 20, suffix: "+", label: "Years in broadcasting", placeholder: true },
  { value: 6, suffix: "", label: "Broadcast partners", placeholder: true },
  { value: 5, suffix: "", label: "Crafts under one roof" },
] as const;

export const services = [
  {
    key: "develop",
    title: "Development",
    body: "Research, story structure and treatment — the same rigour behind fifty broadcast documentaries.",
  },
  {
    key: "direct",
    title: "Direction & Production",
    body: "Producing and directing on location, from Seoul studios to the Siberian winter.",
  },
  {
    key: "camera",
    title: "Cinematography & Photography",
    body: "Camera, light, aerials and stills by the same eye that directs the story.",
  },
  {
    key: "post",
    title: "Editing, Colour & VFX",
    body: "Edit, grade, motion graphics and visual effects finished in-house, with professional narration.",
  },
] as const;

/** PLACEHOLDER partner names for logo rows and credits. */
export const broadcasters = ["KBS", "MBC", "SBS", "EBS", "Arirang TV", "YTN Science"] as const;

export const categories: Category[] = [
  {
    slug: "broadcast",
    name: "Broadcast",
    title: "Broadcast Documentaries",
    tagline: "Documentaries for national television",
    description:
      "Long-form documentaries on history, science and technology, written and directed for broadcast and narrated by professional announcers.",
    visibility: "public",
    subGenres: ["History", "Science", "Technology", "Culture & Expedition"],
    cover: "/images/hero/frozen-river-color-1600.webp",
  },
  {
    slug: "promo",
    name: "Corporate & Promo",
    title: "Corporate & Promotional Films",
    tagline: "Films for companies and institutions",
    description:
      "Brand films, corporate profiles and promotional videos that carry the credibility of documentary storytelling.",
    visibility: "public",
    subGenres: ["Brand Film", "Corporate Profile", "Product", "Campaign"],
    cover: "/images/placeholders/port-cranes-sunset.webp",
  },
  {
    slug: "performance",
    name: "Performance",
    title: "Performance & Events",
    tagline: "The stage, recorded with broadcast discipline",
    description:
      "Concerts, traditional performance, dance and live events, captured with multiple cameras and finished for broadcast and archive.",
    visibility: "public",
    subGenres: ["Concert", "Traditional Arts", "Dance", "Ceremony & Event"],
    cover: "/images/placeholders/orchestra-hall.webp",
  },
  {
    slug: "photography",
    name: "Photography",
    title: "Photography",
    tagline: "Stills from the field",
    description: "Location, production and portrait photography made alongside the films.",
    visibility: "public",
    subGenres: ["Location", "Production Stills", "Portrait"],
    cover: "/images/hero/frozen-river-bw-1600.webp",
  },
];

/**
 * PLACEHOLDER YouTube IDs: public-domain or Creative Commons films (NASA, ESA, NOAA, NPS,
 * Library of Congress, concert recordings) verified as embeddable. Swap each for the
 * D2 Communication channel's own unlisted upload.
 */
const YT = {
  earthViews: "4S06mRc5jwY",
  nightSkies: "ZhgR3zVfo-0",
  libraryOfCongress: "63Ze_bpATac",
  telescopeCleanroom: "4rJdhiDTIq4",
  earthTimelapse: "lNwWOul4i9Y",
  yosemite36: "-tPnzVhK794",
  oneDayYosemite: "7QLVMwyxU_Q",
  rocketFactory: "aZ8GpiO8t78",
  blackMarble: "QiCxG9V0-fw",
  moonTour: "nr5Pj6GQL2o",
  perpetualOcean: "CCmTY0PKGDs",
  sun4k: "6tmbeLTHC_0",
  earth4k: "7fYKMCCPh28",
  artemis: "mYTvg2abusc",
  aerialCity: "yX_Bq7VjpOs",
  symphony: "mJ8shHk7ywQ",
  marineBand: "MVJRqp7OfH4",
  marineBandLive: "1VvP03xdLwI",
  coral: "hscV6nk1GFY",
} as const;

/** The showreel used by hero sections; opens in the same player as any video. PLACEHOLDER video and runtime. */
export const showreel: Video = {
  id: "showreel",
  youtubeId: YT.earthViews,
  title: "Showreel",
  category: "broadcast",
  subGenre: "Showreel",
  year: 2026,
  client: "D2 Communication",
  role: "Directed & edited by Jin Sam Choi",
  runtime: "2:30",
  description: "Two and a half minutes from fifty documentaries, brand films and performances.",
  featured: false,
  poster: "/images/hero/frozen-river-color-2560.webp",
  start: 75, // the placeholder NASA reel opens on title cards
};

export const videos: Video[] = [
  // ── Broadcast ──────────────────────────────────────────────────────────────
  {
    id: "ice-road",
    youtubeId: YT.nightSkies,
    title: "Ice Road: A Winter on the Siberian River",
    category: "broadcast",
    subGenre: "Culture & Expedition",
    year: 2012,
    client: "EBS",
    role: "Director · Producer · Cinematographer",
    runtime: "50 min",
    description:
      "Six weeks with a fishing community on a frozen Siberian river, filmed at forty degrees below zero.",
    featured: true,
    poster: "/images/hero/frozen-river-color-1600.webp",
  },
  {
    id: "royal-archives",
    youtubeId: YT.libraryOfCongress,
    title: "The Royal Archives of Joseon",
    category: "broadcast",
    subGenre: "History",
    year: 2016,
    client: "KBS 1TV",
    role: "Writer · Director",
    runtime: "52 min",
    description:
      "How the Joseon court recorded five centuries of government, day by day — and the scholars who keep the archive alive.",
    featured: true,
    poster: "/images/placeholders/tripitaka-archive.webp",
  },
  {
    id: "silicon-peninsula",
    youtubeId: YT.telescopeCleanroom,
    title: "Silicon Peninsula",
    category: "broadcast",
    subGenre: "Technology",
    year: 2020,
    client: "YTN Science",
    role: "Director · Producer",
    runtime: "45 min",
    description:
      "Inside the clean rooms where Korea's semiconductor industry is built, nanometre by nanometre.",
    featured: true,
    poster: "/images/placeholders/silicon-wafer.webp",
  },
  {
    id: "northern-lights",
    youtubeId: YT.earthTimelapse,
    title: "Under the Northern Lights",
    category: "broadcast",
    subGenre: "Science",
    year: 2017,
    client: "KBS 1TV",
    role: "Director · Cinematographer",
    runtime: "50 min",
    description: "Physicists chase the solar storms that set the Arctic sky alight.",
    featured: true,
    poster: "/images/placeholders/iss-aurora.webp",
  },
  {
    id: "celadon",
    youtubeId: YT.yosemite36,
    title: "Celadon: The Colour of Jade",
    category: "broadcast",
    subGenre: "History",
    year: 2018,
    client: "Arirang TV",
    role: "Director · Producer",
    runtime: "48 min",
    description: "Master potters attempt to recover the lost glaze of Goryeo celadon.",
    featured: false,
    poster: "/images/placeholders/celadon-bowl.webp",
  },
  {
    id: "hwaseong",
    youtubeId: YT.oneDayYosemite,
    title: "Rebuilding Gyeongbokgung",
    category: "broadcast",
    subGenre: "History",
    year: 2015,
    client: "MBC",
    role: "Director",
    runtime: "55 min",
    description: "The forty-year restoration of the Joseon dynasty’s main palace, hall by hall.",
    featured: false,
    poster: "/images/placeholders/palace-snow.webp",
  },
  {
    id: "machines-that-learn",
    youtubeId: YT.rocketFactory,
    title: "Machines That Learn",
    category: "broadcast",
    subGenre: "Technology",
    year: 2021,
    client: "EBS",
    role: "Director · Editor",
    runtime: "50 min",
    description: "Engineers and the first generation of factories run by artificial intelligence.",
    featured: false,
    poster: "/images/placeholders/robot-cleanroom.webp",
  },
  {
    id: "data-age",
    youtubeId: YT.blackMarble,
    title: "The Data Age",
    category: "broadcast",
    subGenre: "Technology",
    year: 2023,
    client: "KBS 1TV",
    role: "Director · Producer · VFX",
    runtime: "52 min",
    description: "Following one message through the data centres, cables and satellites that carry it.",
    featured: false,
    poster: "/images/placeholders/server-racks.webp",
  },
  {
    id: "deep-space",
    youtubeId: YT.moonTour,
    title: "Signals from Deep Space",
    category: "broadcast",
    subGenre: "Science",
    year: 2019,
    client: "YTN Science",
    role: "Director",
    runtime: "45 min",
    description: "Radio astronomers listening for the faintest echoes of the early universe.",
    featured: false,
    poster: "/images/placeholders/radio-telescope.webp",
  },
  {
    id: "glacier-archive",
    youtubeId: YT.perpetualOcean,
    title: "The Glacier Archive",
    category: "broadcast",
    subGenre: "Science",
    year: 2022,
    client: "EBS",
    role: "Director · Producer",
    runtime: "50 min",
    description: "Ice cores, climate records, and the scientists racing to read them before they melt.",
    featured: false,
    poster: "/images/placeholders/arctic-iceberg.webp",
  },
  {
    id: "fire-mountain",
    youtubeId: YT.sun4k,
    title: "Fire Mountain",
    category: "broadcast",
    subGenre: "Science",
    year: 2013,
    client: "MBC",
    role: "Director · Cinematographer",
    runtime: "48 min",
    description: "A year beside one of the world's most active volcanoes.",
    featured: false,
    poster: "/images/placeholders/volcano-eruption.webp",
  },
  {
    id: "seoraksan",
    youtubeId: YT.earth4k,
    title: "Four Seasons of Seoraksan",
    category: "broadcast",
    subGenre: "Culture & Expedition",
    year: 2010,
    client: "KBS 2TV",
    role: "Director · Cinematographer",
    runtime: "55 min",
    description: "A year on Korea's most celebrated mountain, from first snow to autumn fire.",
    featured: false,
    poster: "/images/placeholders/seoraksan-clouds.webp",
  },

  {
    id: "coldest-village",
    youtubeId: YT.earthTimelapse,
    title: "The Coldest Village",
    category: "broadcast",
    subGenre: "Culture & Expedition",
    year: 2014,
    client: "KBS 1TV",
    role: "Director · Cinematographer",
    runtime: "50 min",
    description: "A winter in Oymyakon, the coldest inhabited place on Earth, where school closes only below −52°C.",
    featured: false,
    poster: "/images/placeholders/siberia-village.webp",
  },
  {
    id: "baikal",
    youtubeId: YT.perpetualOcean,
    title: "Baikal: Blue Ice",
    category: "broadcast",
    subGenre: "Culture & Expedition",
    year: 2016,
    client: "EBS",
    role: "Director · Producer · Cinematographer",
    runtime: "48 min",
    description: "The world’s deepest lake through one winter, filmed from the ice caves of Olkhon Island.",
    featured: false,
    poster: "/images/placeholders/baikal-ice-cave.webp",
  },
  {
    id: "palaces-of-seoul",
    youtubeId: YT.oneDayYosemite,
    title: "Palaces of Seoul",
    category: "broadcast",
    subGenre: "History",
    year: 2019,
    client: "Arirang TV",
    role: "Writer · Director",
    runtime: "45 min",
    description: "Five royal palaces and the city that grew around them, filmed from dawn until night.",
    featured: false,
    poster: "/images/placeholders/palace-blue-hour.webp",
  },

  // ── Corporate & Promo ──────────────────────────────────────────────────────
  {
    id: "building-giants",
    youtubeId: YT.artemis,
    title: "Building Giants",
    category: "promo",
    subGenre: "Brand Film",
    year: 2022,
    client: "Hanbit Heavy Industries",
    role: "Director · Producer",
    runtime: "3:40",
    description:
      "An eighteen-month build of an LNG carrier, from the first steel cut to sea trials.",
    featured: true,
    poster: "/images/placeholders/welding-sparks.webp",
  },
  {
    id: "forged",
    youtubeId: YT.rocketFactory,
    title: "Form and Light",
    category: "promo",
    subGenre: "Brand Film",
    year: 2019,
    client: "Metropolitan Design Center",
    role: "Director · Cinematographer",
    runtime: "3:20",
    description: "A launch film for a landmark design centre, shot across four seasons from dawn to night.",
    featured: false,
    poster: "/images/placeholders/architecture-ddp.webp",
  },
  {
    id: "precision",
    youtubeId: YT.telescopeCleanroom,
    title: "Precision at Scale",
    category: "promo",
    subGenre: "Product",
    year: 2023,
    client: "Arum Diagnostics",
    role: "Director · VFX",
    runtime: "2:30",
    description: "A product film for a diagnostics maker, combining laboratory cinematography with 3D visualisation.",
    featured: false,
    poster: "/images/placeholders/lab-scientist.webp",
  },
  {
    id: "city-never-sleeps",
    youtubeId: YT.aerialCity,
    title: "The City That Never Sleeps",
    category: "promo",
    subGenre: "Campaign",
    year: 2021,
    client: "Metropolitan Tourism Board",
    role: "Director · Editor",
    runtime: "1:30",
    description: "A tourism campaign shot across thirty locations over ten nights.",
    featured: false,
    poster: "/images/placeholders/seoul-skyline-night.webp",
  },
  {
    id: "care-engineered",
    youtubeId: YT.earthViews,
    title: "Care, Engineered",
    category: "promo",
    subGenre: "Corporate Profile",
    year: 2020,
    client: "Arum Medical Center",
    role: "Director · Producer",
    runtime: "4:20",
    description: "The people behind a hospital's new robotic surgery unit.",
    featured: false,
    poster: "/images/placeholders/surgical-light.webp",
  },
  {
    id: "moving-the-world",
    youtubeId: YT.blackMarble,
    title: "Moving the World",
    category: "promo",
    subGenre: "Brand Film",
    year: 2024,
    client: "Harbor Line Logistics",
    role: "Director · Aerial Cinematography",
    runtime: "2:50",
    description: "A logistics brand film built on aerial and time-lapse cinematography of a working port.",
    featured: false,
    poster: "/images/placeholders/port-cranes-sunset.webp",
  },
  {
    id: "bridges",
    youtubeId: YT.earth4k,
    title: "Bridges",
    category: "promo",
    subGenre: "Corporate Profile",
    year: 2018,
    client: "Hanseong Engineering & Construction",
    role: "Director",
    runtime: "4:00",
    description: "A construction group’s story, told through the roads and bridges it built.",
    featured: false,
    poster: "/images/placeholders/highway-night-aerial.webp",
  },

  // ── Performance & Events ───────────────────────────────────────────────────
  {
    id: "new-year-gala",
    youtubeId: YT.symphony,
    title: "New Year Gala Concert",
    category: "performance",
    subGenre: "Concert",
    year: 2024,
    client: "City Philharmonic Orchestra",
    role: "Director · Multi-camera Production",
    runtime: "1 h 48 min",
    description: "A seven-camera live recording of a sold-out New Year concert, finished for broadcast.",
    featured: true,
    poster: "/images/placeholders/orchestra-hall.webp",
  },
  {
    id: "fan-dance",
    youtubeId: YT.marineBand,
    title: "Court Music of Joseon",
    category: "performance",
    subGenre: "Traditional Arts",
    year: 2019,
    client: "Korean Traditional Performing Arts Foundation",
    role: "Director · Cinematographer",
    runtime: "12 min",
    description: "A multi-camera recording of a court-music ensemble performing before the Sun, Moon and Five Peaks.",
    featured: false,
    poster: "/images/placeholders/gugak-ensemble.webp",
  },
  {
    id: "samulnori",
    youtubeId: YT.marineBandLive,
    title: "Pungmul by Moonlight",
    category: "performance",
    subGenre: "Traditional Arts",
    year: 2018,
    client: "Seoul Traditional Music Center",
    role: "Director · Editor",
    runtime: "24 min",
    description: "Drummers and dancers of a farmers’ band, filmed at a full-moon festival.",
    featured: false,
    poster: "/images/placeholders/pungmul-night.webp",
  },
  {
    id: "winter-in-motion",
    youtubeId: YT.symphony,
    title: "Winter, in Motion",
    category: "performance",
    subGenre: "Dance",
    year: 2022,
    client: "Seoul Contemporary Ballet",
    role: "Director · Cinematographer",
    runtime: "38 min",
    description: "A contemporary ballet filmed for cinema release.",
    featured: false,
    poster: "/images/placeholders/contemporary-dance.webp",
  },
  {
    id: "lantern-festival",
    youtubeId: YT.coral,
    title: "Lantern Festival Opening Night",
    category: "performance",
    subGenre: "Ceremony & Event",
    year: 2023,
    client: "Lantern Festival Committee",
    role: "Director · Producer",
    runtime: "6 min",
    description: "Opening night of a lantern festival, lit by twenty thousand paper lanterns.",
    featured: false,
    poster: "/images/placeholders/temple-lantern-gate.webp",
  },
  {
    id: "tech-forum",
    youtubeId: YT.artemis,
    title: "Summer Sound Festival",
    category: "performance",
    subGenre: "Concert",
    year: 2024,
    client: "Hanul Live",
    role: "Director · Live Production",
    runtime: "1 h 32 min",
    description: "Three nights of a music festival, filmed for broadcast with eleven cameras.",
    featured: false,
    poster: "/images/placeholders/concert-stage-lights.webp",
  },
  {
    id: "fireworks",
    youtubeId: YT.coral,
    title: "Fireworks over the Han",
    category: "performance",
    subGenre: "Ceremony & Event",
    year: 2023,
    client: "City Festival Committee",
    role: "Director · Producer",
    runtime: "8 min",
    description: "A festival film shot from eight camera positions along the Han River.",
    featured: false,
    poster: "/images/placeholders/fireworks-han-river.webp",
  },
];

export const photos: Photo[] = [
  {
    src: "/images/hero/frozen-river-color-1600.webp",
    alt: "A film crew with snowmobiles and a tripod on a frozen river beside a Siberian village",
    caption: "On location, Siberia",
    orientation: "landscape",
  },
  {
    src: "/images/placeholders/camera-sunrise-portrait.webp",
    alt: "Photographer with a tripod silhouetted on an icy shoreline at sunrise",
    caption: "Before sunrise on the ice",
    orientation: "portrait",
  },
  {
    src: "/images/hero/frozen-river-bw-1600.webp",
    alt: "Black-and-white view of fishermen hauling a net across a frozen river under a dark sky",
    caption: "Ice fishing, Siberia",
    orientation: "landscape",
  },
  {
    src: "/images/placeholders/baikal-ice-cave-portrait.webp",
    alt: "Lone traveller silhouetted in an icicle-fringed ice cave looking out over frozen Lake Baikal",
    caption: "Ice cave, Lake Baikal",
    orientation: "portrait",
  },
  {
    src: "/images/placeholders/crew-antarctica.webp",
    alt: "Documentary camera operator on a tripod filming a scientist among Adelie penguins in Antarctica",
    caption: "Filming among penguins, Antarctica",
    orientation: "landscape",
  },
  {
    src: "/images/placeholders/palace-snow-portrait.webp",
    alt: "Geunjeongjeon throne hall at Gyeongbokgung Palace framed by painted eaves during heavy snowfall",
    caption: "Gyeongbokgung in snow, Seoul",
    orientation: "portrait",
  },
  {
    src: "/images/placeholders/harbour-sunrise.webp",
    alt: "Traditional painted fishing boats moored in a glassy harbour under a pink sunrise sky",
    caption: "Harbour at dawn",
    orientation: "landscape",
  },
  {
    src: "/images/placeholders/observatory-milky-way-portrait.webp",
    alt: "Mountain observatory tower and dome beneath the bright core of the Milky Way",
    caption: "Observatory under the Milky Way",
    orientation: "portrait",
  },
  {
    src: "/images/placeholders/control-room.webp",
    alt: "Television control room crew at a mixing desk facing a wall of broadcast monitors",
    caption: "Live broadcast gallery",
    orientation: "landscape",
  },
  {
    src: "/images/placeholders/hanok-blue-hour.webp",
    alt: "Traditional hanok house with tiled roof on a sloping Bukchon street, lamps glowing at blue hour",
    caption: "Bukchon at blue hour, Seoul",
    orientation: "landscape",
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

export const publicCategories = categories.filter((c) => c.visibility === "public");

export const videosIn = (slug: Video["category"]) => videos.filter((v) => v.category === slug);

export const featuredVideos = videos.filter((v) => v.featured);

export const categoryBySlug = (slug: CategorySlug) => categories.find((c) => c.slug === slug)!;

/** Smaller (800px) variant of a placeholder still, for cards and thumbnails. */
export function smallPoster(src: string) {
  if (src.endsWith("-portrait.webp")) return src; // portraits ship in one size
  if (src.startsWith("/images/placeholders/")) return src.replace(/\.webp$/, "-sm.webp");
  return src.replace(/-(1600|2560)\.webp$/, "-960.webp");
}

export function portraitPoster(src: string) {
  return src.startsWith("/images/placeholders/") ? src.replace(/\.webp$/, "-portrait.webp") : src;
}
