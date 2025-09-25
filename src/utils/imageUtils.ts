// Clean image utilities - only essential code
export const TRAVEL_IMAGES = {
  // Hero section image - original Maldives water villa
  hero: "/images/hero.jpg", // Maldives water villa for hero section
  // Local authentic destination images downloaded from Wikimedia Commons
  destinations: {
    egypt: "/images/destinations/egypt.jpg", // Giza Pyramids
    turkey: "/images/destinations/turkey.jpg", // Hagia Sophia
    greece: "/images/destinations/greece.jpg", // Parthenon
    spain: "/images/destinations/spain.jpg", // Sagrada Familia
    italy: "/images/destinations/italy.jpg", // Colosseum
    bulgaria: "/images/destinations/bulgaria.jpg", // Alexander Nevsky Cathedral
    cyprus: "/images/destinations/cyprus.jpg", // Paphos Archaeological Park
    tunisia: "/images/destinations/tunisia.jpg", // Great Mosque of Kairouan
    vietnam: "/images/destinations/vietnam.jpg", // Ha Long Bay
  },
  // Local continent images downloaded from Unsplash
  continents: {
    europe: "/images/continents/europe.jpg", // Budapest Parliament
    asia: "/images/continents/asia.jpg", // Japanese temple
    africa: "/images/continents/africa.jpg", // African savanna
    "north-america": "/images/continents/north-america.jpg", // New York skyline
    "south-america": "/images/continents/south-america.jpg", // Machu Picchu
    oceania: "/images/continents/oceania.jpg", // Sydney Opera House
  }
};

/**
 * Get image for a region/resort based on its name
 * Falls back to placeholder if specific region not found
 */
export function getRegionImage(regionName: string): string {
  if (!regionName) return '/placeholder-region.jpg';

  // Normalize region name for lookup
  const normalizedName = regionName.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w_]/g, '')
    .replace(/_+/g, '_');

  // Try destinations first
  const name = normalizedName.toLowerCase();

  // Destination matches
  if (name.includes('egypt') || name.includes('giza') || name.includes('pyramid')) return TRAVEL_IMAGES.destinations.egypt;
  if (name.includes('turkey') || name.includes('hagia') || name.includes('sophia')) return TRAVEL_IMAGES.destinations.turkey;
  if (name.includes('greece') || name.includes('parthenon') || name.includes('athens')) return TRAVEL_IMAGES.destinations.greece;
  if (name.includes('spain') || name.includes('sagrada') || name.includes('barcelona')) return TRAVEL_IMAGES.destinations.spain;
  if (name.includes('italy') || name.includes('colosseum') || name.includes('rome')) return TRAVEL_IMAGES.destinations.italy;
  if (name.includes('bulgaria') || name.includes('sofia') || name.includes('nevsky')) return TRAVEL_IMAGES.destinations.bulgaria;
  if (name.includes('cyprus') || name.includes('paphos')) return TRAVEL_IMAGES.destinations.cyprus;
  if (name.includes('tunisia') || name.includes('kairouan') || name.includes('mosque')) return TRAVEL_IMAGES.destinations.tunisia;
  if (name.includes('vietnam') || name.includes('ha_long') || name.includes('halong')) return TRAVEL_IMAGES.destinations.vietnam;

  // Turkey region matches
  if (name.includes('antalya')) return TRAVEL_IMAGES.destinations.turkey;
  if (name.includes('alanya')) return TRAVEL_IMAGES.destinations.turkey;
  if (name.includes('belek')) return TRAVEL_IMAGES.destinations.turkey;
  if (name.includes('side')) return TRAVEL_IMAGES.destinations.turkey;
  if (name.includes('kemer')) return TRAVEL_IMAGES.destinations.turkey;
  if (name.includes('bodrum')) return TRAVEL_IMAGES.destinations.turkey;
  if (name.includes('marmaris')) return TRAVEL_IMAGES.destinations.turkey;
  if (name.includes('kusadasi')) return TRAVEL_IMAGES.destinations.turkey;

  // Egypt region matches
  if (name.includes('hurghada')) return TRAVEL_IMAGES.destinations.egypt;
  if (name.includes('sharm')) return TRAVEL_IMAGES.destinations.egypt;
  if (name.includes('alexandria')) return TRAVEL_IMAGES.destinations.egypt;
  if (name.includes('dahab')) return TRAVEL_IMAGES.destinations.egypt;
  if (name.includes('makadi')) return TRAVEL_IMAGES.destinations.egypt;
  if (name.includes('el_gouna') || name.includes('gouna')) return TRAVEL_IMAGES.destinations.egypt;
  if (name.includes('marsa') || name.includes('alam')) return TRAVEL_IMAGES.destinations.egypt;
  if (name.includes('luxor')) return TRAVEL_IMAGES.destinations.egypt;
  if (name.includes('aswan')) return TRAVEL_IMAGES.destinations.egypt;

  // Greece region matches
  if (name.includes('crete') || name.includes('chania') || name.includes('heraklion') || name.includes('rethymno')) {
    return TRAVEL_IMAGES.destinations.greece;
  }
  if (name.includes('rhodes')) return TRAVEL_IMAGES.destinations.greece;
  if (name.includes('corfu')) return TRAVEL_IMAGES.destinations.greece;
  if (name.includes('santorini')) return TRAVEL_IMAGES.destinations.greece;
  if (name.includes('mykonos')) return TRAVEL_IMAGES.destinations.greece;
  if (name.includes('zakynthos')) return TRAVEL_IMAGES.destinations.greece;

  // Spain/Tenerife region matches
  if (name.includes('tenerife') || name.includes('canary')) return TRAVEL_IMAGES.destinations.spain;
  if (name.includes('costa_adeje') || name.includes('costa adeje')) return TRAVEL_IMAGES.destinations.spain;
  if (name.includes('playa_de_las_americas') || name.includes('playa de las americas')) return TRAVEL_IMAGES.destinations.spain;
  if (name.includes('los_cristianos') || name.includes('los cristianos')) return TRAVEL_IMAGES.destinations.spain;

  // Tunisia region matches
  if (name.includes('hammamet')) return TRAVEL_IMAGES.destinations.tunisia;
  if (name.includes('mahdia')) return TRAVEL_IMAGES.destinations.tunisia;
  if (name.includes('monastir')) return TRAVEL_IMAGES.destinations.tunisia;
  if (name.includes('nabeul')) return TRAVEL_IMAGES.destinations.tunisia;
  if (name.includes('sousse')) return TRAVEL_IMAGES.destinations.tunisia;

  // Ultimate fallback - use a default destination image
  return TRAVEL_IMAGES.destinations.turkey;
}