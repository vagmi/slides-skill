# Theming

Source: `engine/theme.css`. The default palette is a warm off-white paper,
deep emerald ink, a lime accent, and a near-black emerald for dark slides.
The type is Inter for display and JetBrains Mono for labels and code.

## Rebrand one deck

Override tokens in the deck's `index.html`, **after** `deck.css`:

```html
<link rel="stylesheet" href="../../engine/deck.css" />
<style>
  :root {
    --accent: #f97316;
    --accent-soft: #fdba74;
    --accent-wash: #fff4ea;
    --brand: #7c2d12;
    --ink: #431407;
    --deep: #1c0f08;
    --gradient: linear-gradient(100deg, #7c2d12, #ea580c);
    --gradient-deep: linear-gradient(100deg, #fdba74, #fb923c);
  }
</style>
```

To share a theme across several decks, put the block in
`engine/themes/<name>.css` and link it after `deck.css`. Do not edit
`theme.css` to rebrand a single deck.

Swapping fonts means changing the Google Fonts `<link>` and
`--font-display` / `--font-mono`.

## Tokens

### Paper surface (default)

| Token | Default | Role |
| --- | --- | --- |
| `--paper` | `#faf8f3` | slide background |
| `--card` | `#ffffff` | raised surfaces |
| `--ink` | `#063e2e` | primary text |
| `--ink-2` | `#0a5c44` | eyebrow label, secondary headings |
| `--muted` | `#6b6355` | muted text |
| `--line` | `#e6e0d5` | hairlines and borders |

### Accents

| Token | Default | Role |
| --- | --- | --- |
| `--accent` | `#a3e635` | accent bars, ticks, arrows, dots, stat values on deep |
| `--accent-soft` | `#bef264` | the accent on deep slides |
| `--accent-wash` | `#f0fbdc` | `card accent` fill and `tr.hl` on paper |
| `--brand` | `#064e3b` | card labels on paper, stat values on paper, play icon |
| `--warn` | `#b45309` | `card warn`, `text-warn` |

### Deep surface

| Token | Default | Role |
| --- | --- | --- |
| `--deep` | `#09231c` | slide background |
| `--deep-card` | `#0f2e24` | cards |
| `--deep-line` | `#1d4034` | borders |
| `--deep-ink` | `#f2f4ef` | text |
| `--deep-muted` | `#8fa198` | muted text |

### Effects, code and stage

| Token | Role |
| --- | --- |
| `--gradient` / `--gradient-deep` | `text-gradient` on paper / deep |
| `--aura`, `--aura-deep`, `--aura-deep-2` | the soft corner glow on slides |
| `--code-bg`, `--code-fg`, `--code-com`, `--code-key`, `--code-str`, `--code-fn`, `--code-type`, `--code-num`, `--code-prop`, `--code-punc` | code panel colours |
| `--font-display`, `--font-mono` | typefaces |
| `--stage-bg` | the letterbox around the stage, and the preview background |

## Surface aliases (what components read)

`theme.css` maps the raw tokens onto aliases per surface. Components use
**only** these aliases, which is why one class works on both surfaces:

| Alias | Paper | Deep |
| --- | --- | --- |
| `--fg` | `--ink` | `--deep-ink` |
| `--fg-2` | `--ink-2` | `--accent-soft` |
| `--fg-muted` | `--muted` | `--deep-muted` |
| `--card-bg` | `--card` | `--deep-card` |
| `--border` | `--line` | `--deep-line` |
| `--label` | `--brand` | `--accent-soft` |
| `--mark` | `--accent` | `--accent-soft` |
| `--wash` | `--accent-wash` | 8% lime |
| `--grad` | `--gradient` | `--gradient-deep` |

When you write a new component, colour it with these aliases, never with
raw hex values, so it works on both surfaces for free.

## Contrast notes

- Lime on paper is decoration only: bars, ticks, arrows and dots. Do not set
  body text in `--accent` on paper, because it fails contrast. Use
  `text-label` instead.
- `muted` text is for secondary lines. Keep the claim itself in `--fg`.
- Check a new palette on a projector-like screen at low brightness. The
  aura and washes are subtle on purpose.
