import type { Metadata } from "next";

import { loadPublishedContent } from "@/content/load";
import { EditEntry } from "@/components/site/edit-entry";

export const metadata: Metadata = {
  title: "Edit",
  robots: { index: false, follow: false },
};

/** Where Jin Sam Choi signs in to edit the site. */
export default function Page() {
  return <EditEntry snapshot={loadPublishedContent()} />;
}
