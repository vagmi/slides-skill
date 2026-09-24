# Engine internals

The engine is `engine/`: plain CSS and native ES modules, shared by every
deck. There is no build step. Browsers load the files exactly as they are
written.

## Modules

| File | Job |
| --- | --- |
| `deck.js` | Entry point. `start({ title, rail, store, slides })` runs the steps below and exposes `window.Deck`. |
| `libs.js` | The only third-party imports: pinned CDN ES module builds of Alpine and highlight.js. |
| `loader.js` | Fetches each fragment in parallel, keeps the order, and wraps each one in `.frame` + eyebrow (or `.full-slot`). It fills empty `.rail` spans and adds the preview page badge. A failed fetch becomes an on-screen error slide. |
| `nav.js` | Builds the viewport, stage, progress bar, counter and help overlay. Scales the stage (`translate + scale`). Handles keys, clicks, swipes and `#N`. Fires `slide:enter` on the slide that becomes active and pauses media elsewhere. |
| `video.js` | Expands `.video-slide` into the player and title scrim, and wires play, ended and `slide:enter`. |
| `code.js` | Dedents and highlights `.code-panel` sources with highlight.js, and builds the caption strip. |
| `print-preview.js` | The P / `?print` preview: toolbar, zoom, click to present. |
| `fit-check.js` | `Deck.checkFit()`. |

Order of work in `start()`:

```
fetch fragments → frame them → build stage + nav → video slides
→ code panels → Alpine.store("deck", store) + Alpine.start()
→ code panels again (for any rendered by x-for) → print preview
→ window.Deck → "deck:ready" event
```

## CSS files

`deck.css` imports them in this order. The order matters:

| File | Contents |
| --- | --- |
| `theme.css` | tokens, surface aliases, the aura, reveal animations |
| `stage.css` | 1920×1080 stage, slide stacking, `.frame`, `@media print` |
| `type.css` | type scale, text colours, markers |
| `components.css` | cards, lists, numbered rows, stats, pills, flow, quote, table |
| `media.css` | code panels, highlight.js colour map, video, eyebrow, cover furniture |
| `layout.css` | flex, grid, gap and spacing utilities. Loaded late so they win. |
| `chrome.css` | progress bar, counter, help, print preview |

## Console API: `window.Deck`

| Call | Does |
| --- | --- |
| `Deck.show(n)` | go to slide index `n` (0-based) |
| `Deck.next()` / `Deck.prev()` | step |
| `Deck.index` | current index |
| `Deck.slides` | the `<section>` elements |
| `Deck.checkFit()` | overflow report (see [print.md](print.md#fit-check)) |
| `Deck.preview.open()` / `.close(n?)` / `.toggle()` | print preview |

`document` fires `deck:ready` (with `detail` = `Deck`) once everything is up.
Each slide fires `slide:enter` when it becomes active. Listen to it to reset
interactive state.

## Adding behaviour

Fragments cannot carry scripts. To add behaviour:

- **Alpine first.** `x-data`, `@click`, `x-show` and `x-transition` cover
  most interactive bits inside a slide. Mark any interactive region
  `data-no-nav` so that clicks on it do not change slides.
- **An engine module second**, for something every deck can use. Write
  `engine/<thing>.js` exporting a function, call it from `start()` in
  `deck.js`, and keep the file under 300 lines. Document it here.
- **A deck-local module** as a last resort: import it in the deck's
  `index.html` after `start()` resolves:

  ```js
  const deck = await start({ … });
  deck.slides[3].addEventListener("slide:enter", () => { … });
  ```

## Library versions

`engine/libs.js` pins exact versions:

- Alpine `3.17.4`: `https://cdn.jsdelivr.net/npm/alpinejs@3.17.4/dist/module.esm.min.js`
- highlight.js `11.12.0`: `https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.12.0/es/highlight.min.js`

Only use CDN URLs that serve an **ES module** with CORS headers
(jsDelivr's `/npm/` and esm.sh both do). To add a library, add an `export`
line to `libs.js` and import it from there. Never scatter CDN URLs through
the other modules.

## Offline

The CDN libraries and Google Fonts need a network. For a venue without
one:

1. Download the two module files into `engine/vendor/`, then point
   `libs.js` at `./vendor/alpine.esm.min.js` and
   `./vendor/highlight.min.js`.
2. Self-host the fonts. Download the woff2 files into `engine/fonts/`, add
   `@font-face` rules, and remove the Google Fonts `<link>` from the deck.
3. You still need a local static server: `python3 -m http.server`.

## Why a server, and not file://

Slides are separate files, so they can be edited on their own and so no
file passes 300 lines. Loading them takes `fetch()`, and the engine uses
`import`. Browsers allow neither from `file://`. Any static server works,
and so does any static host.
