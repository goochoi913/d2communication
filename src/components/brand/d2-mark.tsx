import { useId, type SVGProps } from "react";

import { LOGO_PIECES, LOGO_VIEWBOX, svgSafeId, type LogoPiece } from "./logo-geometry";

type D2MarkProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children"> & {
  /** Accessible name. Pass an empty string when the mark sits next to visible company text. */
  title?: string;
};

/** The official logo, static and server-rendered. Use for nav bars, footers, and favicons. */
export function D2Mark({ title = "D2 Communication", className, ...props }: D2MarkProps) {
  const uid = svgSafeId(useId());
  return (
    <svg
      viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={className}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <LogoDefs uid={uid} />
      {LOGO_PIECES.map((piece) => (
        <path key={piece.key} {...piecePathProps(piece, uid)} />
      ))}
    </svg>
  );
}

export function LogoDefs({ uid }: { uid: string }) {
  return (
    <defs>
      {LOGO_PIECES.map((piece) =>
        typeof piece.fill === "string" ? null : (
          <linearGradient
            key={piece.key}
            id={`${uid}-${piece.key}`}
            x1={piece.fill.x}
            y1={piece.fill.y1}
            x2={piece.fill.x}
            y2={piece.fill.y2}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={piece.fill.from} />
            <stop offset="1" stopColor={piece.fill.to} />
          </linearGradient>
        ),
      )}
    </defs>
  );
}

export function piecePathProps(piece: LogoPiece, uid: string) {
  return {
    d: piece.d,
    fill: typeof piece.fill === "string" ? piece.fill : `url(#${uid}-${piece.key})`,
    ...(piece.evenOdd ? { fillRule: "evenodd" as const, clipRule: "evenodd" as const } : {}),
  };
}
