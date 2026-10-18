import type { Metadata } from "next";

import { Premiere } from "@/components/options/o4/premiere";

export const metadata: Metadata = { title: "Option 4 · Premiere" };

export default function Page() {
  return <Premiere />;
}
