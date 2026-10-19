/**
 * Addressing into the content tree for edit mode. A path is a list of keys; in arrays of
 * items, "#<id>" picks the item whose `id` (or category `slug`) matches, so a path stays
 * valid when items are reordered. Every update returns a new tree (old ones are kept for undo).
 *
 *   ["text", "hero.title", "ko"]          → a text field
 *   ["works", "#ice-road", "title", "en"] → one work's English title
 *   ["categories", "#promo", "visibility"]
 */
export type ContentPath = readonly (string | number)[];

function indexIn(arr: unknown[], key: string | number): number {
  if (typeof key === "number") return key;
  if (key.startsWith("#")) {
    const id = key.slice(1);
    return arr.findIndex((x) => {
      const item = x as { id?: string; slug?: string } | null;
      return item?.id === id || item?.slug === id;
    });
  }
  return Number(key);
}

export function getAt<T = unknown>(root: unknown, path: ContentPath): T | undefined {
  let node: unknown = root;
  for (const key of path) {
    if (node == null) return undefined;
    node = Array.isArray(node) ? node[indexIn(node, key)] : (node as Record<string | number, unknown>)[key];
  }
  return node as T | undefined;
}

export function setAt<T>(root: T, path: ContentPath, value: unknown): T {
  if (!path.length) return value as T;
  const [key, ...rest] = path;
  if (Array.isArray(root)) {
    const i = indexIn(root, key);
    if (i < 0 || i >= root.length) return root;
    const copy = root.slice();
    copy[i] = setAt(copy[i], rest, value);
    return copy as T;
  }
  const obj = (root ?? {}) as Record<string | number, unknown>;
  return { ...obj, [key]: setAt(obj[key], rest, value) } as T;
}

/** Applies `fn` to the array at `path`. */
export function updateList<T, I>(root: T, path: ContentPath, fn: (items: I[]) => I[]): T {
  const items = (getAt<I[]>(root, path) ?? []) as I[];
  return setAt(root, path, fn(items));
}

export const removeById = <I extends { id: string }>(items: I[], id: string) => items.filter((x) => x.id !== id);

/** Inserts `item` after the item with `afterId` (at the end when not found, at the start when null). */
export function insertAfter<I extends { id: string }>(items: I[], item: I, afterId?: string | null): I[] {
  if (afterId === null) return [item, ...items];
  const i = afterId ? items.findIndex((x) => x.id === afterId) : -1;
  if (i < 0) return [...items, item];
  return [...items.slice(0, i + 1), item, ...items.slice(i + 1)];
}

/** Moves the item `id` so it lands where `overId` is (drag and drop), or by `delta` steps among `scopeIds`. */
export function moveItem<I extends { id: string }>(items: I[], id: string, overId: string): I[] {
  const from = items.findIndex((x) => x.id === id);
  const to = items.findIndex((x) => x.id === overId);
  if (from < 0 || to < 0 || from === to) return items;
  const copy = items.slice();
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

/** Moves `id` one step earlier or later among the items in `scopeIds` (the visible group). */
export function stepItem<I extends { id: string }>(items: I[], id: string, delta: -1 | 1, scopeIds: string[]): I[] {
  const pos = scopeIds.indexOf(id);
  const target = scopeIds[pos + delta];
  return target ? moveItem(items, id, target) : items;
}

export const pathKey = (path: ContentPath) => path.join("/");
