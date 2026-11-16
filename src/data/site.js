// Locked facts (owner-confirmed). Edit here only; every page and schema reads from this file.
export const site = {
  name: 'Red Wood Farm',
  story: 'Garden family restaurant and party lawn on outer Pakhowal Road',
  address: {
    full: '676, VPO Daad, Pakhowal Road, Opp. Cerajot Tiles, near Omaxe Flats, Ludhiana, Punjab 142022',
    street: '676, VPO Daad, Pakhowal Road, Opp. Cerajot Tiles, near Omaxe Flats',
    locality: 'Ludhiana',
    region: 'Punjab',
    postal: '142022',
    country: 'IN',
  },
  phoneDisplay: '096467 13555',
  phoneE164: '+919646713555',
  tel: 'tel:+919646713555',
  wa: 'https://wa.me/919646713555',
  hoursDisplay: '10:00 AM to 11:00 PM, every day',
  hoursShort: 'Open daily, 10 AM to 11 PM',
  placeId: 'ChIJD0lx94mBGjkRqQSgyc2NQXk',
  mapsUrl: 'https://maps.google.com/?cid=8737420667065992361',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Red+Wood+Farm&destination_place_id=ChIJD0lx94mBGjkRqQSgyc2NQXk',
  reviewUrl: 'https://g.page/r/CakEoMnNjUF5EBE/review',
  rating: { value: '4.2', count: 72, checked: '14 Nov 2026' },
  sameAs: [
    'https://www.facebook.com/p/Red-Wood-Farm-100064074312671/',
    'https://www.instagram.com/redwoodfarm_/',
    'https://maps.google.com/?cid=8737420667065992361',
  ],
  // Google Maps pin (GBP-READY.md: keep existing pin).
  geo: { lat: 30.8523639, lng: 75.7975299 },
};

export const waLink = (text) => `${site.wa}?text=${encodeURIComponent(text)}`;
