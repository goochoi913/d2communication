"use client";

import type { ContentSnapshot } from "@/content/schema";
import { D2Mark } from "@/components/brand/d2-mark";
import { SiteProvider } from "@/components/content/site-context";

/** The /edit page: shows the logo while edit mode loads, which then shows the sign-in. */
export function EditEntry({ snapshot }: { snapshot: ContentSnapshot }) {
  return (
    <SiteProvider snapshot={snapshot} lang="en" editorEntry>
      <main className="grid min-h-dvh place-items-center bg-neutral-950">
        <D2Mark className="h-14 w-auto animate-pulse" />
      </main>
    </SiteProvider>
  );
}
