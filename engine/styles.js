/* ============================================================
   styles.js — load Tailwind and the engine's CSS.

   The engine's stylesheets are Tailwind source (@theme, @apply,
   @layer), so they cannot be <link>ed. They are fetched, joined in
   the order below and put in one <style type="text/tailwindcss">
   at the top of <head>. The Tailwind browser build compiles every
   such block in document order, so a deck's own block (in its
   index.html) comes after this one and wins.

   The browser build cannot resolve @import, so these files never
   use it (not even in a comment: the word alone changes how the
   build reads the source).
   ============================================================ */
import { TAILWIND } from "./libs.js";

const FILES = ["theme.css", "stage.css", "components.css", "media.css", "chrome.css"];

function addScript() {
  if (document.querySelector('script[src*="@tailwindcss/browser"]')) return;
  const s = document.createElement("script");
  s.src = new URL(TAILWIND, import.meta.url).href; // a ./vendor/ path works too
  document.head.appendChild(s);
}

/* theme.css sets --deck-styles on :root; once it computes, Tailwind
   has compiled the engine CSS and the page is safe to measure. */
async function compiled(timeout = 15000) {
  const t0 = performance.now();
  const root = document.documentElement;
  while (!getComputedStyle(root).getPropertyValue("--deck-styles")) {
    if (performance.now() - t0 > timeout) throw new Error(`Tailwind did not load from ${TAILWIND}`);
    await new Promise(requestAnimationFrame);
  }
}

export async function loadStyles() {
  const css = await Promise.all(
    FILES.map(async (f) => {
      const res = await fetch(new URL(f, import.meta.url));
      if (!res.ok) throw new Error(`engine/${f}: ${res.status} ${res.statusText}`);
      return `/* ── engine/${f} ── */\n${await res.text()}`;
    })
  );
  const style = document.createElement("style");
  style.setAttribute("type", "text/tailwindcss");
  style.dataset.engine = "";
  style.textContent = css.join("\n");
  document.head.prepend(style);
  addScript();
  await compiled();
}

/* Tailwind builds utilities for new classes on a MutationObserver
   tick. Wait for that before measuring freshly rendered slides. */
export const settled = () =>
  new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
