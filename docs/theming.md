# Theming

Source: `engine/theme.css` (Tailwind source, compiled in the browser). The default palette is a warm off-white paper,
deep emerald ink, a lime accent, and a near-black emerald for dark slides.
The type is Inter for display and JetBrains Mono for labels and code.

## Rebrand one deck

Every colour, size and font is a Tailwind `@theme` token, exposed as a CSS
variable on `:root`. Override the variables in a plain `<style>` block in
the deck's `index.html`:

```html
<style>
  :root {
    --color-accent: #f97316;
    --color-accent-soft: #fdba74;
    --color-accent-wash: #fff4ea;
    --color-brand: #7c2d12;
    --color-ink: #431407;
    --color-deep: #1c0f08;
    --gradient: linear-gradient(100deg, #7c2d12, #ea580c);
    --gradient-deep: linear-gradient(100deg, #fdba74, #fb923c);
  }
</style>
```

Every utility (`bg-brand`, `text-fg`, `border-edge/50`) and every component
reads the variables, so the whole deck follows. A plain `<style>` sits
outside Tailwind's cascade layers, so it always wins over the engine's
defaults.

To **add** tokens (a new colour, a new size), use a Tailwind block. The
engine puts its own block first in `<head>`, so yours compiles after it:

```html
<style type="text/tailwindcss">
  @theme {
    --color-partner: #1d4ed8;   /* → bg-partner, text-partner … */
  }
</style>
```

To share a theme across decks, keep the block in `engine/themes/<name>.css`
and paste it into each deck. Do not edit `theme.css` to rebrand a single
deck.

Swapping fonts means changing the Google Fonts `<link>` and
`--font-display` / `--font-mono`.

## Tokens

### Paper surface (default)

| Token | Default | Role |
| --- | --- | --- |
| `--color-paper` | `#faf8f3` | slide background |
| `--color-card` | `#ffffff` | raised surfaces |
| `--color-ink` | `#063e2e` | primary text |
| `--color-ink-2` | `#0a5c44` | eyebrow label, secondary headings |
| `--color-muted` | `#6b6355` | muted text |
| `--color-line` | `#e6e0d5` | hairlines and borders |

### Accents

| Token | Default | Role |
| --- | --- | --- |
| `--color-accent` | `#a3e635` | accent bars, ticks, arrows, dots, stat values on deep |
| `--color-accent-soft` | `#bef264` | the accent on deep slides |
| `--color-accent-wash` | `#f0fbdc` | `card-accent` fill and `tr.hl` on paper |
| `--color-brand` | `#064e3b` | card labels on paper, stat values on paper, play icon |
| `--color-warn` | `#b45309` | `card-warn`, `text-warn` |

### Deep surface

| Token | Default | Role |
| --- | --- | --- |
| `--color-deep` | `#09231c` | slide background |
| `--color-deep-card` | `#0f2e24` | cards |
| `--color-deep-line` | `#1d4034` | borders |
| `--color-deep-ink` | `#f2f4ef` | text |
| `--color-deep-muted` | `#8fa198` | muted text |

### Effects, code and stage

| Token | Role |
| --- | --- |
| `--gradient` / `--gradient-deep` | `text-gradient` on paper / deep |
| `--aura`, `--aura-deep`, `--aura-deep-2` | the soft corner glow on slides |
| `--code-bg`, `--code-fg`, `--code-com`, `--code-key`, `--code-str`, `--code-fn`, `--code-type`, `--code-num`, `--code-prop`, `--code-punc` | code panel colours |
| `--font-display`, `--font-mono` | typefaces |
| `--stage-bg` | the letterbox around the stage, and the preview background |

Type sizes (`--text-display` … `--text-tiny`) and measures
(`--container-narrow`, `-mid`, `-wide`) are tokens too; see
[components.md](components.md) and [layout.md](layout.md).

## Surface-aware colours (what slides use)

These are the colours slides and components use. `theme.css` sets them to
the paper values on `:root` and flips them on `.slide.deep`, which is why one
class works on both surfaces:

| Token → utility | Paper | Deep |
| --- | --- | --- |
| `--color-fg` → `text-fg` | ink | deep-ink |
| `--color-fg-2` → `text-fg-2` | ink-2 | accent-soft |
| `--color-fg-muted` → `text-fg-muted` | muted | deep-muted |
| `--color-surface` → `bg-surface` | card | deep-card |
| `--color-edge` → `border-edge` | line | deep-line |
| `--color-label` → `text-label` | brand | accent-soft |
| `--color-mark` → `bg-mark` | accent | accent-soft |
| `--color-wash` → `bg-wash` | accent-wash | 8% lime |
| `--grad` (not a colour) | `--gradient` | `--gradient-deep` |

When you write a new component, colour it with these, never with raw hex
values or the fixed palette, so it works on both surfaces for free.

## Contrast notes

- Lime on paper is decoration only: bars, ticks, arrows and dots. Do not set
  body text in `text-accent` on paper, because it fails contrast. Use
  `text-label` instead.
- `text-fg-muted` is for secondary lines. Keep the claim itself in `text-fg`.
- Check a new palette on a projector-like screen at low brightness. The
  aura and washes are subtle on purpose.
