# Slide format

A slide is one HTML file that holds one `<section>`. The loader fetches it,
wraps its children in the standard frame, adds the eyebrow row and puts it
on the stage.

```html
<!-- 04 · Boundary. What this slide is for, in one line. -->
<section data-section="The boundary" data-title="Yours and ours">
  <h2 class="text-h2 r d2">You write slides. <span class="text-gradient">The kit runs the stage.</span></h2>
  <div class="grid grid-cols-2 gap-6 my-auto">
    <div class="card r d3">…</div>
    <div class="card card-accent r d4">…</div>
  </div>
</section>
```

Start the file with an HTML comment that says what the slide is for. That
is the only commentary a slide carries. There are no speaker notes.

## `<section>` attributes

| Attribute | Meaning |
| --- | --- |
| `data-section="…"` | Eyebrow label, top left, in mono caps. Use `Part · Topic` for sub-sections. |
| `data-title="…"` | A name for the slide. It appears in fit-check output. It is never shown on screen. |
| `data-tone="deep"` | Dark surface: near-black emerald with inverted ink. Use it for covers, dividers, numbers, quotes and the close. Leave it out for paper. |
| `data-bare` | Drop the eyebrow row. Use it for covers, dividers, quotes and the close. |
| `data-full` | Drop the padded frame. The content owns all 1920×1080. Use it for video and full-bleed images. |
| `data-rail="…"` | Override the deck's right-hand eyebrow text on this slide only. |
| `x-data="{…}"` | Alpine data for this slide (see below). Optional. |
| `class`, `id`, `style` | Kept as they are. `class="no-aura"` removes the corner glow. |

The frame is inset 76px at the top, 104px at the sides and 70px at the
bottom, and it is a **flex column**. The children stack from the top down.
See [layout.md](layout.md) for placing content inside it.

## Reveal animations

Add `r` to an element to make it rise into place when its slide becomes
active. Add `d1`…`d6` to stagger it. The eyebrow row is already `r d1`.

```html
<h2 class="text-h2 r d2">…</h2>
<p class="text-lead text-fg-muted r d3">…</p>
<div class="grid grid-cols-3 gap-6 r d4">…</div>
```

Typical order: accent bar and headline `d2`, lead `d3`, main body `d3`–`d5`,
footer `d4`–`d6`. Print and print preview always show `r` elements fully
visible.

## Alpine: data and templates

Every slide is an Alpine scope. Use Alpine's `<template>` tags to repeat
markup from data. Keep the data on the `<section>`:

```html
<section
  data-section="The numbers"
  x-data="{
    stats: [
      ['3×', 'faster', 'Compiled code runs in milliseconds.'],
      ['10×', 'cheaper', 'One pass instead of a long reasoning trace.'],
    ],
  }"
>
  <div class="grid grid-cols-2 gap-6 my-auto">
    <template x-for="([k, h, p], n) in stats">
      <div class="card r" :class="'d' + (n + 3)">
        <p class="stat-value" x-text="k"></p>
        <p class="stat-label" x-text="h"></p>
        <p class="text-small text-fg-muted mt-4" x-text="p"></p>
      </div>
    </template>
  </div>
</section>
```

Rules that keep Alpine from biting:

- A `<template x-for>` must contain **exactly one** root element.
- `x-text` sets text and escapes it. `x-html` sets markup, so use it only on
  strings you wrote, such as a headline with a `<span class="text-gradient">`.
- `class="r"` plus `:class="'d3'"` merge. Alpine keeps the static classes.
- Stagger with `:class="'d' + Math.min(n + 3, 6)"`. There is no `d7`.
- Conditional markup: `<template x-if="cond"><img …></template>`, again
  with one root element.
- `<template x-for>` works inside `<tbody>`, so tables can be data-driven
  (see `showcase/slides/08-compare.html`).
- Attribute values can span several lines, so long `x-data` arrays read
  fine. Use single quotes inside the double-quoted attribute.
- For static content, write plain HTML. Alpine is optional.

## Deck-wide data: `$store.deck`

The object passed as `store` to `start()`, normally `config.js`, is
registered as an Alpine store. Any slide can read it:

```html
<b x-text="$store.deck.presenter.name"></b>
<h2 class="text-display" x-text="$store.deck.ask"></h2>
<div x-data="{ p: $store.deck.presenter }"><span x-text="p.email"></span></div>
```

Put anything that changes between audiences in `config.js`: names, logos,
dates and the closing ask. Put nothing there that only one slide uses.

## What does not work in a fragment

- `<script>` tags. Fragments are inserted as markup, so their scripts never
  run. Put behaviour in the engine, or use Alpine directives.
- `<link>` / `<style>` blocks for one slide. They work, but they leak to the
  whole deck. Prefer Tailwind utilities, with arbitrary values (`w-[290px]`)
  for one-off numbers.
- Relative asset paths resolve against **the deck page**, not the fragment.
  So write `assets/logo.svg`, not `../assets/logo.svg`.
