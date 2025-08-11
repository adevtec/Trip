export interface Area {
  id: string;
  name: string;
  cities: { id: string; name: string; }[];
}

export const areas: Area[] = [
  {
    id: 'antalya',
    name: 'Antalya',
    cities: [
      { id: 'antalya-city', name: 'Antalya' },
      { id: 'konyaalti', name: 'Konyaalti' },
      { id: 'kundu', name: 'Kundu' },
      { id: 'lara', name: 'Lara' }
    ]
  },
  {
    id: 'belek',
    name: 'Belek',
    cities: [
      { id: 'belek-city', name: 'Belek' },
      { id: 'bogazkent', name: 'Bogazkent' }
    ]
  },
  {
    id: 'kemer',
    name: 'Kemer',
    cities: [
      { id: 'beldibi', name: 'Beldibi' },
      { id: 'chamyuva', name: 'Chamyuva' }
    ]
  }
];

// Mock API call
export async function fetchAreas() {
  await new Promise(resolve => setTimeout(resolve, 100));
  return areas;
} 