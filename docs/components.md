# Components

Sources: `engine/theme.css` (the type scale and colours), and
`engine/components.css` and `engine/media.css` (the components).

Slides are written in **Tailwind utilities** plus a small set of component
classes for the patterns that would otherwise be a long utility string on
every slide (`card`, `label`, `pill`, `numbered` …). Components sit in
Tailwind's `components` layer, so a utility on the same element always wins:
`card px-6 py-5` changes the card's padding and nothing else.

## Colours

Use the **surface-aware** colours. They flip on `data-tone="deep"` slides,
so the same markup reads right on paper and on deep:

| Colour | Paper | Deep | Use |
| --- | --- | --- | --- |
| `fg` | ink | deep ink | text (the default) |
| `fg-2` | ink-2 | soft lime | secondary heading ink |
| `fg-muted` | muted | deep muted | leads, card body, captions |
| `surface` | white | deep card | card fills |
| `edge` | line | deep line | borders, hairlines |
| `label` | brand | soft lime | mono labels, numbers |
| `mark` | lime | soft lime | bars, ticks, dots, arrows |
| `wash` | lime wash | 8% lime | highlighted fills |

Each works with every colour utility and opacity modifier: `text-fg-muted`,
`bg-surface`, `border-edge`, `bg-mark/20`, `divide-edge`.

The fixed palette (`paper`, `ink`, `brand`, `accent`, `warn`, `deep`, …) is
also there as `bg-brand`, `text-warn`, and so on. See
[theming.md](theming.md). Avoid Tailwind's stock palette (`text-gray-500`,
`bg-blue-600`): it ignores the deck's theme and the deep surface.

## Type scale

Each size sets font size, line height, tracking and weight together:

| Class | Size / weight | Use |
| --- | --- | --- |
| `text-display` | 100px / 700 | cover headline, the ask on the close |
| `text-h1` | 80px / 700 | divider titles |
| `text-h2` | 60px / 600 | the headline of a normal slide |
| `text-h3` | 36px / 600 | card titles, questions |
| `text-h4` | 30px / 600 | small card titles, contrast lines |
| `text-lead` | 34px | the setup line under a headline; pair with `text-fg-muted` |
| `text-body` | 28px | card body text |
| `text-small` | 24px | dense card text, captions |
| `text-tiny` | 20px | the floor; use sparingly |
| `label` | 20px mono caps, tracked, label colour | card kicker: "THE CONTRACT", "OURS" |

Adjust with ordinary utilities: `text-h4 font-normal`, `text-h2 leading-none`,
`font-mono`, `font-semibold`, `uppercase`, `whitespace-nowrap`. For a one-off
size use an arbitrary value, `text-h2 text-[56px]`, rather than `style=""`.

`text-gradient` paints the brand gradient on text. Wrap the words that carry
the point:

```html
<h2 class="text-h2">Reasoning is expensive. <span class="text-gradient">Execution is cheap.</span></h2>
```

In print and PDF the gradient becomes one solid colour, `--grad-solid`.
macOS Preview cannot draw gradient-clipped text from a Chrome PDF, so the
engine does not ask it to. See [print.md](print.md).

Inline `<code>` in prose is set in mono automatically.

## Markers

| Class | What |
| --- | --- |
| `accent-bar` | 64×8 lime pill. It sits above a headline or card title. |
| `tick` | 48×3 lime rule. It goes between a card's title and body. |
| `rule` | 1px hairline, on an `<hr>` or an empty `<div>`. It has zero height, so text put inside it spills out of the card. For a divider with text under it, put `border-t border-edge pt-4` on the text's own element. |
| `pill` | Mono caps in a rounded lime outline: a URL, a tag or a status. |
| `big-num` | 260px ghost numeral or letter for section dividers. |

## Cards

```html
<div class="card">…</div>
```

| Variant | Look | Use |
| --- | --- | --- |
| `card` | surface colour, 1px border, radius 14, padding 34×40 | default |
| `card card-accent` | lime-washed with a 2px lime border | the answer, "ours", the callout |
| `card card-brand` | wash fading down into the card colour | the highlighted column |
| `card card-warn` | amber border and wash; its `.label` turns amber | the trap, the risk |
| `card card-ghost` | transparent, dashed | placeholders, "not yet" |

Change the padding with utilities: `card px-7 py-5` for a small callout,
`card p-12` for a single hero card.

The usual card body is `label` → `tick mt-4 mb-4` → `text-body text-fg-muted`.

## Lists

```html
<div class="bar-list bar-list-accent">   <!-- each item hangs off a left rule -->
  <p>Sandboxed execution</p>
  <p>Serverless deploys</p>
</div>

<ul class="dot-list text-small">          <!-- lime dot bullets -->
  <li>Every slide fits</li>
</ul>
```

`bar-list` items are 30px / 600. Without `bar-list-accent` the rule is a
hairline. With it, the rule is lime. Add `flex-1 min-h-0 justify-evenly` to
spread the items down a tall card.

## Numbered rows (agenda, steps)

```html
<ol class="numbered">
  <li><span class="num">01</span><span>Label</span><span class="aside">5 min</span></li>
</ol>
```

`num` prints in mono with a divider after it. `aside` goes to the right, in
muted text. Use five rows at most.

## Stats

```html
<div class="card">
  <p class="stat-value">3×</p>
  <p class="stat-label">faster</p>
  <p class="text-small text-fg-muted mt-4">Why the number holds.</p>
</div>
```

`stat-value` is 136px, emerald on paper and lime on deep.

## Flow

Boxes joined by arrows. CSS draws the arrows, so `x-for` can render the
steps:

```html
<div class="flow">
  <div class="step"><p class="font-mono">AGENT.md</p><p class="text-tiny text-fg-muted mt-2.5">goes into the prompt</p></div>
  <div class="step">…</div>
</div>
```

## Quote

```html
<blockquote class="quote">
  One sentence. <span class="text-gradient">The turn.</span>
  <cite>Who said it</cite>
</blockquote>
```

64px with a thick lime left rule. Put it on a deep, bare slide inside
`my-auto max-w-wide`.

## Table

```html
<table class="table">
  <thead><tr><th>Approach</th><th>Tooling</th></tr></thead>
  <tbody><tr class="hl"><td class="font-semibold">This kit</td><td>None</td></tr></tbody>
</table>
```

Headers print in mono caps. `tr.hl` gives the row that is the point a lime
wash.

## Cover furniture

| Class | What |
| --- | --- |
| `cover-frame` | Decorative hairline just inside the canvas edge. It is the first child of a bare deep slide. |
| `lockup` | Row of logos: `<img>` · `<span class="x">×</span>` · theirs. Images are 86px tall. |
| `logo-slot` | Dashed name box to stand in for a missing logo. |
| `byline` | Bottom row: top border, mono, name on the left, date and pill on the right. Wrap the name in `<b>` for full ink. |

See `decks/showcase/slides/01-cover.html` for the full assembly.

## Code panels and video

See [code-and-media.md](code-and-media.md).
