export interface City {
  id: string;
  name: string;
  country: string;
}

export interface Region {
  id: string;
  name: string;
  cities: City[];
}

export const regions: Region[] = [
  {
    id: 'europe',
    name: 'Euroopa',
    cities: [
      { id: 'paris', name: 'Pariis', country: 'Prantsusmaa' },
      { id: 'rome', name: 'Rooma', country: 'Itaalia' },
      { id: 'barcelona', name: 'Barcelona', country: 'Hispaania' },
    ],
  },
  {
    id: 'asia',
    name: 'Aasia',
    cities: [
      { id: 'tokyo', name: 'Tokyo', country: 'Jaapan' },
      { id: 'bangkok', name: 'Bangkok', country: 'Tai' },
      { id: 'singapore', name: 'Singapur', country: 'Singapur' },
    ],
  },
  {
    id: 'americas',
    name: 'Ameerika',
    cities: [
      { id: 'new-york', name: 'New York', country: 'USA' },
      { id: 'rio', name: 'Rio de Janeiro', country: 'Brasiilia' },
      { id: 'cancun', name: 'Cancún', country: 'Mehhiko' },
    ],
  },
  {
    id: 'africa',
    name: 'Aafrika',
    cities: [
      { id: 'cairo', name: 'Kairo', country: 'Egiptus' },
      { id: 'cape-town', name: 'Cape Town', country: 'Lõuna-Aafrika' },
      { id: 'marrakech', name: 'Marrakech', country: 'Maroko' },
    ],
  },
];
