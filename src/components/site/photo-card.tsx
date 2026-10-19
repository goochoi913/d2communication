"use client";

import { cn } from "@/lib/utils";
import { tr } from "@/content/format";
import type { Photo } from "@/content/schema";
import { EItem, EText, useText } from "@/components/content/editable";
import { useSite } from "@/components/content/site-context";
import { ColorReveal, revealMedia } from "@/components/media/color-reveal";
import { Picture } from "@/components/media/picture";
import { usePhotoLightbox } from "./photo-lightbox";

/** A photograph in black and white that comes into colour; click for the full-screen view. */
export function PhotoCard({
  photo,
  set,
  scopeIds,
  sizes,
  frameClassName,
  className,
}: {
  photo: Photo;
  /** The photos the lightbox steps through. */
  set: Photo[];
  scopeIds: string[];
  sizes: string;
  /** Size of the image frame; omit to keep the photo's own proportions. */
  frameClassName?: string;
  className?: string;
}) {
  const { lang, editing, bridge } = useSite();
  const t = useText();
  const { open } = usePhotoLightbox();
  const caption = tr(photo.caption, lang);
  const activate = () => (editing && bridge ? bridge.openPanel({ kind: "photo", id: photo.id }) : open(set, photo.id));

  return (
    <EItem
      kind="photo"
      listPath={["photos"]}
      id={photo.id}
      scopeIds={scopeIds}
      label={caption}
      onEdit={() => bridge?.openPanel({ kind: "photo", id: photo.id })}
      className={className}
    >
      <ColorReveal as="figure">
        <button
          type="button"
          onClick={activate}
          aria-label={`${t("photography.open")}: ${caption}`}
          className="block w-full cursor-zoom-in overflow-hidden bg-neutral-900"
        >
          <Picture
            image={photo.image}
            alt={caption}
            sizes={sizes}
            className={cn(frameClassName ?? "relative")}
            style={frameClassName ? undefined : { aspectRatio: `${photo.image.width} / ${photo.image.height}` }}
            imgClassName={cn(revealMedia, "group-hover/reveal:scale-[1.02]")}
          />
        </button>
        <EText
          path={["photos", `#${photo.id}`, "caption"]}
          value={photo.caption}
          as="figcaption"
          className="mt-3 text-xs tracking-[0.2em] text-neutral-500 uppercase"
        />
      </ColorReveal>
    </EItem>
  );
}
