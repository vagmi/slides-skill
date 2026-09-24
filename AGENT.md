# AGENT.md: the slides skill

This repo is a skill for building **presentation decks as static files**.
A deck is a folder of HTML fragments, one per slide, on a fixed 1920×1080
stage. The stage scales to any screen and prints to a PDF with one slide per
page. There is no build step, no bundler and no `npm install`. The engine
is plain ES modules. Alpine.js and highlight.js load from a CDN.

It was extracted from an Astro + Tailwind sales deck. The visual system (the
stage, the slide frame, the two surfaces, the reveals and the print pipeline)
came across. The speaker notes and run-sheet did not: **decks here are
visual only.**

Start with [docs/llms.txt](docs/llms.txt). It is the index to every doc.

## When to use this skill

- Someone asks for slides, a deck, a pitch or a presentation in HTML.
- Someone wants a deck that opens in a browser and exports to PDF.
- You need to add, edit, reorder or restyle slides in `decks/<name>/`.

## Map

```
AGENT.md                 ← you are here
index.html               ← lists the decks (add a <li> per new deck)
docs/                    ← how to use the skill; start at docs/llms.txt
engine/                  ← the shared engine. Do not fork it per deck
  deck.css               ← the one stylesheet a deck links (imports the rest)
  theme.css              ← design tokens, paper/deep surfaces, reveals
  stage.css              ← 1920×1080 stage + @media print (one slide per page)
  type.css · components.css · media.css · layout.css · chrome.css
  deck.js                ← entry: start({ rail, store, slides })
  loader.js · nav.js · print-preview.js · code.js · video.js · fit-check.js
  libs.js                ← pinned CDN imports (Alpine, highlight.js)
decks/
  starter/               ← copy this folder to begin a new deck
  showcase/              ← one slide per layout pattern; copy from it
```

## Workflow

1. `cp -r decks/starter decks/<name>`
2. Edit `decks/<name>/config.js`: names, date, the ask. Slides read it as
   `$store.deck.*`.
3. Write one file per slide in `decks/<name>/slides/NN-slug.html`. Copy the
   closest pattern from `decks/showcase/slides/` (see
   [docs/patterns.md](docs/patterns.md)).
4. List the files in the `slides` array in `decks/<name>/index.html`. That
   array is the running order.
5. Serve the repo root with `python3 -m http.server 8000` and open
   `http://localhost:8000/decks/<name>/`.
6. Check it: run `Deck.checkFit()` in the console (or open with `?fit`), then
   press **P** for the print preview.
7. Add the deck to the root `index.html`.

## In urai: building a deck in a canvas

In urai there is no shell and no local server. A deck is a **canvas**: one
directory, `/canvas/<name>/`, served beside the chat. It uses a flatter layout,
with the deck page at the canvas root and the engine beside it:

```
/canvas/<name>/index.html     ← the deck page (you write it)
/canvas/<name>/config.js      ← copied from the starter, then edited
/canvas/<name>/slides/NN-slug.html
/canvas/<name>/engine/…       ← copied, never edited
```

1. Copy the engine and the starter's config and slides in one call:
   ```
   copy_library_files(library: "slides-skill", canvas: "<name>", copies: [
     { from: "engine/",                  to: "engine/" },
     { from: "decks/starter/config.js",  to: "" },
     { from: "decks/starter/slides/",    to: "slides/" }
   ])
   ```
2. Edit `config.js`, then write each slide with `write_file`. Read the
   closest pattern from `decks/showcase/slides/` with `read_library_file`
   first (see [docs/patterns.md](docs/patterns.md)).
3. Write `index.html` **last**, because the canvas opens as soon as it exists.
   Start from `decks/starter/index.html`, but import `./engine/deck.js` and
   link `engine/deck.css`, not `../../engine/`.
4. Links inside a canvas must name the file: `decks/q3/index.html`, never
   `decks/q3/`. A path ending in `/` does not resolve.
5. Paths may be at most four levels deep inside the canvas. `slides/NN.html`
   is two.

## Hard rules

- **Design at 1920×1080.** Every size is in stage pixels. Never use `vw`,
  `vh`, `rem` media queries or responsive breakpoints on a slide.
- **One `<section>` per slide file**, and nothing else. Scripts inside a
  fragment do not run. Put data in `x-data` or in `config.js`.
- **No build tooling.** Do not add Vite, npm packages, Tailwind or a
  bundler. Third-party code comes only through `engine/libs.js` as a
  pinned CDN ES module.
- **No file over 300 lines.** That covers engine files, slides and docs. If a
  slide grows that long, it holds too much. Split it into two slides.
- **Visual slides only.** Do not add speaker notes, scripts or run-sheets.
- **Keep the print path working.** After any change, open the print preview
  (P) and confirm each slide is one page, with reveals visible and nothing
  clipped.
- **Content must fit the frame.** Slides clip their overflow and never
  scroll. `Deck.checkFit()` must list nothing.
- Use the classes in [docs/components.md](docs/components.md) and
  [docs/layout.md](docs/layout.md) before inline styles. Use `style=""` only
  for a one-off number.
- Restyle through the tokens in [docs/theming.md](docs/theming.md), never by
  editing component CSS for one deck.

## Writing style for slide copy

- One idea per slide. A headline that states the point, not a topic label.
- Short sentences, active voice. If a card needs a paragraph, it needs a
  slide.
- Wrap the words that carry the point in `<span class="text-gradient">`.
  Use it once per headline at most.
