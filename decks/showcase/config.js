/* Deck-wide values. Everything audience-specific lives here, so pointing
   the deck at another room is one edit. Slides read it as $store.deck.* */
export default {
  presenter: { name: "Your Name", role: "Founder", email: "you@example.com", site: "example.com" },
  audience: { name: "Acme Corp", logo: null }, // logo: "assets/acme.svg" → shown on the cover
  date: "24 Sep 2026",
  ask: "Pick one deck. Rebuild it here this week.",
};
