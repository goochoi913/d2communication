"use client";

import { useId, type CSSProperties } from "react";
import { motion, useTransform, type MotionValue, type Variants } from "motion/react";

import { useReducedMotionSafe } from "@/components/motion/use-reduced-motion-safe";
import { LogoDefs, piecePathProps } from "./d2-mark";
import {
  LOGO_BASELINE,
  LOGO_COLORS,
  LOGO_PIECES,
  LOGO_VIEWBOX,
  svgSafeId,
  type LogoPiece,
} from "./logo-geometry";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const VIEWBOX = `0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`;

const letters = LOGO_PIECES.filter((p) => p.kind === "letter");

type IntroProps = {
  /**
   * "assemble": the red letters rise from their shared baseline, then the grey folds
   * unfold from the edge where they tuck under the red.
   * "draw": every piece is traced as an outline, then filled.
   */
  variant?: "assemble" | "draw";
  /** Start (or reset) the animation. Defaults to playing on mount. */
  play?: boolean;
  /** Seconds before the sequence begins. */
  delay?: number;
  /** Multiplies every duration and delay in the sequence. */
  speed?: number;
  /** Outline width in viewBox units for the "draw" variant. */
  strokeWidth?: number;
  onComplete?: () => void;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

/** Intro and loading animations built on the official logo paths. */
export function D2LogoAnimated({
  variant = "assemble",
  play = true,
  delay = 0,
  speed = 1,
  strokeWidth = 3,
  onComplete,
  className,
  style,
  title = "D2 Communication",
}: IntroProps) {
  const uid = svgSafeId(useId());
  const reduce = useReducedMotionSafe();
  const t = (s: number) => s / speed;

  const svgProps = {
    viewBox: VIEWBOX,
    fill: "none",
    role: "img" as const,
    className,
    style,
  };

  if (reduce) {
    return (
      <motion.svg
        {...svgProps}
        initial={{ opacity: 0 }}
        animate={{ opacity: play ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        onAnimationComplete={() => play && onComplete?.()}
      >
        <title>{title}</title>
        <LogoDefs uid={uid} />
        {LOGO_PIECES.map((piece) => (
          <path key={piece.key} {...piecePathProps(piece, uid)} />
        ))}
      </motion.svg>
    );
  }

  if (variant === "draw") {
    const lastIndex = LOGO_PIECES.length - 1;
    return (
      <motion.svg {...svgProps} initial="hidden" animate={play ? "visible" : "hidden"}>
        <title>{title}</title>
        <LogoDefs uid={uid} />
        {LOGO_PIECES.map((piece, i) => {
          const order = drawOrder(piece);
          const strokeVariants: Variants = {
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: [0, 1, 1, 0],
              transition: {
                pathLength: { delay: t(delay + order * 0.09), duration: t(1.1), ease: EASE_OUT },
                opacity: {
                  delay: t(delay + order * 0.09),
                  duration: t(1.9),
                  times: [0, 0.05, 0.75, 1],
                },
              },
            },
          };
          const fillVariants: Variants = {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { delay: t(delay + 0.85 + order * 0.07), duration: t(0.7), ease: "easeOut" },
            },
          };
          return (
            <g key={piece.key}>
              <motion.path
                {...piecePathProps(piece, uid)}
                variants={fillVariants}
                onAnimationComplete={(def) => {
                  if (i === lastIndex && def === "visible") onComplete?.();
                }}
              />
              <motion.path
                d={piece.d}
                fill="none"
                stroke={piece.kind === "letter" ? LOGO_COLORS.red : LOGO_COLORS.grayShadow}
                strokeWidth={strokeWidth}
                strokeLinejoin="miter"
                variants={strokeVariants}
              />
            </g>
          );
        })}
      </motion.svg>
    );
  }

  // "assemble"
  const folds = LOGO_PIECES.filter((p) => p.kind === "fold");
  const lastFold = folds[folds.length - 1].key;
  return (
    <motion.svg {...svgProps} initial="hidden" animate={play ? "visible" : "hidden"}>
      <title>{title}</title>
      <LogoDefs uid={uid} />
      <defs>
        <clipPath id={`${uid}-rise`}>
          <rect x={0} y={-60} width={LOGO_VIEWBOX.width} height={LOGO_BASELINE + 60.01} />
        </clipPath>
      </defs>
      {folds.map((piece) => {
        const both = piece.key === "fold-top";
        const variants: Variants = {
          hidden: { scaleY: 0, scaleX: both ? 0 : 1 },
          visible: {
            scaleY: 1,
            scaleX: 1,
            transition: { delay: t(delay + foldDelay(piece)), duration: t(0.75), ease: EASE_OUT },
          },
        };
        return (
          <motion.path
            key={piece.key}
            {...piecePathProps(piece, uid)}
            variants={variants}
            style={hingeStyle(piece)}
            onAnimationComplete={(def) => {
              if (piece.key === lastFold && def === "visible") onComplete?.();
            }}
          />
        );
      })}
      <g clipPath={`url(#${uid}-rise)`}>
        {letters.map((piece, i) => {
          const variants: Variants = {
            hidden: { y: LOGO_BASELINE },
            visible: {
              y: 0,
              transition: { delay: t(delay + i * 0.14), duration: t(1.0), ease: EASE_OUT },
            },
          };
          return <motion.path key={piece.key} {...piecePathProps(piece, uid)} variants={variants} />;
        })}
      </g>
    </motion.svg>
  );
}

type ScrollProps = {
  /** 0 → 1 progress, usually from useScroll(). */
  progress: MotionValue<number>;
  /**
   * "fold": the grey folds tuck back under the red as progress rises (1 = only "d2" left).
   * "assemble": the intro sequence, scrubbed by scroll (0 = empty, 1 = complete logo).
   * "explode": pieces drift apart along their own axis (0 = intact logo).
   */
  effect: "fold" | "assemble" | "explode";
  /** Explode distance in viewBox units. */
  distance?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

/** Scroll-linked logo. Every effect is exactly the official logo at its resting end. */
export function D2LogoScroll({
  progress,
  effect,
  distance = 90,
  className,
  style,
  title = "D2 Communication",
}: ScrollProps) {
  const uid = svgSafeId(useId());
  const reduce = useReducedMotionSafe();
  return (
    <svg viewBox={VIEWBOX} fill="none" role="img" overflow="visible" className={className} style={style}>
      <title>{title}</title>
      <LogoDefs uid={uid} />
      <defs>
        <clipPath id={`${uid}-rise`}>
          <rect x={0} y={-60} width={LOGO_VIEWBOX.width} height={LOGO_BASELINE + 60.01} />
        </clipPath>
      </defs>
      {LOGO_PIECES.filter((p) => p.kind === "fold").map((piece) =>
        reduce ? (
          <path key={piece.key} {...piecePathProps(piece, uid)} />
        ) : (
          <ScrollPiece key={piece.key} piece={piece} uid={uid} progress={progress} effect={effect} distance={distance} />
        ),
      )}
      <g clipPath={effect === "assemble" ? `url(#${uid}-rise)` : undefined}>
        {letters.map((piece) =>
          reduce ? (
            <path key={piece.key} {...piecePathProps(piece, uid)} />
          ) : (
            <ScrollPiece key={piece.key} piece={piece} uid={uid} progress={progress} effect={effect} distance={distance} />
          ),
        )}
      </g>
    </svg>
  );
}

function ScrollPiece({
  piece,
  uid,
  progress,
  effect,
  distance,
}: {
  piece: LogoPiece;
  uid: string;
  progress: MotionValue<number>;
  effect: ScrollProps["effect"];
  distance: number;
}) {
  const isFold = piece.kind === "fold";
  const letterIndex = letters.findIndex((l) => l.key === piece.key);

  // assemble: letters rise during 0–0.55, folds unfold during 0.45–1
  const start = isFold ? 0.45 + foldDelay(piece) * 0.25 : letterIndex * 0.12;
  const end = isFold ? Math.min(1, start + 0.35) : start + 0.43;

  const rise = useTransform(progress, [start, end], [LOGO_BASELINE, 0], { clamp: true });
  const unfold = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const foldAway = useTransform(progress, [0, 1], [1, 0], { clamp: true });

  const [dx, dy] = explodeVector(piece);
  const ex = useTransform(progress, [0, 1], [0, dx * distance]);
  const ey = useTransform(progress, [0, 1], [0, dy * distance]);

  if (effect === "assemble") {
    return isFold ? (
      <motion.path
        {...piecePathProps(piece, uid)}
        style={{ ...hingeStyle(piece), scaleY: unfold, scaleX: piece.key === "fold-top" ? unfold : 1 }}
      />
    ) : (
      <motion.path {...piecePathProps(piece, uid)} style={{ y: rise }} />
    );
  }
  if (effect === "fold") {
    return isFold ? (
      <motion.path
        {...piecePathProps(piece, uid)}
        style={{ ...hingeStyle(piece), scaleY: foldAway, scaleX: piece.key === "fold-top" ? foldAway : 1 }}
      />
    ) : (
      <path {...piecePathProps(piece, uid)} />
    );
  }
  return <motion.path {...piecePathProps(piece, uid)} style={{ x: ex, y: ey }} />;
}

function hingeStyle(piece: LogoPiece) {
  return {
    transformBox: "fill-box" as const,
    originX: piece.hinge.x,
    originY: piece.hinge.y,
  };
}

/** Folds follow the letter they hang from: "d" folds first, then the "2" folds top-down. */
function foldDelay(piece: LogoPiece) {
  switch (piece.key) {
    case "fold-top":
      return 0.62;
    case "tail-d":
      return 0.74;
    case "fold-2-upper":
      return 0.8;
    case "fold-2-lower":
      return 0.9;
    case "tail-2":
      return 1.0;
    default:
      return 0;
  }
}

function drawOrder(piece: LogoPiece) {
  return ["letter-d", "letter-2", "fold-top", "fold-2-upper", "fold-2-lower", "tail-d", "tail-2"].indexOf(piece.key);
}

/** Unit-ish direction for the explode effect: away from the logo's optical centre. */
function explodeVector(piece: LogoPiece): [number, number] {
  const cx = LOGO_VIEWBOX.width / 2;
  const cy = LOGO_VIEWBOX.height / 2;
  const px = piece.box.x + piece.box.w / 2;
  const py = piece.box.y + piece.box.h / 2;
  const len = Math.hypot(px - cx, py - cy) || 1;
  const k = piece.kind === "letter" ? 0.35 : 1;
  return [((px - cx) / len) * k, ((py - cy) / len) * k];
}
