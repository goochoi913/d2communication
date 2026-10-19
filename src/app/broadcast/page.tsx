import { pageMetadata } from "@/content/metadata";
import { loadPublishedContent } from "@/content/load";
import { SiteShell } from "@/components/site/site-shell";

export const metadata = pageMetadata("en", "broadcast");

export default function Page() {
  return <SiteShell snapshot={loadPublishedContent()} lang="en" page={{ kind: "category", slug: "broadcast" }} />;
}
