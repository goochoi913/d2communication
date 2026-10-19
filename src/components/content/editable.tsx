"use client";

import type { ElementType, ReactNode } from "react";

import { tr } from "@/content/format";
import type { ContentPath } from "@/content/paths";
import type { ImageAsset, L10n } from "@/content/schema";
import type { TextKey } from "@/content/text-defaults";
import type { AddButtonProps, EditableItemProps, ImageSlot } from "./bridge";
import { RichText } from "./rich-text";
import { useSite } from "./site-context";

type TextProps = {
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  rich?: boolean;
  placeholder?: string;
  /** Custom rendering for visitors (e.g. word-by-word reveal). Edit mode always shows plain editable text. */
  children?: (text: string) => ReactNode;
};

/**
 * An editable piece of content text: the `L10n` value at `path`, in the page's language.
 * Visitors get the plain element; in edit mode it becomes editable in place.
 */
export function EText({ path, value, as: As = "span", className, multiline, rich, placeholder, children }: TextProps & {
  path: ContentPath;
  value: L10n;
}) {
  const { bridge, editing, lang } = useSite();
  if (editing && bridge) {
    return (
      <bridge.Text
        path={path}
        value={value}
        as={As}
        className={className}
        multiline={multiline}
        rich={rich}
        placeholder={placeholder}
      />
    );
  }
  const text = tr(value, lang);
  if (children) return <As className={className}>{children(text)}</As>;
  return <As className={className}>{rich || multiline ? <RichText text={text} /> : text}</As>;
}

/** A plain string shared by both languages (a stat's number, a year), editable in place. */
export function EPlain({ path, value, as: As = "span", className, placeholder, children }: Omit<TextProps, "multiline" | "rich"> & {
  path: ContentPath;
  value: string;
}) {
  const { bridge, editing } = useSite();
  if (editing && bridge) {
    return (
      <bridge.Text path={path} value={{ en: value, ko: value }} plain as={As} className={className} placeholder={placeholder} />
    );
  }
  return <As className={className}>{children ? children(value) : value}</As>;
}

/** One of the site's fixed texts (`TEXT_DEFAULTS`), editable in place. */
export function Txt({ k, ...props }: TextProps & { k: TextKey }) {
  const { content } = useSite();
  return <EText path={["text", k]} value={content.text[k]} {...props} />;
}

/** The plain string of a fixed text, for attributes (aria-label, alt, title). */
export function useText() {
  const { content, lang } = useSite();
  return (k: TextKey) => tr(content.text[k], lang);
}

/** Wraps a rendered image so it can be replaced in edit mode (click to upload, set focus). */
export function EImage({ path, image, slot, className, children }: {
  path: ContentPath;
  image?: ImageAsset;
  slot: ImageSlot;
  className?: string;
  children: ReactNode;
}) {
  const { bridge, editing } = useSite();
  if (editing && bridge) {
    return (
      <bridge.Image path={path} image={image} slot={slot} className={className}>
        {children}
      </bridge.Image>
    );
  }
  return className ? <div className={className}>{children}</div> : <>{children}</>;
}

/** Wraps one item of a list (a work, photo, logo, stat) with move/delete/edit controls in edit mode. */
export function EItem({ children, className, ...props }: EditableItemProps) {
  const { bridge, editing } = useSite();
  if (editing && bridge) {
    return (
      <bridge.Item {...props} className={className}>
        {children}
      </bridge.Item>
    );
  }
  return className ? <div className={className}>{children}</div> : <>{children}</>;
}

/** An "add" button for a list, rendered only in edit mode. */
export function EAdd(props: AddButtonProps) {
  const { bridge, editing } = useSite();
  if (!editing || !bridge) return null;
  return <bridge.Add {...props} />;
}

/** Items visitors can see; in edit mode hidden items stay visible (marked) so they can be shown again. */
export function useVisible<T extends { hidden?: boolean }>(items: T[]): T[] {
  const { editing } = useSite();
  return editing ? items : items.filter((x) => !x.hidden);
}
