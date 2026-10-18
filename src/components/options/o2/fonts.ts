import { Archivo } from "next/font/google";

/** Archivo, variable in weight and width: expanded for display, normal for reading. */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-o2",
  display: "swap",
});
