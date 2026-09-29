# Patterns

Every pattern below is a working slide in `decks/showcase/slides/`. To use
one, copy the file into your deck, rename it, change the words and the
`x-data`, and add it to the `slides` array.

| Need | Copy | Surface | Shape |
| --- | --- | --- | --- |
| Open the talk | `01-cover.html` | deep, bare | logo lockup · `display` headline · lead · byline pinned to the bottom |
| Set the agenda | `02-agenda.html` | paper | headline · `numbered` rows from `x-for`, with durations as `aside` |
| Name the problem | `03-problem.html` | paper | headline · lead · `grid-cols-3` cards, the last one `card-warn` |
| Draw a line: yours / ours, before / after | `04-boundary.html` | paper | three-column grid: plain card · `card-accent` seam · `card-brand` |
| Land numbers | `05-numbers.html` | deep | headline · lead · `grid-cols-3` stat cards · `grid-cols-2` contrast at `mt-auto` |
| Show code | `06-code.html` | paper | `grid-cols-2` of `code-panel sm` · `card-accent` callout · `flow` strip |
| Explain a process | `07-process.html` | paper | `grid-4` numbered step cards · `grid-wide-left` lead + checklist |
| Compare options | `08-compare.html` | paper | `table` from `x-for`, with the winning row `hl` |
| Pause on a principle | `09-quote.html` | deep, bare | `quote` centred with `my-auto` |
| Start a section | `10-divider.html` | deep, bare | `big-num` letter or number · `h1` · one lead line |
| Answer questions | `11-faq.html` | paper | `grid-cols-2` of question cards (2×2) |
| Close with the ask | `12-close.html` | deep, bare | logo · label · `display` ask from `$store` · byline |
| Play a recording | see [code-and-media.md](code-and-media.md) | deep, full | video under a title scrim |

## Pacing a deck

The reference decks this skill came from follow one shape. It is a good
default:

1. **Cover** (deep), then **agenda** (paper).
2. **Problem** slides on paper: the audience's own situation, stated plainly.
3. **The answer**: the same layout as the problem slide, so the room
   compares the two directly.
4. **Boundary**: what they own and what you own. Put it *before* the demo, so
   they watch as builders and not as defenders.
5. **Demo** (deep, video) and **how it works** (code, flow).
6. **Numbers** (deep), then controls or security.
7. **Close** (deep, bare): one ask.
8. **Appendix**: a divider, then backup slides that you show only when
   asked. Name the files `A1-…`, `A2-…`.

Alternate surfaces for rhythm. Deep slides mark a change of gear: cover,
divider, numbers, demo, quote, close. Paper slides carry the argument.
Never put more than two or three deep slides in a row.

## Making a new pattern

When nothing fits:

1. Start from the closest pattern. Keep headline → lead → `my-auto` body.
2. Compose from [layout.md](layout.md) and [components.md](components.md)
   classes. Use `style=""` only for a one-off number, such as a column
   width or a font-size nudge.
3. If you need the same `style=""` on two slides, it should be a class.
   Add it to the right engine CSS file, and document it in components.md
   or layout.md.
4. Run `Deck.checkFit()` and look at the slide in the print preview.
