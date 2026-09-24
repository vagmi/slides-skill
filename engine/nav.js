/* ============================================================
   nav.js — scale the stage to the window and drive navigation.

   l/j/→/Space/PageDown/click-right = next · h/k/←/PageUp/click-left
   = prev · Home/End · F fullscreen · P print preview · ? help ·
   swipe on touch · #N in the URL jumps to slide N.

   hjkl exists because a focused <video> swallows the arrow keys
   and Space. Any key with Cmd/Ctrl/Alt is left to the browser, so
   Cmd+P still opens the print dialog and Cmd+F still finds.
   ============================================================ */

export const W = 1920;
export const H = 1080;

const pad = (n) => String(n).padStart(2, "0");
const root = document.documentElement;
export const previewing = () => root.classList.contains("print-preview");

/* Embedded media owns its own clicks and transport keys. Mark any
   other interactive region with data-no-nav. */
const isMedia = (t) =>
  t instanceof Element && !!t.closest("video, audio, [data-no-nav]");

const HELP = [
  ["l / j", "Next slide (works over video)"],
  ["h / k", "Previous slide (works over video)"],
  ["→ / Space", "Next slide"],
  ["←", "Previous slide"],
  ["Home / End", "First / last slide"],
  ["F", "Fullscreen"],
  ["P", "Print preview"],
  ["⌘P / Ctrl+P", "Print · Save as PDF"],
  ["?", "Close this"],
];

/* Build the viewport, stage and chrome; return the nav controller. */
export function createNav(els) {
  const viewport = document.createElement("div");
  viewport.className = "deck-viewport";
  viewport.innerHTML =
    `<div class="deck-stage"></div>` +
    `<div class="deck-chrome"><div class="deck-progress"><span></span></div>` +
    `<div class="deck-meta"><b>01</b> / <span>${pad(els.length)}</span></div></div>` +
    `<div class="deck-help"><table>` +
    HELP.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("") +
    `</table></div>`;
  const stage = viewport.querySelector(".deck-stage");
  const bar = viewport.querySelector(".deck-progress span");
  const cur = viewport.querySelector(".deck-meta b");
  const help = viewport.querySelector(".deck-help");
  stage.append(...els);
  document.body.appendChild(viewport);

  let i = 0;
  const nav = { els, stage, viewport, get index() { return i; } };

  /* scale the whole stage to fit (letterbox; never reflow) */
  nav.fit = () => {
    const s = Math.min(innerWidth / W, innerHeight / H);
    const x = (innerWidth - W * s) / 2;
    const y = (innerHeight - H * s) / 2;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
  };

  nav.show = (n) => {
    i = Math.max(0, Math.min(els.length - 1, n));
    els.forEach((s, k) => s.classList.toggle("active", k === i));
    bar.style.width = ((i + 1) / els.length) * 100 + "%";
    cur.textContent = pad(i + 1);
    viewport.classList.toggle("on-deep", els[i].classList.contains("deep"));
    // never leave a video running on a slide you navigated away from
    stage.querySelectorAll("video, audio").forEach((m) => {
      if (m.closest(".slide") !== els[i]) m.pause();
    });
    // let a slide reset its own interactive state as it comes into view
    els[i].dispatchEvent(new CustomEvent("slide:enter"));
    const hash = "#" + (i + 1);
    if (location.hash !== hash) history.replaceState(null, "", location.search + hash);
  };
  nav.next = () => nav.show(i + 1);
  nav.prev = () => nav.show(i - 1);

  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    if (key === "p") return nav.preview?.toggle();
    if (previewing()) {
      if (key === "Escape") nav.preview.close();
      return; // arrows and Space scroll the preview
    }
    if (key === "l" || key === "j") return e.preventDefault(), nav.next();
    if (key === "h" || key === "k") return e.preventDefault(), nav.prev();
    if (isMedia(e.target) && [" ", "ArrowRight", "ArrowLeft"].includes(key)) return;

    if (["ArrowRight", "PageDown", " "].includes(key)) {
      e.preventDefault();
      nav.next();
    } else if (["ArrowLeft", "PageUp"].includes(key)) {
      e.preventDefault();
      nav.prev();
    } else if (key === "Home") nav.show(0);
    else if (key === "End") nav.show(els.length - 1);
    else if (key === "f") {
      document.fullscreenElement
        ? document.exitFullscreen()
        : root.requestFullscreen();
    } else if (key === "?") help.classList.toggle("open");
    else if (key === "Escape") help.classList.remove("open");
  });

  let x0 = null;
  addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  addEventListener("touchend", (e) => {
    if (x0 == null || previewing()) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) (dx < 0 ? nav.next : nav.prev)();
    x0 = null;
  });

  stage.addEventListener("click", (e) => {
    if (previewing() || isMedia(e.target)) return;
    (e.clientX / innerWidth > 0.5 ? nav.next : nav.prev)();
  });
  help.addEventListener("click", () => help.classList.remove("open"));
  addEventListener("resize", () => previewing() || nav.fit());

  nav.fit();
  const n = parseInt(location.hash.slice(1), 10);
  nav.show(Number.isInteger(n) && n > 0 ? n - 1 : 0);
  return nav;
}
