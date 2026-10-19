"use client";

import { useCallback, useState } from "react";

import { useSite } from "@/components/content/site-context";
import { navCategories } from "@/content/select";
import { About } from "../home/about";
import { Chapters } from "../home/chapters";
import { Featured } from "../home/featured";
import { Hero } from "../home/hero";
import { Partners } from "../home/partners";
import { PhotoStrip } from "../home/photo-strip";
import { Stats } from "../home/stats";
import { Intro } from "../intro";

export function HomePage() {
  const { content, editing } = useSite();
  const [introDone, setIntroDone] = useState(false);
  const done = useCallback(() => setIntroDone(true), []);
  // Photography's chapter number follows the film chapters shown above it.
  const filmChapters = navCategories(content, editing).filter((c) => c.slug !== "photography").length;

  return (
    <>
      {editing ? null : <Intro onDone={done} />}
      <Hero ready={introDone || editing} />
      <Stats />
      <Featured />
      <Chapters />
      <PhotoStrip numeral={filmChapters} />
      <Partners />
      <About />
    </>
  );
}
