import type { Metadata } from "next";

import { Reel } from "@/components/options/o1/reel";

export const metadata: Metadata = { title: "Option 1 · Reel" };

export default function Page() {
  return <Reel />;
}
