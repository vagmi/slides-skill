/* Deck-wide values. Everything audience-specific lives here, so pointing
   the deck at another room is one edit. Slides read it as $store.deck.* */
export default {
  title: "Deck title",
  presenter: { name: "Your Name", role: "Your role", email: "you@example.com", site: "example.com" },
  audience: { name: "Audience", logo: null }, // logo: "assets/their-logo.svg"
  date: "",
  ask: "The one thing you want them to do next.",
};
