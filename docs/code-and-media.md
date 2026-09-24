# Code and media

## Code panels

`engine/code.js` colours code with **highlight.js** (the "common" build from
the CDN). The colours come from the deck's `--code-*` tokens, not from a
highlight.js theme. Panels are always dark, on either surface.

```html
<figure class="code-panel sm r d3" data-lang="ts"
        data-caption="index.ts" data-note="the whole script">
  <textarea>
    import { createAcme } from "./acme";

    const acme = createAcme({ token });
    await urai.complete(await acme.invoices.list(50));
  </textarea>
</figure>
```

- **Put the source in a `<textarea>`.** Its content is raw text, so you can
  write `<div>`, `&` and `${}` as they are. Only a literal `</textarea>`
  would end it. You can also use `<pre><code>…</code></pre>` with `<`
  escaped as `&lt;`.
- The source is **dedented**, so indent it to match the file. Leading and
  trailing blank lines are dropped.
- Alpine does not touch the code text, so `x-for` inside a code sample is
  safe.

| Attribute / class | Meaning |
| --- | --- |
| `data-lang` | Any language in highlight.js "common": `ts`, `js`, `html`, `xml`, `css`, `json`, `bash`, `shell`, `python`, `markdown`, `yaml`, `sql`, `go`, `rust`, `java`, `diff` … Omit it, or use `plaintext`, for no colour. |
| `data-caption` | Mono label on the header strip, left. Usually a filename. |
| `data-note` | Second label, right-aligned: what it is or where it came from. |
| `sm` / `md` / `lg` | 17px / 20px / 24px type. Use `lg` for one short snippet that carries the slide, and `sm` when two panels sit side by side. `md` is the default. |
| `wrap` | Soft-wrap long lines. By default they are clipped. |

Code on a slide illustrates a point. It is not a file. Trim it until every
line earns its place, and mark cuts with a comment (`// …`). About 12 lines
at `sm` in a half-width panel is the practical limit.

A callout that belongs to a panel goes directly under it:

```html
<div class="stack gap-s">
  <figure class="code-panel sm" data-lang="js">…</figure>
  <div class="card accent" style="padding:20px 28px">
    <p class="label">The line that matters</p>
    <p class="small mt-xs"><code>await urai.complete()</code> returns the result.</p>
  </div>
</div>
```

## Video slides

`engine/video.js` turns a `.video-slide` into a full-bleed player with a
title card.

```html
<section data-section="Demo · In the app" data-title="Demo" data-tone="deep" data-full>
  <div class="video-slide" data-src="assets/demo.mp4"
       data-w="1920" data-h="1080" data-note="2 minutes, no sound">
    <h2 class="title">Watch it <span class="text-gradient">work</span>.</h2>
    <p class="lead">One sentence of setup.</p>
  </div>
</section>
```

- The video sits under a translucent scrim that shows the eyebrow, title,
  lead and a play button. A click starts it, muted and never on autoplay,
  and the scrim fades out. Native controls appear only while it plays.
- The scrim returns when the video ends, and whenever you come back to the
  slide. Leaving the slide pauses the video.
- `hjkl` keeps changing slides even while the player has focus. The arrow
  keys and Space control the player.
- The video is never cropped. It is scaled to fit inside a 52px margin.
  `data-w` / `data-h` must be the recording's natural size, so that the
  border hugs the picture. Get them with:

  ```bash
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height \
    -of default=nw=1 assets/demo.mp4
  ```

- `data-poster="assets/demo.jpg"` sets a still frame to show before play.
- Print and print preview show the title card.
- Large videos should not go in git. Keep them in a bucket and sync them
  into `assets/` before the talk.

## Images and logos

- Put files in `decks/<name>/assets/` and reference them as `assets/x.svg`.
  Paths resolve against the deck page.
- Use SVG for logos. Make one version for deep slides (light ink) and one
  for paper (dark ink).
- Cover lockup: `<div class="lockup">` with `<img>` elements. They are
  sized to 86px tall.
- To show a logo only when it exists, test the `$store` value:

  ```html
  <template x-if="$store.deck.audience.logo">
    <img :src="$store.deck.audience.logo" :alt="$store.deck.audience.name" />
  </template>
  <template x-if="!$store.deck.audience.logo">
    <span class="logo-slot" x-text="$store.deck.audience.name"></span>
  </template>
  ```

- For a full-bleed image, use a `data-full` slide with
  `<img class="fill" style="object-fit:cover;width:100%;height:100%">`.
- Media inside a slide is capped at `max-width/max-height: 100%` of its box.
- Diagrams: inline `<svg>` scales perfectly and prints sharp. Colour it with
  `currentColor` or with `var(--accent)` and the other tokens, so it follows
  the surface.
