// FAQ answers use only owner-confirmed facts. Unknowns point to WhatsApp.
export const homeFaq = [];

export const partyFaq = [
  { q: 'Can I book Red Wood Farm for a birthday party?', a: 'Yes. Red Wood Farm hosts birthday parties on its fairy-lit lawn, for lunch or in the evening. Send the date, time and number of guests on WhatsApp to 096467 13555 and we will share the options.' },
  { q: 'Do you host kitty parties in Ludhiana?', a: 'Yes. Kitty parties are a good fit for the lawn and the restaurant in the daytime, from 10 AM. Message us on WhatsApp with your date and group size to plan the menu.' },
  { q: 'How many guests can the lawn hold?', a: 'It depends on the set-up (seated lunch, buffet or lounge). Tell us your guest count on WhatsApp and we will tell you what works.' },
  { q: 'What does a party cost? Are there packages?', a: 'Prices depend on the menu, the number of guests and the set-up. Ask us on WhatsApp for current per-plate prices and packages; we do not publish them here because they change.' },
  { q: 'Is the food cooked in your own kitchen?', a: 'Yes. Parties are served from the Red Wood Farm kitchen, with dishes from our menu: tandoor, North Indian and Indo-Chinese, veg and non-veg.' },
  { q: 'What are your hours for parties?', a: 'The restaurant is open every day from 10:00 AM to 11:00 PM. Party timings are agreed when you book.' },
  { q: 'Is the venue wheelchair accessible?', a: 'No. Red Wood Farm does not have wheelchair access at the moment. Please call us on 096467 13555 before you plan a visit so we can talk it through.' },
];

export const visitFaq = [
  { q: 'Where is Red Wood Farm?', a: 'At 676, VPO Daad, Pakhowal Road, opposite Cerajot Tiles and near Omaxe Flats, Ludhiana, Punjab 142022.' },
  { q: 'What are your opening hours?', a: 'Every day, 10:00 AM to 11:00 PM.' },
  { q: 'Do you offer takeaway?', a: 'Yes. Call or WhatsApp 096467 13555 to order, then pick it up at the restaurant.' },
  { q: 'Is there Wi-Fi?', a: 'Yes, Wi-Fi is available for guests.' },
  { q: 'Is Red Wood Farm wheelchair accessible?', a: 'No. There is no wheelchair access at the moment.' },
  { q: 'Do you have vegetarian food?', a: 'Yes. Most of the menu is vegetarian, and every dish is marked veg or non-veg on the menu.' },
  { q: 'Can I book a table?', a: 'Yes. Send the date, time and number of people on WhatsApp to 096467 13555, or call.' },
];

export const faqSchema = (list) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: list.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
