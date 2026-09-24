/* ============================================================
   fit-check.js — list slides whose content runs past the frame.

   Every slide is a fixed 1920×1080 canvas with overflow: hidden, so
   content that does not fit is clipped, not scrolled. Run
   Deck.checkFit() in the console (or open the deck with ?fit) and
   trim anything it lists. Reveals are switched off while measuring,
   or you would measure mid-animation, and the decorative
   .cover-frame hairline (which overhangs on purpose) is ignored.
   ============================================================ */

export function checkFit(nav) {
  const st = document.createElement("style");
  st.textContent =
    ".r{opacity:1!important;transform:none!important;animation:none!important}" +
    ".cover-frame{display:none!important}"; // decorative, overhangs on purpose
  document.head.appendChild(st);

  const found = [];
  nav.els.forEach((s, k) => {
    nav.els.forEach((x, j) => x.classList.toggle("active", j === k));
    const inner = s.querySelector(":scope > .frame, :scope > .full-slot");
    if (!inner) return;
    const over = inner.scrollHeight - inner.clientHeight;
    const wide = inner.scrollWidth - inner.clientWidth;
    if (over > 2 || wide > 2) found.push({ slide: k + 1, title: s.dataset.title, over, wide });
  });

  st.remove();
  nav.show(nav.index);
  console.table(found.length ? found : [{ result: "every slide fits" }]);
  return found;
}
