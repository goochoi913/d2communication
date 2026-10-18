import Link from "next/link";
import { LuArrowRight, LuArrowUpRight } from "react-icons/lu";

import { D2LogoAnimated } from "@/components/brand/d2-logo-animated";
import { designOptions } from "@/data/options";

export default function OptionsIndex() {
  return (
    <main className="min-h-dvh bg-neutral-100 text-neutral-950">
      <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-12 md:py-20">
        <header className="grid gap-10 border-b border-neutral-300 pb-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <D2LogoAnimated className="h-14 w-auto" delay={0.15} />
            <h1 className="mt-10 text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
              Landing page options
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-neutral-600">
              Six distinct directions for the D2 Communication homepage, each with its own layout, typography and
              motion. Open each in turn, then pick one or combine sections from several. The real site is built from
              that choice.
            </p>
          </div>
          <aside className="self-end text-sm leading-relaxed text-neutral-600 md:col-span-4 md:col-start-9">
            <p className="font-medium text-neutral-950">How to review</p>
            <ul className="mt-3 space-y-2">
              <li>Judge on a desktop browser, full screen.</li>
              <li>Scroll slowly — most of the motion is tied to scrolling.</li>
              <li>
                Use <Kbd>←</Kbd> <Kbd>→</Kbd> or the pill at the bottom right to step between options.
              </li>
              <li>All titles, credits, contact details and videos are placeholders.</li>
            </ul>
          </aside>
        </header>

        <ol className="mt-14 grid gap-x-10 gap-y-20 md:grid-cols-2">
          {designOptions.map((o) => (
            <li key={o.id}>
              <Link href={`/options/${o.id}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_40px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/previews/option-${o.id}.webp`}
                    alt={`Preview of option ${o.id}, ${o.name}`}
                    loading={o.id <= 2 ? "eager" : "lazy"}
                    className="size-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
                  />
                  <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-950 opacity-0 shadow-sm backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                    Open <LuArrowUpRight className="size-3.5" />
                  </span>
                </div>
                <div className="mt-6 flex items-baseline gap-4">
                  <span className="font-mono text-sm text-neutral-400 tabular-nums">0{o.id}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-2xl font-semibold tracking-[-0.02em]">{o.name}</h2>
                      <span className="text-sm text-neutral-500">{o.brief}</span>
                    </div>
                    <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{o.concept}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-neutral-500">
                      <span className="flex items-center gap-1.5">
                        {o.palette.map((c) => (
                          <span
                            key={c}
                            title={c}
                            className="size-4 rounded-full ring-1 ring-black/10"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </span>
                      <span>{o.type}</span>
                      <span className="ml-auto flex items-center gap-1.5 font-medium text-neutral-950">
                        View option {o.id}
                        <LuArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <footer className="mt-24 flex flex-col gap-2 border-t border-neutral-300 pt-8 text-sm text-neutral-500 md:flex-row md:justify-between">
          <p>D2 Communication · design review</p>
          <p>Placeholder photography: Wikimedia Commons contributors (see CREDITS.md). Placeholder films: NASA, ESA, NOAA and others.</p>
        </footer>
      </div>
    </main>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-grid min-w-6 place-items-center rounded border border-neutral-300 bg-white px-1.5 font-mono text-xs text-neutral-700 shadow-[0_1px_0_rgba(0,0,0,0.08)]">
      {children}
    </kbd>
  );
}
