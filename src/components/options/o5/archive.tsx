"use client";

import type { LenisOptions } from "lenis";

import { cn } from "@/lib/utils";
import { VideoPlayerProvider } from "@/components/media/video-player";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { inter, newsreader } from "./fonts";
import { PALETTE } from "./shared";
import { Masthead } from "./masthead";
import { LeadStory } from "./lead-story";
import { Contents } from "./contents";
import { Profile } from "./profile";
import { Section } from "./section";
import { Photography } from "./photography";
import { ScreeningRoom } from "./screening-room";
import { ArchiveIndex } from "./archive-index";
import { Colophon } from "./colophon";

// Anchor jumps land below the compact masthead.
const LENIS: LenisOptions = { anchors: { offset: -72 } };

/**
 * Option 5 — "Archive". The body of work presented as a serious print magazine or a
 * public broadcaster's archive: masthead, cover story, numbered sections, a screening
 * room, and an index of every film.
 */
export function Archive() {
  return (
    <SmoothScroll options={LENIS}>
      <VideoPlayerProvider tone="light">
        <div
          style={PALETTE}
          className={cn(
            newsreader.variable,
            inter.variable,
            "min-h-dvh bg-(--o5-paper) text-(--o5-ink) antialiased [font-family:var(--font-o5-sans)] selection:bg-(--o5-red) selection:text-white",
          )}
        >
          <Masthead />
          <main>
            <LeadStory />
            <Contents />
            <Profile />
            <Section slug="broadcast" index={0} layout="lead-left" />
            <Section slug="promo" index={1} layout="lead-wide" />
            <Section slug="performance" index={2} layout="lead-right" />
            <Photography index={3} />
            <ScreeningRoom />
            <ArchiveIndex />
          </main>
          <Colophon />
        </div>
      </VideoPlayerProvider>
    </SmoothScroll>
  );
}
