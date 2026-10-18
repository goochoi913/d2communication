import { Cormorant_Garamond, Inter } from "next/font/google";

export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-o3-display",
  display: "swap",
});

export const ui = Inter({
  subsets: ["latin"],
  variable: "--font-o3-ui",
  display: "swap",
});
