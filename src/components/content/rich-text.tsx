import { Fragment, type ReactNode } from "react";

export type RichSegment = { text: string; em: boolean };

/** Splits text into lines, and each line into plain and `*emphasised*` segments. */
export function parseRich(text: string): RichSegment[][] {
  return text.split("\n").map((line) => {
    const segments: RichSegment[] = [];
    const re = /\*([^*]+)\*/g;
    let last = 0;
    for (let m = re.exec(line); m; m = re.exec(line)) {
      if (m.index > last) segments.push({ text: line.slice(last, m.index), em: false });
      segments.push({ text: m[1], em: true });
      last = m.index + m[0].length;
    }
    if (last < line.length) segments.push({ text: line.slice(last), em: false });
    return segments;
  });
}

/** Text without the `*` markers, for alt text, metadata and aria labels. */
export const plainText = (text: string) => text.replace(/\*([^*]+)\*/g, "$1");

export function RichLine({ segments }: { segments: RichSegment[] }) {
  return (
    <>
      {segments.map((s, i) => (s.em ? <em key={i}>{s.text}</em> : <Fragment key={i}>{s.text}</Fragment>))}
    </>
  );
}

/**
 * Renders rich text: `*words*` become <em>, line breaks become <br>. Pass `line` to wrap
 * each line yourself (for line-by-line reveal animations).
 */
export function RichText({ text, line }: { text: string; line?: (content: ReactNode, index: number) => ReactNode }) {
  const lines = parseRich(text);
  return (
    <>
      {lines.map((segments, i) => {
        const content = <RichLine segments={segments} />;
        if (line) return <Fragment key={i}>{line(content, i)}</Fragment>;
        return (
          <Fragment key={i}>
            {i > 0 && <br />}
            {content}
          </Fragment>
        );
      })}
    </>
  );
}
