import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
// Korean serif in small unicode-range slices: a page downloads only the slices its characters need.
import "@fontsource/noto-serif-kr/300.css";
import "@fontsource/noto-serif-kr/400.css";

import { INTRO_SEEN_SCRIPT, LANG_SCRIPT, LIVE_PREFETCH_SCRIPT } from "@/lib/head-scripts";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

// Fonts ship with the site (no build-time download), so a rebuild after Publish can't fail on them.
const display = localFont({
  src: [
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const sans = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://d2communication.com"),
  title: { default: "D2 Communication", template: "%s — D2 Communication" },
  applicationName: "D2 Communication",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

/** Before first paint: the page language for /ko, the intro's once-per-visit flag, and the live-content request. */
const HEAD_SCRIPT = `${LANG_SCRIPT};${INTRO_SEEN_SCRIPT};${LIVE_PREFETCH_SCRIPT}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body className="min-h-dvh bg-neutral-950 text-neutral-50">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
