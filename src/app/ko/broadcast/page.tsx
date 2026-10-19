import { pageMetadata } from "@/content/metadata";
import { loadPublishedContent } from "@/content/load";
import { SiteShell } from "@/components/site/site-shell";

export const metadata = pageMetadata("ko", "broadcast");

export default function Page() {
  return <SiteShell snapshot={loadPublishedContent()} lang="ko" page={{ kind: "category", slug: "broadcast" }} />;
}
