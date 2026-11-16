// Content hubs. Every spoke page lives at /<cluster>/<slug>/ and its hub at /<cluster>/.
export const clusters = {
  party: {
    name: 'Parties & events',
    short: 'Parties',
    path: '/party/',
    blurb: 'Birthdays, kitty parties, family functions, office lunches and festival get-togethers on the lawn.',
  },
  food: {
    name: 'Food & menu guides',
    short: 'Food',
    path: '/food/',
    blurb: 'What is on our menu, what to order first and how to order for a group, with real prices.',
  },
  garden: {
    name: 'The garden & evenings outdoors',
    short: 'Garden',
    path: '/garden/',
    blurb: 'The lawn, the fairy-light tunnel and how to spend an afternoon or evening outdoors on the edge of Ludhiana.',
  },
  visit: {
    name: 'Getting here',
    short: 'Visit',
    path: '/visit/',
    blurb: 'Directions from around Ludhiana, Pakhowal Road and what is nearby.',
  },
  guides: {
    name: 'Guides',
    short: 'Guides',
    path: '/guides/',
    blurb: 'Practical guides on food in Ludhiana and planning parties, written by the Red Wood Farm team.',
  },
};
export const clusterOrder = ['party', 'food', 'garden', 'visit', 'guides'];
