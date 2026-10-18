"use client";

import { Fragment } from "react";

import { cn } from "@/lib/utils";
import { broadcasters, videos } from "@/data/site";
import { Marquee, SectionLabel, container } from "./shared";

const clients = Array.from(new Set(videos.filter((v) => v.category !== "broadcast").map((v) => v.client)));

export function Broadcasters() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0a] py-24 text-[#f5f5f4] md:py-32">
      <div className={cn(container, "flex items-center justify-between gap-6")}>
        <SectionLabel>Broadcast on</SectionLabel>
        <p className="hidden text-[12px] font-medium tracking-[0.16em] text-white/40 uppercase md:block">
          Networks &amp; clients
        </p>
      </div>

      <Marquee duration={38} className="mt-12">
        {[0, 1].map((round) => (
          <Fragment key={round}>
            {broadcasters.map((b) => (
              <span key={`${round}-${b}`} className="flex items-center">
                <span className="text-[clamp(3.2rem,7.2vw,8rem)] leading-none font-medium tracking-[-0.055em] whitespace-nowrap text-white/85">
                  {b}
                </span>
                <span aria-hidden className="mx-[3.2vw] size-2.5 rounded-full bg-white/20" />
              </span>
            ))}
          </Fragment>
        ))}
      </Marquee>

      <Marquee duration={60} reverse className="mt-8">
        {[0, 1].map((round) => (
          <Fragment key={round}>
            {clients.map((c) => (
              <span
                key={`${round}-${c}`}
                className="mx-6 text-[clamp(1.1rem,1.6vw,1.6rem)] font-medium tracking-[-0.02em] whitespace-nowrap text-white/35"
              >
                {c}
              </span>
            ))}
          </Fragment>
        ))}
      </Marquee>
    </section>
  );
}
