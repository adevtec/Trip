import { TRAVEL_IMAGES } from '@/utils/imageUtils';
import { type Country } from './destinations';

export interface Continent {
  id: string;
  name: string;
  slug: string;
  image: string;
  countries: Country[];
}

export const continents: Continent[] = [
  {
    id: 'europe',
    name: 'Euroopa',
    slug: 'euroopa',
    image: TRAVEL_IMAGES.continents.europe,
    countries: [] // Täidame hiljem
  },
  // ... teised kontinendid
]; 