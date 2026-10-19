"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from "react";

import { cn } from "@/lib/utils";

/**
 * Classes for an image (or video) inside <ColorReveal>: black-and-white until the reveal.
 * On devices with a mouse the colour comes in on hover; on phones and tablets it comes in
 * while the image crosses the middle of the screen, or when it's tapped.
 */
export const revealMedia =
  "grayscale transition-[filter,scale] duration-[1200ms] ease-out motion-reduce:transition-none group-hover/reveal:grayscale-0 group-data-[color=on]/reveal:grayscale-0";

type Listener = (active: boolean) => void;
const listeners = new WeakMap<Element, Listener>();
let observer: IntersectionObserver | null = null;

/** One shared observer for every image on the page: the "middle of the screen" band. */
function centerBand() {
  observer ??= new IntersectionObserver(
    (entries) => entries.forEach((e) => listeners.get(e.target)?.(e.isIntersecting)),
    { rootMargin: "-32% 0px -32% 0px" },
  );
  return observer;
}

export function ColorReveal<T extends ElementType = "div">({
  as,
  className,
  onActiveChange,
  ...rest
}: {
  as?: T;
  /** Fires when the reveal turns on or off: hover with a mouse, centre of the screen on touch. */
  onActiveChange?: (active: boolean) => void;
} & Omit<ComponentPropsWithoutRef<T>, "as">) {
  const As = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const callback = useRef(onActiveChange);
  useEffect(() => {
    callback.current = onActiveChange;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const on = () => callback.current?.(true);
      const off = () => callback.current?.(false);
      el.addEventListener("pointerenter", on);
      el.addEventListener("pointerleave", off);
      return () => {
        el.removeEventListener("pointerenter", on);
        el.removeEventListener("pointerleave", off);
      };
    }
    const io = centerBand();
    listeners.set(el, (active) => {
      el.dataset.color = active ? "on" : "off";
      callback.current?.(active);
    });
    io.observe(el);
    return () => {
      io.unobserve(el);
      listeners.delete(el);
    };
  }, []);

  return <As ref={ref} className={cn("group/reveal", className)} {...rest} />;
}
