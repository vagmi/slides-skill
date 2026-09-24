# Print and PDF

Every slide prints as exactly one 1920×1080 page. No letterboxing, no
reflow, reveals always visible. What the room saw is what they take home.

## Print preview

Press **P** in a deck, or open it with `?print` (for example
`/decks/showcase/?print`).

- Every slide is laid out as a page, in order, shrunk to the window with CSS
  `zoom`. This is the print layout, not a re-flow of it.
- Reveal animations are forced visible. Video slides show their title card.
- Each page has a number badge. The badge does not print.
- **Click a page** to close the preview and present from that slide.
- The toolbar's **Print / Save PDF** button opens the browser's print
  dialog.
- **P** or **Esc** closes the preview and returns to the slide you were on.
- `?print` stays in the URL while the preview is open, so a refresh keeps
  it open.

## Save as PDF

In Chrome (recommended), use the preview's button, or Cmd/Ctrl+P, from
either mode:

- Destination: **Save as PDF**
- Margins: **None**
- **Background graphics: ON.** Without it, the paper, cards and deep slides
  print white.
- Paper size is ignored. `@page { size: 1920px 1080px }` sets it.

Chrome and Edge honour the `@page` size exactly. Safari and Firefox may fall
back to letter or A4. If a PDF comes out in the wrong page size, re-export
it from Chrome.

### Headless export

To produce the PDF without a person clicking through the dialog, use
Playwright with Chrome:

```js
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto("http://localhost:8000/decks/acme/");
await page.waitForFunction(() => window.Deck);           // slides loaded
await page.pdf({ path: "acme.pdf", preferCSSPageSize: true, printBackground: true });
```

Do **not** call `page.emulateMedia({ media: "screen" })` first. The print
rules only apply to print media.

Or use Chrome directly:
`chrome --headless --print-to-pdf=acme.pdf --no-pdf-header-footer <url>`.
Give the page time to fetch its slides with `--virtual-time-budget=5000`.

## How it works

The print rules live in `engine/stage.css` under `@media print`:

- `@page { size: 1920px 1080px; margin: 0 }`.
- The stage transform and zoom are removed, and slides become normal blocks
  with `break-after: page`.
- `print-color-adjust: exact` keeps fills and gradients.
- The chrome, help overlay, preview toolbar and page badges are hidden.
- `.r` reveals are forced to `opacity: 1` (in `theme.css`).

The preview (`engine/print-preview.js` + `engine/chrome.css`) reuses the same
page geometry. It adds `html.print-preview`, stacks the slides and sets
`--preview-zoom` to fit the window. The print rules use `!important`, so
printing from the preview gives the same PDF as printing from presenting
mode.

## Fit check

Slides clip their overflow. They never scroll. So content that runs past the
frame disappears without warning. Check every slide:

- In the console: `Deck.checkFit()`. It prints a table of slides whose frame
  content is taller or wider than the frame, then returns the list.
- Or open the deck with `?fit` to run the check on load.

Reveals are switched off while measuring. The decorative `.cover-frame`,
which overhangs on purpose, is ignored. An empty result means every slide
fits.

## Pre-flight checklist

1. `Deck.checkFit()` returns `[]`.
2. The print preview shows every slide once, in order, with nothing hidden.
3. Deep slides and cards have colour in the PDF, so background graphics
   were on.
4. Page count = slide count.
5. Fonts rendered as Inter and JetBrains Mono, not a fallback. If the
   network is slow, give the page a moment before printing.
