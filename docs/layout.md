# Layout

Slides are laid out with plain **Tailwind CSS v4 utilities** (`flex`,
`grid grid-cols-3`, `gap-6`, `mt-8`, `max-w-mid` …). The engine loads the
Tailwind browser build from the CDN, so any utility you write in a slide
works with no build step. See [tailwindcss.com/docs](https://tailwindcss.com/docs).

Every number is in stage pixels: the 1920×1080 canvas scales as one unit,
so nothing is responsive and nothing reflows. Tailwind's spacing unit is
`0.25rem` = 4px on the stage (`mt-8` = 32px, `gap-6` = 24px).

## Never on a slide

- **Responsive variants**: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`, `max-*:`
  and container queries. They react to the browser window, not the stage, so
  the slide would change between a laptop, a projector and the PDF.
- **Viewport units**: `h-screen`, `w-screen`, `min-h-dvh`, `h-[50vh]`.
  Use pixels or `h-full`.
- `dark:`. The surface comes from `data-tone="deep"`, not the OS.

`hover:` and `transition` are harmless but pointless: nobody hovers on a
projector.

## The frame

Every slide that is not `data-full` gets a `.frame`. It is an absolutely
positioned **flex column**, inset `76px 104px 70px 104px`, so the usable
area is 1712×934. When the eyebrow row is present it takes the top ~57px.

Place blocks vertically with auto margins:

| Class | Effect in the frame |
| --- | --- |
| `my-auto` | Centre this block in the space left over. The usual choice for the body of a slide. |
| `mt-auto` | Push this block to the bottom of the frame, for footers, bylines and closing contrasts. |
| `flex-1 min-h-0` | Take all the remaining height. Use it for columns that should stretch. |

The usual skeleton is headline → lead → `my-auto` body → optional `mt-auto`
footer.

```html
<h2 class="text-h2 r d2">Headline.</h2>
<p class="text-lead text-fg-muted r d3 mt-4">Setup.</p>
<div class="grid grid-cols-3 gap-6 my-auto">…</div>
<div class="grid grid-cols-2 gap-6 mt-auto">…</div>
```

## Recipes

| Need | Classes |
| --- | --- |
| column | `flex flex-col` |
| row, centred vertically | `flex items-center` |
| centred on both axes | `flex items-center justify-center` |
| fill the frame (covers) | `flex flex-col h-full relative` |
| equal columns | `grid grid-cols-2 gap-6` (or `-3`, `-4`) |
| two columns and a seam card | `grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-6` |
| wide left / narrow right | `grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6` |
| stretch items down a tall card | `flex-1 min-h-0 flex flex-col justify-evenly` |
| overlay | `absolute inset-0` |

Use `minmax(0, …)` in custom grid columns, as above, so long words cannot
push a column wider than its share. `grid-cols-N` already does this.

## Spacing rhythm

| Step | Pixels | Margin | Gap |
| --- | --- | --- | --- |
| xs | 10 | `mt-2.5` | `gap-2.5` |
| s | 16 | `mt-4` | `gap-4` |
| m | 24–32 | `mt-8` | `gap-6` |
| l | 40–48 | `mt-12` | `gap-10` |
| xl | 64–72 | `mt-18` | `gap-16` |

Common rhythm: accent bar `mb-8` → headline → lead `mt-4` → body `mt-12`
or `my-auto`. Grids of cards use `gap-6`.

Utilities always beat the engine's components (they live in a later cascade
layer), so `card p-6` or `quote mt-0` override the component's own spacing.

## Width (measure)

Long lines are hard to read from the back of a room. Cap them with the
stage-sized measures from `theme.css`:

| Class | max-width | Use for |
| --- | --- | --- |
| `max-w-narrow` | 1100px | leads under a divider, short captions |
| `max-w-mid` | 1400px | leads under a headline |
| `max-w-wide` | 1560px | long headlines, display text |

Tailwind's own `max-w-3xl` etc. also work (they are rem-based, so 48rem =
768px on the stage).

## Resets

Tailwind's preflight is on: headings, paragraphs, lists, figures and
blockquotes have no margin, lists have no bullets and headings inherit their
size. Spacing and size are always explicit. Inside a slide the line-height
is `normal` unless a `text-*` size or `leading-*` sets it.

## Budget: what fits on one slide

- A headline of one or two lines at `text-h2` (60px), plus a lead of one or
  two lines.
- Then **one** body block: three or four cards, five to six list rows, a
  table of up to about six rows, or two code panels of about 12 lines at
  `sm`.
- If `Deck.checkFit()` reports overflow, cut words first, then drop to a
  smaller type size, then split the slide. Never go below `text-tiny`
  (20px).
