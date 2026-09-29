/* ============================================================
   libs.js — the only place third-party code comes from. Pinned
   builds on jsDelivr, so there is nothing to install and nothing
   to bundle. Bump a version here and every deck follows.

   Alpine       — x-data / x-for / x-text inside slide fragments.
   highlight.js — syntax colour for .code-panel blocks (the "common"
                  build: js, ts, html/xml, css, json, bash, python,
                  markdown, yaml, sql, go, rust, java … ).
   Tailwind     — the v4 browser build. Not an ES module: styles.js
                  adds it as a classic <script> and feeds it the
                  engine's CSS. It generates utilities for every
                  class in the DOM, including slides loaded later.
   ============================================================ */
export { default as Alpine } from "https://cdn.jsdelivr.net/npm/alpinejs@3.17.4/dist/module.esm.min.js";
export { default as hljs } from "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.12.0/es/highlight.min.js";
export const TAILWIND = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.3.3";
