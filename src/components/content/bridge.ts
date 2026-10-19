import type { ComponentType, ElementType, ReactNode } from "react";

import type { ContentPath } from "@/content/paths";
import type { ImageAsset, L10n, SiteContent } from "@/content/schema";

/**
 * The contract between the visitor site and edit mode. The site renders plain elements;
 * when an editor is signed in, the lazily loaded edit-mode bundle registers an
 * `EditorBridge`, and the content primitives (`Txt`, `EImage`, `EItem`, `EAdd`) render
 * its editable versions instead. Visitors never download any edit-mode code.
 */

export type EditableTextProps = {
  /** Path to the `L10n` value being edited (or to a plain string when `plain`). */
  path: ContentPath;
  value: L10n;
  /** The value is one string shared by both languages (a number, a year, an email). */
  plain?: boolean;
  as?: ElementType;
  className?: string;
  /** Line breaks allowed (Enter adds a line instead of finishing). */
  multiline?: boolean;
  /** `*words*` for emphasis are allowed. */
  rich?: boolean;
  /** Shown in edit mode while the field is empty. */
  placeholder?: string;
};

export type ImageSlot = "hero" | "poster" | "photo" | "cover" | "portrait" | "background";

export type EditableImageProps = {
  /** Path to the `ImageAsset` (it may not exist yet). */
  path: ContentPath;
  image?: ImageAsset;
  slot: ImageSlot;
  className?: string;
  children: ReactNode;
};

export type ItemKind = "work" | "photo" | "partner" | "stat" | "craft";

export type EditableItemProps = {
  kind: ItemKind;
  listPath: ContentPath;
  id: string;
  /** The ids of the group the item is shown in, in display order (for moving it). */
  scopeIds: string[];
  /** Name used in the delete confirmation. */
  label: string;
  className?: string;
  /** Opens the item's settings panel instead of the default click action. */
  onEdit?: () => void;
  children: ReactNode;
};

export type AddButtonProps = {
  kind: ItemKind;
  listPath: ContentPath;
  /** Field values for the new item, e.g. its category and placement. */
  preset?: Record<string, unknown>;
  /** Insert after this item (the end of the list when omitted). */
  afterId?: string;
  label?: string;
  variant?: "tile" | "inline";
  className?: string;
};

export type PanelRequest =
  | { kind: "work"; id: string }
  | { kind: "category"; slug: string }
  | { kind: "partner"; id: string }
  | { kind: "photo"; id: string }
  | { kind: "settings" }
  | { kind: "fonts" }
  | { kind: "history" };

export type EditorBridge = {
  /** Edit affordances are on (signed in and the Edit switch is on). */
  editing: boolean;
  /** The draft being edited, shown instead of the published content. */
  content: SiteContent;
  Text: ComponentType<EditableTextProps>;
  Image: ComponentType<EditableImageProps>;
  Item: ComponentType<EditableItemProps>;
  Add: ComponentType<AddButtonProps>;
  openPanel: (panel: PanelRequest) => void;
  /** Edit mode's internal API (see components/editor/context.tsx). */
  api: unknown;
};
