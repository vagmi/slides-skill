/* ============================================================
   loader.js — fetch slide fragments and turn each into a stage-ready
   <section class="slide">.

   A fragment is one HTML file holding one <section>:

     <section data-section="Introduction" data-title="Cover"
              data-tone="deep" data-bare>
       …markup, Alpine directives, <template x-for> …
     </section>

   data-section  eyebrow label, top-left (omit with data-bare)
   data-title    human name, shown in fit-check output and tooltips
   data-tone     "deep" for the dark surface; paper otherwise
   data-bare     drop the eyebrow row (covers, dividers, close)
   data-full     drop the padded frame; content owns all 1920×1080
   data-rail     override the deck-wide right-hand eyebrow text
   x-data        optional; every slide gets an Alpine scope anyway

   Anything else on the <section> (class, id, x-data, style) is kept.
   ============================================================ */

const pad = (n) => String(n).padStart(2, "0");

async function fetchFragment(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const tpl = document.createElement("template");
  tpl.innerHTML = await res.text();
  const sec = tpl.content.querySelector("section");
  if (!sec) throw new Error("no <section> in the file");
  return sec;
}

/* A slide that could not load still takes its place in the order, so the
   numbering stays right and the problem is on screen, not only in the
   console. (On file:// nothing loads at all; the deck page warns.) */
function errorSlide(url, err) {
  const sec = document.createElement("section");
  sec.dataset.section = "Load error";
  sec.dataset.title = url;
  const hint = String(err.message || err);
  sec.innerHTML =
    `<h2 class="text-h2">Could not load <span class="font-mono">${url}</span></h2>` +
    `<p class="text-lead text-fg-muted mt-8 max-w-mid">${hint}</p>`;
  return sec;
}

/* Wrap the fragment's children in the standard frame + eyebrow row. */
function frame(sec, n, rail) {
  const d = sec.dataset;
  sec.classList.add("slide");
  if (d.tone === "deep") sec.classList.add("deep");
  sec.dataset.n = n + 1;
  if (!d.title) d.title = d.section || `Slide ${n + 1}`;
  if (!sec.hasAttribute("x-data")) sec.setAttribute("x-data", "");

  const body = document.createElement("div");
  body.className = "full" in d ? "full-slot" : "frame";
  if (!("full" in d) && !("bare" in d)) {
    const eb = document.createElement("div");
    eb.className = "eyebrow r d1";
    eb.innerHTML = `<span></span><span class="rail"></span>`;
    eb.firstChild.textContent = d.section || "";
    body.appendChild(eb);
  }
  body.append(...sec.childNodes);
  sec.appendChild(body);

  const tag = document.createElement("span");
  tag.className = "preview-tag";
  tag.textContent = pad(n + 1);
  sec.appendChild(tag);

  // every empty <span class="rail"></span> gets the deck's rail text
  const text = d.rail ?? rail;
  sec.querySelectorAll(".rail:empty").forEach((e) => (e.textContent = text));
  return sec;
}

/* Load every fragment in parallel; keep the running order. URLs are
   resolved against the deck page, so "slides/01-cover.html" works. */
export async function loadSlides(urls, rail) {
  const secs = await Promise.all(
    urls.map((u) => fetchFragment(new URL(u, location.href)).catch((e) => errorSlide(u, e)))
  );
  return secs.map((s, n) => frame(s, n, rail));
}
