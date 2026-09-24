/* ============================================================
   print-preview.js — see the PDF before you print it.

   P (or ?print in the URL) lays every slide out as a page, in
   order, exactly as print will paginate it: 1920×1080 per page,
   reveals forced visible, video slides on their title card. Pages
   are shrunk to the window with CSS zoom, so what you see is the
   print layout, not a re-flow of it.

   "Print / Save PDF" calls window.print(); stage.css then drops the
   zoom and the toolbar. Click any page to present from that slide.
   P or Esc closes.
   ============================================================ */
import { W } from "./nav.js";

const root = document.documentElement;
const isOpen = () => root.classList.contains("print-preview");

// keep ?print in the URL while previewing, so a refresh stays put
function setFlag(on) {
  const u = new URL(location.href);
  on ? u.searchParams.set("print", "") : u.searchParams.delete("print");
  history.replaceState(null, "", u.toString().replace(/([?&]print)=(?=&|#|$)/, "$1"));
}

export function installPreview(nav) {
  let bar = null;
  let resume = 0;

  const zoom = () => {
    const z = Math.max(0.1, Math.min(1, (innerWidth - 96) / W));
    root.style.setProperty("--preview-zoom", String(z));
  };

  function makeBar() {
    bar = document.createElement("div");
    bar.className = "preview-bar";
    bar.innerHTML =
      `<strong>PRINT PREVIEW</strong>` +
      `<span class="hint">${nav.els.length} pages · 1920×1080 · one slide per page</span>` +
      `<span class="grow"></span>` +
      `<span class="hint">Margins: None · Background graphics: On</span>` +
      `<button type="button" class="primary" data-act="print">Print / Save PDF</button>` +
      `<button type="button" data-act="close">Close (P)</button>`;
    bar.addEventListener("click", (e) => {
      const act = e.target.closest("button")?.dataset.act;
      if (act === "print") print();
      if (act === "close") close();
    });
    document.body.appendChild(bar);
  }

  function open() {
    if (isOpen()) return;
    resume = nav.index;
    if (!bar) makeBar();
    nav.stage.querySelectorAll("video").forEach((v) => v.pause());
    zoom();
    root.classList.add("print-preview");
    // open scrolled to the slide you were on
    requestAnimationFrame(() => nav.els[resume]?.scrollIntoView({ block: "center" }));
    setFlag(true);
  }

  function close(n) {
    if (!isOpen()) return;
    root.classList.remove("print-preview");
    scrollTo(0, 0);
    setFlag(false);
    nav.fit();
    nav.show(typeof n === "number" ? n : resume);
  }

  const toggle = () => (isOpen() ? close() : open());

  addEventListener("resize", () => isOpen() && zoom());

  // click a page → present from that slide
  nav.stage.addEventListener("click", (e) => {
    if (!isOpen()) return;
    const s = e.target.closest(".slide");
    if (s) close(nav.els.indexOf(s));
  });

  nav.preview = { open, close, toggle };
  if (new URL(location.href).searchParams.has("print")) open();
  return nav.preview;
}
