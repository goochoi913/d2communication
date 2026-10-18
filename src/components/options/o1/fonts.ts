import { Instrument_Serif, Inter_Tight } from "next/font/google";

export const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-o1-sans",
  display: "swap",
});

export const serifFace = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-o1-serif",
  display: "swap",
});
