# Layout

Source: `engine/layout.css`. Every number is in stage pixels. The whole
1920×1080 canvas scales as one unit, so nothing here is responsive and
nothing reflows. Never add media queries, `vw` or `vh` to a slide.

## The frame

Every slide that is not `data-full` gets a `.frame`. It is an absolutely
positioned **flex column**, inset `76px 104px 70px 104px`, so the usable
area is 1712×934. When the eyebrow row is present it takes the top ~57px.

Place blocks vertically with auto margins:

| Class | Effect in the frame |
| --- | --- |
| `my-auto` | Centre this block in the space left over. The usual choice for the body of a slide. |
| `mt-auto` | Push this block to the bottom of the frame, for footers, bylines and closing contrasts. |
| `grow` | Take all the remaining height. Use it for columns that should stretch, such as `grid-split grow`. |

The usual skeleton is headline → lead → `my-auto` body → optional `mt-auto`
footer.

```html
<h2 class="h2 r d2">Headline.</h2>
<p class="lead r d3 mt-s">Setup.</p>
<div class="grid-3 my-auto">…</div>
<div class="grid-2 mt-auto">…</div>
```

## Flex

| Class | CSS |
| --- | --- |
| `stack` | `display:flex; flex-direction:column` |
| `row` | `display:flex; align-items:center` |
| `wrap` | `flex-wrap:wrap` |
| `grow` | `flex:1 1 0; min-width:0; min-height:0` |
| `shrink-0` | `flex-shrink:0` |
| `center` | flex, centred on both axes |
| `h-full` | `height:100%`: a `stack h-full` fills the frame (covers) |

## Grids

All grids default to `gap: 26px`.

| Class | Columns |
| --- | --- |
| `grid-2` / `grid-3` / `grid-4` | equal columns |
| `grid-split` | `1fr auto 1fr`: two columns and a seam card between them |
| `grid-wide-left` | `3fr 2fr` |
| `grid-wide-right` | `2fr 3fr` |
| `span-2` / `span-3` | a child spanning 2 or 3 columns |

## Gaps and spacing

| Scale | xs | s | m | l | xl |
| --- | --- | --- | --- | --- | --- |
| `gap-*` | 10 | 16 | 26 | 40 | 64 |
| `mt-*` / `mb-*` | 10 | 18 | 30 | 46 | 70 |

Also `mt-0`, `mb-0` and `ml-auto`. These load after the components, so they
always override a component's own spacing.

Common rhythm: accent bar `mb-m` → headline → lead `mt-s` → body `mt-l`
or `my-auto`.

## Alignment

`items-start`, `items-center`, `items-end`, `items-baseline`,
`items-stretch`, `justify-center`, `justify-between`, `justify-end`,
`justify-evenly`, `text-center` and `text-right`.

## Width (measure)

Long lines are hard to read from the back of a room. Cap them:

| Class | max-width | Use for |
| --- | --- | --- |
| `w-narrow` | 1100px | leads under a divider, short captions |
| `w-mid` | 1400px | leads under a headline |
| `w-wide` | 1560px | long headlines, display text |
| `w-full` | 100% | |

## Positioning

`relative`, and `fill` (absolute, `inset:0`). A cover uses
`<div class="stack h-full relative">` so its decorative `.cover-frame`
can sit behind the content.

## Resets

Inside a slide, `h1`–`h4`, `p`, `ul`, `ol`, `figure` and `blockquote` have
zero margin, and lists have no bullets. Spacing is always explicit. The reset
has zero specificity, so any class wins over it.

## Budget: what fits on one slide

- A headline of one or two lines at `h2` (60px), plus a lead of one or two
  lines.
- Then **one** body block: three or four cards, five to six list rows, a
  table of up to about six rows, or two code panels of about 12 lines at
  `sm`.
- If `Deck.checkFit()` reports overflow, cut words first, then drop to a
  smaller type class, then split the slide. Never shrink below `tiny`
  (20px).
