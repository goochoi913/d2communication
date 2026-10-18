import type { ImgHTMLAttributes } from "react";

/**
 * Responsive still for the site's pre-sized WebP files:
 * placeholders ship as <slug>-sm.webp (800w) and <slug>.webp (1920w); the hero photo as
 * -960 / -1600 / -2560 variants. Plain <img> because the site is a static export.
 */
export function Still({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSetFor(src)}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      {...props}
    />
  );
}

export function srcSetFor(src: string): string | undefined {
  if (src.startsWith("/images/placeholders/")) {
    if (src.endsWith("-portrait.webp")) return undefined;
    const base = src.replace(/(-sm)?\.webp$/, "");
    return `${base}-sm.webp 800w, ${base}.webp 1920w`;
  }
  const sized = src.match(/^(.*)-(960|1600|2560)\.webp$/);
  if (sized) return `${sized[1]}-960.webp 960w, ${sized[1]}-1600.webp 1600w, ${sized[1]}-2560.webp 2560w`;
  return undefined;
}
