/* ============================================================
   code.js — code panels, coloured by highlight.js (from the CDN).

     <figure class="code-panel sm r d3" data-lang="ts"
             data-caption="index.ts" data-note="the factory">
       <textarea>
         const x = await thing();   // raw source — no escaping needed
       </textarea>
     </figure>

   The source goes in a <textarea> (raw text: write <div> as is, only
   </textarea> would end it) or in <pre><code> (escape < as &lt;).
   It is dedented, so indent it to match the slide file.

   data-lang     any highlight.js "common" language: ts, js, html,
                 css, json, bash, python, markdown, yaml, sql …
                 Omit or "plaintext" for no colour.
   data-caption  mono label, left of the header strip (a filename)
   data-note     second label, right-aligned
   class         sm (two side by side) | md (default) | lg (one short
                 snippet) · wrap (soft-wrap long lines)

   Colours come from the --code-* tokens in theme.css (media.css maps
   hljs classes onto them), never from a highlight.js theme.
   ============================================================ */
import { hljs } from "./libs.js";

/* strip the leading blank line and the indentation shared by every line */
function dedent(src) {
  const lines = src.replace(/^\s*\n/, "").replace(/\s+$/, "").split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^[ \t]*/)[0].length);
  const ind = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(ind)).join("\n");
}

function build(fig) {
  const src = fig.querySelector("textarea, pre code, pre");
  if (!src || fig.dataset.ready) return;
  const text = dedent(src.tagName === "TEXTAREA" ? src.value : src.textContent);
  const lang = (fig.dataset.lang || "plaintext").toLowerCase();

  const code = document.createElement("code");
  code.textContent = text;
  if (lang !== "plaintext" && hljs.getLanguage(lang)) {
    code.innerHTML = hljs.highlight(text, { language: lang, ignoreIllegals: true }).value;
  }
  const pre = document.createElement("pre");
  pre.appendChild(code);

  fig.replaceChildren();
  const { caption, note } = fig.dataset;
  if (caption || note) {
    const head = document.createElement("figcaption");
    head.className = "code-head";
    head.innerHTML = `<span class="caption"></span><span class="note"></span>`;
    head.children[0].textContent = caption || "";
    head.children[1].textContent = note || "";
    fig.appendChild(head);
  }
  fig.appendChild(pre);
  if (!/\b(sm|md|lg)\b/.test(fig.className)) fig.classList.add("md");
  fig.dataset.ready = "1";
}

export function highlightAll(scope = document) {
  scope.querySelectorAll(".code-panel").forEach(build);
}
