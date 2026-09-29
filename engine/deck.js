/* ============================================================
   deck.js — the entry point. A deck page calls start() once:

     <script type="module">
       import { start } from "../../engine/deck.js";
       import config from "./config.js";
       start({
         rail: "Acme × You",            // right-hand eyebrow text
         store: config,                 // → $store.deck in every slide
         slides: ["slides/01-cover.html", "slides/02-agenda.html"],
       });
     </script>

   The slides array IS the running order. Each entry is an HTML
   fragment (see loader.js). Order of work:
     Tailwind + engine CSS (in parallel with) fetch fragments →
     frame them → video slides → Alpine
     (x-data, x-for, x-text …) → code highlighting → stage + nav
     → print preview.

   Needs any static file server (fetch and ES modules do not work
   from file://). No build step, no install.
   ============================================================ */
import { Alpine } from "./libs.js";
import { loadStyles, settled } from "./styles.js";
import { loadSlides } from "./loader.js";
import { createNav } from "./nav.js";
import { highlightAll } from "./code.js";
import { wireVideos } from "./video.js";
import { installPreview } from "./print-preview.js";
import { checkFit } from "./fit-check.js";

export async function start({ rail = "", store = {}, slides = [], title } = {}) {
  if (title) document.title = title;

  const [els] = await Promise.all([loadSlides(slides, rail), loadStyles()]);

  // Build the stage first so Alpine initialises slides in the live DOM.
  const nav = createNav(els);
  wireVideos(nav.stage, rail);
  highlightAll(nav.stage); // panels written directly in the fragment

  Alpine.store("deck", store);
  window.Alpine = Alpine;
  Alpine.start();
  await new Promise(requestAnimationFrame);
  highlightAll(nav.stage); // panels rendered by x-for
  await settled(); // Tailwind has built the classes Alpine rendered

  installPreview(nav);

  // Console handle: Deck.show(3), Deck.checkFit(), Deck.preview.open()
  window.Deck = {
    show: nav.show,
    next: nav.next,
    prev: nav.prev,
    preview: nav.preview,
    checkFit: () => checkFit(nav),
    get index() { return nav.index; },
    get slides() { return nav.els; },
  };
  if (new URL(location.href).searchParams.has("fit")) window.Deck.checkFit();
  document.dispatchEvent(new CustomEvent("deck:ready", { detail: window.Deck }));
  return window.Deck;
}
