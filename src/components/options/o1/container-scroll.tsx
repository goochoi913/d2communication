"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * Adapted from Aceternity UI's Container Scroll Animation
 * (ui.aceternity.com/components/container-scroll-animation): the screen tilts back to flat
 * as it rises. Tuned to land flat when the frame reaches the centre of the viewport, with a
 * thin premium bezel instead of the original grey device frame.
 */
export function ContainerScroll({ title, children }: { title: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    const frame = requestAnimationFrame(check);
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", check);
    };
  }, []);

  // A restrained tilt (the original uses 20°): enough to feel the screen rise, never a 3D trick.
  const rotate = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 14, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.9, 0.98] : [1.04, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -90]);

  return (
    <div ref={ref} className="relative flex items-center justify-center px-2 py-10 md:px-10 md:py-24">
      <div className="relative w-full" style={{ perspective: "1200px" }}>
        <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center">
          {title}
        </motion.div>
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Card({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="mx-auto mt-4 w-full max-w-[1180px] origin-top rounded-[30px] border border-white/10 bg-[#151515] p-2 md:mt-10 md:p-3"
    >
      <div className="relative aspect-video overflow-hidden rounded-[22px] bg-black">{children}</div>
    </motion.div>
  );
}
