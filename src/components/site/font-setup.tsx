"use client";

import { fontStacks, fontStylesheets } from "@/content/fonts";
import { useSite } from "@/components/content/site-context";

/**
 * Applies the typefaces chosen in edit mode: loads the stylesheets they need (React hoists
 * the links into <head>, so the static HTML starts loading them at once) and sets the
 * display and text font stacks for this page's language.
 */
export function FontSetup() {
  const { content, lang } = useSite();
  const choice = content.settings.fonts;
  const { display, text } = fontStacks(choice, lang);
  const sheets = fontStylesheets(choice);
  const google = sheets.some((href) => href.startsWith("https://fonts.googleapis.com"));

  return (
    <>
      {google ? <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" /> : null}
      {sheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="fonts" />
      ))}
      <style>{`:root{--site-display:${display};--site-text:${text}}`}</style>
    </>
  );
}
