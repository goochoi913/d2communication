import { Barlow_Condensed, JetBrains_Mono } from "next/font/google";

export const condFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-o4-cond",
  display: "swap",
});

export const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-o4-mono",
  display: "swap",
});
