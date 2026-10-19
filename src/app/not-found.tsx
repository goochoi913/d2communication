import Link from "next/link";

import { D2Mark } from "@/components/brand/d2-mark";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-neutral-950 px-6 text-center text-neutral-50">
      <div>
        <D2Mark className="mx-auto h-12 w-auto" />
        <h1 className="mt-10 font-display text-[clamp(2.2rem,5vw,4rem)] leading-tight font-light">This page doesn&rsquo;t exist.</h1>
        <p lang="ko" className="mt-3 text-neutral-400">
          없는 페이지입니다.
        </p>
        <div className="mt-10 flex justify-center gap-3 text-sm">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 hover:border-white">
            D2 Communication
          </Link>
          <Link href="/ko" className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-neutral-300 hover:border-white">
            한국어
          </Link>
        </div>
      </div>
    </main>
  );
}
