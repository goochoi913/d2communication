"""
Splits MaruBuri (Naver's Korean serif, OFL 1.1) into small unicode-range slices, so a page
downloads only the slices for the characters it shows, like Google Fonts does for Korean.
The slice ranges are Pretendard's (the same frequency-based ranges Google uses).

Usage (fontTools and brotli required, e.g. in a virtualenv):
  python scripts/fonts/split-maruburi.py <dir with MaruBuri-*.ttf> <pretendard dynamic-subset css>
Writes public/fonts/maruburi/*.woff2 and public/fonts/maruburi/maruburi.css.
"""
import re
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

WEIGHTS = {"Light": 300, "Regular": 400, "SemiBold": 600}
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "fonts" / "maruburi"


def parse_ranges(css: str) -> list[str]:
    seen, ranges = set(), []
    for block in re.findall(r"unicode-range:\s*([^;]+);", css):
        value = block.strip()
        if value not in seen:
            seen.add(value)
            ranges.append(value)
    return ranges


def codepoints(value: str) -> set[int]:
    points = set()
    for part in value.split(","):
        part = part.strip().upper().removeprefix("U+")
        if "-" in part:
            a, b = part.split("-")
            points.update(range(int(a, 16), int(b, 16) + 1))
        elif part:
            points.add(int(part, 16))
    return points


def main(src_dir: str, pretendard_css: str) -> None:
    ranges = parse_ranges(Path(pretendard_css).read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    rules = []
    for style, weight in WEIGHTS.items():
        source = Path(src_dir) / f"MaruBuri-{style}.ttf"
        cmap = set(TTFont(source).getBestCmap())
        for i, value in enumerate(ranges):
            wanted = codepoints(value) & cmap
            if not wanted:
                continue
            font = TTFont(source)
            options = subset.Options()
            options.flavor = "woff2"
            options.layout_features = ["*"]
            options.name_IDs = ["*"]
            options.notdef_outline = True
            subsetter = subset.Subsetter(options)
            subsetter.populate(unicodes=wanted)
            subsetter.subset(font)
            name = f"maruburi-{weight}-{i}.woff2"
            font.flavor = "woff2"
            font.save(OUT / name)
            rules.append(
                "@font-face{font-family:'MaruBuri';font-style:normal;font-weight:%d;font-display:swap;"
                "src:url(./%s) format('woff2');unicode-range:%s}" % (weight, name, value)
            )
    header = "/* MaruBuri © NAVER Corp. / NAVER Cultural Foundation, SIL Open Font License 1.1. Split by scripts/fonts/split-maruburi.py. */\n"
    (OUT / "maruburi.css").write_text(header + "\n".join(rules) + "\n")
    print(f"{len(rules)} slices written to {OUT}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
