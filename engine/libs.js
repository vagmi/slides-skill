/* ============================================================
   libs.js — the only place third-party code comes from. Pinned
   ES module builds on jsDelivr, so there is nothing to install and
   nothing to bundle. Bump a version here and every deck follows.

   Alpine      — x-data / x-for / x-text inside slide fragments.
   highlight.js — syntax colour for .code-panel blocks (the "common"
                  build: js, ts, html/xml, css, json, bash, python,
                  markdown, yaml, sql, go, rust, java … ).
   ============================================================ */
export { default as Alpine } from "https://cdn.jsdelivr.net/npm/alpinejs@3.17.4/dist/module.esm.min.js";
export { default as hljs } from "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.12.0/es/highlight.min.js";
