"use client";

import { Fragment } from "react";

import { cn } from "@/lib/utils";
import { broadcasters } from "@/data/site";
import { Label, Reveal, cond } from "./shared";

export function BroadcastOn() {
  return (
    <section className="border-y border-white/10 bg-black py-20" aria-label="Broadcast on">
      <Reveal>
        <Label className="text-center">Broadcast on</Label>
        <ul className="mx-auto mt-10 flex max-w-[1500px] flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6">
          {broadcasters.map((b, i) => (
            <Fragment key={b}>
              {i > 0 ? <li aria-hidden className="h-6 w-px bg-white/15" /> : null}
              <li
                className={cn(
                  cond,
                  "text-[clamp(1.6rem,2.4vw,2.6rem)] font-semibold tracking-[0.16em] text-[#9a9a9a] uppercase",
                )}
              >
                {b}
              </li>
            </Fragment>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
