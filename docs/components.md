# Components

Sources: `engine/type.css`, `engine/components.css` and `engine/media.css`.
Every class reads the surface aliases (`--fg`, `--fg-muted`, `--card-bg`,
`--border`, `--label`, `--mark`), so the same markup looks right on paper
and on `data-tone="deep"` slides.

## Type scale

| Class | Size / weight | Use |
| --- | --- | --- |
| `display` | 100px / 700 | cover headline, the ask on the close |
| `h1` | 80px / 700 | divider titles |
| `h2` | 60px / 600 | the headline of a normal slide |
| `h3` | 36px / 600 | card titles, questions |
| `h4` | 30px / 600 | small card titles, contrast lines |
| `lead` | 34px, muted | the setup line under a headline |
| `body` | 28px | card body text |
| `small` | 24px | dense card text, captions |
| `tiny` | 20px | the floor; use sparingly |
| `label` | 20px mono caps, tracked | card kicker: "THE CONTRACT", "OURS" |

Modifiers: `mono`, `strong` (600), `bold` (700), `muted`, `fg`,
`text-accent` (lime), `text-label` (label colour), `text-warn`, `upper`
and `nowrap`.

`text-gradient` paints the brand gradient on text. Wrap the words that carry
the point:

```html
<h2 class="h2">Reasoning is expensive. <span class="text-gradient">Execution is cheap.</span></h2>
```

Inline `<code>` in prose is set in mono automatically.

## Markers

| Class | What |
| --- | --- |
| `accent-bar` | 64×8 lime pill. It sits above a headline or card title. |
| `tick` | 48×3 lime rule. It goes between a card's title and body. |
| `rule` | 1px hairline, on an `<hr>` or `<div>`. |
| `pill` | Mono caps in a rounded lime outline: a URL, a tag or a status. |
| `big-num` | 260px ghost numeral or letter for section dividers. |

## Cards

```html
<div class="card">…</div>
```

| Variant | Look | Use |
| --- | --- | --- |
| `card` | surface colour, 1px border, radius 14, padding 34×40 | default |
| `card tight` | padding 18×26, radius 10 | small chips, flow steps |
| `card loose` | padding 44×50 | a single hero card |
| `card accent` | lime-washed with a 2px lime border | the answer, "ours", the callout |
| `card brand` | wash fading down into the card colour | the highlighted column |
| `card warn` | amber border and wash; its `.label` turns amber | the trap, the risk |
| `card ghost` | transparent, dashed | placeholders, "not yet" |

The usual card body is `label` → `tick mt-s mb-s` → `body muted`.

## Lists

```html
<div class="bar-list accent">   <!-- each item hangs off a left rule -->
  <p>Sandboxed execution</p>
  <p>Serverless deploys</p>
</div>

<ul class="dot-list small">     <!-- lime dot bullets -->
  <li>Every slide fits</li>
</ul>
```

`bar-list` items are 30px / 600. Without `.accent` the rule is a hairline.
With it, the rule is lime. Add `grow justify-evenly` to spread the items
down a tall card.

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
  <p class="small muted mt-s">Why the number holds.</p>
</div>
```

`stat-value` is 136px, emerald on paper and lime on deep.

## Flow

Boxes joined by arrows. CSS draws the arrows, so `x-for` can render the
steps:

```html
<div class="flow">
  <div class="step"><p class="mono">AGENT.md</p><p class="tiny muted mt-xs">goes into the prompt</p></div>
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
`my-auto w-wide`.

## Table

```html
<table class="table">
  <thead><tr><th>Approach</th><th>Tooling</th></tr></thead>
  <tbody><tr class="hl"><td class="strong">This kit</td><td>None</td></tr></tbody>
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
