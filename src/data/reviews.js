// Every real Google review of Red Wood Farm that has text, quoted exactly as written on Google
// (source: data_google_reviews_with_text.tsv read 14 Nov 2026, re-checked on the live Google Maps
// listing, sorted by newest, on 17 Nov 2026: no newer text reviews). Rules:
// - Wording, spelling and punctuation are the reviewer's own. Long reviews are shortened only with "…".
// - Name = first name + last initial, as shown on Google. "when" is Google's relative date turned into
//   month and year (reviews Google shows as "N years ago" only carry the year).
// - Left out: one review about an airport (Indivar, posted on this listing by mistake), one unrelated
//   one ("Marshall aid"), and one written in Italian that Google shows only as a machine translation.
// - One sentence of RAHUL G.'s review that names a drinks party is cut with "…" (no drinks wording on this site
//   until the owner confirms a licence); the rest is as written.
// - Star-only reviews have nothing to quote; they count only in the rating (site.js, re-checked live).
// - Plain HTML on the site. No Review or AggregateRating schema: self-published reviews are ignored or
//   penalised by Google.
export const reviewsUrl = 'https://search.google.com/local/reviews?placeid=ChIJD0lx94mBGjkRqQSgyc2NQXk';

// The moving band shows only 4- and 5-star reviews with real content (owner's call, 17 Nov 2026).
// Filler reviews ("Nice", "Good", a generic line) are flagged and left out of the band; every review stays
// listed here as the record, and the full picture is one click away on Google.
export const bandReviews = () => reviews.filter((r) => r.stars >= 4 && !r.filler);

export const reviews = [
  { name: 'Gaurav S.', stars: 5, when: 'Aug 2026', text: 'Awsome food, nice ambience.' },
  { name: 'Jaya S.', stars: 1, when: 'Aug 2026', text: 'I have attended TEEJ party here on 1st Aug.... There service is very Poor... We are around 35 ladies n 10-12 kids... But they served snacks only 1 time… REALLY Very Bad Experience .. will never suggest anyone to visit here👎🏻👎🏻👎🏻' },
  { name: 'Sanjeev K.', stars: 5, when: 'May 2026', text: 'Crazy location for casual parties and events..staff is also friendly' },
  { name: 'Surinder D.', stars: 5, when: 'Apr 2026', text: 'Very good preparetion and service' },
  { name: 'Gurveer S.', stars: 5, when: 'Mar 2026', text: 'Red wood Farm is a perfect place for venue for wedding, parties ,corporate function . food was absolutely delicious , fresh, and full of flavor . The staff is very polite ,co-operative, well -organized. …' },
  { name: 'Kala C.', stars: 5, when: 'Mar 2026', text: 'I personally recommend this place. Great place for family party and social events . Must come to make your memories enjoyable' },
  { name: 'Ajmer S.', stars: 5, when: 'Mar 2026', text: 'Great ambience and good food' },
  { name: 'gurvinder k.', stars: 5, when: 'Feb 2026', text: 'Great, peaceful experience, Food was way better than any other place...felt like close to nature.' },
  { name: 'Inderpreet S.', stars: 4, when: 'Jan 2026', text: 'Good space for small function parties..' },
  { name: 'Punit G.', filler: true, stars: 5, when: 'Dec 2025', text: 'I was great experience' },
  { name: 'Mehak S.', stars: 1, when: '2025', text: 'They do not provide what they commit.. Very cheap way of serving food.' },
  { name: 'Harish S.', stars: 1, when: '2025', text: 'Pathetic food. Too expensive against what you commit and what you provide' },
  { name: 'Gurpreet S.', stars: 5, when: '2025', text: 'Good space for small gathering' },
  { name: 'Isha', stars: 5, when: '2024', text: 'Very good place awesome decor yummy food perfect location specially impressive Hospitality washrooms are so clean five star facilities' },
  { name: 'Kamal c.', filler: true, stars: 5, when: '2024', text: 'Awesome look red wood' },
  { name: 'Sukhjit S.', stars: 2, when: '2024', text: 'Mediocre place, just an open field.' },
  { name: 'RAHUL G.', stars: 4, when: '2023', text: "A good place to arrange a small gathering upto 150-200 people. Lawn is nice.. But bathrooms are not upto mark.. … A good catering service can add stars to the party at this place." },
  { name: 'Keshav S.', stars: 5, when: '2023', text: 'Best place I really love this heaven on earth' },
  { name: 'Vishal P.', stars: 3, when: '2023', text: 'Not bad' },
  { name: 'Garry g.', filler: true, stars: 5, when: '2023', text: 'Nice' },
  { name: 'Nikita R.', filler: true, stars: 5, when: '2023', text: 'Good' },
  { name: 'Dalchand N.', stars: 1, when: '2023', text: 'Dal' },
];
