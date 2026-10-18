import type { Metadata } from "next";

import { Archive } from "@/components/options/o5/archive";

export const metadata: Metadata = { title: "Option 5 · Archive" };

export default function Page() {
  return <Archive />;
}
