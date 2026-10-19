/* eslint-disable @next/next/no-img-element -- static export: images are pre-sized variants, not next/image */
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { imageSrcSet, imageUrl, objectPosition } from "@/content/format";
import type { ImageAsset } from "@/content/schema";

/**
 * A responsive image from the content: picks a variant by `sizes`, crops around the
 * focal point set in edit mode, and shows the tiny blurred preview until it loads.
 */
export function Picture({
  image,
  alt,
  sizes = "100vw",
  priority = false,
  className,
  imgClassName,
  style,
}: {
  image: ImageAsset;
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Classes for the wrapper (size it here). */
  className?: string;
  /** Classes for the <img> itself (filters, transitions). */
  imgClassName?: string;
  style?: CSSProperties;
}) {
  const position = objectPosition(image);
  return (
    <span
      className={cn("relative block overflow-hidden bg-neutral-900", className)}
      style={{
        ...(image.lqip ? { backgroundImage: `url("${image.lqip}")`, backgroundSize: "cover", backgroundPosition: position ?? "center" } : null),
        ...style,
      }}
    >
      <img
        src={imageUrl(image, 1280)}
        srcSet={imageSrcSet(image)}
        sizes={image.widths?.length ? sizes : undefined}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        draggable={false}
        className={cn("absolute inset-0 size-full object-cover", imgClassName)}
        style={position ? { objectPosition: position } : undefined}
      />
    </span>
  );
}
