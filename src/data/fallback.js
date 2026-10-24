// Built-in content used until Supabase is connected (and as a safety net if it's unreachable).
// Once connected, routes come from the `routes` table. Paths are approximate: walk them
// once and adjust in Supabase (Table Editor -> routes -> path) before you publish.

export const FALLBACK_ROUTES = [
  {
    slug: 'center-strip-classic',
    name: 'Center Strip Classic',
    area: 'Center Strip',
    color: '#ff3d9a',
    description: 'Our signature route. Big fountains, the Eiffel Tower and the LINQ Promenade. A great first walk.',
    highlights: ['Bellagio Fountains', 'Paris Las Vegas', 'The LINQ Promenade', 'High Roller'],
    path: [
      [36.1022, -115.1727], [36.1058, -115.1726], [36.109, -115.1724], [36.1126, -115.1723],
      [36.1162, -115.1722], [36.118, -115.1716], [36.1222, -115.1702],
    ],
  },
  {
    slug: 'north-strip-neon',
    name: 'North Strip Neon',
    area: 'North Strip',
    color: '#2ee6ff',
    description: 'From the Venetian canals past the Wynn and Resorts World up to the Sahara.',
    highlights: ['The Venetian', 'Fashion Show', 'Wynn & Encore', 'Resorts World', 'Sahara'],
    path: [
      [36.1222, -115.1702], [36.127, -115.169], [36.129, -115.1668], [36.134, -115.164],
      [36.137, -115.162], [36.1405, -115.1597], [36.144, -115.157],
    ],
  },
  {
    slug: 'south-strip-sign',
    name: 'South Strip to the Sign',
    area: 'South Strip',
    color: '#ffc34d',
    description: 'Castles, pyramids and a group photo at the famous Welcome to Las Vegas sign.',
    highlights: ['Excalibur', 'Luxor', 'Mandalay Bay', 'Welcome to Las Vegas sign'],
    path: [
      [36.1022, -115.1727], [36.0975, -115.173], [36.0921, -115.1738], [36.0875, -115.1735],
      [36.082, -115.1728],
    ],
  },
  {
    slug: 'full-strip',
    name: 'The Full Strip',
    area: 'End to end',
    color: '#a66bff',
    description: 'The whole boulevard, sign to Sahara. Our long-distance challenge walk.',
    highlights: ['Welcome sign', 'Center Strip', 'North Strip', 'Sahara'],
    path: [
      [36.082, -115.1728], [36.0875, -115.1735], [36.0921, -115.1738], [36.0975, -115.173],
      [36.1022, -115.1727], [36.109, -115.1724], [36.1162, -115.1722], [36.1222, -115.1702],
      [36.127, -115.169], [36.129, -115.1668], [36.134, -115.164], [36.137, -115.162], [36.144, -115.157],
    ],
  },
  {
    slug: 'downtown-neon',
    name: 'Downtown Neon',
    area: 'Downtown / Fremont',
    color: '#5dff9f',
    description: 'A bonus route under the Fremont Street canopy and up to the Neon Museum boneyard.',
    highlights: ['Fremont Street Experience', 'Fremont East', 'The Neon Museum'],
    path: [
      [36.1716, -115.1466], [36.1706, -115.1452], [36.1696, -115.1437], [36.168, -115.1413],
      [36.17, -115.1405], [36.174, -115.1375], [36.177, -115.1355],
    ],
  },
]

export const WALK_TYPES = [
  { icon: '🌅', name: 'Sunrise walks', text: 'Early starts in the summer months so we finish before the heat sets in.' },
  { icon: '🌃', name: 'Neon nights', text: 'Evening walks when the Strip is fully lit up. Our most photogenic walks.' },
  { icon: '🎄', name: 'Holiday lights', text: 'December walks past the resort holiday displays and conservatory gardens.' },
  { icon: '🎃', name: 'Costume walk', text: 'Our Halloween walk. Costumes encouraged, comfortable shoes required.' },
  { icon: '🏁', name: 'Full Strip challenge', text: 'Sign to Sahara, end to end. Earn bragging rights (and a milestone).' },
  { icon: '☕', name: 'Coffee walks', text: 'Shorter, social walks that end at a café so we can hang out afterwards.' },
]

export const MILESTONES = [
  { walks: 1, name: 'First Light', color: '#2ee6ff' },
  { walks: 10, name: 'Glow Getter', color: '#5dff9f' },
  { walks: 25, name: 'Bright Lights', color: '#ffc34d' },
  { walks: 50, name: 'Neon Legend', color: '#ff3d9a' },
  { walks: 100, name: 'Strip Icon', color: '#a66bff' },
]
