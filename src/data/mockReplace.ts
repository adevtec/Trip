// Mock data replacements for live deployment
// These replace the mock data imports to avoid dependencies

export const departureCities = [
  { id: 'tallinn', name: 'Tallinn', code: 'TLL', country: 'Estonia' },
  { id: 'riga', name: 'Riia', code: 'RIX', country: 'Latvia' },
  { id: 'vilnius', name: 'Vilnius', code: 'VNO', country: 'Lithuania' }
];

export type DepartureCity = {
  id: string;
  name: string;
  code: string;
  country: string;
};

export type City = {
  id: string;
  name: string;
  country: string;
};

export type Country = {
  id: string;
  name: string;
};

export type Area = {
  id: string;
  name: string;
  countryId: string;
};

export type Resort = {
  id: string;
  name: string;
  areaId: string;
};

export const countries: Country[] = [
  { id: 'turkey', name: 'Türgi' },
  { id: 'egypt', name: 'Egiptus' },
  { id: 'spain', name: 'Hispaania' },
  { id: 'greece', name: 'Kreeka' }
];

export type DateRange = {
  from?: Date;
  to?: Date;
};

export type Traveler = {
  adults: number;
  children: number;
  childrenAges: number[];
};