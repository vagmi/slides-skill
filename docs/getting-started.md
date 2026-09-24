# Getting started

## Serve the repo

The deck fetches its slide files, and the engine is ES modules. Browsers
block both on `file://`, so serve the repo root with any static server:

```bash
python3 -m http.server 8000        # or: npx serve .   /   caddy file-server
open http://localhost:8000/        # the deck index
```

Nothing to install and nothing to build. To deploy, copy the whole folder to
any static host: GitHub Pages, Cloudflare Pages, S3 or nginx.

A deck opened from `file://` shows a one-line message that says to serve it
instead. The deck pages carry a small classic `<script>` for this. Keep it
when you copy the starter. A slide file that fails to load, for example
because of a typo in the `slides` array, becomes a "Could not load" slide in
its place.

## Make a new deck

```bash
cp -r decks/starter decks/acme
```

```
decks/acme/
  index.html        ← head, fonts, deck.css, and the start({...}) call
  config.js         ← names, date, the ask → $store.deck in every slide
  slides/
    01-cover.html   ← one <section> per file
    02-content.html
    03-close.html
  assets/           ← logos, images, videos for this deck
```

1. **config.js**: fill in the presenter, the audience and the ask.
   Everything audience-specific goes here, so you can point the deck at a
   new room with one edit.
2. **slides/**: write one file per slide. Name them `NN-slug.html`, and use
   `A1-…` for the appendix. Copy patterns from `decks/showcase/slides/`.
3. **index.html**: list the files in `slides: [...]`. The order of that
   array is the order on screen and the page order in the PDF. To cut a
   slide, remove its line. You can keep the file.
4. Add a `<li>` for the deck to the root `index.html`.

The `start()` call:

```html
<script type="module">
  import { start } from "../../engine/deck.js";
  import config from "./config.js";

  start({
    title: "Acme × Us",          // optional; sets document.title
    rail: "Acme × Us",           // right-hand eyebrow text on every slide
    store: config,               // becomes $store.deck in the slides
    slides: ["slides/01-cover.html", "slides/02-problem.html"],
  });
</script>
```

Paths resolve against the deck page, so `../../engine/` assumes the deck
sits at `decks/<name>/`. Adjust the path if you put it somewhere else.

## Present

| Key | Action |
| --- | --- |
| `l` / `j` | Next slide. Works over a focused video too |
| `h` / `k` | Previous slide. Works over a focused video too |
| → / Space / PageDown / click right half | Next slide |
| ← / PageUp / click left half | Previous slide |
| Home / End | First / last slide |
| `f` | Fullscreen |
| `p` | Print preview (see [print.md](print.md)) |
| `?` | Keyboard help |
| Esc | Close help or preview |
| swipe | Next / previous on touch screens |

The URL tracks the slide (`#7`), so a refresh keeps your place and you can
link to one slide. Keys pressed with Cmd, Ctrl or Alt go to the browser, so
Cmd+P prints and Cmd+F finds.

`hjkl` exists because a focused `<video>` takes the arrow keys and Space for
its own playback controls.

## URL flags

| Flag | Effect |
| --- | --- |
| `#N` | Open on slide N |
| `?print` | Open straight into the print preview |
| `?fit` | Run the fit check on load; results go to the console |

## Before you present

- `Deck.checkFit()` in the console lists nothing.
- Print preview (P) shows every slide once, in order, fully visible.
- Fonts and CDN libraries load on the venue network. If the network is
  doubtful, vendor them. See [engine.md](engine.md#offline).
